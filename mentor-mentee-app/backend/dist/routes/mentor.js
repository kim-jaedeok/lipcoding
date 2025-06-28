"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mentor_1 = require("../controllers/mentor");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/mentors", auth_1.authenticateToken, mentor_1.getMentors);
exports.default = router;
//# sourceMappingURL=mentor.js.map