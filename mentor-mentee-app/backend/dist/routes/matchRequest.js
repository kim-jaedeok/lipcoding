"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const matchRequest_1 = require("../controllers/matchRequest");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/match-requests", auth_1.authenticateToken, matchRequest_1.createMatchRequest);
router.get("/match-requests/incoming", auth_1.authenticateToken, matchRequest_1.getIncomingMatchRequests);
router.get("/match-requests/outgoing", auth_1.authenticateToken, matchRequest_1.getOutgoingMatchRequests);
router.put("/match-requests/:id/accept", auth_1.authenticateToken, matchRequest_1.acceptMatchRequest);
router.put("/match-requests/:id/reject", auth_1.authenticateToken, matchRequest_1.rejectMatchRequest);
router.delete("/match-requests/:id", auth_1.authenticateToken, matchRequest_1.cancelMatchRequest);
exports.default = router;
//# sourceMappingURL=matchRequest.js.map