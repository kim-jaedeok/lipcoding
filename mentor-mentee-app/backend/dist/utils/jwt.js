"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.extractTokenFromHeader = extractTokenFromHeader;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function generateToken(user) {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: "mentor-mentee-app",
        sub: user.id.toString(),
        aud: "mentor-mentee-app-users",
        exp: now + 3600,
        nbf: now,
        iat: now,
        jti: `${user.id}-${now}`,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    return jsonwebtoken_1.default.sign(payload, config_1.config.jwtSecret);
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
    }
    catch (error) {
        throw new Error("Invalid token");
    }
}
function extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Invalid authorization header");
    }
    return authHeader.substring(7);
}
//# sourceMappingURL=jwt.js.map