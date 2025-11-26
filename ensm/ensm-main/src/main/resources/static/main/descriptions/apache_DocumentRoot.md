# 웹 문서 루트 경로 (DocumentRoot)

## 이 옵션이 하는 일

웹사이트의 파일들이 저장된 디렉토리 경로를 지정합니다. 클라이언트가 웹사이트에 접속하면 이 디렉토리 안의 파일들이 제공됩니다. 예를 들어, `http://example.com/index.html`에 접속하면 `DocumentRoot/index.html` 파일이 전송됩니다.

## 기본값

- **기본 경로**: `/var/www/html` (대부분의 Linux 배포판)
- **Ubuntu/Debian**: `/var/www/html`
- **CentOS/RHEL**: `/var/www/html`

## 경로 설정 예시

### 표준 경로
```
/var/www/html              → 기본 웹 루트 (권장)
/var/www/example.com       → 특정 도메인용
/home/user/public_html     → 사용자 홈 디렉토리
```

### 개발 환경
```
/var/www/development      → 개발용
/home/developer/www       → 개발자 로컬 경로
/opt/website              → 대체 경로
```

## 알아야 할 것들

### 디렉토리 권한

웹 서버가 파일을 읽을 수 있도록 적절한 권한이 필요합니다:

```bash
# 디렉토리 소유권 설정 (Apache 사용자로)
sudo chown -R www-data:www-data /var/www/html

# 또는
sudo chown -R apache:apache /var/www/html

# 읽기 권한 부여
sudo chmod -R 755 /var/www/html
```

### 보안 고려사항

1. **루트 디렉토리 밖에 두기**: 웹 루트는 시스템 루트(`/`) 밖에 두는 것이 안전합니다
2. **실행 권한 제한**: PHP, Python 등 실행 파일이 있는 경우에만 실행 권한 부여
3. **민감한 파일 제외**: 설정 파일, 비밀번호 파일 등은 웹 루트 밖에 보관

### 가상 호스트별 다른 경로

여러 웹사이트를 운영할 때는 각 사이트마다 다른 DocumentRoot를 설정할 수 있습니다:

```apache
<VirtualHost *:80>
    ServerName example.com
    DocumentRoot /var/www/example
</VirtualHost>

<VirtualHost *:80>
    ServerName another.com
    DocumentRoot /var/www/another
</VirtualHost>
```

## 자주 발생하는 오류

### "403 Forbidden" 오류
**원인**: 
- 디렉토리 권한이 없음
- Apache 사용자가 파일을 읽을 수 없음

**해결 방법**:
```bash
# 소유권 변경
sudo chown -R www-data:www-data /var/www/html

# 권한 설정
sudo chmod -R 755 /var/www/html
```

### "404 Not Found" 오류
**원인**: 
- DocumentRoot 경로가 잘못됨
- 파일이 해당 경로에 없음

**해결 방법**:
1. 경로가 올바른지 확인 (`ls -la /var/www/html`)
2. 파일이 실제로 존재하는지 확인
3. 경로에 오타가 없는지 확인

### "Permission denied" 오류
**원인**: 디렉토리에 접근 권한이 없음

**해결 방법**:
```bash
# 디렉토리 권한 확인
ls -ld /var/www/html

# 권한 부여
sudo chmod 755 /var/www/html
sudo chown www-data:www-data /var/www/html
```

### 경로 변경 후 작동하지 않음
**확인 사항**:
1. 새 경로가 존재하는지 확인
2. Apache 설정을 다시 로드 (`sudo systemctl reload apache2`)
3. 경로에 공백이나 특수문자가 없는지 확인
