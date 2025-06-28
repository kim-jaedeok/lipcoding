import { Router } from "express";
import {
  getMe,
  updateProfile,
  getProfileImage,
  uploadProfileImage,
} from "../controllers/user";
import { authenticateToken } from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const router = Router();

// 인증이 필요한 라우터
router.get("/me", authenticateToken, getMe);
router.put("/profile", authenticateToken, updateProfile);
router.post(
  "/profile/image",
  authenticateToken,
  upload.single("image"),
  uploadProfileImage
);

// 프로필 이미지는 인증 없이도 접근 가능 (공개 프로필 이미지)
router.get("/images/:role/:id", getProfileImage);

export default router;
