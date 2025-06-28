# 🎯 멘토-멘티 매칭 플랫폼

전문 개발자(멘토)와 개발을 배우는 사람(멘티)을 연결하는 웹 애플리케이션입니다.

## ✨ 주요 기능

### 🔐 인증 시스템

- **회원가입/로그인**: 역할 기반 계정 생성 (멘토/멘티)
- **JWT 인증**: 1시간 토큰 만료, 자동 로그아웃
- **보안**: OWASP Top 10 준수, Rate Limiting, CORS 설정

### 👤 프로필 관리

- **개인정보 수정**: 이름, 자기소개 등록/수정
- **이미지 업로드**: 최대 1MB, JPG/PNG 지원
- **기술 스택 관리**: 멘토 전용 기술 스택 등록 (자동완성 지원)
- **실시간 프로필 이미지**: Base64 및 파일 업로드 모두 지원

### 🔍 멘토 탐색 (멘티 전용)

- **멘토 목록 조회**: 모든 등록된 멘토 확인
- **기술 스택 검색**: 원하는 기술로 멘토 필터링
- **정렬 기능**: 이름순, 기술 스택순 정렬
- **프로필 확인**: 멘토의 자기소개, 기술 스택, 프로필 이미지 확인

### 💌 매칭 요청 시스템

- **요청 생성**: 멘티가 원하는 멘토에게 메시지와 함께 요청
- **중복 방지**: 동일한 멘토에게 중복 요청 불가
- **상태 관리**: PENDING → ACCEPTED/REJECTED 상태 추적
- **요청 관리**:
  - 멘토: 받은 요청 확인, 수락/거절
  - 멘티: 보낸 요청 확인, 취소 가능

### 📋 요청 관리

- **받은 요청 (멘토)**: 멘티의 요청 확인 및 수락/거절
- **보낸 요청 (멘티)**: 내가 보낸 요청 상태 확인
- **1:1 관계**: 멘토당 하나의 활성 멘토링 관계만 유지
- **자동 거절**: 요청 수락 시 다른 pending 요청들 자동 거절

## 🏗️ 기술 스택

### Frontend

- **React 19** + **TypeScript**
- **Vite** (빌드 도구)
- **Material-UI (MUI)** (UI 컴포넌트)
- **React Query** (서버 상태 관리)
- **Zustand** (클라이언트 상태 관리)
- **React Router** (라우팅)
- **React Hook Form + Zod** (폼 관리 및 검증)
- **Axios** (HTTP 클라이언트)

### Backend

- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** + **SQLite** (데이터베이스)
- **JWT** (인증)
- **Multer** (파일 업로드)
- **Helmet, CORS, Rate Limiting** (보안)
- **Swagger UI** (API 문서화)

## 🚀 실행 방법

### 백엔드 실행

```bash
cd mentor-mentee-app/backend
npm install
npm run dev
```

- 서버: http://localhost:8080
- API 문서: http://localhost:8080/swagger-ui

### 프론트엔드 실행

```bash
cd mentor-mentee-app/frontend
npm install
npm run dev
```

- 애플리케이션: http://localhost:3000

## 📱 페이지 구조

### 공통

- `/login` - 로그인
- `/signup` - 회원가입
- `/profile` - 프로필 관리

### 역할별 페이지

- **멘토**: `/requests` (받은 요청 관리)
- **멘티**: `/mentors` (멘토 탐색), `/requests` (보낸 요청 관리)

## 🎨 주요 UI 특징

### 반응형 디자인

- Material-UI 기반 모던한 인터페이스
- 모바일 친화적 반응형 레이아웃

### 사용자 경험

- 실시간 검색 및 필터링
- 로딩 상태 표시
- 에러 처리 및 알림
- 직관적인 네비게이션

### 접근성

- 역할 기반 페이지 접근 제어
- 명확한 사용자 피드백
- 테스트 ID 적용으로 E2E 테스트 지원

## 🛡️ 보안 기능

- **SQL 인젝션 방지**: Prisma ORM 사용
- **XSS 방지**: 입력 검증 및 이스케이핑
- **JWT 토큰 보안**: 1시간 만료, Bearer 토큰
- **Rate Limiting**: 15분당 100요청 제한
- **CORS 설정**: Frontend만 허용
- **Helmet**: 보안 헤더 적용

## 📊 데이터베이스 스키마

### Users 테이블

- 기본 정보: id, email, name, password, role
- 프로필: bio, skills, imageData
- 타임스탬프: createdAt, updatedAt

### MatchRequests 테이블

- 관계: mentorId, menteeId
- 내용: message, status
- 타임스탬프: createdAt, updatedAt

## 🧪 테스트

### API 테스트

- `api-test.html`: 브라우저 기반 API 테스트
- `test-match-request.js`: 매칭 요청 API 테스트
- `comprehensive-test.js`: 종합 기능 테스트

### 데이터 검증

- `final-validation.js`: 최종 데이터 검증
- `check-db.js`: 데이터베이스 상태 확인

## 📚 문서

### 개발 가이드

- `DEVELOPMENT_GUIDE.md`: 종합 개발 가이드
- `PROJECT_TODO.md`: 프로젝트 진행 상황

### 요구사항 문서

- `requirements/`: API 명세, 사용자 스토리, OpenAPI 스펙

## 🎯 향후 개선 계획

- 실시간 알림 시스템
- 멘토링 세션 스케줄링
- 평가 및 리뷰 시스템
- 멘토링 기록 관리
- 이메일 알림 기능

---

> 💡 완전히 구현된 풀스택 멘토-멘티 매칭 플랫폼입니다.
