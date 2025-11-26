# 에러 로그 경로 (ErrorLog)

## 이 옵션이 하는 일

Apache가 발생한 오류와 경고 메시지를 기록할 파일의 경로를 지정합니다. 서버 문제를 진단하고 해결하는 데 필수적인 정보를 제공합니다.

## 기본값

- **기본 경로**: `logs/error_log` (상대 경로)
- **절대 경로 예시**: `/var/log/apache2/error.log` (Ubuntu/Debian)
- **절대 경로 예시**: `/var/log/httpd/error_log` (CentOS/RHEL)

## 경로 설정 예시

### 표준 경로
```
/var/log/apache2/error.log        → Ubuntu/Debian
/var/log/httpd/error_log          → CentOS/RHEL
/var/log/apache/error.log         → 일반적인 경로
```

### 사용자 정의 경로
```
/var/log/webserver/error.log      → 사용자 정의 디렉토리
/home/user/logs/apache_error.log  → 사용자 홈 디렉토리
/opt/apache/logs/error.log        → 대체 경로
```

### 상대 경로
```
logs/error_log                    → Apache 설치 디렉토리 기준
../logs/error.log                 → 상위 디렉토리
error.log                         → 현재 디렉토리
```

## 알아야 할 것들

### 로그 파일 권한

Apache가 로그 파일에 쓸 수 있도록 적절한 권한이 필요합니다:

```bash
# 로그 디렉토리 생성 및 권한 설정
sudo mkdir -p /var/log/apache2
sudo chown www-data:www-data /var/log/apache2
sudo chmod 755 /var/log/apache2

# 로그 파일 권한
sudo touch /var/log/apache2/error.log
sudo chown www-data:www-data /var/log/apache2/error.log
sudo chmod 644 /var/log/apache2/error.log
```

### 로그 파일 크기 관리

로그 파일이 계속 커지면 디스크 공간을 차지하므로 로그 로테이션을 설정해야 합니다:

```bash
# logrotate 설정 예시
/var/log/apache2/error.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 www-data www-data
}
```

### 로그 레벨과의 관계

`ErrorLog`는 `LogLevel` 설정에 따라 기록되는 내용이 달라집니다:
- `LogLevel warn`: 경고 이상만 기록
- `LogLevel debug`: 모든 디버깅 정보 기록

### 여러 가상 호스트

각 가상 호스트마다 다른 에러 로그를 지정할 수 있습니다:

```apache
<VirtualHost *:80>
    ServerName example.com
    ErrorLog /var/log/apache2/example_error.log
</VirtualHost>

<VirtualHost *:80>
    ServerName another.com
    ErrorLog /var/log/apache2/another_error.log
</VirtualHost>
```

## 로그 내용 예시

에러 로그에는 다음과 같은 정보가 기록됩니다:

```
[Mon Jan 15 10:30:45.123456 2024] [error] [client 192.168.1.100] File does not exist: /var/www/html/missing.html
[Mon Jan 15 10:31:12.654321 2024] [warn] [client 192.168.1.101] Invalid method in request: GETT
[Mon Jan 15 10:32:00.987654 2024] [error] [client 192.168.1.102] PHP Fatal error: Call to undefined function
```

## 자주 발생하는 오류

### "Permission denied" 오류
**원인**: 
- 로그 파일이나 디렉토리에 쓰기 권한이 없음
- Apache 사용자가 로그 파일을 생성할 수 없음

**해결 방법**:
```bash
# 소유권 변경
sudo chown www-data:www-data /var/log/apache2/error.log

# 권한 설정
sudo chmod 644 /var/log/apache2/error.log
```

### 로그 파일이 생성되지 않음
**원인**: 
- 디렉토리가 존재하지 않음
- 경로가 잘못됨

**해결 방법**:
1. 디렉토리 생성: `sudo mkdir -p /var/log/apache2`
2. 경로 확인 및 수정
3. 절대 경로 사용 권장

### 로그 파일이 너무 커짐
**원인**: 로그 로테이션이 설정되지 않음

**해결 방법**:
1. logrotate 설정
2. 수동으로 로그 파일 압축 및 보관
3. 오래된 로그 삭제

### 로그에 아무것도 기록되지 않음
**확인 사항**:
1. `LogLevel` 설정 확인 (너무 높게 설정되어 있으면 기록 안 됨)
2. 로그 파일 경로가 올바른지 확인
3. Apache가 실제로 오류를 발생시키지 않았는지 확인
