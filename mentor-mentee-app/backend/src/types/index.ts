import { Request } from "express";
import { Role } from "@prisma/client";

export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface JWTPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
  name: string;
  email: string;
  role: Role;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: "mentor" | "mentee";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  image?: string; // Base64 encoded
  skills?: string[]; // Only for mentors
}

export interface MatchRequestCreate {
  mentorId: number;
  menteeId: number;
  message: string;
}
