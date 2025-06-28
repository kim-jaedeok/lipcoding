import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { AuthenticatedRequest } from "../types";

const prisma = new PrismaClient();

// 매칭 요청 생성 스키마
const createMatchRequestSchema = z.object({
  mentorId: z.number(),
  menteeId: z.number(),
  message: z.string().min(1, "Message is required"),
});

// 매칭 요청 생성 (멘티 전용)
export const createMatchRequest = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "MENTEE") {
      res.status(403).json({ error: "Only mentees can send match requests" });
      return;
    }

    const validation = createMatchRequestSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "Validation failed",
        details: validation.error.errors,
      });
      return;
    }

    const { mentorId, menteeId, message } = validation.data;

    // 멘티 ID 검증
    if (menteeId !== req.user.id) {
      res
        .status(403)
        .json({ error: "You can only send requests for yourself" });
      return;
    }

    // 멘토 존재 확인
    const mentor = await prisma.user.findFirst({
      where: { id: mentorId, role: "MENTOR" },
    });

    if (!mentor) {
      res.status(404).json({ error: "Mentor not found" });
      return;
    }

    // 이미 요청이 있는지 확인
    const existingRequest = await prisma.matchRequest.findFirst({
      where: {
        mentorId,
        menteeId,
        status: { in: ["PENDING", "ACCEPTED"] },
      },
    });

    if (existingRequest) {
      res
        .status(400)
        .json({ error: "Request already exists or is already accepted" });
      return;
    }

    // 멘티가 다른 멘토에게 pending 요청이 있는지 확인
    const pendingRequest = await prisma.matchRequest.findFirst({
      where: {
        menteeId,
        status: "PENDING",
      },
    });

    if (pendingRequest) {
      res.status(400).json({ error: "You already have a pending request" });
      return;
    }

    // 매칭 요청 생성
    const matchRequest = await prisma.matchRequest.create({
      data: {
        mentorId,
        menteeId,
        message,
        status: "PENDING",
      },
    });

    res.json({
      id: matchRequest.id,
      status: matchRequest.status,
    });
  } catch (error) {
    console.error("Create match request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 받은 요청 목록 (멘토 전용)
export const getIncomingMatchRequests = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "MENTOR") {
      res
        .status(403)
        .json({ error: "Only mentors can view incoming requests" });
      return;
    }

    const requests = await prisma.matchRequest.findMany({
      where: { mentorId: req.user.id },
      include: {
        mentee: {
          select: {
            id: true,
            name: true,
            bio: true,
            imageData: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedRequests = requests.map((request) => ({
      id: request.id,
      message: request.message,
      status: request.status,
      createdAt: request.createdAt,
      mentee: {
        id: request.mentee.id,
        name: request.mentee.name,
        bio: request.mentee.bio || "",
        hasImage: !!request.mentee.imageData,
        imageUrl: `/api/images/mentee/${request.mentee.id}`,
      },
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error("Get incoming requests error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 보낸 요청 목록 (멘티 전용)
export const getOutgoingMatchRequests = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "MENTEE") {
      res
        .status(403)
        .json({ error: "Only mentees can view outgoing requests" });
      return;
    }

    const requests = await prisma.matchRequest.findMany({
      where: { menteeId: req.user.id },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            bio: true,
            skills: true,
            imageData: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedRequests = requests.map((request) => {
      let parsedSkills: string[] = [];
      if (request.mentor.skills) {
        try {
          parsedSkills = JSON.parse(request.mentor.skills);
        } catch (e) {
          console.error("Error parsing skills:", e);
        }
      }

      return {
        id: request.id,
        message: request.message,
        status: request.status,
        createdAt: request.createdAt,
        mentor: {
          id: request.mentor.id,
          name: request.mentor.name,
          bio: request.mentor.bio || "",
          skills: parsedSkills,
          hasImage: !!request.mentor.imageData,
          imageUrl: `/api/images/mentor/${request.mentor.id}`,
        },
      };
    });

    res.json(formattedRequests);
  } catch (error) {
    console.error("Get outgoing requests error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 요청 수락 (멘토 전용)
export const acceptMatchRequest = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "MENTOR") {
      res.status(403).json({ error: "Only mentors can accept requests" });
      return;
    }

    const requestId = parseInt(req.params.id);
    if (isNaN(requestId)) {
      res.status(400).json({ error: "Invalid request ID" });
      return;
    }

    // 요청 확인
    const matchRequest = await prisma.matchRequest.findFirst({
      where: {
        id: requestId,
        mentorId: req.user.id,
        status: "PENDING",
      },
    });

    if (!matchRequest) {
      res.status(404).json({ error: "Match request not found or not pending" });
      return;
    }

    // 멘토가 이미 수락한 요청이 있는지 확인
    const existingAccepted = await prisma.matchRequest.findFirst({
      where: {
        mentorId: req.user.id,
        status: "ACCEPTED",
      },
    });

    if (existingAccepted) {
      res
        .status(400)
        .json({ error: "You already have an accepted mentoring relationship" });
      return;
    }

    // 트랜잭션으로 요청 수락 및 다른 요청들 거절
    const result = await prisma.$transaction(async (tx) => {
      // 해당 요청 수락
      const accepted = await tx.matchRequest.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" },
      });

      // 같은 멘토의 다른 pending 요청들 거절
      await tx.matchRequest.updateMany({
        where: {
          mentorId: req.user!.id,
          id: { not: requestId },
          status: "PENDING",
        },
        data: { status: "REJECTED" },
      });

      return accepted;
    });

    res.json({
      id: result.id,
      status: result.status,
    });
  } catch (error) {
    console.error("Accept match request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 요청 거절 (멘토 전용)
export const rejectMatchRequest = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "MENTOR") {
      res.status(403).json({ error: "Only mentors can reject requests" });
      return;
    }

    const requestId = parseInt(req.params.id);
    if (isNaN(requestId)) {
      res.status(400).json({ error: "Invalid request ID" });
      return;
    }

    const matchRequest = await prisma.matchRequest.findFirst({
      where: {
        id: requestId,
        mentorId: req.user.id,
        status: "PENDING",
      },
    });

    if (!matchRequest) {
      res.status(404).json({ error: "Match request not found or not pending" });
      return;
    }

    const updated = await prisma.matchRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    });

    res.json({
      id: updated.id,
      status: updated.status,
    });
  } catch (error) {
    console.error("Reject match request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 요청 취소 (멘티 전용)
export const cancelMatchRequest = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role !== "MENTEE") {
      res.status(403).json({ error: "Only mentees can cancel requests" });
      return;
    }

    const requestId = parseInt(req.params.id);
    if (isNaN(requestId)) {
      res.status(400).json({ error: "Invalid request ID" });
      return;
    }

    const matchRequest = await prisma.matchRequest.findFirst({
      where: {
        id: requestId,
        menteeId: req.user.id,
        status: { in: ["PENDING", "ACCEPTED"] },
      },
    });

    if (!matchRequest) {
      res.status(404).json({ error: "Match request not found" });
      return;
    }

    await prisma.matchRequest.delete({
      where: { id: requestId },
    });

    res.json({ message: "Match request cancelled successfully" });
  } catch (error) {
    console.error("Cancel match request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
