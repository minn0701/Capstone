# ENSM 라우팅 경로 전체 정리

## Caddy 리버스 프록시 라우팅 (포트 55555)

### 1. 정적 파일 라우팅 (우선순위 높음)

#### Auth 서버 정적 파일
- `/auth/static/*` → `localhost:55556` (auth 서버)
- `/auth/favicon.ico` → `localhost:55556` (auth 서버)
- `/auth/manifest.json` → `localhost:55556` (auth 서버)

#### Main 서버 정적 파일
- `/main/static/*` → `localhost:55557` (main 서버)
- `/main/favicon.ico` → `localhost:55557` (main 서버)
- `/main/manifest.json` → `localhost:55557` (main 서버)
- `/main/descriptions/*` → `localhost:55557` (main 서버)

#### 하위 호환성 (루트 경로)
- `/favicon.ico` → `localhost:55556` (auth 서버)
- `/manifest.json` → `localhost:55556` (auth 서버)

### 2. 애플리케이션 라우팅

#### Auth 서버
- `/auth/*` → `localhost:55556` (auth 서버)
  - `/auth/` - 로그인 페이지
  - `/auth/login` - 로그인 API
  - `/auth/change-password` - 비밀번호 변경 페이지/API
  - `/auth/find-account` - 계정 찾기 페이지
  - `/auth/setup` - 초기 설정 페이지/API
  - `/auth/users/**` - 사용자 관리 API

#### Main 서버
- `/main/*` → `localhost:55557` (main 서버)
  - `/main` - 대시보드 (리다이렉트)
  - `/main/` - 대시보드 (리다이렉트)
  - `/main/index.html` - 메인 페이지 HTML
  - `/main/dashboard` - 대시보드
  - `/main/ensm/**` - ENSM 설정 페이지
  - `/main/system/**` - 시스템 관리 페이지
  - `/main/packages/**` - 패키지 관리 페이지
  - `/main/network/**` - 네트워크 관리 페이지
  - `/main/tools/**` - 도구 페이지
  - `/main/api/**` - Main 서버 API 엔드포인트

#### 기타 서비스
- `/grafana/*` → `localhost:3000` (Grafana)
- `/kibana/*` → `localhost:5601` (Kibana)

#### 루트 경로
- `/` → `localhost:55556` (auth 서버) → `/auth/`로 리다이렉트

## Auth 서버 내부 라우팅 (포트 55556)

### Spring Security 설정
- **Public 경로 (인증 불필요):**
  - `/`, `/index.html`
  - `/auth/`, `/auth/index.html`
  - `/auth/static/**`, `/static/**`
  - `/auth/login`
  - `/auth/setup/**`
  - `/auth/change-password`, `/auth/change-password/**`
  - `/auth/find-account`, `/auth/find-account/**`
  - `/favicon.ico`, `/manifest.json`
  - `/auth/favicon.ico`, `/auth/manifest.json`

- **인증 필요 경로:**
  - `/auth/users/**`
  - `/auth/change-password` (POST 요청)

### 컨트롤러 매핑
- `AuthController` (`/auth`)
  - `POST /auth/login` - 로그인
  - `POST /auth/change-password` - 비밀번호 변경

- `AuthPageRoutingController`
  - `GET /` → 302 리다이렉트 `/auth/`
  - `GET /auth/`, `/auth/find-account`, `/auth/change-password`, `/auth/setup` → `index.html` 반환

### React Router (basename="/auth")
- `/auth/` - 로그인 페이지
- `/auth/setup` - 초기 설정 페이지
- `/auth/find-account` - 계정 찾기 페이지
- `/auth/change-password` - 비밀번호 변경 페이지

### 정적 리소스
- `classpath:/static/index.html` - React 빌드된 HTML
- `classpath:/static/static/**` - React 빌드된 JS/CSS (빌드 시 `/auth/static/**`로 경로 생성)

## Main 서버 내부 라우팅 (포트 55557)

### Spring Security 설정
- **Public 경로 (인증 불필요):**
  - `/main/static/**`
  - `/main/favicon.ico`
  - `/main/manifest.json`
  - `/main/descriptions/**`
  - `/main/index.html`
  - `/main`, `/main/dashboard`

- **인증 필요 경로:**
  - `/main/api/system-config/**`
  - `/main/api/**`

### 컨트롤러 매핑
- `MainPageRoutingController`
  - `GET /main`, `/main/`, `/main/index.html`
  - `GET /main/dashboard`
  - `GET /main/ensm/**`, `/main/system/**`, `/main/packages/**`, `/main/network/**`, `/main/tools/**`
  - → 모두 `classpath:/static/main/index.html` 반환

- `DescriptionController` (`/main/descriptions`)
  - `GET /main/descriptions/{filename}` - 설명 파일 제공

- 기타 API 컨트롤러들 (`/main/api/**`)
  - 패키지 관리, 시스템 설정, 네트워크 관리 등

### React Router (basename="/main")
- `/main/dashboard` - 대시보드
- `/main/ensm/**` - ENSM 설정
- `/main/system/**` - 시스템 관리
- `/main/packages/**` - 패키지 관리
- `/main/network/**` - 네트워크 관리
- `/main/tools/**` - 도구

### 정적 리소스
- `classpath:/static/main/index.html` - React 빌드된 HTML
- `classpath:/static/main/static/**` - React 빌드된 JS/CSS (빌드 시 `/main/static/**`로 경로 생성)
- `classpath:/static/main/descriptions/**` - 설명 파일들

## 인증 플로우

### 1. 초기 접속
```
사용자 → http://main.minn.my:5555/
  ↓
Caddy → localhost:55556 (auth 서버)
  ↓
AuthPageRoutingController → 302 리다이렉트 /auth/
  ↓
Caddy → localhost:55556 (auth 서버)
  ↓
AuthPageRoutingController → index.html 반환
  ↓
React Router (basename="/auth") → LoginPage 렌더링
```

### 2. 로그인 성공
```
LoginPage → POST /auth/login
  ↓
AuthController → JWT 토큰 발급 (쿠키 설정)
  ↓
응답: { "redirect": "/main/dashboard" }
  ↓
클라이언트 → window.location.href = "/main/dashboard"
  ↓
Caddy → localhost:55557 (main 서버)
  ↓
MainPageRoutingController → index.html 반환
  ↓
React Router (basename="/main") → Dashboard 렌더링
```

### 3. 인증 실패 (Main 서버 접근 시)
```
사용자 → GET /main/api/packages
  ↓
Caddy → localhost:55557 (main 서버)
  ↓
JwtAuthenticationFilter → 토큰 없음/유효하지 않음
  ↓
SecurityConfig → 302 리다이렉트 /auth?redirect=/main/dashboard
  ↓
Caddy → localhost:55556 (auth 서버)
  ↓
LoginPage 렌더링
```

### 4. Root 계정 초기 설정
```
Root 계정 로그인 → POST /auth/login
  ↓
AuthController → root 계정 감지
  ↓
응답: { "mustChangePassword": true, "redirect": "/auth/change-password?force=true" }
  ↓
클라이언트 → window.location.href = "/auth/change-password?force=true"
  ↓
Caddy → localhost:55556 (auth 서버)
  ↓
AuthPageRoutingController → index.html 반환
  ↓
React Router → ChangePasswordPage 렌더링 (force=true)
  ↓
사용자 입력 → POST /auth/change-password (force=true, newUsername, newPassword)
  ↓
AuthController → replaceRootAccount() 실행
  ↓
응답: { "redirect": "/auth/" }
  ↓
클라이언트 → window.location.href = "/auth/"
  ↓
LoginPage 렌더링 (새 계정으로 로그인)
```

## 정적 리소스 경로

### Auth 서버
- **빌드 시:** `homepage: "/auth"` 설정으로 React가 `/auth/static/**` 경로로 빌드
- **실제 파일 위치:** `classpath:/static/static/**`
- **접근 경로:** `http://main.minn.my:5555/auth/static/js/...`

### Main 서버
- **빌드 시:** `homepage: "/main"` 설정으로 React가 `/main/static/**` 경로로 빌드
- **실제 파일 위치:** `classpath:/static/main/static/**`
- **접근 경로:** `http://main.minn.my:5555/main/static/js/...`

## 주의사항

1. **Caddy 라우팅 순서:** Caddy는 위에서 아래로 매칭하므로, 구체적인 경로(`/auth/static/*`)가 일반적인 경로(`/auth/*`)보다 먼저 와야 합니다.

2. **React Router basename:** 
   - Auth: `basename="/auth"` → 모든 라우트는 `/auth/*`로 시작
   - Main: `basename="/main"` → 모든 라우트는 `/main/*`로 시작

3. **정적 리소스 경로:**
   - React 빌드 시 `homepage` 설정이 정적 리소스 경로에 영향을 줍니다.
   - `homepage: "/auth"` → `/auth/static/**`
   - `homepage: "/main"` → `/main/static/**`

4. **쿠키 경로:**
   - JWT 토큰 쿠키는 `Path=/`로 설정되어 모든 경로에서 사용 가능합니다.

5. **리다이렉트 경로:**
   - 인증 실패 시: `/auth?redirect=/main/dashboard`
   - 로그인 성공 시: `/main/dashboard`
   - Root 계정 초기 설정 후: `/auth/`

