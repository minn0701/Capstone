# 패키지 설치 문제 해결 요약

## 수정 사항

### 1. 로깅 추가 ✅
- `PackageManagementController.java`: 설치 요청 수신/완료 로그 추가
- `PackageManagementService.java`: 서비스 호출/완료 로그 추가
- 예외 발생 시 상세 스택 트레이스 출력

### 2. Spring Security 설정 수정 ✅
- `/main/api/packages/**` 경로를 `permitAll()`로 변경
- 패키지 관리 API는 인증 없이 접근 가능하도록 수정

### 3. `nfs-utils`, `git` 제거 완료 ✅
- `manage_packages.sh`의 패키지 목록에서 제거
- `get_service_name()`, `get_rpm_package()` 함수에서 제거

## 다음 단계

1. **재빌드 및 재배포 필요**
2. **테스트:**
   - 설치 버튼 클릭
   - 브라우저 개발자 도구 Network 탭 확인
   - 서버 로그 확인: `journalctl -u ensm-main.service -f`

## 확인할 로그

설치 버튼 클릭 시 다음 순서로 로그가 나타나야 합니다:
```
패키지 설치 요청 수신 - packageId: {packageId}
패키지 설치 시작: {packageId}
PackageManagementService.installPackage 호출: {packageId}
스크립트 실행: /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/manage_packages.sh install {packageId}
패키지 설치 스크립트 실행 결과: ...
패키지 설치 완료: {packageId}, 결과: ...
```

로그가 하나도 나타나지 않으면:
- API 요청이 전송되지 않았거나
- Spring Security에서 차단된 것일 수 있습니다.

