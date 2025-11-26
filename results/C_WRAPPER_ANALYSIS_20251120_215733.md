# C Wrapper 파일 기능 분석 리포트

**생성일시**: 2025-11-20 21:57:33

## 분석 결과

### 1. install_package.c

**사용 위치**:
- `BindConfigService.java` (205줄)
- `ApacheConfigService.java` (194줄)

**호출 방식**:
```java
// BindConfigService.java
new ProcessBuilder("/usr/local/bin/ensm-scripts/system/install_package", "bind", "bind-utils")

// ApacheConfigService.java  
new ProcessBuilder("/usr/local/bin/ensm-scripts/system/install_package", "httpd")
```

**기능**:
- **dnf/yum install 명령을 root 권한으로 실행**
- 인자로 패키지 이름을 받아서 `dnf install -y <package>` 또는 `yum install -y <package>` 실행
- setuid 4755로 설정되어 일반 사용자(ensm)가 실행해도 root 권한으로 동작

**필요한 이유**:
- RPM 스펙 파일에서도 sudo/chmod 실행 불가
- ensm 사용자가 패키지를 설치하려면 root 권한 필요
- C wrapper를 setuid로 설정하여 root 권한 획득

---

### 2. enable_service.c

**사용 위치**:
- `BindConfigService.java` (229줄)
- `ApacheConfigService.java` (218줄)

**호출 방식**:
```java
// BindConfigService.java
new ProcessBuilder("/usr/local/bin/ensm-scripts/system/enable_service", "named")

// ApacheConfigService.java
new ProcessBuilder("/usr/local/bin/ensm-scripts/system/enable_service", "httpd")
```

**기능**:
- **systemctl enable 명령을 root 권한으로 실행**
- 인자로 서비스 이름을 받아서 `systemctl enable <service>.service` 실행
- setuid 4755로 설정되어 일반 사용자(ensm)가 실행해도 root 권한으로 동작

**필요한 이유**:
- systemctl enable은 root 권한 필요
- ensm 사용자가 서비스를 활성화하려면 root 권한 필요

---

### 3. run_script.c

**사용 위치** (매우 광범위):
- `ScriptExecutor.java` (56줄) - 모든 스크립트 실행의 기본
- `ApacheScriptExecutor.java` (50, 54줄)
- `BindScriptExecutor.java` (34줄)
- 모든 패키지 설정 스크립트 실행기 (Jellyfin, Plex, Docker, Git, NFS, VSFTPD, HomeAssistant, noVNC)
- `CronService.java` (37줄)
- `SshService.java` (35줄)
- `DdnsController.java` (134줄)

**호출 방식**:
```java
// ScriptExecutor.java
command.add(getRunScriptPath()); // "/usr/local/bin/ensm-scripts/system/run_script"
command.add(getBasePath() + "/" + scriptPath); // 스크립트 전체 경로
// ... 추가 인자들

// 예시
new ProcessBuilder("/usr/local/bin/ensm-scripts/system/run_script", 
                   "/usr/local/bin/ensm-scripts/system/manage_packages.sh", 
                   "list")
```

**기능**:
- **일반 스크립트를 root 권한으로 실행하는 범용 wrapper**
- 첫 번째 인자: 실행할 스크립트의 전체 경로
- 나머지 인자들: 스크립트에 전달할 인자들
- setuid 4755로 설정되어 일반 사용자(ensm)가 실행해도 root 권한으로 동작

**필요한 이유**:
- 모든 스크립트가 root 권한이 필요한 작업 수행 (디스크 관리, RAID, LVM, 패키지 관리 등)
- ensm 사용자가 스크립트를 실행하려면 root 권한 필요
- 하나의 범용 wrapper로 모든 스크립트 실행 통합

---

## 구현 요구사항

### install_package.c
```c
// 인자: 패키지 이름들 (공백으로 구분된 여러 패키지 가능)
// 실행: dnf install -y <packages> 또는 yum install -y <packages>
// 반환: exit code (0: 성공, 그 외: 실패)
```

### enable_service.c
```c
// 인자: 서비스 이름 (예: "named", "httpd")
// 실행: systemctl enable <service>.service
// 반환: exit code (0: 성공, 그 외: 실패)
```

### run_script.c
```c
// 인자: 
//   argv[1]: 실행할 스크립트의 전체 경로
//   argv[2...]: 스크립트에 전달할 인자들
// 실행: execv(script_path, script_args)
// 반환: execv의 반환값 (성공 시 반환 안 함, 실패 시 -1)
```

---

## 보안 고려사항

1. **setuid 4755**: root 소유, setuid 비트 설정
2. **입력 검증**: 인자 검증 필요 (경로 탐색 공격 방지)
3. **경로 제한**: `/usr/local/bin/ensm-scripts/` 하위 스크립트만 실행 가능하도록 제한 권장

---

## 결론

세 가지 C wrapper 모두 **ensm 사용자가 root 권한이 필요한 작업을 수행**하기 위해 필요합니다.

- `install_package`: 패키지 설치 (dnf/yum install)
- `enable_service`: 서비스 활성화 (systemctl enable)
- `run_script`: 범용 스크립트 실행 (모든 스크립트)

RPM 스펙 파일에서 sudo/chmod 실행이 불가능하므로, C wrapper를 setuid로 설정하여 해결한 것으로 보입니다.

