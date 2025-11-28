# 패키지 설치 디버깅 가이드

## 확인해야 할 사항

### 1. 서버 로그 확인
```bash
# ENSM 메인 서버 로그 확인
journalctl -u ensm-main.service -n 100 --no-pager | grep -E "(패키지|package|install|스크립트)"

# 실시간 로그 확인
journalctl -u ensm-main.service -f
```

### 2. 스크립트 파일 존재 및 권한 확인
```bash
# 스크립트 파일 확인
ls -la /usr/local/bin/ensm-scripts/system/manage_packages.sh
ls -la /usr/local/bin/ensm-scripts/system/run_script

# run_script 권한 확인 (setuid 비트가 있어야 함)
ls -laZ /usr/local/bin/ensm-scripts/system/run_script
```

### 3. 수동으로 스크립트 실행 테스트
```bash
# ENSM 사용자로 스크립트 실행 테스트
sudo -u ensm /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/manage_packages.sh install apache

# 또는 직접 실행 (root 권한)
/usr/local/bin/ensm-scripts/system/manage_packages.sh install apache
```

### 4. 브라우저 콘솔 확인
- F12 개발자 도구 열기
- Console 탭에서 오류 메시지 확인
- Network 탭에서 `/main/api/packages/{packageId}/install` 요청 확인
  - Response 확인
  - Status Code 확인 (500이면 오류)

## 수정된 내용

1. **manage_packages.sh**: `nfs-utils`, `git`, `jellyfin`, `novnc` 제거 완료
2. **Controller**: 스크립트 실행 결과가 "오류:" 또는 "❌"로 시작하면 HTTP 500 반환

## 예상 문제

1. **run_script 권한 문제**: setuid 비트가 없거나 SELinux가 차단
2. **스크립트 파일 누락**: 빌드 시 파일이 제대로 복사되지 않음
3. **패키지 관리자 권한**: dnf/yum이 root 권한 없이 실행됨
