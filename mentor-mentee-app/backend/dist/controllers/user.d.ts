import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types";
export declare const getMe: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getProfileImage: (req: Request, res: Response) => Promise<void>;
export declare const uploadProfileImage: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=user.d.ts.map