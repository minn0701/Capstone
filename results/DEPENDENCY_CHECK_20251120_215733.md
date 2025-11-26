# React 빌드 의존성 점검 리포트

**생성일시**: 2025-11-20 21:57:33

## 발견된 문제 및 해결

### 1. ✅ ajv/ajv-keywords 버전 충돌 (해결됨)

**문제**: `ajv-keywords`가 `ajv/dist/compile/codegen`을 찾을 수 없음

**원인**: 
- `react-scripts 5.0.1`은 `ajv 8.x`를 사용
- `ajv-keywords`가 올바른 버전의 `ajv`를 찾지 못함

**해결**:
- `package.json`에 `ajv@^8.12.0` 명시적 추가
- `package.json`에 `ajv-keywords@^5.1.0` 명시적 추가
- `resolutions` 및 `overrides` 추가 (npm 버전 호환성)
- `build.gradle`에서 `ajv`와 `ajv-keywords`를 먼저 설치하도록 수정

---

### 2. ✅ React 19 호환성 확인

**현재 버전**: `react@^19.1.0`, `react-dom@^19.1.0`

**호환성**:
- `react-scripts 5.0.1`은 React 18까지 공식 지원
- React 19는 실험적 지원 (일부 경고 가능)
- `@testing-library/react@^16.3.0`은 React 19 지원

**권장사항**: 현재 버전 유지 (React 19 사용 중)

---

### 3. ✅ react-router-dom 버전 확인

**ensm-main**: `react-router-dom@^7.6.0`
**ensm-auth**: `react-router-dom@^7.6.1`

**호환성**: React 19와 호환됨

**권장사항**: 버전 통일 (선택사항)

---

### 4. ✅ webpack 관련 의존성

**react-scripts 5.0.1** 내부 의존성:
- `webpack@5.x` (내부)
- `terser-webpack-plugin` (내부)
- `schema-utils` (내부)

**문제 가능성**: 
- `ajv` 버전 불일치로 인한 `schema-utils` 오류 가능
- ✅ `ajv` 명시적 설치로 해결

---

### 5. ✅ babel 관련 의존성

**react-scripts 5.0.1** 내부 의존성:
- `@babel/core@7.x` (내부)
- `@babel/preset-react` (내부)

**호환성**: React 19와 호환됨

---

### 6. ✅ 기타 의존성 확인

#### ensm-main
- `framer-motion@^12.11.3` - React 19 호환 ✅
- `lucide-react@^0.510.0` - React 19 호환 ✅
- `react-markdown@^10.1.0` - React 19 호환 ✅
- `react-gauge-chart@^0.5.1` - React 19 호환 확인 필요 ⚠️
- `rehype-highlight@^7.0.2` - 호환 ✅
- `rehype-raw@^7.0.0` - 호환 ✅
- `remark-gfm@^4.0.1` - 호환 ✅

#### ensm-auth
- `http-proxy-middleware@^3.0.5` - 호환 ✅
- `cross-env@^7.0.3` - 호환 ✅

---

## 추가된 수정 사항

### package.json 수정

#### ensm-main/package.json
```json
{
  "dependencies": {
    "ajv": "^8.12.0",
    "ajv-keywords": "^5.1.0",
    ...
  },
  "resolutions": {
    "ajv": "^8.12.0",
    "ajv-keywords": "^5.1.0"
  },
  "overrides": {
    "ajv": "^8.12.0",
    "ajv-keywords": "^5.1.0"
  }
}
```

#### ensm-auth/package.json
```json
{
  "dependencies": {
    "ajv": "^8.12.0",
    "ajv-keywords": "^5.1.0",
    ...
  },
  "resolutions": {
    "ajv": "^8.12.0",
    "ajv-keywords": "^5.1.0"
  },
  "overrides": {
    "ajv": "^8.12.0",
    "ajv-keywords": "^5.1.0"
  }
}
```

### build.gradle 수정

#### ensm-main/build.gradle
- `installAjv` 태스크: `ajv`와 `ajv-keywords`를 먼저 설치
- `installReact` 태스크: `installAjv`에 의존

#### ensm-auth/build.gradle
- `cleanNodeModules` 태스크 추가
- `installAjv` 태스크 추가
- `installReact` 태스크: `installAjv`에 의존

---

## 잠재적 문제 및 모니터링 사항

### 1. react-gauge-chart
- React 19와의 호환성 확인 필요
- 빌드 시 오류 발생 시 버전 다운그레이드 고려

### 2. npm audit 경고
- 빌드 시 `9 vulnerabilities (3 moderate, 6 high)` 경고
- 프로덕션 배포 전 보안 패치 적용 권장

### 3. Node.js 버전
- 현재: Node.js v20.19.5
- `react-scripts 5.0.1`은 Node.js 14+ 지원
- ✅ 호환됨

---

## 권장 빌드 프로세스

1. **의존성 정리**
   ```cmd
   rmdir /s /q node_modules
   del /f /q package-lock.json
   ```

2. **ajv 먼저 설치** (자동화됨)
   ```cmd
   npm install ajv@^8.12.0 ajv-keywords@^5.1.0 --legacy-peer-deps --force
   ```

3. **나머지 의존성 설치** (자동화됨)
   ```cmd
   npm install --legacy-peer-deps --force
   ```

4. **빌드 실행**
   ```cmd
   npm run build
   ```

---

## 테스트 체크리스트

빌드 후 다음을 확인하세요:

- [ ] React 빌드 성공 (오류 없음)
- [ ] JAR 파일 크기 정상 (ensm-main: ~80-100MB)
- [ ] JAR 파일 무결성 확인 (`unzip -t`)
- [ ] 리눅스에서 서비스 정상 시작
- [ ] 웹 UI 정상 작동

---

## 참고사항

- `resolutions`는 Yarn에서 사용
- `overrides`는 npm 8.3+에서 사용
- `--legacy-peer-deps`는 peer dependency 충돌 무시
- `--force`는 의존성 충돌 강제 해결

