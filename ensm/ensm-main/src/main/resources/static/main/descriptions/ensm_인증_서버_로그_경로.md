# ENSM 인증 서버 로그 경로

## 개요

ENSM 인증 서버(ensm-auth)의 로그 파일이 저장될 경로를 지정하는 설정입니다. 인증 관련 로그가 이 경로에 기록됩니다.

## 설정 방법

로그 파일 경로를 절대 경로로 지정합니다:

```
/var/log/auth/auth-app.log
```

## 주요 특징

- **절대 경로**: 전체 경로를 지정해야 합니다
- **로그 파일**: 인증 서버의 모든 로그가 이 파일에 기록됩니다
- **권한**: 로그 파일 디렉토리에 쓰기 권한이 필요합니다

## 일반적인 사용 예시

```
/var/log/auth/auth-app.log
/var/log/ensm/auth.log
/opt/ensm/logs/auth.log
```

## 주의사항

- **디렉토리 존재**: 로그 파일이 저장될 디렉토리가 존재해야 합니다
- **권한**: ENSM 사용자가 로그 파일을 쓸 수 있어야 합니다
- **로그 로테이션**: 로그 파일이 계속 증가하므로 로그 로테이션 설정 권장

## 권장 설정

일반적으로 `/var/log/ensm/` 디렉토리를 사용하는 것을 권장합니다:

```bash
# 디렉토리 생성
mkdir -p /var/log/ensm
chown ensm:ensm /var/log/ensm
chmod 755 /var/log/ensm
```

