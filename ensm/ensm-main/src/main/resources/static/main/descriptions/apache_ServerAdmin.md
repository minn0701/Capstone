# 서버 관리자 이메일 (ServerAdmin)

## 이 옵션이 하는 일

웹 서버 관리자의 이메일 주소를 지정합니다. 이 이메일은 주로 오류 페이지에 표시되어 사용자가 문제가 발생했을 때 연락할 수 있도록 합니다.

## 왜 필요한가요?

- **오류 페이지 표시**: 500 오류 등이 발생했을 때 사용자에게 연락처 제공
- **서버 식별**: 여러 서버를 관리할 때 각 서버의 관리자 정보 기록
- **로그 참조**: 서버 로그에서 관리자 정보 확인 가능

## 설정 예시

### 일반적인 이메일 형식
```
admin@example.com
webmaster@example.com
support@example.com
server@example.com
```

### 개발 환경
```
dev@localhost
admin@test.local
```

## 알아야 할 것들

### 오류 페이지에 표시

Apache가 생성하는 기본 오류 페이지에 이 이메일이 표시됩니다:

```
500 Internal Server Error

The server encountered an internal error and was unable to complete your request.

Please contact the server administrator at admin@example.com
```

### 실제 이메일 발송 아님

이 설정은 이메일을 자동으로 보내지 않습니다. 단지 연락처 정보를 제공할 뿐입니다. 실제 알림을 받으려면 별도의 모니터링 시스템을 설정해야 합니다.

### 가상 호스트별 다른 관리자

여러 웹사이트를 운영할 때는 각 사이트마다 다른 관리자 이메일을 설정할 수 있습니다:

```apache
<VirtualHost *:80>
    ServerName example.com
    ServerAdmin admin@example.com
    DocumentRoot /var/www/example
</VirtualHost>

<VirtualHost *:80>
    ServerName another.com
    ServerAdmin support@another.com
    DocumentRoot /var/www/another
</VirtualHost>
```

## 자주 발생하는 오류

### 이메일 형식 오류
**증상**: 설정은 되지만 유효하지 않은 형식

**올바른 형식**:
- `admin@example.com` ✅
- `user.name@example.com` ✅
- `admin@localhost` ✅ (로컬 개발용)

**잘못된 형식**:
- `admin@` ❌ (도메인 없음)
- `@example.com` ❌ (사용자명 없음)
- `admin example.com` ❌ (공백 포함)

### 이메일이 실제로 작동하지 않음
**참고**: 이 설정은 이메일을 보내지 않습니다. 단지 정보만 제공합니다.

실제 이메일 알림이 필요하다면:
- 로그 모니터링 도구 사용 (예: Logwatch, Fail2ban)
- 별도의 알림 시스템 구축
