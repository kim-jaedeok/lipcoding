import { Response } from "express";
import { AuthenticatedRequest } from "../types";
export declare const createMatchRequest: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getIncomingMatchRequests: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getOutgoingMatchRequests: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const acceptMatchRequest: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const rejectMatchRequest: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const cancelMatchRequest: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=matchRequest.d.ts.map