import { JWTPayload, AuthenticatedUser } from "../types";
export declare function generateToken(user: AuthenticatedUser): string;
export declare function verifyToken(token: string): JWTPayload;
export declare function extractTokenFromHeader(authHeader: string | undefined): string;
//# sourceMappingURL=jwt.d.ts.map