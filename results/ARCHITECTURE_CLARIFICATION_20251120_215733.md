# 아키텍처 구조 명확화 리포트

**생성일시**: 2025-11-20 21:57:33

## 사용자가 설명한 구조

### 올바른 구조
1. **백엔드**: 모든 동작을 `run_script.c` (setuid)를 통해 쉘 스크립트를 인자값과 함께 호출
2. **C wrapper의 역할**: 처음 설치 시 setuid 비트 설정 (chmod 4755)
3. **실제 동작**: `run_script.c`가 setuid로 설정되어 있어서, ensm 사용자가 실행해도 root 권한으로 스크립트 실행

### 예시
```
백엔드 (ensm 사용자)
  ↓
run_script.c (setuid 4755, root 소유)
  ↓ (root 권한으로 실행)
쉘 스크립트 (manage_packages.sh 등)
  ↓
실제 명령어 실행 (dnf install, systemctl enable 등)
```

---

## 현재 코드 분석

### ScriptExecutor.java (대부분의 패키지)
```java
command.add(getRunScriptPath()); // "/usr/local/bin/ensm-scripts/system/run_script"
command.add(getBasePath() + "/" + scriptPath); // 스크립트 경로
// 인자들...
```
✅ **올바른 구조**: `run_script.c`를 통해 스크립트 실행

### BindConfigService / ApacheConfigService
```java
// install_package.c 직접 호출
new ProcessBuilder("/usr/local/bin/ensm-scripts/system/install_package", "bind", "bind-utils")

// enable_service.c 직접 호출
new ProcessBuilder("/usr/local/bin/ensm-scripts/system/enable_service", "named")
```
❌ **일관성 없음**: C wrapper를 직접 호출 (다른 패키지와 다름)

---

## 문제점

### 1. install_package.c와 enable_service.c의 필요성
- 사용자 설명대로라면 **모든 것은 `run_script.c`를 통해 스크립트 실행**
- `manage_packages.sh`의 `install_package()` 함수가 이미 `dnf/yum install` 실행
- `manage_packages.sh`의 `toggle_autostart()` 함수가 이미 `systemctl enable` 실행
- **따라서 `install_package.c`와 `enable_service.c`는 불필요할 수 있음**

### 2. Bind/Apache의 특별한 경우
- 다른 패키지들은 `PackageManagementService` → `manage_packages.sh` 사용
- Bind/Apache는 C wrapper를 직접 호출
- **일관성 부족**

---

## 해결 방안

### 옵션 1: install_package.c와 enable_service.c 제거 (권장)
**이유**:
- 모든 동작은 `run_script.c`를 통해 스크립트 실행
- `manage_packages.sh`가 이미 패키지 설치/서비스 활성화 기능 제공
- Bind/Apache도 `PackageManagementService` 사용하도록 수정

**장점**:
- 구조 일관성
- 코드 단순화
- 유지보수 용이

**단점**:
- Bind/Apache 코드 수정 필요

### 옵션 2: install_package.c와 enable_service.c 유지
**이유**:
- Bind/Apache에서 직접 사용 중
- 스크립트 없이도 직접 호출 가능

**장점**:
- 코드 수정 최소화

**단점**:
- 일관성 부족
- 중복 구현

---

## 결론

**사용자 설명이 정확합니다.**

올바른 구조:
- 모든 동작: `run_script.c` (setuid) → 쉘 스크립트 실행
- C wrapper: 설치 시 setuid 비트 설정만 담당

따라서:
- **`run_script.c`만 필요** (범용 wrapper)
- **`install_package.c`와 `enable_service.c`는 불필요** (스크립트로 처리 가능)
- 또는 Bind/Apache 코드를 수정하여 `PackageManagementService` 사용

---

## 권장 사항

1. **`run_script.c`만 생성** (범용 스크립트 실행 wrapper)
2. **`install_package.c`와 `enable_service.c`는 생성하지 않음**
3. **Bind/Apache 코드 수정**: `PackageManagementService` 사용하도록 변경 (선택사항)

또는:

1. **세 가지 C wrapper 모두 생성** (현재 코드와의 호환성 유지)
2. **Bind/Apache는 현재 방식 유지**
3. **다른 패키지는 `run_script.c` 사용** (현재 상태)

