"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadsDir = path_1.default.join(process.cwd(), "uploads");
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const userId = req.user?.id || "unknown";
        const filename = `${userId}_${Date.now()}${ext}`;
        cb(null, filename);
    },
});
const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("이미지 파일만 업로드 가능합니다."));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024,
    },
});
const validateImage = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 1024 * 1024;
    if (!allowedTypes.includes(file.mimetype)) {
        throw new Error("JPEG, PNG, WebP 파일만 업로드 가능합니다.");
    }
    if (file.size > maxSize) {
        throw new Error("파일 크기는 1MB 이하여야 합니다.");
    }
    return true;
};
exports.validateImage = validateImage;
//# sourceMappingURL=upload.js.map