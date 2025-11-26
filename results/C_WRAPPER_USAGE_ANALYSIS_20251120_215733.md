# C Wrapper 사용 현황 분석 리포트

**생성일시**: 2025-11-20 21:57:33

## 현재 사용 현황

### install_package.c
**직접 사용하는 곳**:
- ❌ `BindConfigService.java` (205줄) - 직접 호출
- ❌ `ApacheConfigService.java` (194줄) - 직접 호출

**간접 사용하는 곳**:
- ✅ `PackageManagementService.java` (58줄) - `manage_packages.sh install` 사용
  - 이 스크립트는 `run_script.c`를 통해 실행되므로 root 권한으로 실행됨
  - `manage_packages.sh`의 `install_package()` 함수가 내부적으로 `dnf/yum install` 실행

### enable_service.c
**직접 사용하는 곳**:
- ❌ `BindConfigService.java` (229줄) - 직접 호출
- ❌ `ApacheConfigService.java` (218줄) - 직접 호출

**간접 사용하는 곳**:
- ✅ `PackageManagementService.java` (86줄) - `manage_packages.sh autostart` 사용
  - 이 스크립트는 `run_script.c`를 통해 실행되므로 root 권한으로 실행됨
  - `manage_packages.sh`의 `toggle_autostart()` 함수가 내부적으로 `systemctl enable/disable` 실행

### run_script.c
**사용하는 곳** (매우 광범위):
- ✅ `ScriptExecutor.java` - 모든 스크립트 실행
- ✅ 모든 패키지 설정 스크립트 실행기
- ✅ `CronService`, `SshService`, `DdnsController` 등

---

## 문제점 분석

### 1. 중복 구현
- `install_package.c`와 `enable_service.c`는 **Bind와 Apache에서만 직접 사용**
- 다른 패키지들은 `manage_packages.sh`를 통해 간접적으로 같은 기능 사용
- **일관성 부족**: 일부는 C wrapper 직접 사용, 일부는 스크립트 사용

### 2. manage_packages.sh의 install_package() 함수
```bash
install_package() {
    local pkg="$1"
    local rpm_pkg=$(get_rpm_package "$pkg")
    local service=$(get_service_name "$pkg")
    
    # 패키지 설치
    if command -v dnf &> /dev/null; then
        dnf install -y $rpm_pkg 2>&1  # ← root 권한 필요
    elif command -v yum &> /dev/null; then
        yum install -y $rpm_pkg 2>&1  # ← root 권한 필요
    fi
    
    # 서비스 활성화
    if [ -n "$service" ]; then
        systemctl enable "${service}.service" 2>&1  # ← root 권한 필요
        systemctl start "${service}.service" 2>&1
    fi
}
```

이 함수는 `run_script.c`를 통해 실행되므로 root 권한으로 실행됩니다.

### 3. Bind/Apache의 특별한 경우
- Bind와 Apache는 **설정 서비스에서 직접 설치**를 시도
- 다른 패키지들은 **PackageManagementService를 통해 설치**
- 이는 **아키텍처 불일치**

---

## 해결 방안

### 옵션 1: install_package.c와 enable_service.c를 모든 곳에서 사용 (권장)
**장점**:
- 일관된 인터페이스
- 명확한 권한 관리
- 스크립트와 독립적인 실행

**단점**:
- Bind/Apache 외 다른 곳에서도 사용하도록 코드 수정 필요

### 옵션 2: manage_packages.sh만 사용 (현재 대부분의 패키지)
**장점**:
- 이미 대부분의 패키지가 이 방식 사용
- 코드 수정 최소화

**단점**:
- Bind/Apache 코드 수정 필요
- C wrapper 파일이 불필요해짐

### 옵션 3: 하이브리드 (현재 상태 유지)
**장점**:
- 코드 수정 없음

**단점**:
- 일관성 부족
- C wrapper가 일부만 사용됨

---

## 권장 사항

**install_package.c와 enable_service.c를 모든 패키지에서 사용 가능하도록 구현**하는 것이 좋습니다.

이유:
1. **명확한 권한 관리**: setuid wrapper로 명확하게 root 권한 획득
2. **일관성**: 모든 패키지가 동일한 방식으로 설치/활성화
3. **유연성**: 스크립트 없이도 직접 호출 가능
4. **보안**: 경로 제한 등 보안 검증 가능

### 구현 방향
1. `install_package.c`: 
   - 인자로 패키지 이름(들) 받아서 `dnf/yum install -y` 실행
   - 모든 패키지에서 사용 가능

2. `enable_service.c`:
   - 인자로 서비스 이름 받아서 `systemctl enable` 실행
   - 모든 패키지에서 사용 가능

3. `manage_packages.sh`:
   - 내부적으로 `install_package.c`와 `enable_service.c` 사용하도록 수정 가능
   - 또는 현재처럼 `run_script.c`를 통해 root 권한으로 실행 (현재 방식 유지 가능)

---

## 결론

**사용자 지적이 정확합니다.** 
- 현재는 Bind와 Apache에서만 직접 사용
- 하지만 **모든 패키지에서 사용 가능하도록 구현**해야 함
- `manage_packages.sh`는 `run_script.c`를 통해 실행되므로 현재도 작동하지만, 일관성을 위해 C wrapper를 활용하는 것이 좋음

