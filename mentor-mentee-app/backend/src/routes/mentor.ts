import { Router } from "express";
import { getMentors } from "../controllers/mentor";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// 멘토 목록 조회 (멘티 전용)
router.get("/mentors", authenticateToken, getMentors);

export default router;
