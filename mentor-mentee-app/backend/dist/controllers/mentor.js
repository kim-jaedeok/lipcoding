"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMentors = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getMentors = async (req, res) => {
    try {
        if (req.user?.role !== "MENTEE") {
            res.status(403).json({ error: "Only mentees can access mentor list" });
            return;
        }
        const { skill, order_by } = req.query;
        let whereCondition = {
            role: "MENTOR",
        };
        if (skill && typeof skill === "string") {
            whereCondition.skills = {
                contains: skill,
            };
        }
        let orderBy = { id: "asc" };
        if (order_by === "name") {
            orderBy = { name: "asc" };
        }
        else if (order_by === "skill") {
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
        const formattedMentors = mentors.map((mentor) => {
            let parsedSkills = [];
            if (mentor.skills) {
                try {
                    parsedSkills = JSON.parse(mentor.skills);
                }
                catch (e) {
                    console.error("Error parsing skills:", e);
                }
            }
            let imageUrl;
            if (mentor.imageData) {
                if (mentor.imageData.startsWith("/uploads/")) {
                    imageUrl = `http://localhost:8080${mentor.imageData}`;
                }
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
                imageUrl: imageUrl ||
                    `https://placehold.co/500x500.jpg?text=${encodeURIComponent(mentor.name)}`,
                createdAt: mentor.createdAt,
            };
        });
        res.json(formattedMentors);
    }
    catch (error) {
        console.error("Get mentors error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getMentors = getMentors;
//# sourceMappingURL=mentor.js.map