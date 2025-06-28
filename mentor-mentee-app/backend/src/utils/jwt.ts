import jwt from "jsonwebtoken";
import { config } from "../config";
import { JWTPayload, AuthenticatedUser } from "../types";

export function generateToken(user: AuthenticatedUser): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    iss: "mentor-mentee-app",
    sub: user.id.toString(),
    aud: "mentor-mentee-app-users",
    exp: now + 3600, // 1시간 유효
    nbf: now,
    iat: now,
    jti: `${user.id}-${now}`,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, config.jwtSecret);
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, config.jwtSecret) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export function extractTokenFromHeader(authHeader: string | undefined): string {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Invalid authorization header");
  }
  return authHeader.substring(7);
}
