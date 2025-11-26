# 디렉터리별 설정 허용 (AllowOverride)

## 이 옵션이 하는 일

각 디렉토리에 `.htaccess` 파일을 사용하여 해당 디렉토리만의 설정을 허용할지 결정합니다. `.htaccess` 파일은 Apache의 메인 설정 파일을 수정하지 않고도 특정 디렉토리의 동작을 변경할 수 있게 해줍니다.

## 왜 필요한가요?

- **유연한 설정**: 각 웹사이트마다 다른 설정 적용 가능
- **권한 없이 설정**: 메인 설정 파일 수정 권한 없이도 설정 변경 가능
- **호스팅 환경**: 여러 사용자가 각자의 설정을 관리할 수 있음

## 선택지 설명

### All
- **의미**: 모든 `.htaccess` 지시어 허용
- **효과**: 가장 유연하지만 성능에 약간의 영향
- **사용 시기**: 호스팅 환경, 여러 사용자가 각자 설정 관리

### None
- **의미**: `.htaccess` 파일 완전히 무시
- **효과**: 성능이 가장 좋음 (파일 확인 불필요)
- **사용 시기**: 단일 사이트, 보안이 중요한 환경

### FileInfo
- **의미**: 파일 타입, MIME 타입 관련 설정만 허용
- **효과**: 제한적이지만 안전
- **사용 시기**: 파일 타입 설정만 필요한 경우

### AuthConfig
- **의미**: 인증 관련 설정만 허용
- **효과**: 인증 기능만 사용 가능
- **사용 시기**: 비밀번호 보호가 필요한 디렉토리

### Indexes
- **의미**: 디렉토리 목록 표시 설정만 허용
- **효과**: 목록 표시 제어만 가능
- **사용 시기**: 디렉토리 브라우징 제어만 필요한 경우

### Limit
- **의미**: 접근 제어 설정만 허용
- **효과**: 접근 제한만 설정 가능
- **사용 시기**: 특정 IP나 사용자만 허용하는 경우

### Options
- **의미**: 디렉토리 옵션 설정만 허용
- **효과**: FollowSymLinks, ExecCGI 등 옵션만 설정 가능
- **사용 시기**: 특정 디렉토리 옵션만 변경하는 경우

## 성능 고려사항

### AllowOverride All
- **장점**: 최대 유연성
- **단점**: Apache가 각 요청마다 `.htaccess` 파일을 확인해야 해서 성능 저하 가능

### AllowOverride None
- **장점**: 최고 성능 (파일 확인 불필요)
- **단점**: `.htaccess` 파일 사용 불가

## 알아야 할 것들

### .htaccess 파일 예시

`.htaccess` 파일은 웹 루트나 특정 디렉토리에 배치합니다:

```apache
# .htaccess 파일 예시
RewriteEngine On
RewriteRule ^old-page$ /new-page [R=301,L]

# 비밀번호 보호
AuthType Basic
AuthName "Protected Area"
AuthUserFile /path/to/.htpasswd
Require valid-user
```

### AllowOverride와 Require의 관계

`AllowOverride`는 `.htaccess` 파일 사용을 허용하는 것이고, 실제 접근 제어는 `Require` 지시어로 합니다.

### 보안 고려사항

`AllowOverride All`을 사용하면 사용자가 다양한 설정을 변경할 수 있어 보안 위험이 있을 수 있습니다. 가능하면 필요한 항목만 허용하는 것이 좋습니다.

## 자주 발생하는 오류

### .htaccess 파일이 작동하지 않음
**원인**: 
- `AllowOverride None`으로 설정됨
- `.htaccess` 파일 위치가 잘못됨
- 파일 이름이 정확하지 않음 (`.htaccess` 정확히)

**해결 방법**:
1. `AllowOverride All` 또는 필요한 항목으로 변경
2. `.htaccess` 파일이 올바른 디렉토리에 있는지 확인
3. 파일 이름이 정확한지 확인 (숨김 파일)

### 성능이 느려짐
**원인**: `AllowOverride All` 사용 시 각 요청마다 `.htaccess` 파일 확인

**해결 방법**:
1. 필요한 항목만 허용 (예: `AllowOverride FileInfo AuthConfig`)
2. 가능하면 메인 설정 파일에 직접 설정
3. `AllowOverride None` 사용 (`.htaccess` 불필요한 경우)

### "Invalid command" 오류
**원인**: `.htaccess`에서 허용되지 않은 지시어 사용

**해결 방법**:
- 해당 지시어가 `AllowOverride`에서 허용된 항목에 포함되는지 확인
- 메인 설정 파일에서만 사용 가능한 지시어는 `.htaccess`에서 사용 불가

### 호스팅 환경에서 설정이 안 됨
**확인 사항**:
1. 호스팅 제공자가 `.htaccess` 사용을 허용하는지 확인
2. `AllowOverride` 설정이 서버 관리자 권한이 필요한지 확인
3. 호스팅 패널에서 `.htaccess` 사용 옵션 확인
