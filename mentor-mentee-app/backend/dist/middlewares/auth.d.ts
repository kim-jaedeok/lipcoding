import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { Role } from "@prisma/client";
export declare function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
export declare function requireRole(role: Role): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map