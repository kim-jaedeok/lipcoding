# 📋 멘토-멘티 매칭 앱 프로젝트 TODO 리스트

> 전체 프로젝트 구현 진행상황을 추적하기 위한 체크리스트입니다.

## 📊 전체 진행률

- [x] **1단계**: 프로젝트 설정 (8/8) ✅
- [x] **2단계**: 백엔드 개발 (25/25) ✅
- [x] **3단계**: 프론트엔드 개발 (22/22) ✅
- [x] **4단계**: 통합 및 테스트 (12/12) ✅
- [ ] **5단계**: 배포 준비 (0/8)

**총 진행률: 67/75 (89%)**

---

## 🚀 1단계: 프로젝트 설정

### 📁 프로젝트 구조 생성

- [x] 루트 폴더 `mentor-mentee-app` 생성
- [x] `backend` 폴더 구조 생성
- [x] `frontend` 폴더 구조 생성
- [x] 루트 `README.md` 작성

### ⚙️ 백엔드 초기 설정

- [x] Node.js + TypeScript 프로젝트 초기화
- [x] 필수 패키지 설치 (Express, Prisma, JWT 등)
- [x] TypeScript 설정 (`tsconfig.json`)
- [x] 개발 환경 스크립트 설정

### 🎨 프론트엔드 초기 설정

- [x] React + TypeScript + Vite 프로젝트 초기화
- [x] 필수 패키지 설치 (React Query, Zustand, MUI 등)
- [x] Vite 설정 (`vite.config.ts`)
- [x] 개발 환경 스크립트 설정

---

## 🖥️ 2단계: 백엔드 개발

### 🗄️ 데이터베이스 설계

- [x] Prisma 스키마 파일 생성 (`schema.prisma`)
- [x] User 모델 정의 (id, email, password, name, role)
- [x] Profile 모델 정의 (name, bio, imageUrl, skills)
- [x] MatchRequest 모델 정의 (mentorId, menteeId, message, status)
- [x] 관계 설정 (User-Profile, User-MatchRequest)
- [x] 데이터베이스 마이그레이션 실행

### 🔐 인증 시스템

- [x] JWT 유틸리티 함수 구현
- [x] 비밀번호 해싱 유틸리티 구현
- [x] 인증 미들웨어 구현
- [ ] 역할 기반 권한 미들웨어 구현

### 🛣️ API 라우터 및 컨트롤러

#### 인증 엔드포인트

- [x] `POST /api/signup` - 회원가입 구현
- [x] `POST /api/login` - 로그인 구현

#### 사용자 프로필 엔드포인트

- [x] `GET /api/me` - 내 정보 조회 구현
- [x] `PUT /api/profile` - 프로필 수정 구현
- [x] `GET /api/images/:role/:id` - 프로필 이미지 조회 구현

#### 멘토 목록 엔드포인트

- [x] `GET /api/mentors` - 멘토 목록 조회 구현
- [x] 기술 스택 검색 기능 구현
- [x] 이름/기술 스택 정렬 기능 구현

#### 매칭 요청 엔드포인트

- [x] `POST /api/match-requests` - 매칭 요청 생성 구현
- [x] `GET /api/match-requests/incoming` - 받은 요청 목록 구현
- [x] `GET /api/match-requests/outgoing` - 보낸 요청 목록 구현
- [x] `PUT /api/match-requests/:id/accept` - 요청 수락 구현
- [x] `PUT /api/match-requests/:id/reject` - 요청 거절 구현
- [x] `DELETE /api/match-requests/:id` - 요청 취소 구현

### 📁 파일 업로드

- [x] Multer 미들웨어 설정
- [x] 이미지 파일 검증 (크기, 형식)
- [x] Base64 이미지 처리 로직
- [x] 프로필 이미지 저장/조회 구현

### 📚 API 문서화

- [x] Swagger UI 설정
- [ ] OpenAPI 스펙 자동 생성 설정
- [x] `http://localhost:8080/swagger-ui` 접근 설정
- [x] `http://localhost:8080/openapi.json` 접근 설정
- [x] 루트 경로 Swagger UI 리디렉션

### 🛡️ 보안 설정

- [x] Helmet 보안 헤더 설정
- [x] CORS 설정
- [x] Rate Limiting 설정
- [x] 입력 데이터 검증 (Zod)
- [x] SQL 인젝션 방지 확인

---

## 🎨 3단계: 프론트엔드 개발

### 🏗️ 기본 구조 설정

- [x] 라우팅 설정 (React Router)
- [x] 전역 상태 관리 설정 (Zustand)
- [x] API 클라이언트 설정 (React Query + Axios)
- [x] 타입 정의 파일 생성
- [x] 상수 정의 파일 생성

### 🎨 UI 컴포넌트 라이브러리

- [x] Material-UI 또는 Ant Design 설정
- [x] Tailwind CSS 설정
- [x] 전역 스타일 설정
- [x] 테마 설정 (다크/라이트 모드)

### 📄 페이지 컴포넌트

#### 인증 페이지

- [x] 회원가입 페이지 (`/signup`) 구현
  - [x] 이메일 입력 필드 (`id="email"`)
  - [x] 비밀번호 입력 필드 (`id="password"`)
  - [x] 역할 선택 필드 (`id="role"`)
  - [x] 가입 버튼 (`id="signup"`)
- [x] 로그인 페이지 (`/login`) 구현
  - [x] 이메일 입력 필드 (`id="email"`)
  - [x] 비밀번호 입력 필드 (`id="password"`)
  - [x] 로그인 버튼 (`id="login"`)

#### 프로필 페이지

- [x] 프로필 관리 페이지 (`/profile`) 구현
  - [x] 이름 입력 필드 (`id="name"`)
  - [x] 소개 입력 필드 (`id="bio"`)
  - [x] 기술 스택 입력 필드 (`id="skillsets"`) - 멘토만
  - [x] 프로필 사진 표시 (`id="profile-photo"`)
  - [x] 파일 입력 필드 (`id="profile"`)
  - [x] 저장 버튼 (`id="save"`)

#### 멘토 목록 페이지 (멘티 전용)

- [x] 멘토 목록 페이지 (`/mentors`) 구현
  - [x] 멘토 카드 컴포넌트 (`class="mentor"`)
  - [x] 검색 입력 필드 (`id="search"`)
  - [x] 이름 정렬 옵션 (`id="name"`)
  - [x] 기술 스택 정렬 옵션 (`id="skill"`)

#### 요청 관리 페이지

- [x] 요청 관리 페이지 (`/requests`) 구현
  - [x] 매칭 요청 메시지 입력 (`id="message"`, `data-mentor-id`, `data-testid`)
  - [x] 요청 상태 표시 (`id="request-status"`)
  - [x] 요청 버튼 (`id="request"`)
  - [x] 수락 버튼 (`id="accept"`) - 멘토만
  - [x] 거절 버튼 (`id="reject"`) - 멘토만
  - [x] 요청 메시지 표시 (`class="request-message"`, `mentee` 속성)

### 🔗 네비게이션 및 라우팅

- [x] 역할별 네비게이션 바 구현
- [x] 인증 상태 기반 라우팅 구현
- [x] 홈 페이지 (`/`) 리디렉션 로직 구현
- [x] 보호된 라우트 구현

### 📱 반응형 디자인

- [x] 모바일 화면 대응
- [x] 태블릿 화면 대응
- [x] 데스크톱 화면 대응

---

## 🔧 4단계: 통합 및 테스트

### 🔗 API 통합

- [x] 회원가입/로그인 API 연동
- [x] 프로필 관리 API 연동
- [x] 멘토 목록 API 연동
- [x] 매칭 요청 API 연동
- [x] 이미지 업로드 API 연동

### 🛡️ 인증 흐름 테스트

- [x] JWT 토큰 저장/관리 테스트
- [x] 토큰 만료 처리 테스트
- [x] 역할별 권한 검증 테스트

### 🧪 기능 테스트

- [x] 회원가입 흐름 테스트
- [x] 로그인 흐름 테스트
- [x] 프로필 등록/수정 테스트
- [x] 멘토 검색/정렬 테스트
- [x] 매칭 요청 생성/관리 테스트
- [x] 이미지 업로드 테스트

### 🔒 보안 검증

- [ ] OWASP Top 10 취약점 검사
- [ ] XSS 방지 테스트
- [ ] SQL 인젝션 방지 테스트

---

## 🚀 5단계: 배포 준비

### 📝 문서화

- [ ] API 문서 완성도 검토
- [ ] 사용자 가이드 작성
- [ ] 개발 환경 설정 가이드 작성
- [ ] 배포 가이드 작성

### ⚡ 성능 최적화

- [ ] 번들 크기 최적화
- [ ] 이미지 최적화
- [ ] 코드 스플리팅 적용
- [ ] 캐싱 전략 구현

### 🌐 접근성 및 사용성

- [ ] WCAG 2.1 접근성 기준 준수
- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 호환성 테스트
- [ ] 사용자 경험 최종 검토

---

## 📝 추가 고려사항

### 🔄 실시간 기능 (선택사항)

- [ ] WebSocket 연결 설정
- [ ] 실시간 매칭 요청 알림
- [ ] 실시간 상태 업데이트

### 📊 모니터링 (선택사항)

- [ ] 로깅 시스템 구현
- [ ] 에러 추적 시스템 구현
- [ ] 성능 모니터링 구현

---

## 📋 체크리스트 사용법

1. **작업 시작 전**: 해당 항목을 체크하여 진행 상황 표시
2. **완료 후**: `- [x]`로 체크박스를 채워 완료 표시
3. **진행률 업데이트**: 각 단계별 완료 개수를 업데이트
4. **정기 리뷰**: 전체 진행률을 정기적으로 검토

> 💡 **팁**: 각 항목을 완료할 때마다 관련 커밋을 남겨 추적 가능하도록 하세요.
