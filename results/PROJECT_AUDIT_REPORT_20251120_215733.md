# 프로젝트 전체 점검 리포트

**생성일시**: 2025-11-20 21:57:33

## 🔴 심각한 문제 (즉시 수정 필요)

### 1. C Wrapper 소스 파일 누락
**위치**: `ensm/ensm-scripts/system/`
**문제**: 스펙 파일에서 컴파일하려는 C 소스 파일들이 없음
- ❌ `install_package.c` - 누락
- ❌ `enable_service.c` - 누락  
- ❌ `run_script.c` - 누락

**영향**: 
- 스크립트 실행 시 권한 문제 발생 가능
- RPM 설치 시 컴파일 실패

**해결 방법**: C wrapper 소스 파일 생성 필요

---

### 2. ensm-postinstall.sh 스크립트 누락
**위치**: `ensm/ensm-scripts/system/`
**문제**: 스펙 파일과 systemd 서비스에서 참조하지만 파일이 없음
- ❌ `ensm-postinstall.sh` - 누락

**영향**:
- RPM 설치 후 초기 설정이 실행되지 않음
- ensm-postinstall.service가 실패

**해결 방법**: postinstall 스크립트 생성 필요

---

### 3. 로그 경로 불일치
**위치**: `ensm/ensm-main/src/main/resources/application.properties`
**문제**: 
- 현재: `logging.file.name=${LOG_PATH_MAIN:/var/log/main/main-app.log}`
- 스펙 파일/systemd: `/var/log/ensm/main/main-app.log`

**영향**: 로그 파일이 다른 위치에 생성될 수 있음

**해결 방법**: application.properties 수정 필요

---

## ⚠️ 경고 (수정 권장)

### 4. 불필요한 폴더 구조
**위치**: `ensm/ensm-scripts/ensm/ensm-main/`
**문제**: 중복된 폴더 구조 (프로젝트 소스가 스크립트 폴더에 포함됨)
- `ensm-scripts/ensm/ensm-main/src/main/resources/static/main/`

**영향**: 혼란, 불필요한 파일 포함 가능

**해결 방법**: 해당 폴더 삭제

---

### 5. 스펙 파일 JAR 파일 경로
**위치**: `ensm/ensm-rpm/SPECS/ensm.spec` (68-69줄)
**문제**: 
- 스펙 파일에서 `ensm-auth-0.0.1-SNAPSHOT.jar`, `ensm-main-0.0.1-SNAPSHOT.jar`를 참조
- 빌드 스크립트가 없어서 JAR 파일 생성 방법 불명확

**영향**: RPM 빌드 시 JAR 파일을 수동으로 준비해야 함

**해결 방법**: 빌드 스크립트 재구성 또는 문서화 필요

---

## ✅ 확인 완료 (문제 없음)

### 6. 스크립트 경로 매칭
- ✅ 백엔드 `ScriptExecutor`는 `SystemConfigStore`에서 basePath 가져옴
- ✅ 기본값: `/usr/local/bin/ensm-scripts` (스펙 파일과 일치)
- ✅ `run_script` 경로: `basePath + "/system/run_script"` (올바름)

### 7. 시스템 서비스 파일
- ✅ `ensm-auth.service` - 경로 올바름 (`/opt/ensm/ensm-auth.jar`)
- ✅ `ensm-main.service` - 경로 올바름 (`/opt/ensm/ensm-main.jar`)
- ✅ `ensm.service` - 통합 서비스 올바름
- ✅ `ensm-postinstall.service` - 경로 올바름 (스크립트만 누락)

### 8. UserStore 경로
- ✅ `config/users.yml` 사용 (상대 경로)
- ✅ systemd 서비스에서 `WorkingDirectory=/opt/ensm` 설정
- ✅ 스펙 파일에서 `/opt/ensm/config/users.yml` 생성
- ✅ 경로 일치 확인

### 9. 스크립트 파일 존재 확인
- ✅ `system/manage_packages.sh` - 존재
- ✅ `system/manage_disks.sh` - 존재
- ✅ `system/manage_partitions.sh` - 존재
- ✅ `system/manage_raid.sh` - 존재
- ✅ `system/manage_lvm.sh` - 존재
- ✅ `system/manage_cron.sh` - 존재
- ✅ `system/system_info.sh` - 존재
- ✅ `network/ddns_cloudflare.sh` - 존재
- ✅ `network/network_log.sh` - 존재
- ✅ `network/port_daemon_status.sh` - 존재
- ✅ `tools/ssh_automation.sh` - 존재
- ✅ 패키지 설정 스크립트들 모두 존재

### 10. Caddyfile 생성
- ✅ 스펙 파일 `%post` 섹션에서 자동 생성
- ✅ 경로: `/etc/caddy/Caddyfile`
- ✅ 리버스 프록시 설정 올바름

### 11. 모니터링 스택 설정
- ✅ Prometheus 설정 파일 존재
- ✅ Loki 설정 파일 존재
- ✅ Promtail 설정 파일 존재
- ✅ 바이너리 dependencies 폴더에 존재

---

## 📋 수정 작업 목록

### 즉시 수정 필요
1. [ ] `ensm/ensm-scripts/system/install_package.c` 생성
2. [ ] `ensm/ensm-scripts/system/enable_service.c` 생성
3. [ ] `ensm/ensm-scripts/system/run_script.c` 생성
4. [ ] `ensm/ensm-scripts/system/ensm-postinstall.sh` 생성
5. [ ] `ensm/ensm-main/src/main/resources/application.properties` 로그 경로 수정

### 권장 수정
6. [ ] `ensm/ensm-scripts/ensm/` 폴더 삭제
7. [ ] 빌드 스크립트 재구성 또는 문서화

---

## 📝 참고사항

### 빌드 프로세스
- 현재 Gradle 빌드 설정이 삭제되어 있음
- RPM 빌드 전에 JAR 파일을 수동으로 생성해야 함
- 또는 빌드 스크립트를 재구성해야 함

### 설정 파일 경로
- `ensm-config.yml`: `config/ensm-config.yml` (상대 경로, WorkingDirectory 기준)
- `users.yml`: `config/users.yml` (상대 경로, WorkingDirectory 기준)
- 프로덕션: `/opt/ensm/config/` 디렉토리 사용

