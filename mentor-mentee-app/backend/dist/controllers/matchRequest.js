"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelMatchRequest = exports.rejectMatchRequest = exports.acceptMatchRequest = exports.getOutgoingMatchRequests = exports.getIncomingMatchRequests = exports.createMatchRequest = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const createMatchRequestSchema = zod_1.z.object({
    mentorId: zod_1.z.number(),
    menteeId: zod_1.z.number(),
    message: zod_1.z.string().min(1, "Message is required"),
});
const createMatchRequest = async (req, res) => {
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
        if (menteeId !== req.user.id) {
            res
                .status(403)
                .json({ error: "You can only send requests for yourself" });
            return;
        }
        const mentor = await prisma.user.findFirst({
            where: { id: mentorId, role: "MENTOR" },
        });
        if (!mentor) {
            res.status(404).json({ error: "Mentor not found" });
            return;
        }
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
    }
    catch (error) {
        console.error("Create match request error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.createMatchRequest = createMatchRequest;
const getIncomingMatchRequests = async (req, res) => {
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
    }
    catch (error) {
        console.error("Get incoming requests error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getIncomingMatchRequests = getIncomingMatchRequests;
const getOutgoingMatchRequests = async (req, res) => {
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
            let parsedSkills = [];
            if (request.mentor.skills) {
                try {
                    parsedSkills = JSON.parse(request.mentor.skills);
                }
                catch (e) {
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
    }
    catch (error) {
        console.error("Get outgoing requests error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getOutgoingMatchRequests = getOutgoingMatchRequests;
const acceptMatchRequest = async (req, res) => {
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
        const result = await prisma.$transaction(async (tx) => {
            const accepted = await tx.matchRequest.update({
                where: { id: requestId },
                data: { status: "ACCEPTED" },
            });
            await tx.matchRequest.updateMany({
                where: {
                    mentorId: req.user.id,
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
    }
    catch (error) {
        console.error("Accept match request error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.acceptMatchRequest = acceptMatchRequest;
const rejectMatchRequest = async (req, res) => {
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
    }
    catch (error) {
        console.error("Reject match request error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.rejectMatchRequest = rejectMatchRequest;
const cancelMatchRequest = async (req, res) => {
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
    }
    catch (error) {
        console.error("Cancel match request error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.cancelMatchRequest = cancelMatchRequest;
//# sourceMappingURL=matchRequest.js.map