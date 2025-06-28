"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("./config");
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const mentor_1 = __importDefault(require("./routes/mentor"));
const matchRequest_1 = __importDefault(require("./routes/matchRequest"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP",
});
app.use(limiter);
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static("uploads"));
app.use("/api", auth_1.default);
app.use("/api", user_1.default);
app.use("/api", mentor_1.default);
app.use("/api", matchRequest_1.default);
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
let swaggerDocument;
try {
    const openApiPath = path.join(__dirname, "../../../requirements/openapi.yaml");
    if (fs.existsSync(openApiPath)) {
        const yamlContent = fs.readFileSync(openApiPath, "utf8");
        swaggerDocument = yaml.load(yamlContent);
    }
    else {
        throw new Error("OpenAPI file not found");
    }
}
catch (error) {
    console.warn("Could not load OpenAPI file, using fallback:", error);
    swaggerDocument = {
        openapi: "3.0.1",
        info: {
            title: "Mentor-Mentee Matching API",
            description: "API for matching mentors and mentees in a mentoring platform",
            version: "1.0.0",
            contact: {
                name: "Mentor-Mentee Matching App",
            },
            license: {
                name: "MIT",
            },
        },
        servers: [
            {
                url: "http://localhost:8080/api",
                description: "Local development server",
            },
        ],
        security: [
            {
                BearerAuth: [],
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "JWT token obtained from login endpoint",
                },
            },
        },
        tags: [
            {
                name: "Authentication",
                description: "User authentication endpoints",
            },
            {
                name: "User Profile",
                description: "User profile management endpoints",
            },
            {
                name: "Mentors",
                description: "Mentor listing endpoints",
            },
            {
                name: "Match Requests",
                description: "Match request management endpoints",
            },
        ],
    };
}
app.use("/swagger-ui", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.get("/openapi.json", (_, res) => {
    res.json(swaggerDocument);
});
app.get("/", (_, res) => {
    res.redirect("/swagger-ui");
});
app.use("*", (_, res) => {
    res.status(404).json({ error: "Not found" });
});
app.use((err, _req, res, _next) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
});
const port = config_1.config.port;
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 API docs available at http://localhost:${port}/swagger-ui`);
    console.log(`📄 OpenAPI spec at http://localhost:${port}/openapi.json`);
});
//# sourceMappingURL=index.js.map