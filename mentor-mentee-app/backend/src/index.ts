import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { config } from "./config";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import mentorRoutes from "./routes/mentor";
import matchRequestRoutes from "./routes/matchRequest";

const app = express();

// 보안 미들웨어
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100 요청
  message: "Too many requests from this IP",
});
app.use(limiter);

// JSON 파싱
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 (업로드된 이미지)
app.use("/uploads", express.static("uploads"));

// API 라우트
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", mentorRoutes);
app.use("/api", matchRequestRoutes);

// OpenAPI 문서 import
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

// OpenAPI 문서 로드
let swaggerDocument: any;
try {
  const openApiPath = path.join(
    __dirname,
    "../../../requirements/openapi.yaml"
  );
  if (fs.existsSync(openApiPath)) {
    const yamlContent = fs.readFileSync(openApiPath, "utf8");
    swaggerDocument = yaml.load(yamlContent);
  } else {
    throw new Error("OpenAPI file not found");
  }
} catch (error) {
  console.warn("Could not load OpenAPI file, using fallback:", error);
  swaggerDocument = {
    openapi: "3.0.1",
    info: {
      title: "Mentor-Mentee Matching API",
      description:
        "API for matching mentors and mentees in a mentoring platform",
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

app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/openapi.json", (_, res) => {
  res.json(swaggerDocument);
});

// 루트 경로는 Swagger UI로 리디렉션
app.get("/", (_, res) => {
  res.redirect("/swagger-ui");
});

// 404 핸들러
app.use("*", (_, res) => {
  res.status(404).json({ error: "Not found" });
});

// 에러 핸들러
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

const port = config.port;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API docs available at http://localhost:${port}/swagger-ui`);
  console.log(`📄 OpenAPI spec at http://localhost:${port}/openapi.json`);
});
