# 패키지 설치 문제 분석

## 현재 상황
- 설치 버튼 클릭 시 아무 반응 없음
- ensm-main 로그에 아무것도 안 뜸

## 가능한 원인

### 1. API 요청이 Controller에 도달하지 않음
**확인 방법:**
- 브라우저 개발자 도구 Network 탭 확인
- POST `/main/api/packages/{packageId}/install` 요청이 전송되는지
- 요청 상태 코드 (404, 403, 500 등)
- 응답 내용

**가능한 원인:**
- Spring Security에서 차단
- URL 매핑 오류
- CORS 문제

### 2. Controller에 도달하지만 로깅이 안됨
**확인 방법:**
- `journalctl -u ensm-main.service -f`로 실시간 로그 확인
- 설치 버튼 클릭 후 다음 로그가 나타나야 함:
  ```
  패키지 설치 요청 수신 - packageId: {packageId}
  ```

### 3. 예외가 발생했지만 로깅이 안됨
**확인 방법:**
- 위 로그가 없다면 요청이 도달하지 않은 것
- 로그는 있지만 예외가 발생한다면 스택 트레이스 확인

## 추가 확인 사항

### 프론트엔드
- 브라우저 콘솔 에러 확인
- Network 탭에서 실제 요청 확인
- 요청 URL이 올바른지: `/main/api/packages/{packageId}/install`

### 백엔드
- Spring Security 설정 확인
- Controller 로그 추가됨 (재빌드 필요)
- 예외 처리 로직 확인

## 다음 단계

1. **코드 수정 완료** (로깅 추가)
2. **재빌드 및 재배포 필요**
3. **테스트 후 로그 확인**

## 추가된 로깅 위치

### PackageManagementController.java
- `installPackage()` 메서드 시작 부분에 로그
- 예외 발생 시 상세 로그

### PackageManagementService.java
- `installPackage()` 메서드 시작/완료 로그
- 예외 발생 시 상세 로그

### ScriptExecutor.java
- 이미 로깅이 있음 (스크립트 실행 명령어, 결과)

재빌드 후 설치 버튼을 클릭하면 어느 단계에서 문제가 발생하는지 로그로 확인 가능합니다.

