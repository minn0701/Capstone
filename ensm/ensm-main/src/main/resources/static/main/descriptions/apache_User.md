# 실행 사용자 (User)

## 이 옵션이 하는 일

Apache 웹 서버 프로세스가 실행될 때 사용할 Linux 사용자 계정을 지정합니다. 이 사용자 권한으로 웹 서버가 동작하며, 파일 접근 권한도 이 사용자 기준으로 결정됩니다.

## 기본값

- **Ubuntu/Debian**: `www-data`
- **CentOS/RHEL**: `apache`
- **일부 배포판**: `httpd`, `_www`

## 일반적인 사용자 계정

### www-data (Ubuntu/Debian)
```
www-data
```
→ Ubuntu와 Debian에서 표준 Apache 사용자

### apache (CentOS/RHEL)
```
apache
```
→ CentOS와 RHEL에서 표준 Apache 사용자

### httpd
```
httpd
```
→ 일부 배포판에서 사용

## 알아야 할 것들

### 보안 고려사항

**중요**: Apache는 **root 권한으로 시작**한 후 설정된 사용자로 전환합니다. 이는 1024 이하 포트(80, 443)를 사용하기 위함입니다.

**절대 하지 말아야 할 것**:
- `root` 사용자로 실행 ❌ (보안 위험)
- 일반 사용자 계정 사용 ❌ (권한 문제)

**권장 사항**:
- 전용 웹 서버 사용자 계정 사용 (예: `www-data`, `apache`)
- 최소 권한 원칙 적용

### 파일 권한 설정

웹 서버가 파일을 읽을 수 있도록 적절한 권한이 필요합니다:

```bash
# 웹 루트 디렉토리 소유권 설정
sudo chown -R www-data:www-data /var/www/html

# 읽기 권한 부여
sudo chmod -R 755 /var/www/html
```

### 사용자 확인

현재 Apache가 어떤 사용자로 실행 중인지 확인:

```bash
# 프로세스 확인
ps aux | grep apache

# 또는
ps aux | grep httpd

# 설정 파일에서 확인
grep "^User" /etc/apache2/apache2.conf
```

### 사용자 그룹

`User`와 함께 `Group`도 설정해야 합니다. 일반적으로 같은 이름을 사용합니다:
- `User www-data` → `Group www-data`
- `User apache` → `Group apache`

## 자주 발생하는 오류

### "Permission denied" 오류
**원인**: 
- 웹 서버 사용자가 파일을 읽을 수 없음
- 디렉토리 접근 권한이 없음

**해결 방법**:
```bash
# 소유권 변경
sudo chown -R www-data:www-data /var/www/html

# 권한 설정
sudo chmod -R 755 /var/www/html
```

### Apache가 시작되지 않음
**원인**: 
- 지정한 사용자가 존재하지 않음
- 사용자 이름 오타

**해결 방법**:
1. 사용자 존재 확인: `id www-data`
2. 사용자 생성 (없는 경우): `sudo useradd -r -s /bin/false www-data`
3. 설정 파일의 사용자 이름 확인

### 파일을 쓸 수 없음
**원인**: 웹 서버 사용자에게 쓰기 권한이 없음

**해결 방법**:
```bash
# 특정 디렉토리에만 쓰기 권한 부여
sudo chown www-data:www-data /var/www/html/uploads
sudo chmod 775 /var/www/html/uploads
```

### root로 실행하면 안 되나요?
**절대 안 됩니다!** root로 실행하면:
- 보안 취약점 발생
- 해킹 시 전체 시스템 접근 가능
- 권장되지 않는 방법

**올바른 방법**:
- root로 시작 → 설정된 사용자로 전환 (자동)
- 1024 이하 포트 사용 가능하면서도 안전
