# 패키지 설치 문제 분석

## 발견된 문제

### 1. ❌ 서버에 오래된 스크립트 설치됨

**증거**:
- 서버 로그에서 `nfs-utils`, `git`, `jellyfin`, `novnc` 패키지가 여전히 나타남
- 하지만 수정한 파일에는 6개 패키지만 있음 (apache, bind, vsftpd, docker, plex, home-assistant)

**원인**:
- 새로 빌드한 RPM 패키지를 서버에 설치하지 않음
- 또는 빌드 시 업데이트된 스크립트가 포함되지 않음

**해결**:
```bash
# 1. 새 RPM 패키지 업그레이드
sudo rpm -Uvh ~/ensm-0.0.1-1.x86_64.rpm

# 2. 스크립트 내용 확인 (6개 패키지만 있어야 함)
sudo cat /usr/local/bin/ensm-scripts/system/manage_packages.sh | grep "PACKAGES="

# 3. 서비스 재시작 (필요시)
sudo systemctl restart ensm-main.service
```

### 2. ❌ 설치 요청 로그가 전혀 없음

**증거**:
- `journalctl` 로그에 "install" 관련 로그가 전혀 없음
- 스크립트 실행 로그만 있고, 설치 시도 로그는 없음

**가능한 원인**:
1. 프론트엔드에서 API 요청이 전송되지 않음
2. 요청이 서버에 도달하지 않음
3. Controller가 요청을 받지 못함
4. 오류가 발생했지만 로그에 기록되지 않음

**확인 방법**:
```bash
# 실시간 로그 모니터링
sudo journalctl -u ensm-main.service -f

# 그 상태에서 브라우저에서 패키지 설치 버튼 클릭
# → 어떤 로그가 나오는지 확인
```

**브라우저 개발자 도구에서 확인**:
- F12 → Network 탭
- 패키지 설치 버튼 클릭
- `/main/api/packages/{packageId}/install` 요청 확인
  - 요청이 전송되었는지 확인
  - Status Code 확인 (200, 500, 404 등)
  - Response Body 확인

### 3. ⚠️ 파일 권한 (정상일 수 있음)

**현재 상태**:
- `manage_packages.sh`: `-rwx------` (700) - 소유자만 접근 가능
- `run_script`는 root 권한으로 실행되므로 문제 없을 수 있음

**확인 필요**:
```bash
# run_script 권한 확인
sudo ls -laZ /usr/local/bin/ensm-scripts/system/run_script
# setuid 비트가 있어야 함: `-rwsr-xr-x`

# 수동 실행 테스트
sudo -u ensm /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/manage_packages.sh list
```

## 즉시 해야 할 일

### 1단계: 새 RPM 패키지 설치
```bash
# 현재 버전 확인
rpm -qi ensm

# 새 버전으로 업그레이드
sudo rpm -Uvh ~/ensm-0.0.1-1.x86_64.rpm

# 스크립트 내용 확인 (213줄)
sudo sed -n '213p' /usr/local/bin/ensm-scripts/system/manage_packages.sh
# → PACKAGES=("apache" "bind" "vsftpd" "docker" "plex" "home-assistant") 가 나와야 함
```

### 2단계: 브라우저에서 설치 시도 + 로그 모니터링
```bash
# 터미널 1: 실시간 로그 모니터링
sudo journalctl -u ensm-main.service -f

# 터미널 2 (또는 브라우저): 패키지 설치 버튼 클릭
# → 터미널 1에서 어떤 로그가 나오는지 확인
```

### 3단계: 수동 설치 테스트
```bash
# 수동으로 설치 스크립트 실행
sudo /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/manage_packages.sh install apache

# 또는 직접 실행
sudo /usr/local/bin/ensm-scripts/system/manage_packages.sh install apache
```

