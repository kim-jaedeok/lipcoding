"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const auth_1 = require("../middlewares/auth");
const upload_1 = require("../middlewares/upload");
const router = (0, express_1.Router)();
router.get("/me", auth_1.authenticateToken, user_1.getMe);
router.put("/profile", auth_1.authenticateToken, user_1.updateProfile);
router.post("/profile/image", auth_1.authenticateToken, upload_1.upload.single("image"), user_1.uploadProfileImage);
router.get("/images/:role/:id", user_1.getProfileImage);
exports.default = router;
//# sourceMappingURL=user.js.map