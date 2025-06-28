import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../types";

const prisma = new PrismaClient();

// 멘토 목록 조회 (멘티 전용)
export const getMentors = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // 멘티만 접근 가능
    if (req.user?.role !== "MENTEE") {
      res.status(403).json({ error: "Only mentees can access mentor list" });
      return;
    }

    const { skill, order_by } = req.query;

    // 기본 쿼리 조건
    let whereCondition: any = {
      role: "MENTOR",
    };

    // skill 필터링
    if (skill && typeof skill === "string") {
      whereCondition.skills = {
        contains: skill,
      };
    }

    // 정렬 조건
    let orderBy: any = { id: "asc" }; // 기본 정렬
    if (order_by === "name") {
      orderBy = { name: "asc" };
    } else if (order_by === "skill") {
      orderBy = { skills: "asc" };
    }

    const mentors = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        bio: true,
        skills: true,
        imageData: true,
        createdAt: true,
      },
      orderBy,
    });

    // 응답 데이터 형식 변환
    const formattedMentors = mentors.map((mentor) => {
      let parsedSkills: string[] = [];
      if (mentor.skills) {
        try {
          parsedSkills = JSON.parse(mentor.skills);
        } catch (e) {
          console.error("Error parsing skills:", e);
        }
      }

      // 이미지 URL 생성
      let imageUrl: string | undefined;
      if (mentor.imageData) {
        // 파일 경로인 경우 (uploadProfileImage를 통해 업로드된 경우)
        if (mentor.imageData.startsWith("/uploads/")) {
          imageUrl = `http://localhost:8080${mentor.imageData}`;
        }
        // Base64 데이터인 경우 (updateProfile을 통해 업로드된 경우)
        else if (mentor.imageData.startsWith("data:image/")) {
          imageUrl = `http://localhost:8080/api/users/images/mentor/${mentor.id}`;
        }
      }

      return {
        id: mentor.id,
        name: mentor.name,
        bio: mentor.bio || "",
        skills: parsedSkills,
        hasImage: !!mentor.imageData,
        imageUrl:
          imageUrl ||
          `https://placehold.co/500x500.jpg?text=${encodeURIComponent(
            mentor.name
          )}`,
        createdAt: mentor.createdAt,
      };
    });

    res.json(formattedMentors);
  } catch (error) {
    console.error("Get mentors error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
