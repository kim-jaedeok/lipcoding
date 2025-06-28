# 멘토-멘티 매칭 앱 종합 개발 가이드

> 이 문서는 TypeScript 기반 멘토-멘티 매칭 웹 애플리케이션 개발을 위한 종합 가이드입니다.

## 📌 프로젝트 개요

멘토와 멘티를 매칭하는 웹 플랫폼으로, JWT 인증 기반의 역할별 접근 제어와 실시간 매칭 요청 관리 시스템을 제공합니다.

### 주요 특징

- 🔐 JWT 기반 인증 시스템
- 👥 역할별 UI/UX (멘토/멘티)
- 📸 프로필 이미지 업로드
- 🔍 멘토 검색 및 정렬
- 💬 매칭 요청 및 메시지 시스템
- 🛡️ OWASP Top 10 보안 적용

## 🛠️ 기술 스택

### Frontend

```json
{
  "framework": "React 19 + TypeScript",
  "buildTool": "Vite",
  "ui": "Material-UI / Ant Design",
  "stateManagement": "React Query + Zustand",
  "routing": "React Router v6",
  "httpClient": "Axios",
  "forms": "React Hook Form + Zod",
  "styling": "Tailwind CSS"
}
```

### Backend

```json
{
  "runtime": "Node.js",
  "framework": "Express.js + TypeScript",
  "database": "SQLite + Prisma ORM",
  "auth": "JWT (jsonwebtoken)",
  "fileUpload": "Multer",
  "docs": "Swagger UI Express",
  "validation": "Zod",
  "security": "Helmet + CORS + Rate Limiting"
}
```

## 📁 프로젝트 구조

```
mentor-mentee-app/
├── 📱 frontend/
│   ├── src/
│   │   ├── 🧩 components/     # 재사용 컴포넌트
│   │   ├── 📄 pages/         # 페이지 컴포넌트
│   │   ├── 🎣 hooks/         # 커스텀 훅
│   │   ├── 🌐 services/      # API 서비스
│   │   ├── 📝 types/         # TypeScript 타입
│   │   ├── 🗃️ store/         # 상태 관리
│   │   ├── 🔧 utils/         # 유틸리티
│   │   └── 📊 constants/     # 상수
│   └── ⚙️ vite.config.ts
└── 🖥️ backend/
    ├── src/
    │   ├── 🎮 controllers/   # 컨트롤러
    │   ├── 🛡️ middlewares/   # 미들웨어
    │   ├── 📊 models/        # 데이터 모델
    │   ├── 🛣️ routes/        # 라우터
    │   ├── 💼 services/      # 비즈니스 로직
    │   ├── 📝 types/         # TypeScript 타입
    │   ├── 🔧 utils/         # 유틸리티
    │   └── ⚙️ config/        # 설정
    ├── 🗄️ prisma/           # DB 스키마
    └── 📁 uploads/          # 업로드 파일
```

## 🎯 핵심 기능

### 1. 🔐 인증 시스템

- **회원가입**: 이메일, 비밀번호, 이름, 역할(멘토/멘티)
- **로그인**: JWT 토큰 발급 (1시간 유효)
- **역할별 라우팅**: 멘토/멘티별 다른 네비게이션

### 2. 👤 프로필 관리

- **기본 정보**: 이름, 소개, 프로필 이미지
- **멘토 전용**: 기술 스택 관리
- **이미지 업로드**: 최대 1MB, .jpg/.png만 허용
- **기본 이미지**: 역할별 플레이스홀더 제공

### 3. 🔍 멘토 검색 (멘티 전용)

- **목록 조회**: 전체 멘토 리스트
- **검색**: 기술 스택 키워드로 필터링
- **정렬**: 이름 또는 기술 스택별 정렬

### 4. 💌 매칭 요청 시스템

- **요청 보내기**: 메시지와 함께 매칭 요청
- **상태 관리**: pending → accepted/rejected/cancelled
- **제한 사항**: 멘토당 하나의 활성 매칭만 허용

## 🌐 API 엔드포인트

### 🔐 인증

```http
POST /api/signup      # 회원가입
POST /api/login       # 로그인
```

### 👤 사용자

```http
GET  /api/me          # 내 정보 조회
PUT  /api/profile     # 프로필 수정
GET  /api/images/:role/:id  # 프로필 이미지
```

### 👨‍🏫 멘토

```http
GET  /api/mentors?skill=react&order_by=name  # 멘토 목록
```

### 💌 매칭 요청

```http
POST   /api/match-requests           # 요청 보내기
GET    /api/match-requests/incoming  # 받은 요청 (멘토)
GET    /api/match-requests/outgoing  # 보낸 요청 (멘티)
PUT    /api/match-requests/:id/accept   # 수락
PUT    /api/match-requests/:id/reject   # 거절
DELETE /api/match-requests/:id          # 취소
```

## 🎨 UI/UX 설계

### 📱 페이지 구조

```
/ (홈)              → 로그인 상태에 따라 리디렉션
├── /signup         → 회원가입
├── /login          → 로그인
├── /profile        → 프로필 관리
├── /mentors        → 멘토 목록 (멘티만)
└── /requests       → 요청 관리
```

### 🧭 네비게이션

```
멘토: [Profile] [Requests]
멘티: [Profile] [Mentors] [Requests]
```

### 🧪 테스트 ID 규칙

#### 회원가입/로그인

```html
<input id="email" />
<!-- 이메일 입력 -->
<input id="password" />
<!-- 비밀번호 입력 -->
<select id="role" />
<!-- 역할 선택 -->
<button id="signup" />
<!-- 가입 버튼 -->
<button id="login" />
<!-- 로그인 버튼 -->
```

#### 프로필

```html
<input id="name" />
<!-- 이름 -->
<textarea id="bio" />
<!-- 소개 -->
<input id="skillsets" />
<!-- 기술스택 -->
<img id="profile-photo" />
<!-- 프로필 사진 -->
<input id="profile" type="file" />
<!-- 파일 입력 -->
<button id="save" />
<!-- 저장 -->
```

#### 멘토 목록

```html
<div class="mentor" />
<!-- 멘토 카드 -->
<input id="search" />
<!-- 검색 -->
<input id="name" />
<!-- 이름 정렬 -->
<input id="skill" />
<!-- 스킬 정렬 -->
```

#### 매칭 요청

```html
<textarea id="message" data-mentor-id="123" data-testid="message-123" />
<!-- 메시지 -->
<div id="request-status" />
<!-- 상태 -->
<button id="request" />
<!-- 요청 -->
<button id="accept" />
<!-- 수락 -->
<button id="reject" />
<!-- 거절 -->

<div class="request-message" mentee="456" />
<!-- 요청 메시지 -->
```

## 🔒 보안 요구사항

### JWT 토큰 구조

```json
{
  "iss": "mentor-mentee-app",
  "sub": "user-id",
  "aud": "mentor-mentee-app",
  "exp": 1640995200,
  "nbf": 1640991600,
  "iat": 1640991600,
  "jti": "unique-token-id",
  "name": "사용자명",
  "email": "user@example.com",
  "role": "mentor|mentee"
}
```

### 보안 조치

- ✅ SQL 인젝션 방지 (Prisma ORM)
- ✅ XSS 방지 (입력 검증)
- ✅ CSRF 방지
- ✅ Rate Limiting
- ✅ CORS 설정
- ✅ Helmet 보안 헤더

## 🚀 개발 환경

### 포트 설정

```
Frontend:  http://localhost:3000
Backend:   http://localhost:8080
API:       http://localhost:8080/api
Docs:      http://localhost:8080/swagger-ui
```

### 데이터베이스

- **Type**: SQLite (로컬 개발)
- **ORM**: Prisma
- **Migration**: 자동 마이그레이션
- **Seed**: 초기 데이터 구성

## 📋 개발 단계

### 1️⃣ 기반 설정

- [ ] Express + TypeScript + Prisma 백엔드
- [ ] React + TypeScript + Vite 프론트엔드
- [ ] 데이터베이스 스키마 설계
- [ ] 개발 환경 구성

### 2️⃣ 인증 시스템

- [ ] JWT 인증 미들웨어
- [ ] 회원가입/로그인 API
- [ ] 인증 상태 관리
- [ ] 역할별 라우팅

### 3️⃣ 프로필 관리

- [ ] 프로필 CRUD API
- [ ] 이미지 업로드 기능
- [ ] 프로필 UI 컴포넌트

### 4️⃣ 멘토 시스템

- [ ] 멘토 목록 API
- [ ] 검색/정렬 기능
- [ ] 멘토 카드 UI

### 5️⃣ 매칭 시스템

- [ ] 매칭 요청 CRUD API
- [ ] 상태 관리 로직
- [ ] 요청 관리 UI

### 6️⃣ 최적화

- [ ] 테스트 ID 추가
- [ ] 성능 최적화
- [ ] 에러 처리
- [ ] 접근성 개선

## 🎯 품질 기준

### 코드 품질

- ✅ TypeScript strict 모드
- ✅ ESLint + Prettier
- ✅ 100% 타입 커버리지
- ✅ 모듈화된 구조

### 사용자 경험

- ✅ 반응형 디자인
- ✅ 로딩 상태 표시
- ✅ 에러 처리
- ✅ 접근성 (WCAG 2.1)

### 성능

- ✅ 코드 스플리팅
- ✅ 이미지 최적화
- ✅ 번들 크기 최적화
- ✅ 캐싱 전략

---

> 💡 **개발 팁**: 이 가이드를 참조하여 일관성 있는 개발을 진행하세요. 각 단계별로 테스트를 통해 기능을 검증하고, 보안 요구사항을 반드시 준수해야 합니다.

## 💬 채팅 Instruction

### 협업 방식

이 프로젝트에서는 다음과 같은 협업 방식을 따릅니다:

#### 📋 요구사항 분석 우선

- **요구사항을 받으면 먼저 이해한 내용을 정리하여 응답**
- 구현할 기능의 범위와 세부사항 확인
- 기술적 접근 방법과 구현 계획 제시
- 예상되는 이슈나 고려사항 언급

#### 🔒 코드 수정 승인 방식

- **사용자의 명시적 허락 없이는 코드를 수정하지 않음**
- 구현 계획을 설명한 후 승인을 받고 작업 진행
- 수정할 파일과 변경 내용을 미리 안내
- 단계적 구현으로 검토 포인트 제공

#### 💡 소통 예시

**사용자 요청:**

```
"로그인 기능을 구현해줘"
```

**올바른 응답 방식:**

```
## 🔍 요구사항 분석

로그인 기능 구현을 위해 다음과 같이 이해했습니다:

### 구현 범위
- JWT 기반 인증 시스템
- 이메일/비밀번호 로그인
- 토큰 저장 및 관리
- 인증 상태 기반 라우팅

### 구현 계획
1. **백엔드**: Express.js로 로그인 API 구현
2. **프론트엔드**: React 로그인 폼과 상태 관리
3. **미들웨어**: JWT 토큰 검증 로직
4. **라우팅**: 인증 보호된 페이지 구성

### 수정할 파일들
- `backend/src/routes/auth.ts`
- `frontend/src/pages/Login.tsx`
- `frontend/src/services/auth.ts`
- `frontend/src/hooks/useAuth.ts`

이렇게 진행하는 것이 맞나요? 승인해주시면 단계별로 구현하겠습니다.
```

#### 🚫 잘못된 응답 방식

- 바로 코드 파일을 생성하거나 수정하는 것
- 요구사항 확인 없이 구현 시작
- 사용자 의도를 추측해서 작업 진행

### 📝 응답 템플릿

```markdown
## 🔍 요구사항 분석

[이해한 내용 정리]

### 구현 범위

- [기능 1]
- [기능 2]
- [기능 3]

### 구현 계획

1. [단계 1]
2. [단계 2]
3. [단계 3]

### 기술적 고려사항

- [고려사항 1]
- [고려사항 2]

### 수정/생성할 파일들

- [파일 1]: [용도]
- [파일 2]: [용도]

이렇게 진행하는 것이 맞나요? 승인해주시면 구현하겠습니다.
```
