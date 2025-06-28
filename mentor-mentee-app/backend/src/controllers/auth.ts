import { Request, Response } from "express";
import { SignupRequest, LoginRequest } from "../types";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import prisma from "../utils/prisma";
import { Role } from "@prisma/client";

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name, role }: SignupRequest = req.body;

    // 입력 검증
    if (!email || !password || !name || !role) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (!["mentor", "mentee"].includes(role)) {
      res.status(400).json({ error: "Invalid role" });
      return;
    }

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 사용자 생성
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role.toUpperCase() as Role,
      },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password }: LoginRequest = req.body;

    // 입력 검증
    if (!email || !password) {
      res.status(400).json({ error: "Missing email or password" });
      return;
    }

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // 비밀번호 확인
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // JWT 토큰 생성
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // 사용자 정보 (비밀번호 제외)
    const userInfo = {
      id: user.id,
      email: user.email,
      name: user.name,
      fullName: user.name, // fullName을 name과 동일하게 설정
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
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
