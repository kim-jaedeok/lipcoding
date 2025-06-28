import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// 사용자 정보가 포함된 Request 타입
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// uploads 디렉토리 생성
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage 설정
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // 파일명: 사용자ID_timestamp.확장자
    const ext = path.extname(file.originalname);
    const userId = (req as AuthenticatedRequest).user?.id || "unknown";
    const filename = `${userId}_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// 파일 필터
const fileFilter = (
  _req: AuthenticatedRequest,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // 이미지 파일만 허용
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("이미지 파일만 업로드 가능합니다."));
  }
};

// Multer 설정
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
});

// 이미지 유효성 검증
export const validateImage = (file: Express.Multer.File) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 1024 * 1024; // 1MB

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error("JPEG, PNG, WebP 파일만 업로드 가능합니다.");
  }

  if (file.size > maxSize) {
    throw new Error("파일 크기는 1MB 이하여야 합니다.");
  }

  return true;
};
