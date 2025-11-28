# ENSM 프로젝트 분석 보고서

## 📋 분석 개요
- 분석 일시: 2025-11-27
- 분석 목적: 임시 기능 제거, 문제점 파악 및 코드 정리
- 분석 범위: 전체 프로젝트 (프론트엔드 + 백엔드)

---

## 1️⃣ 임시/불필요한 기능 (개발 과정에서 필요했으나 현재 불필요)

### ✅ 제거 대상

#### 1.1 Mock 데이터 및 개발용 파일
| 파일 | 위치 | 제거 이유 | 검증 결과 |
|------|------|-----------|-----------|
| `mockData.js` | `ensm-main/src/main/resources/static/main/src/utils/mockData.js` | 개발 초기 모킹용. 실제 백엔드 API 사용 중 | ✅ 제거 가능 - 실제 API 호출로 대체됨 |
| `App.test.js` | `ensm-main/src/main/resources/static/main/src/App.test.js` | 기본 테스트 파일. 실제 테스트 로직 없음 | ✅ 제거 가능 |
| `setupTests.js` | `ensm-main/src/main/resources/static/main/src/setupTests.js` | 테스트 설정 파일. 사용 안 함 | ✅ 제거 가능 |
| `ENSMMockup.jsx` | `ensm-main/src/main/resources/static/main/src/ENSMMockup.jsx` | **주의**: 이 파일은 실제 사용 중인 레이아웃 컴포넌트입니다. 제거하면 안 됩니다! | ⚠️ **제거 금지** - 실제 UI 컴포넌트 |

#### 1.2 PackageManagement.jsx - 불필요한 기능

| 코드 위치 | 기능 | 제거 이유 | 검증 결과 |
|-----------|------|-----------|-----------|
| `getInstallTime()` 함수 (22-39줄) | 패키지 크기에 따른 설치 시간 계산 | 백엔드에서 실제 설치 시간 제공, 웹 전용 개발 시 임시 기능 | ✅ 제거 가능 |
| `getInitialPackages()` 함수 (42-61줄) | localStorage에서 초기 패키지 로드 | 백엔드 API 사용 중 | ✅ 제거 가능 (백엔드 API로 대체) |
| localStorage 패키지 저장 (97-101줄) | 패키지 상태를 localStorage에 저장 | 백엔드에서 상태 관리 중 | ✅ 제거 가능 |
| localStorage 패키지 로드 (78-92줄) | useEffect에서 localStorage 로드 | 백엔드 API 사용 중 | ✅ 제거 가능 |

**주의**: `ENSMMockup.jsx`에서도 localStorage 기반 패키지 로드가 있음 (165-194줄). 이것도 제거 필요.

#### 1.3 Constants.js - 불필요한 상수

| 항목 | 위치 | 제거 이유 |
|------|------|-----------|
| `INSTALL_TIMES` (56-60줄) | `constants.js` | `getInstallTime()`과 함께 제거 가능 |
| `GIT_CONFIG`, `NFS_CONFIG` | `STORAGE_KEYS` | Git/NFS 패키지 제거됨 (이미 제거됨) |

#### 1.4 API.js - 불필요한 export

| 코드 | 위치 | 제거 이유 |
|------|------|-----------|
| `export const mockFetch = apiFetch;` (73줄) | `api.js` | 하위 호환성용 별칭, 불필요 |

---

## 2️⃣ 매칭 안되는 부분

### 2.1 백엔드 컨트롤러 - 제거된 패키지용 컨트롤러 남아있음

| 파일 | 경로 | 문제점 | 조치 필요 |
|------|------|--------|-----------|
| `GitConfigController.java` | `ensm-main/src/main/java/com/ensm/main/packages/` | Git 패키지 제거됐지만 컨트롤러 존재 | ✅ 제거 필요 |
| `NfsConfigController.java` | 동일 | NFS 패키지 제거됐지만 컨트롤러 존재 | ✅ 제거 필요 |
| `NovncConfigController.java` | 동일 | Novnc 패키지 제거됐지만 컨트롤러 존재 | ✅ 제거 필요 |
| `JellyfinConfigController.java` | 동일 | Jellyfin 패키지 제거됐지만 컨트롤러 존재 | ✅ 제거 필요 |

**관련 파일들도 확인 필요:**
- 각 Controller의 Service 클래스
- 각 Controller의 Request/Response DTO 클래스
- 프론트엔드의 각 Config 컴포넌트 (GitConfig.jsx, NfsConfig.jsx 등)

### 2.2 프론트엔드 - 패키지 필터링 로직 문제

| 위치 | 문제점 | 설명 |
|------|--------|------|
| `PackageManagement.jsx:148-149` | 설치된 패키지만 필터링 | 백엔드에서 모든 패키지 목록 반환하는데, 설치된 것만 필터링하면 미설치 패키지 표시 불가 |
| `PackageManagement.jsx:572` | 중복 필터링 | 이미 `loadPackages()`에서 필터링했는데 다시 필터링 |

**올바른 로직:**
- 백엔드에서 모든 패키지 목록 (설치/미설치 포함) 반환
- 프론트엔드에서 모든 패키지를 표시 (installed 상태로 구분)

---

## 3️⃣ 로직 문제 및 이상한 로직

### 3.1 PackageManagement.jsx - 필터링 로직 문제

**문제점:**
```javascript
// 현재 (148-152줄)
const installedPackages = Array.isArray(data) 
    ? data.filter(pkg => pkg.installed === true || pkg.installed === "true")
    : [];
setPackages(installedPackages); // 설치된 것만 저장

// 572줄에서 다시 필터링
{packages.filter(pkg => pkg.installed === true || pkg.installed === "true").map(...)}
```

**문제:**
1. 백엔드에서 모든 패키지 목록 반환
2. 프론트엔드에서 설치된 것만 필터링하여 저장
3. 결과: 미설치 패키지를 표시할 수 없음
4. 572줄에서 중복 필터링 (이미 설치된 것만 있어서 불필요)

**올바른 로직:**
- 백엔드에서 받은 모든 패키지 목록을 그대로 저장
- UI에서 `installed` 상태에 따라 다르게 표시

### 3.2 localStorage와 백엔드 API 혼용

**문제점:**
- `loadPackages()`에서 백엔드 API 호출
- 동시에 localStorage에도 패키지 저장/로드
- 두 데이터 소스가 충돌할 수 있음

**위치:**
- `PackageManagement.jsx:78-101줄` (localStorage 로드/저장)
- `ENSMMockup.jsx:165-194줄` (localStorage 기반 패키지 로드)

**조치:** localStorage 기반 패키지 관리 완전 제거, 백엔드 API만 사용

### 3.3 getInitialPackages() 기본값 문제

**위치:** `PackageManagement.jsx:57-60줄`

```javascript
return [
    { id: 'apache', name: 'Apache HTTP Server', installed: true, ... },
    { id: 'bind', name: 'BIND DNS Server', installed: true, ... }
];
```

**문제:** 하드코딩된 기본값이 실제 설치 상태와 다를 수 있음

**조치:** 기본값 제거, 백엔드 API 호출 실패 시 빈 배열 반환

---

## 4️⃣ 함수 호출 문제 및 미사용 함수

### 4.1 미사용 함수

| 함수 | 위치 | 상태 |
|------|------|------|
| `getInstallTime()` | `PackageManagement.jsx:22-39` | 미사용 - 제거 가능 |
| `getInitialPackages()` | `PackageManagement.jsx:42-61` | 미사용 - localStorage 제거 시 불필요 |
| `mockFetch()` | `mockData.js:5-724` | 미사용 - apiFetch 사용 중 |

### 4.2 중복된 필터링 로직

| 위치 | 문제 |
|------|------|
| `PackageManagement.jsx:148-149` | installed 필터링 |
| `PackageManagement.jsx:572` | 동일한 installed 필터링 |

---

## 5️⃣ 컴포넌트 이름 불일치

### 5.1 확인된 불일치 없음

프로젝트 전반에서 컴포넌트 이름 불일치는 발견되지 않았습니다.

**확인 사항:**
- 백엔드 컨트롤러 경로와 프론트엔드 API 호출 경로 일치 ✅
- 컴포넌트 import/export 이름 일치 ✅
- 라우트 경로와 컴포넌트 매칭 ✅

---

## 6️⃣ 쓰레기 코드 및 중복 코드

### 6.1 중복 필터링

| 위치 | 설명 |
|------|------|
| `PackageManagement.jsx:148-149, 572` | installed 필터링 중복 |

### 6.2 불필요한 타입 변환

| 위치 | 설명 |
|------|------|
| `PackageManagement.jsx:48-50, 84-86` | installed를 boolean/string 변환 - 백엔드에서 이미 boolean 반환 |

**백엔드 확인:** `PackageManagementService.java:32-34`에서 이미 boolean으로 변환함

### 6.3 미사용 코드

| 위치 | 설명 |
|------|------|
| `mockData.js` 전체 | 개발용 모킹 코드, 실제 API 사용 중 |
| `App.test.js` | 기본 테스트 템플릿, 실제 테스트 없음 |

---

## 7️⃣ 추가 발견된 문제점

### 7.1 백엔드 - 제거된 패키지 관련 코드

| 파일 | 문제 |
|------|------|
| `GitConfigService.java` | Git 패키지 체크 로직 존재 (65줄: `rpm -q git`) |
| `NfsConfigService.java` | NFS 패키지 체크 로직 존재 (56줄: `rpm -q nfs-utils`) |
| `JellyfinConfigService.java` | Jellyfin 패키지 체크 로직 존재 |
| `NovncConfigService.java` | Novnc 패키지 체크 로직 존재 |

**조치:** 위 서비스 클래스들도 모두 제거 필요

### 7.2 프론트엔드 - 제거된 패키지 관련 컴포넌트

| 파일 | 상태 |
|------|------|
| `GitConfig.jsx` | App.js에서 이미 import 제거됨 ✅ |
| `NfsConfig.jsx` | App.js에서 이미 import 제거됨 ✅ |
| 실제 파일 존재 여부 확인 필요 | 파일 자체 삭제 필요할 수 있음 |

---

## 8️⃣ 요약 및 우선순위

### 🔴 높은 우선순위 (즉시 조치)

1. **백엔드 컨트롤러 제거**
   - GitConfigController.java + Service + DTO
   - NfsConfigController.java + Service + DTO
   - NovncConfigController.java + Service + DTO
   - JellyfinConfigController.java + Service + DTO

2. **프론트엔드 필터링 로직 수정**
   - `PackageManagement.jsx:148-149` - 모든 패키지 표시하도록 수정
   - `PackageManagement.jsx:572` - 중복 필터링 제거

3. **localStorage 제거**
   - `PackageManagement.jsx:78-101줄` - localStorage 로드/저장 제거
   - `ENSMMockup.jsx:165-194줄` - localStorage 기반 패키지 로드 제거

### 🟡 중간 우선순위

4. **임시 기능 제거**
   - `getInstallTime()` 함수 제거
   - `getInitialPackages()` 함수 제거 (localStorage 제거 시 자동 불필요)
   - `INSTALL_TIMES` 상수 제거

5. **Mock 데이터 제거**
   - `mockData.js` 전체 파일 삭제
   - `mockFetch` export 제거 (`api.js`)

6. **테스트 파일 정리**
   - `App.test.js` 제거
   - `setupTests.js` 제거 (또는 실제 테스트 구현)

### 🟢 낮은 우선순위 (코드 정리)

7. **중복 코드 제거**
   - installed 필터링 중복 제거
   - 불필요한 타입 변환 제거

8. **파일 정리**
   - 제거된 패키지 관련 Config 컴포넌트 파일 삭제
   - 사용하지 않는 유틸리티 함수 정리

---

## 9️⃣ 검증 결과

### ✅ 제거 가능 (영향 없음)

- 모든 임시/불필요 기능
- Mock 데이터
- 테스트 파일
- localStorage 기반 패키지 관리

### ⚠️ 주의 필요

- `ENSMMockup.jsx`는 실제 사용 중인 컴포넌트 - 제거하면 안 됨 (내부 localStorage 로직만 제거)
- 백엔드 컨트롤러 제거 시 관련 Service, DTO도 함께 제거 필요

### ❌ 제거 불가

- 없음

---

## 🔟 결론

프로젝트 전체에서 **임시 기능, 불필요한 코드, 매칭 안되는 부분**을 확인했습니다. 대부분 제거 가능하며, 특히 **localStorage 기반 패키지 관리**를 완전히 제거하고 **백엔드 API만 사용**하도록 정리하는 것이 중요합니다.

**예상 작업 시간:** 약 1-2시간 (체계적으로 진행 시)

---

**보고서 작성 일시:** 2025-11-27
**작성자:** AI Assistant

