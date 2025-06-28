"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const prisma_1 = __importDefault(require("../utils/prisma"));
async function signup(req, res) {
    try {
        const { email, password, name, role } = req.body;
        if (!email || !password || !name || !role) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        if (!["mentor", "mentee"].includes(role)) {
            res.status(400).json({ error: "Invalid role" });
            return;
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(400).json({ error: "Email already exists" });
            return;
        }
        const hashedPassword = await (0, password_1.hashPassword)(password);
        await prisma_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role.toUpperCase(),
            },
        });
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Missing email or password" });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const isValidPassword = await (0, password_1.comparePassword)(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });
        const userInfo = {
            id: user.id,
            email: user.email,
            name: user.name,
            fullName: user.name,
            role: user.role,
            bio: user.bio,
            skills: user.skills ? JSON.parse(user.skills) : [],
            hasImage: !!user.imageData,
            imageUrl: user.imageData
                ? `/images/${user.role.toLowerCase()}/${user.id}`
                : undefined,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
        res.json({ token, user: userInfo });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
//# sourceMappingURL=auth.js.map