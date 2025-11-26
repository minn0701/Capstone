# 웹 서버 포트 (Port)

## 이 옵션이 하는 일

Apache 웹 서버가 클라이언트의 요청을 받을 포트 번호를 지정합니다. 포트는 서버의 "문"과 같은 역할을 하며, 클라이언트는 이 포트 번호를 통해 웹 서버에 접속합니다.

## 기본값과 일반적인 설정

- **기본값**: 80
- **HTTP**: 일반적으로 80번 포트 사용
- **HTTPS**: 일반적으로 443번 포트 사용 (SSL/TLS 인증서 필요)

## 포트 번호 선택 가이드

### 1024 이하 포트 (권한 필요)
- **80, 443**: 표준 웹 포트, root 권한 필요
- **장점**: URL에 포트 번호를 입력하지 않아도 접속 가능
- **단점**: 보안상 root 권한으로 실행해야 함

### 1024 이상 포트 (일반 사용자 권한)
- **8080, 8443**: 개발 환경에서 자주 사용
- **장점**: 일반 사용자 권한으로 실행 가능, 보안상 안전
- **단점**: URL에 포트 번호를 명시해야 함 (예: `http://example.com:8080`)

## 예시

```
80        → 표준 HTTP 포트 (http://example.com)
443       → 표준 HTTPS 포트 (https://example.com)
8080      → 개발/테스트용 HTTP 포트 (http://example.com:8080)
8443      → 개발/테스트용 HTTPS 포트 (https://example.com:8443)
3000      → 개발 서버용 포트
9000      → 대체 웹 서버 포트
```

## 알아야 할 것들

### 포트 충돌 확인
다른 프로그램이 이미 사용 중인 포트를 선택하면 Apache가 시작되지 않습니다. 다음 명령어로 확인할 수 있습니다:

```bash
# Linux/Mac
sudo netstat -tulpn | grep :80
# 또는
sudo ss -tulpn | grep :80

# Windows
netstat -ano | findstr :80
```

### 방화벽 설정
포트를 변경한 경우 방화벽에서 해당 포트를 열어야 외부에서 접속할 수 있습니다:

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

### SELinux (CentOS/RHEL)
SELinux가 활성화된 경우 포트 사용 권한을 설정해야 할 수 있습니다:

```bash
sudo semanage port -a -t http_port_t -p tcp 8080
```

## 자주 발생하는 오류

### 오류: "Address already in use"
**원인**: 선택한 포트가 이미 다른 프로그램에서 사용 중입니다.

**해결 방법**:
1. 다른 포트 번호를 선택하거나
2. 해당 포트를 사용하는 프로그램을 종료하세요

### 오류: "Permission denied" (1024 이하 포트)
**원인**: 1024 이하 포트는 root 권한이 필요합니다.

**해결 방법**:
1. Apache를 root 권한으로 실행하거나
2. 1024 이상의 포트를 사용하세요 (보안상 권장)

### 포트는 열었는데 접속이 안 됨
**확인 사항**:
1. 방화벽 규칙이 제대로 적용되었는지 확인
2. Apache가 실제로 해당 포트에서 수신 대기 중인지 확인 (`sudo netstat -tulpn | grep apache`)
3. 서버의 네트워크 보안 그룹(클라우드 환경)에서 포트가 열려있는지 확인
