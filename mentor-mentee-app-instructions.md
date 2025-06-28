# 멘토-멘티 매칭 앱 개발 Instructions

## 프로젝트 개요

TypeScript를 사용하여 멘토와 멘티를 매칭하는 풀스택 웹 애플리케이션을 개발합니다.

## 기술 스택

### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) 또는 Ant Design
- **State Management**: React Query + Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **API Documentation**: Swagger UI Express
- **Validation**: Zod
- **Security**: Helmet, CORS, Express Rate Limit

## 프로젝트 구조

```
mentor-mentee-app/
├── frontend/                 # React TypeScript 프론트엔드
│   ├── src/
│   │   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── hooks/           # 커스텀 훅
│   │   ├── services/        # API 서비스
│   │   ├── types/           # TypeScript 타입 정의
│   │   ├── store/           # 상태 관리
│   │   ├── utils/           # 유틸리티 함수
│   │   └── constants/       # 상수 정의
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Express TypeScript 백엔드
│   ├── src/
│   │   ├── controllers/     # 컨트롤러
│   │   ├── middlewares/     # 미들웨어
│   │   ├── models/          # 데이터 모델
│   │   ├── routes/          # 라우터
│   │   ├── services/        # 비즈니스 로직
│   │   ├── types/           # TypeScript 타입 정의
│   │   ├── utils/           # 유틸리티 함수
│   │   └── config/          # 설정 파일
│   ├── prisma/              # 데이터베이스 스키마
│   ├── uploads/             # 업로드된 파일
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 핵심 기능 요구사항

### 1. 인증 시스템

- JWT 기반 인증
- 회원가입 (이메일, 비밀번호, 이름, 역할)
- 로그인/로그아웃
- 토큰 만료 처리
- 역할 기반 라우팅 (멘토/멘티)

### 2. 사용자 프로필

- 프로필 조회/수정
- 이미지 업로드 (최대 1MB, .jpg/.png)
- 기본 이미지 제공
- 멘토: 기술 스택 관리
- 멘티: 기본 프로필 정보

### 3. 멘토 목록 (멘티 전용)

- 멘토 리스트 조회
- 기술 스택으로 검색
- 이름/기술 스택으로 정렬
- 매칭 요청 보내기

### 4. 매칭 요청 관리

- 요청 보내기 (메시지 포함)
- 요청 상태 관리 (pending/accepted/rejected/cancelled)
- 멘토: 요청 수락/거절
- 멘티: 요청 취소
- 한 번에 하나의 매칭만 허용

## API 엔드포인트 (OpenAPI 기반)

### 인증

- `POST /api/signup` - 회원가입
- `POST /api/login` - 로그인

### 사용자

- `GET /api/me` - 내 정보 조회
- `PUT /api/profile` - 프로필 수정
- `GET /api/images/:role/:id` - 프로필 이미지

### 멘토

- `GET /api/mentors` - 멘토 목록 조회 (쿼리: skill, order_by)

### 매칭 요청

- `POST /api/match-requests` - 요청 보내기
- `GET /api/match-requests/incoming` - 받은 요청 (멘토)
- `GET /api/match-requests/outgoing` - 보낸 요청 (멘티)
- `PUT /api/match-requests/:id/accept` - 요청 수락
- `PUT /api/match-requests/:id/reject` - 요청 거절
- `DELETE /api/match-requests/:id` - 요청 취소

## UI/UX 요구사항

### 페이지 구조

- `/` - 홈 (로그인 상태에 따라 리디렉션)
- `/signup` - 회원가입
- `/login` - 로그인
- `/profile` - 프로필 관리
- `/mentors` - 멘토 목록 (멘티 전용)
- `/requests` - 요청 관리

### 네비게이션

- 멘토: Profile, Requests
- 멘티: Profile, Mentors, Requests

### 테스트 ID 요구사항

특정 HTML 요소들은 테스트를 위해 정확한 ID를 가져야 합니다:

#### 회원가입

- email 입력: `id="email"`
- password 입력: `id="password"`
- role 선택: `id="role"`
- 가입 버튼: `id="signup"`

#### 로그인

- email 입력: `id="email"`
- password 입력: `id="password"`
- 로그인 버튼: `id="login"`

#### 프로필

- name 입력: `id="name"`
- bio 입력: `id="bio"`
- skillsets 입력: `id="skillsets"`
- 프로필 사진: `id="profile-photo"`
- 파일 입력: `id="profile"`
- 저장 버튼: `id="save"`

#### 멘토 목록

- 멘토 항목: `class="mentor"`
- 검색 입력: `id="search"`
- 이름 정렬: `id="name"`
- 스킬 정렬: `id="skill"`

#### 매칭 요청

- 메시지 입력: `id="message"`, `data-mentor-id="{{mentor-id}}"`, `data-testid="message-{{mentor-id}}"`
- 요청 상태: `id="request-status"`
- 요청 버튼: `id="request"`

#### 요청 관리

- 요청 메시지: `class="request-message"`, `mentee="{{mentee-id}}"`
- 수락 버튼: `id="accept"`
- 거절 버튼: `id="reject"`

## 보안 요구사항

### JWT 토큰

- RFC 7519 준수 클레임: `iss`, `sub`, `aud`, `exp`, `nbf`, `iat`, `jti`
- 커스텀 클레임: `name`, `email`, `role`
- 만료 시간: 1시간
- Bearer 토큰 형식

### 보안 조치

- SQL 인젝션 방지 (Prisma ORM 사용)
- XSS 방지 (입력 검증 및 이스케이핑)
- CSRF 방지
- Rate Limiting
- CORS 설정
- Helmet 보안 헤더

## 개발 환경 설정

### 포트 설정

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- API Base URL: `http://localhost:8080/api`

### 데이터베이스

- SQLite (로컬 개발용)
- Prisma ORM으로 스키마 관리
- 자동 마이그레이션 및 초기화

### API 문서

- `http://localhost:8080/openapi.json` - OpenAPI 스펙
- `http://localhost:8080/swagger-ui` - Swagger UI
- `http://localhost:8080/` - Swagger UI로 리디렉션

## 개발 순서

1. **백엔드 설정**

   - Express + TypeScript 프로젝트 초기화
   - Prisma 설정 및 데이터베이스 스키마 정의
   - JWT 인증 미들웨어 구현
   - 기본 라우터 및 컨트롤러 구현

2. **프론트엔드 설정**

   - React + TypeScript + Vite 프로젝트 초기화
   - 라우팅 및 상태 관리 설정
   - API 서비스 레이어 구현
   - 기본 레이아웃 및 컴포넌트 구현

3. **인증 기능**

   - 회원가입/로그인 API 및 UI
   - JWT 토큰 관리
   - 인증 상태 기반 라우팅

4. **프로필 관리**

   - 프로필 CRUD API 및 UI
   - 이미지 업로드 기능

5. **멘토 목록 및 검색**

   - 멘토 목록 API 및 UI
   - 검색/정렬 기능

6. **매칭 요청 시스템**

   - 요청 CRUD API 및 UI
   - 상태 관리 및 실시간 업데이트

7. **테스트 및 최적화**
   - E2E 테스트 지원을 위한 테스트 ID 추가
   - 성능 최적화
   - 에러 처리 및 사용자 경험 개선

## 품질 기준

- TypeScript strict 모드 사용
- ESLint + Prettier 코드 포맷팅
- 반응형 디자인 (모바일 대응)
- 접근성 고려 (WCAG 2.1)
- 로딩 상태 및 에러 상태 처리
- 사용자 친화적인 에러 메시지
- 성능 최적화 (코드 스플리팅, 이미지 최적화)
