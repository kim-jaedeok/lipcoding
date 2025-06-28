"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfileImage = exports.getProfileImage = exports.updateProfile = exports.getMe = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const upload_1 = require("../middlewares/upload");
const prisma = new client_1.PrismaClient();
const updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    bio: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
});
const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
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
        let parsedSkills = [];
        if (user.skills) {
            try {
                parsedSkills = JSON.parse(user.skills);
            }
            catch (e) {
                console.error("Error parsing skills:", e);
            }
        }
        let imageUrl;
        if (user.imageData) {
            console.log("getMe - User imageData exists:", user.imageData.substring(0, 50) + "...");
            if (user.imageData.startsWith("/uploads/")) {
                imageUrl = `http://localhost:8080${user.imageData}`;
                console.log("getMe - File path imageUrl:", imageUrl);
            }
            else if (user.imageData.startsWith("data:image/")) {
                imageUrl = `http://localhost:8080/api/users/images/${user.role.toLowerCase()}/${user.id}`;
                console.log("getMe - Base64 imageUrl:", imageUrl);
            }
        }
        else {
            console.log("getMe - No imageData found for user");
        }
        const response = {
            ...user,
            skills: user.role === "MENTOR" ? parsedSkills : undefined,
            imageData: undefined,
            imageUrl,
            hasImage: !!user.imageData,
        };
        res.json(response);
    }
    catch (error) {
        console.error("Get me error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getMe = getMe;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        console.log(`프로필 업데이트 요청 - 사용자 ID: ${userId}, 역할: ${userRole}`);
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
            console.log(`이미지 길이: ${image.length}, 시작 부분: ${image.substring(0, 50)}`);
        }
        let imageData;
        if (image) {
            const base64Regex = /^data:image\/(jpeg|jpg|png);base64,/;
            if (!base64Regex.test(image)) {
                res.status(400).json({
                    error: "Invalid image format. Only JPEG and PNG are allowed.",
                });
                return;
            }
            const sizeInBytes = (image.length * 3) / 4;
            if (sizeInBytes > 1048576) {
                res.status(400).json({ error: "Image size must be less than 1MB" });
                return;
            }
            imageData = image;
        }
        let skillsData;
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
        let parsedSkills = [];
        if (updatedUser.skills) {
            try {
                parsedSkills = JSON.parse(updatedUser.skills);
            }
            catch (e) {
                console.error("Error parsing skills:", e);
            }
        }
        let imageUrl;
        if (updatedUser.imageData) {
            console.log("updateProfile - User imageData exists:", updatedUser.imageData.substring(0, 50) + "...");
            if (updatedUser.imageData.startsWith("/uploads/")) {
                imageUrl = `http://localhost:8080${updatedUser.imageData}`;
                console.log("updateProfile - File path imageUrl:", imageUrl);
            }
            else if (updatedUser.imageData.startsWith("data:image/")) {
                imageUrl = `http://localhost:8080/api/users/images/${updatedUser.role.toLowerCase()}/${updatedUser.id}`;
                console.log("updateProfile - Base64 imageUrl:", imageUrl);
            }
        }
        else {
            console.log("updateProfile - No imageData found for user");
        }
        const response = {
            ...updatedUser,
            skills: updatedUser.role === "MENTOR" ? parsedSkills : undefined,
            imageData: undefined,
            imageUrl,
            hasImage: !!updatedUser.imageData,
        };
        console.log("응답 데이터:", {
            ...response,
            imageUrl: response.imageUrl,
            hasImage: response.hasImage,
        });
        res.json(response);
    }
    catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateProfile = updateProfile;
const getProfileImage = async (req, res) => {
    try {
        const { role, id } = req.params;
        const userId = parseInt(id);
        if (isNaN(userId)) {
            res.status(400).json({ error: "Invalid user ID" });
            return;
        }
        if (role !== "mentor" && role !== "mentee") {
            res.status(400).json({ error: "Invalid role" });
            return;
        }
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                role: role.toUpperCase(),
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
            const defaultImageUrl = role === "mentor"
                ? "https://placehold.co/500x500.jpg?text=MENTOR"
                : "https://placehold.co/500x500.jpg?text=MENTEE";
            res.redirect(defaultImageUrl);
            return;
        }
        const base64Data = user.imageData.replace(/^data:image\/[a-z]+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, "base64");
        const mimeMatch = user.imageData.match(/^data:image\/([a-z]+);base64,/);
        const mimeType = mimeMatch ? `image/${mimeMatch[1]}` : "image/jpeg";
        res.set("Content-Type", mimeType);
        res.set("Cache-Control", "public, max-age=3600");
        res.send(imageBuffer);
    }
    catch (error) {
        console.error("Get profile image error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getProfileImage = getProfileImage;
const uploadProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!req.file) {
            res.status(400).json({ error: "이미지 파일이 필요합니다." });
            return;
        }
        (0, upload_1.validateImage)(req.file);
        const imageUrl = `/uploads/${req.file.filename}`;
        const fullImageUrl = `http://localhost:8080${imageUrl}`;
        await prisma.user.update({
            where: { id: userId },
            data: { imageData: imageUrl },
        });
        res.json({
            message: "프로필 이미지가 성공적으로 업로드되었습니다.",
            imageUrl: fullImageUrl,
        });
    }
    catch (error) {
        console.error("Upload profile image error:", error);
        if (req.file) {
            const filePath = path_1.default.join(process.cwd(), "uploads", req.file.filename);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "이미지 업로드 중 오류가 발생했습니다.",
        });
    }
};
exports.uploadProfileImage = uploadProfileImage;
//# sourceMappingURL=user.js.map