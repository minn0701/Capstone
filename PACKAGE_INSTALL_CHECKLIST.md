# 패키지 설치 문제 확인 체크리스트

## 발견된 문제

### 1. ❌ 서버에 오래된 스크립트가 설치됨
- 로그에 `nfs-utils`, `git`, `jellyfin`, `novnc`가 여전히 나타남
- 새로 빌드한 RPM 패키지를 설치해야 함

### 2. ⚠️ 설치 요청 로그가 없음
- `journalctl` 로그에 "install" 관련 로그가 전혀 없음
- 설치 버튼이 제대로 작동하지 않거나, 요청이 서버에 도달하지 않을 수 있음

### 3. ⚠️ 파일 권한
- `manage_packages.sh` 권한: `-rwx------` (700)
- `run_script` 권한: 확인 필요

## 확인해야 할 사항

### 1. 새 RPM 패키지 설치 (필수)
```bash
# 현재 설치된 버전 확인
rpm -qi ensm

# 새 RPM 패키지 업그레이드
sudo rpm -Uvh ~/ensm-0.0.1-1.x86_64.rpm

# 또는 재설치
sudo rpm -e ensm
sudo rpm -ivh ~/ensm-0.0.1-1.x86_64.rpm
```

### 2. 설치 스크립트 내용 확인
```bash
# 업그레이드 후 스크립트 내용 확인
sudo cat /usr/local/bin/ensm-scripts/system/manage_packages.sh | grep -A 1 "PACKAGES="

# 6개 패키지만 있어야 함: apache, bind, vsftpd, docker, plex, home-assistant
```

### 3. 브라우저에서 실제 설치 시도
- F12 개발자 도구 열기
- Network 탭에서 패키지 설치 버튼 클릭
- `/main/api/packages/{packageId}/install` 요청 확인
  - Request Headers 확인
  - Request Payload 확인
  - Response 확인 (Status Code, Body)

### 4. 실시간 로그 모니터링
```bash
# 터미널 1: 실시간 로그 확인
sudo journalctl -u ensm-main.service -f

# 터미널 2 (또는 브라우저): 패키지 설치 버튼 클릭
# → 터미널 1에서 로그 확인
```

### 5. 수동 스크립트 실행 테스트
```bash
# 수동으로 설치 스크립트 실행 (root 권한)
sudo /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/manage_packages.sh install apache

# 또는 직접 실행 (root 권한)
sudo /usr/local/bin/ensm-scripts/system/manage_packages.sh install apache
```

## 수정된 코드 확인

### SOURCES 파일 확인
- `ensm/ensm-rpm/SOURCES/ensm-scripts/system/manage_packages.sh`에는 6개 패키지만 있음
- 하지만 서버에 설치된 파일은 여전히 10개 패키지 포함

### 해결 방법
1. **새 RPM 패키지 빌드 후 업그레이드**
2. **서비스 재시작** (필요시)

