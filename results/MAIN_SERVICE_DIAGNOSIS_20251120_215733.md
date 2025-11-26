# ensm-main 서비스 시작 문제 진단

**생성일시**: 2025-11-20 21:57:33

## 현재 상황

- ✅ 빌드 성공
- ❌ ensm-main 서비스 시작 실패
- ❌ Loki 서비스 시작 실패

## 확인 사항

### 1. 새로 빌드된 JAR 파일 확인

리눅스에서 다음을 확인하세요:

```bash
# JAR 파일 크기 확인
ls -lh /opt/ensm/ensm-main.jar

# JAR 파일 무결성 확인
unzip -t /opt/ensm/ensm-main.jar | head -20

# 또는
jar tf /opt/ensm/ensm-main.jar | head -20
```

### 2. ensm-main 서비스 로그 확인

```bash
# 최근 로그 확인
journalctl -u ensm-main.service -n 100 --no-pager

# 실시간 로그 모니터링
journalctl -u ensm-main.service -f
```

### 3. 수동 실행 테스트

```bash
# ensm 사용자로 직접 실행
su - ensm
cd /opt/ensm
/opt/ensm/java/jdk/bin/java -jar ensm-main.jar
```

### 4. Loki 서비스 로그 확인

```bash
# Loki 오류 확인
journalctl -u loki.service -n 50 --no-pager

# Loki 바이너리 확인
ls -lh /usr/local/bin/loki
/usr/local/bin/loki --version

# Loki 설정 파일 확인
cat /etc/loki/config.yml
ls -ld /var/lib/loki/
```

### 5. 의존성 확인

```bash
# ensm-main이 ensm-auth에 의존하는지 확인
systemctl status ensm-auth.service

# 포트 확인
netstat -tlnp | grep -E '55556|55557'
```

## 예상 원인

### 1. JAR 파일 문제
- 새로 빌드된 JAR 파일이 제대로 전송되지 않았을 수 있음
- JAR 파일이 여전히 손상되었을 수 있음

### 2. Loki 문제 (간접적 영향)
- Loki가 실패해도 ensm-main은 독립적으로 실행되어야 함
- 하지만 로그 수집 기능이 영향을 받을 수 있음

### 3. 설정 파일 문제
- `/opt/ensm/config/ensm-config.yml` 누락 또는 오류
- `/opt/ensm/config/users.yml` 문제

### 4. 권한 문제
- ensm 사용자 권한 부족
- 로그 디렉토리 권한 문제

## 해결 방법

### 즉시 확인할 명령어

```bash
# 1. 서비스 상태
systemctl status ensm-main.service --no-pager -l

# 2. 최근 로그
journalctl -u ensm-main.service -n 50 --no-pager

# 3. JAR 파일 확인
ls -lh /opt/ensm/*.jar
unzip -t /opt/ensm/ensm-main.jar 2>&1 | head -10

# 4. 수동 실행
cd /opt/ensm
/opt/ensm/java/jdk/bin/java -jar ensm-main.jar 2>&1 | head -50
```

위 명령어들의 출력을 공유해주시면 정확한 원인을 파악할 수 있습니다.

