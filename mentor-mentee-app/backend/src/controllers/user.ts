import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { z } from "zod";
import path from "path";
import fs from "fs";
import { AuthenticatedRequest } from "../types";
import { validateImage } from "../middlewares/upload";

const prisma = new PrismaClient();

// 프로필 업데이트 스키마
const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  image: z.string().optional(), // Base64 encoded image
  skills: z.array(z.string()).optional(), // For mentors only
});

// 내 정보 조회
export const getMe = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        imageData: true,
        skills: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // skills JSON 파싱
    let parsedSkills: string[] = [];
    if (user.skills) {
      try {
        parsedSkills = JSON.parse(user.skills);
      } catch (e) {
        console.error("Error parsing skills:", e);
      }
    }

    // 이미지 URL 생성
    let imageUrl: string | undefined;
    if (user.imageData) {
      console.log(
        "getMe - User imageData exists:",
        user.imageData.substring(0, 50) + "..."
      );
      // 파일 경로인 경우 (uploadProfileImage를 통해 업로드된 경우)
      if (user.imageData.startsWith("/uploads/")) {
        imageUrl = `http://localhost:8080${user.imageData}`;
        console.log("getMe - File path imageUrl:", imageUrl);
      }
      // Base64 데이터인 경우 (updateProfile을 통해 업로드된 경우)
      else if (user.imageData.startsWith("data:image/")) {
        imageUrl = `http://localhost:8080/api/users/images/${user.role.toLowerCase()}/${
          user.id
        }`;
        console.log("getMe - Base64 imageUrl:", imageUrl);
      }
    } else {
      console.log("getMe - No imageData found for user");
    }

    const response = {
      ...user,
      skills: user.role === "MENTOR" ? parsedSkills : undefined,
      imageData: undefined, // 클라이언트에 직접 노출하지 않음
      imageUrl, // 프론트엔드에서 사용할 이미지 URL
      hasImage: !!user.imageData,
    };

    res.json(response);
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 프로필 업데이트
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    console.log(
      `프로필 업데이트 요청 - 사용자 ID: ${userId}, 역할: ${userRole}`
    );
    console.log("요청 데이터:", JSON.stringify(req.body, null, 2));

    const validation = updateProfileSchema.safeParse(req.body);
    if (!validation.success) {
      console.log("검증 실패:", validation.error.errors);
      res.status(400).json({
        error: "Validation failed",
        details: validation.error.errors,
      });
      return;
    }

    const { name, bio, image, skills } = validation.data;

    console.log(`이미지 데이터 존재: ${!!image}`);
    if (image) {
      console.log(
        `이미지 길이: ${image.length}, 시작 부분: ${image.substring(0, 50)}`
      );
    }

    // 이미지 검증 (Base64 형식)
    let imageData: string | undefined;
    if (image) {
      // Base64 이미지 검증 및 처리
      const base64Regex = /^data:image\/(jpeg|jpg|png);base64,/;
      if (!base64Regex.test(image)) {
        res.status(400).json({
          error: "Invalid image format. Only JPEG and PNG are allowed.",
        });
        return;
      }

      // 이미지 크기 검증 (대략적으로 Base64 길이로 계산)
      const sizeInBytes = (image.length * 3) / 4;
      if (sizeInBytes > 1048576) {
        // 1MB
        res.status(400).json({ error: "Image size must be less than 1MB" });
        return;
      }

      imageData = image;
    }

    // 멘토가 아닌 경우 skills 무시
    let skillsData: string | undefined;
    if (userRole === "MENTOR" && skills) {
      skillsData = JSON.stringify(skills);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        ...(imageData && { imageData }),
        ...(userRole === "MENTOR" && skillsData && { skills: skillsData }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        imageData: true,
        skills: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // skills JSON 파싱
    let parsedSkills: string[] = [];
    if (updatedUser.skills) {
      try {
        parsedSkills = JSON.parse(updatedUser.skills);
      } catch (e) {
        console.error("Error parsing skills:", e);
      }
    }

    // 이미지 URL 생성
    let imageUrl: string | undefined;
    if (updatedUser.imageData) {
      console.log(
        "updateProfile - User imageData exists:",
        updatedUser.imageData.substring(0, 50) + "..."
      );
      // 파일 경로인 경우 (uploadProfileImage를 통해 업로드된 경우)
      if (updatedUser.imageData.startsWith("/uploads/")) {
        imageUrl = `http://localhost:8080${updatedUser.imageData}`;
        console.log("updateProfile - File path imageUrl:", imageUrl);
      }
      // Base64 데이터인 경우 (updateProfile을 통해 업로드된 경우)
      else if (updatedUser.imageData.startsWith("data:image/")) {
        imageUrl = `http://localhost:8080/api/users/images/${updatedUser.role.toLowerCase()}/${
          updatedUser.id
        }`;
        console.log("updateProfile - Base64 imageUrl:", imageUrl);
      }
    } else {
      console.log("updateProfile - No imageData found for user");
    }

    const response = {
      ...updatedUser,
      skills: updatedUser.role === "MENTOR" ? parsedSkills : undefined,
      imageData: undefined, // 클라이언트에 직접 노출하지 않음
      imageUrl, // 프론트엔드에서 사용할 이미지 URL
      hasImage: !!updatedUser.imageData,
    };

    console.log("응답 데이터:", {
      ...response,
      imageUrl: response.imageUrl,
      hasImage: response.hasImage,
    });

    res.json(response);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 프로필 이미지 조회
export const getProfileImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { role, id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    // 역할 검증
    if (role !== "mentor" && role !== "mentee") {
      res.status(400).json({ error: "Invalid role" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        role: role.toUpperCase() as Role,
      },
      select: {
        imageData: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.imageData) {
      // 기본 이미지 URL로 리디렉션
      const defaultImageUrl =
        role === "mentor"
          ? "https://placehold.co/500x500.jpg?text=MENTOR"
          : "https://placehold.co/500x500.jpg?text=MENTEE";

      res.redirect(defaultImageUrl);
      return;
    }

    // Base64 이미지 데이터를 직접 반환
    const base64Data = user.imageData.replace(
      /^data:image\/[a-z]+;base64,/,
      ""
    );
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Content-Type 추출
    const mimeMatch = user.imageData.match(/^data:image\/([a-z]+);base64,/);
    const mimeType = mimeMatch ? `image/${mimeMatch[1]}` : "image/jpeg";

    res.set("Content-Type", mimeType);
    res.set("Cache-Control", "public, max-age=3600"); // 1시간 캐시
    res.send(imageBuffer);
  } catch (error) {
    console.error("Get profile image error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;

    if (!req.file) {
      res.status(400).json({ error: "이미지 파일이 필요합니다." });
      return;
    }

    // 이미지 유효성 검증
    validateImage(req.file);

    // 새 이미지 URL 저장 (임시로 imageData 필드 사용)
    const imageUrl = `/uploads/${req.file.filename}`;
    const fullImageUrl = `http://localhost:8080${imageUrl}`;

    await prisma.user.update({
      where: { id: userId },
      data: { imageData: imageUrl }, // 임시로 imageData 필드에 파일 경로 저장
    });

    res.json({
      message: "프로필 이미지가 성공적으로 업로드되었습니다.",
      imageUrl: fullImageUrl,
    });
  } catch (error) {
    console.error("Upload profile image error:", error);

    // 업로드된 파일 삭제 (오류 발생 시)
    if (req.file) {
      const filePath = path.join(process.cwd(), "uploads", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "이미지 업로드 중 오류가 발생했습니다.",
    });
  }
};
