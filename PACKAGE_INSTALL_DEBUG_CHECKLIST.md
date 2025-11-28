# 패키지 설치 문제 디버깅 체크리스트

## 확인 사항

### 1. 프론트엔드 확인
- 브라우저 개발자 도구 콘솔에서 에러 확인
- Network 탭에서 `/main/api/packages/{packageId}/install` POST 요청이 실제로 전송되는지 확인
- 요청 상태 코드 확인 (200, 400, 500 등)
- 응답 내용 확인

### 2. 백엔드 로그 확인
다음 로그가 나타나야 합니다:
```
패키지 설치 요청 수신 - packageId: {packageId}
PackageManagementService.installPackage 호출: {packageId}
스크립트 실행: /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/manage_packages.sh install {packageId}
```

### 3. 가능한 문제점

#### A. API 요청이 도달하지 않는 경우
- Spring Security 필터에서 차단
- CORS 문제
- URL 매핑 오류

#### B. API 요청은 도달하지만 스크립트 실행이 안되는 경우
- run_script 권한 문제
- 스크립트 파일 존재 여부
- 스크립트 실행 권한

#### C. 스크립트 실행은 되지만 실패하는 경우
- root 권한 문제
- dnf/yum 패키지 설치 권한
- 네트워크 문제 (외부 저장소 접근)

## 확인 명령어

### 서버에서 직접 테스트:
```bash
# 1. 스크립트 직접 실행
sudo /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/manage_packages.sh install apache

# 2. run_script 권한 확인
ls -la /usr/local/bin/ensm-scripts/system/run_script

# 3. manage_packages.sh 권한 확인
ls -la /usr/local/bin/ensm-scripts/system/manage_packages.sh

# 4. ensm 사용자로 실행 테스트
sudo -u ensm /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/manage_packages.sh install apache
```

## 추가된 로깅

Controller와 Service에 다음 로그가 추가되었습니다:
- 요청 수신 로그
- 패키지 ID 확인 로그
- 스크립트 실행 시작/완료 로그
- 예외 발생 시 상세 스택 트레이스

이제 설치 버튼을 클릭하면 로그에 어떤 단계에서 문제가 발생하는지 확인할 수 있습니다.

