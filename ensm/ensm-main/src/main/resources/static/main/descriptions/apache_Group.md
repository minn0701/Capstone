# 실행 그룹 (Group)

## 이 옵션이 하는 일

Apache 웹 서버 프로세스가 실행될 때 사용할 Linux 그룹을 지정합니다. `User` 설정과 함께 사용되며, 파일 접근 권한을 제어하는 데 사용됩니다.

## 기본값

- **Ubuntu/Debian**: `www-data`
- **CentOS/RHEL**: `apache`
- **일반적으로**: `User`와 동일한 이름 사용

## 일반적인 그룹 계정

### www-data (Ubuntu/Debian)
```
www-data
```
→ Ubuntu와 Debian에서 표준 Apache 그룹

### apache (CentOS/RHEL)
```
apache
```
→ CentOS와 RHEL에서 표준 Apache 그룹

## 알아야 할 것들

### User와 Group의 관계

일반적으로 `User`와 `Group`은 같은 이름을 사용합니다:

```apache
User www-data
Group www-data
```

또는

```apache
User apache
Group apache
```

### 그룹 권한 활용

여러 사용자가 웹 파일을 관리해야 할 때 그룹 권한을 활용할 수 있습니다:

```bash
# 웹 개발자들을 www-data 그룹에 추가
sudo usermod -a -G www-data developer1
sudo usermod -a -G www-data developer2

# 웹 루트를 그룹 쓰기 가능하게 설정
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 775 /var/www/html
```

이렇게 하면 여러 개발자가 파일을 수정할 수 있습니다.

### 그룹 확인

현재 Apache가 어떤 그룹으로 실행 중인지 확인:

```bash
# 프로세스 확인
ps aux | grep apache | head -1

# 그룹 정보 확인
groups www-data

# 설정 파일에서 확인
grep "^Group" /etc/apache2/apache2.conf
```

## 자주 발생하는 오류

### 그룹이 존재하지 않음
**원인**: 지정한 그룹이 시스템에 없음

**해결 방법**:
```bash
# 그룹 생성
sudo groupadd www-data

# 또는
sudo groupadd apache
```

### 파일 접근 권한 문제
**원인**: 그룹 권한이 올바르게 설정되지 않음

**해결 방법**:
```bash
# 그룹 소유권 설정
sudo chgrp -R www-data /var/www/html

# 그룹 읽기/쓰기 권한 부여
sudo chmod -R g+rw /var/www/html
```

### 여러 사용자가 파일을 수정할 수 없음
**해결 방법**:
1. 사용자들을 같은 그룹에 추가
2. 그룹 쓰기 권한 부여
3. SETGID 비트 설정 (선택사항):
   ```bash
   sudo chmod g+s /var/www/html
   ```
