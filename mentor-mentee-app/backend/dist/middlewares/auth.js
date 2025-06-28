"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.requireRole = requireRole;
const jwt_1 = require("../utils/jwt");
function authenticateToken(req, res, next) {
    try {
        const token = (0, jwt_1.extractTokenFromHeader)(req.headers.authorization);
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = {
            id: parseInt(payload.sub),
            email: payload.email,
            name: payload.name,
            role: payload.role,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
}
function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        if (req.user.role !== role) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map