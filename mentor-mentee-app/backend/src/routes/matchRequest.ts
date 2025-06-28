import { Router } from "express";
import {
  createMatchRequest,
  getIncomingMatchRequests,
  getOutgoingMatchRequests,
  acceptMatchRequest,
  rejectMatchRequest,
  cancelMatchRequest,
} from "../controllers/matchRequest";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// 매칭 요청 생성 (멘티 전용)
router.post("/match-requests", authenticateToken, createMatchRequest);

// 받은 요청 목록 (멘토 전용)
router.get(
  "/match-requests/incoming",
  authenticateToken,
  getIncomingMatchRequests
);

// 보낸 요청 목록 (멘티 전용)
router.get(
  "/match-requests/outgoing",
  authenticateToken,
  getOutgoingMatchRequests
);

// 요청 수락 (멘토 전용)
router.put("/match-requests/:id/accept", authenticateToken, acceptMatchRequest);

// 요청 거절 (멘토 전용)
router.put("/match-requests/:id/reject", authenticateToken, rejectMatchRequest);

// 요청 취소 (멘티 전용)
router.delete("/match-requests/:id", authenticateToken, cancelMatchRequest);

export default router;
