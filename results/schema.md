# ENSM 프로젝트 전체 구조 및 구현 가이드

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [프론트엔드 구조](#프론트엔드-구조)
3. [백엔드 구조](#백엔드-구조)
4. [API 엔드포인트 목록](#api-엔드포인트-목록)
5. [스크립트 구조](#스크립트-구조)
6. [인증 및 보안](#인증-및-보안)
7. [설정 관리](#설정-관리)
8. [구현 패턴](#구현-패턴)
9. [주요 기능별 구현 가이드](#주요-기능별-구현-가이드)

---

## 프로젝트 개요

### 목적
ENSM (Enterprise Network System Manager)는 Rocky Linux 9.6 서버 관리를 위한 웹 기반 관리 시스템입니다.

### 기술 스택
- **프론트엔드**: React 19, React Router 7
- **백엔드**: Spring Boot 3.5.0, Java 21
- **서버**: Rocky Linux 9.6
- **웹서버**: Caddy (리버스 프록시)
- **모니터링**: Grafana, Prometheus, Loki
- **인증**: JWT (JSON Web Token)

### 프로젝트 구조
```
ensm/
├── ensm-main/          # 메인 백엔드 애플리케이션
├── ensm-auth/          # 인증 서버 (참고용)
└── ensm-scripts/       # 서버 실행 스크립트들
```

---

## 프론트엔드 구조

### 디렉토리 구조
```
web/
├── src/
│   ├── pages/          # 페이지 컴포넌트
│   │   ├── Dashboard.jsx
│   │   ├── ensm/       # 기본 설정
│   │   ├── packages/   # 패키지 설정 (Apache, Bind, Docker 등)
│   │   ├── system/     # 시스템 관리 (Cron, Disk, RAID, LVM)
│   │   ├── network/    # 네트워크 관리 (DDNS, Port, Log)
│   │   └── tools/      # 도구 (SSH Automation)
│   ├── components/     # 공통 컴포넌트
│   ├── hooks/          # 커스텀 훅
│   ├── utils/          # 유틸리티
│   │   ├── api.js      # API 호출 유틸리티
│   │   ├── mockData.js # Mock API (개발용)
│   │   └── storageHelper.js
│   └── ENSMMockup.jsx  # 메인 레이아웃
```

### API 호출 패턴
- **개발 환경**: `mockData.js`의 `mockFetch` 사용
- **프로덕션 환경**: `api.js`의 `apiFetch` 사용 (실제 백엔드 호출)
- **환경 변수**:
  - `REACT_APP_USE_MOCK_API=true`: Mock API 사용
  - `REACT_APP_API_BASE_URL=/main/api`: API 기본 URL

### 주요 컴포넌트
- **ENSMMockup**: 사이드바, 헤더, 검색 기능 포함 메인 레이아웃
- **Dashboard**: 시스템 모니터링 (CPU, Memory, Disk, Logs)
- **Settings**: 시스템 기본 설정 (다크모드, 사용자 관리)
- **PackageConfig**: 패키지별 설정 페이지 (공통 레이아웃 사용)

---

## 백엔드 구조

### 디렉토리 구조
```
ensm-main/src/main/java/com/ensm/main/
├── EnsmMainApplication.java    # 메인 애플리케이션
├── config/                     # 설정 클래스
│   ├── SecurityConfig.java     # Spring Security 설정
│   ├── SystemConfig.java       # 시스템 설정 모델
│   └── SystemConfigStore.java  # 설정 저장소
├── auth/                       # 인증 관련
│   ├── JwtUtil.java           # JWT 유틸리티
│   └── JwtAuthenticationFilter.java
├── controller/                 # REST API 컨트롤러
│   ├── SystemConfigController.java
│   ├── MainPageRoutingController.java
│   └── DescriptionController.java
├── packages/                   # 패키지 관리
│   ├── ApacheConfigController.java
│   ├── ApacheConfigService.java
│   ├── ApacheScriptExecutor.java
│   ├── BindConfigController.java
│   ├── BindConfigService.java
│   ├── BindScriptExecutor.java
│   ├── PackageManagementController.java
│   └── PackageManagementService.java
├── system/                     # 시스템 관리
│   ├── CronController.java
│   ├── CronService.java
│   ├── SystemInfoController.java
│   └── SystemInfoService.java
├── network/                    # 네트워크 관리
│   ├── DdnsController.java
│   └── DdnsService.java
└── tools/                      # 도구
    ├── SshController.java
    └── SshService.java
```

### 구현 패턴
1. **Controller**: REST API 엔드포인트 정의
2. **Service**: 비즈니스 로직 처리
3. **ScriptExecutor**: 쉘 스크립트 실행 (서버 명령 실행)
4. **Properties**: 설정 값 관리

---

## API 엔드포인트 목록

### 기본 경로
- **메인 API**: `/main/api/*`
- **인증 API**: `/auth/*`

### 시스템 설정
- `GET /main/api/system-config` - 시스템 설정 조회
- `PUT /main/api/system-config` - 시스템 설정 업데이트

### 패키지 관리
- `GET /main/api/packages` - 설치된 패키지 목록
- `GET /main/api/packages/{id}/installed` - 패키지 설치 여부 확인
- `POST /main/api/packages/{id}/install` - 패키지 설치
- `GET /main/api/packages/{id}/status` - 패키지 서비스 상태

### Apache 설정
- `GET /main/api/apache-config/installed` - Apache 설치 여부
- `GET /main/api/apache-config/current` - 현재 Apache 설정 조회
- `POST /main/api/apache-config` - Apache 설정 적용
- `POST /main/api/apache-config/install` - Apache 설치

### BIND 설정
- `GET /main/api/bind-config/installed` - BIND 설치 여부
- `GET /main/api/bind-config/current` - 현재 BIND 설정 조회
- `POST /main/api/bind-config` - BIND 설정 적용
- `POST /main/api/bind-config/install` - BIND 설치

### CRON 관리
- `GET /main/api/cron/{user}` - 사용자별 CRON 작업 목록
- `POST /main/api/cron/{user}` - CRON 작업 추가
- `DELETE /main/api/cron/{user}/{index}` - CRON 작업 삭제

### 디스크 관리
- `GET /main/api/disks/list` - 디스크 목록 조회
- `GET /main/api/disks/available` - 사용 가능한 디스크 목록 (파티션/LVM/RAID 미사용)

### 파티션 관리
- `GET /main/api/partitions/list` - 파티션 목록 조회
- `POST /main/api/partitions/create` - 파티션 생성
- `POST /main/api/partitions/format` - 파티션 포맷
- `POST /main/api/partitions/mount` - 파티션 마운트
- `POST /main/api/partitions/{device}/unmount` - 파티션 언마운트
- `DELETE /main/api/partitions/{device}` - 파티션 삭제

### RAID 관리
- `GET /main/api/raid/list` - RAID 목록 조회
- `POST /main/api/raid/create` - RAID 생성
- `DELETE /main/api/raid/{name}` - RAID 삭제

### LVM 관리
- `GET /main/api/lvm/pv` - 물리 볼륨(PV) 목록
- `POST /main/api/lvm/pv/create` - 물리 볼륨 생성
- `GET /main/api/lvm/vg` - 볼륨 그룹(VG) 목록
- `POST /main/api/lvm/vg/create` - 볼륨 그룹 생성
- `POST /main/api/lvm/vg/expand` - 볼륨 그룹 확장
- `GET /main/api/lvm/lv` - 논리 볼륨(LV) 목록
- `POST /main/api/lvm/lv/create` - 논리 볼륨 생성
- `POST /main/api/lvm/lv/expand` - 논리 볼륨 확장
- `POST /main/api/lvm/lv/shrink` - 논리 볼륨 축소

### 네트워크 관리
- `GET /main/api/network` - 네트워크 인터페이스 목록
- `GET /main/api/network-stats` - 네트워크 통계
- `GET /main/api/network-log` - 네트워크 로그
- `GET /main/api/ports` - 열린 포트 목록
- `GET /main/api/services` - 서비스 상태 목록

### DDNS 관리
- `GET /main/api/ddns` - DDNS 설정 조회
- `PUT /main/api/ddns` - DDNS 설정 업데이트
- `POST /main/api/ddns/test` - DDNS 테스트
- `POST /main/api/ddns/cron/toggle` - DDNS 자동 업데이트 토글

### 사용자 관리
- `GET /auth/users` - 사용자 목록 조회
- `POST /auth/users` - 사용자 추가
- `DELETE /auth/users/{username}` - 사용자 삭제

### 설명 문서
- `GET /main/api/descriptions/{package}/{setting}` - 설정 설명 문서 조회

---

## 스크립트 구조

### 스크립트 위치
- **기본 경로**: `/usr/local/bin/ensm-scripts/`
- **설정 가능**: `SystemConfig.ensmScriptsBasePath`

### 스크립트 실행 패턴
모든 서버 명령은 **setuid wrapper**를 통해 실행됩니다:
```bash
/usr/local/bin/ensm-scripts/system/run_script {스크립트경로} {인자들}
```

### 스크립트 목록

#### Apache 설정
- **경로**: `/usr/local/bin/ensm-scripts/apache/configure_apache.sh`
- **기능**: Apache httpd.conf 파일 수정
- **명령어**:
  - `set_port {포트}` - 포트 설정
  - `set_servername {서버이름}` - 서버 이름 설정
  - `set_docroot {경로}` - DocumentRoot 설정
  - `set_user {사용자}` - User 설정
  - `set_group {그룹}` - Group 설정
  - `get_all` - 모든 설정 조회 (JSON)
  - `apply` - 설정 적용 (서비스 재시작)

#### BIND 설정
- **경로**: `/usr/local/bin/ensm-scripts/bind/configure_bind.sh`
- **기능**: BIND named.conf 파일 수정

#### 시스템 관리
- **경로**: `/usr/local/bin/ensm-scripts/system/`
- **스크립트**:
  - `manage_cron.sh` - CRON 작업 관리
    - `list_jobs {사용자}` - CRON 작업 목록
    - `add_job {사용자} {스케줄} {명령어}` - CRON 작업 추가
    - `delete_job {사용자} {인덱스}` - CRON 작업 삭제
  - `manage_packages.sh` - 패키지 관리
  - `system_info.sh` - 시스템 정보 조회
  - `install_package` - 패키지 설치 (setuid wrapper)
  - `enable_service` - 서비스 활성화 (setuid wrapper)
  - `run_script` - 스크립트 실행 (setuid wrapper)

#### 네트워크 관리
- **경로**: `/usr/local/bin/ensm-scripts/network/`
- **스크립트**:
  - `ddns_cloudflare.sh` - Cloudflare DDNS 업데이트
  - `network_log.sh` - 네트워크 로그 조회
  - `port_daemon_status.sh` - 포트 및 데몬 상태 조회

#### 도구
- **경로**: `/usr/local/bin/ensm-scripts/tools/`
- **스크립트**:
  - `ssh_automation.sh` - SSH 자동화

### setuid wrapper
서버 명령 실행을 위한 setuid 래퍼 프로그램:
- `/usr/local/bin/ensm-scripts/system/run_script` - 스크립트 실행
- `/usr/local/bin/ensm-scripts/system/install_package` - 패키지 설치
- `/usr/local/bin/ensm-scripts/system/enable_service` - 서비스 활성화

---

## 인증 및 보안

### JWT 인증
- **토큰 생성**: `JwtUtil.generateToken()`
- **토큰 검증**: `JwtAuthenticationFilter`
- **보안 설정**: `SecurityConfig`

### Spring Security 설정
- **인증 필터**: JWT 기반 인증
- **인증 경로**: `/auth/**` (인증 서버)
- **API 경로**: `/main/api/**` (메인 서버)

---

## 설정 관리

### SystemConfig
시스템 전역 설정을 관리하는 클래스:
- `systemName`: 시스템 이름
- `darkMode`: 다크모드 설정
- `ensmScriptsBasePath`: 스크립트 기본 경로
- `apacheScriptPath`: Apache 스크립트 경로
- `bindScriptPath`: BIND 스크립트 경로
- `ddnsApiToken`: DDNS API 토큰
- `ddnsZoneName`: DDNS Zone 이름
- `ddnsRecordName`: DDNS 레코드 이름
- `ddnsTtl`: DDNS TTL
- `ddnsSchedule`: DDNS 업데이트 스케줄
- `ddnsConfigFile`: DDNS 설정 파일 경로
- `ddnsLogFile`: DDNS 로그 파일 경로

### SystemConfigStore
설정을 파일에 저장/로드하는 클래스:
- **저장 위치**: `/etc/ensm/system-config.json` (기본값)
- **형식**: JSON

---

## 구현 패턴

### 1. Controller-Service-ScriptExecutor 패턴

#### Controller
```java
@RestController
@RequestMapping("/main/api/{resource}")
@RequiredArgsConstructor
public class ResourceController {
    private final ResourceService service;
    
    @GetMapping
    public ResponseEntity<?> get() {
        return ResponseEntity.ok(service.get());
    }
    
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Request request) {
        return ResponseEntity.ok(service.create(request));
    }
}
```

#### Service
```java
@Service
@RequiredArgsConstructor
public class ResourceService {
    private final ScriptExecutor executor;
    
    public String create(Request request) {
        // 비즈니스 로직
        String result = executor.execute(new String[]{"create", request.getParam()});
        return result;
    }
}
```

#### ScriptExecutor
```java
@Component
@RequiredArgsConstructor
public class ResourceScriptExecutor {
    private final ResourceProperties properties;
    
    public String execute(String[] args) {
        List<String> cmd = new ArrayList<>();
        cmd.add("/usr/local/bin/ensm-scripts/system/run_script");
        cmd.add(properties.getScriptPath());
        cmd.addAll(Arrays.asList(args));
        
        ProcessBuilder pb = new ProcessBuilder(cmd);
        Process process = pb.start();
        // 결과 읽기 및 반환
    }
}
```

### 2. 스크립트 실행 패턴
모든 서버 명령은 `run_script` wrapper를 통해 실행:
```java
List<String> cmd = new ArrayList<>();
cmd.add("/usr/local/bin/ensm-scripts/system/run_script");
cmd.add(scriptPath);
cmd.addAll(Arrays.asList(args));
```

### 3. 설정 파일 관리
- **YAML**: DDNS 설정 등 (SnakeYAML 사용)
- **JSON**: 시스템 설정 (Jackson 사용)
- **텍스트**: Apache, BIND 설정 파일 (직접 수정)

---

## 주요 기능별 구현 가이드

### 1. 패키지 설정 (Apache, BIND 등)

#### 구현 단계
1. **Controller 생성**: REST API 엔드포인트 정의
2. **Service 생성**: 비즈니스 로직 처리
3. **ScriptExecutor 생성**: 스크립트 실행
4. **Properties 생성**: 설정 값 관리
5. **Request DTO 생성**: 요청 데이터 모델

#### 예시: Apache 설정
```java
// Controller
@PostMapping
public ResponseEntity<String> applyConfig(@RequestBody ApacheConfigRequest request) {
    String result = service.applyConfiguration(request);
    return ResponseEntity.ok(result);
}

// Service
public String applyConfiguration(ApacheConfigRequest req) {
    List<String[]> commands = new ArrayList<>();
    if (req.getPort() != null) {
        commands.add(new String[]{"set_port", req.getPort().toString()});
    }
    // ... 다른 설정들
    
    StringBuilder log = new StringBuilder();
    for (String[] cmd : commands) {
        log.append(executor.execute(cmd));
    }
    return log.toString();
}
```

### 2. 시스템 관리 (CRON, 디스크 등)

#### CRON 관리
- **스크립트**: `manage_cron.sh`
- **기능**: CRON 작업 목록, 추가, 삭제
- **구현**: `CronService`에서 스크립트 실행

#### 디스크 관리
- **명령어**: `lsblk`, `fdisk`, `parted`, `mkfs`, `mount`, `umount`
- **구현**: 직접 명령 실행 또는 스크립트 작성

#### RAID 관리
- **명령어**: `mdadm`
- **구현**: 스크립트 작성 후 실행

#### LVM 관리
- **명령어**: `pvcreate`, `vgcreate`, `lvcreate`, `vgextend`, `lvextend`, `lvreduce`
- **구현**: 스크립트 작성 후 실행

### 3. 네트워크 관리

#### DDNS 관리
- **스크립트**: `ddns_cloudflare.sh`
- **설정 파일**: YAML 형식
- **CRON 연동**: 자동 업데이트 스케줄 관리

#### 네트워크 로그
- **명령어**: `journalctl`, `dmesg`
- **구현**: 스크립트로 로그 조회

#### 포트 및 서비스 상태
- **명령어**: `ss`, `netstat`, `systemctl`
- **구현**: 스크립트로 상태 조회

### 4. 사용자 관리
- **API**: `/auth/users`
- **기능**: 사용자 목록, 추가, 삭제
- **구현**: 인증 서버에서 처리 (참고용)

---

## 주의사항

### 1. 보안
- 모든 서버 명령은 **setuid wrapper**를 통해 실행
- 스크립트 경로는 설정 파일에서 관리
- SSH를 통한 원격 실행 시 비밀번호는 설정 파일에 저장 (암호화 권장)

### 2. 에러 처리
- 스크립트 실행 실패 시 적절한 에러 메시지 반환
- 로그 파일에 에러 기록
- 사용자에게 명확한 에러 메시지 제공

### 3. 데이터 동기화
- 디스크, 파티션, LVM, RAID 데이터는 서로 연동되어야 함
- 사용 가능한 디스크 목록은 다른 기능에서 사용 중인 디스크를 제외해야 함

### 4. 설정 파일 백업
- 중요한 설정 파일 수정 전 백업 생성
- 백업 파일은 타임스탬프 포함

### 5. 서비스 재시작
- 설정 변경 후 서비스 재시작 필요 시 명시적으로 처리
- 서비스 재시작 실패 시 롤백 고려

---

## 참고 자료

### 기존 프로젝트 구조
- **ensm-main**: 기존 백엔드 구현 참고
- **ensm-scripts**: 기존 스크립트 참고
- **web**: 새 프론트엔드 (기준)

### 외부 연동
- **Caddy**: 리버스 프록시, Grafana 서브패스 설정
- **Grafana**: 모니터링 대시보드
- **Prometheus**: 메트릭 수집
- **Loki**: 로그 수집

### 서버 환경
- **OS**: Rocky Linux 9.6
- **패키지 관리**: RPM, DNF
- **서비스 관리**: systemd
- **파일 시스템**: ext4, XFS 등

---

## 구현 체크리스트

### 필수 구현 항목
- [ ] 시스템 설정 API
- [ ] 패키지 관리 API (Apache, BIND 등)
- [ ] CRON 관리 API
- [ ] 디스크 관리 API
- [ ] 파티션 관리 API
- [ ] RAID 관리 API
- [ ] LVM 관리 API
- [ ] 네트워크 관리 API
- [ ] DDNS 관리 API
- [ ] 사용자 관리 API
- [ ] 설명 문서 API

### 스크립트 구현
- [ ] Apache 설정 스크립트
- [ ] BIND 설정 스크립트
- [ ] CRON 관리 스크립트
- [ ] 디스크 관리 스크립트
- [ ] 파티션 관리 스크립트
- [ ] RAID 관리 스크립트
- [ ] LVM 관리 스크립트
- [ ] DDNS 스크립트
- [ ] 네트워크 로그 스크립트
- [ ] 포트/서비스 상태 스크립트

### 보안 및 설정
- [ ] JWT 인증 구현
- [ ] Spring Security 설정
- [ ] SystemConfig 구현
- [ ] 설정 파일 저장/로드
- [ ] setuid wrapper 설정

---

**마지막 업데이트**: 2025-01-20
**작성자**: AI Assistant
**버전**: 1.0

