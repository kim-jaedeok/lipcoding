# 멘토-멘티 매칭 앱

TypeScript 기반 멘토와 멘티를 매칭하는 풀스택 웹 애플리케이션입니다.

## 🚀 빠른 시작

### 백엔드 실행

```bash
cd backend
npm install
npm run dev
```

백엔드 서버: http://localhost:8080
API 문서: http://localhost:8080/swagger-ui

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

프론트엔드 앱: http://localhost:3000

## 🛠️ 기술 스택

### Frontend

- React 19 + TypeScript
- Vite
- Material-UI
- React Query + Zustand
- React Router v6
- Axios

### Backend

- Node.js + Express + TypeScript
- Prisma ORM + SQLite
- JWT Authentication
- Swagger UI

## 📋 주요 기능

- 🔐 JWT 기반 인증 (멘토/멘티 역할)
- 👤 프로필 관리 (이미지 업로드 포함)
- 🔍 멘토 검색 및 정렬
- 💌 매칭 요청 시스템
- 🛡️ OWASP 보안 적용

## 📁 프로젝트 구조

```
mentor-mentee-app/
├── backend/           # Express TypeScript 백엔드
├── frontend/          # React TypeScript 프론트엔드
└── README.md
```

## 🔐 보안

- SQL 인젝션 방지 (Prisma ORM)
- XSS 방지 (입력 검증)
- JWT 토큰 인증
- Rate Limiting
- CORS 설정
- Helmet 보안 헤더

## 📖 API 문서

OpenAPI 3.0 기반 API 문서는 서버 실행 후 다음 주소에서 확인할 수 있습니다:

- Swagger UI: http://localhost:8080/swagger-ui
- OpenAPI JSON: http://localhost:8080/openapi.json
