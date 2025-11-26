# ENSM 서비스 시작 문제 진단 가이드

**생성일시**: 2025-11-20 21:57:33

## 프로세스가 시작되지 않는 문제 진단

다음 로그와 정보를 수집해주세요:

---

## 1. 시스템 서비스 상태 확인

```bash
# 모든 ENSM 관련 서비스 상태 확인
systemctl status ensm-auth.service
systemctl status ensm-main.service
systemctl status ensm.service
systemctl status prometheus.service
systemctl status grafana-server.service
systemctl status loki.service
systemctl status promtail.service
systemctl status node_exporter.service

# 서비스 활성화 상태 확인
systemctl is-enabled ensm-auth.service
systemctl is-enabled ensm-main.service
systemctl is-enabled ensm.service

# 실패한 서비스 목록
systemctl --failed
```

---

## 2. 서비스 로그 확인 (journalctl)

```bash
# ensm-auth 서비스 로그 (최근 100줄)
journalctl -u ensm-auth.service -n 100 --no-pager

# ensm-main 서비스 로그 (최근 100줄)
journalctl -u ensm-main.service -n 100 --no-pager

# ensm 서비스 로그 (최근 100줄)
journalctl -u ensm.service -n 100 --no-pager

# 모든 ENSM 관련 서비스 로그
journalctl -u ensm* -n 200 --no-pager

# 실시간 로그 모니터링 (선택사항)
journalctl -u ensm-auth.service -f
```

---

## 3. 애플리케이션 로그 파일

```bash
# ensm-auth 로그
cat /var/log/ensm/auth/auth-app.log
tail -n 100 /var/log/ensm/auth/auth-app.log

# ensm-main 로그
cat /var/log/ensm/main/main-app.log
tail -n 100 /var/log/ensm/main/main-app.log

# 로그 파일이 없으면 디렉토리 확인
ls -la /var/log/ensm/
ls -la /var/log/ensm/auth/
ls -la /var/log/ensm/main/
```

---

## 4. 시스템 로그 확인

```bash
# 시스템 부팅 로그
journalctl -b -n 200 --no-pager

# 최근 시스템 오류
journalctl -p err -n 50 --no-pager

# systemd 관련 오류
journalctl -u systemd -n 50 --no-pager
```

---

## 5. 서비스 파일 확인

```bash
# 서비스 파일 내용 확인
cat /usr/lib/systemd/system/ensm-auth.service
cat /usr/lib/systemd/system/ensm-main.service
cat /usr/lib/systemd/system/ensm.service

# 서비스 파일 권한 확인
ls -la /usr/lib/systemd/system/ensm*.service

# systemd 재로드 여부 확인
systemctl daemon-reload
```

---

## 6. 프로세스 및 포트 확인

```bash
# Java 프로세스 확인
ps aux | grep java
ps aux | grep ensm

# 포트 사용 확인
netstat -tlnp | grep -E '55556|55557|55555|3000|9090|3100|9080|9100'
# 또는
ss -tlnp | grep -E '55556|55557|55555|3000|9090|3100|9080|9100'

# 포트 리스닝 확인
lsof -i :55556
lsof -i :55557
lsof -i :55555
```

---

## 7. 파일 및 디렉토리 확인

```bash
# JAR 파일 확인
ls -lh /opt/ensm/ensm-auth.jar
ls -lh /opt/ensm/ensm-main.jar

# 설정 파일 확인
ls -la /opt/ensm/config/
cat /opt/ensm/config/users.yml
cat /opt/ensm/config/ensm-config.yml

# 스크립트 확인
ls -la /usr/local/bin/ensm-scripts/
ls -la /usr/local/bin/ensm-scripts/system/

# run_script 바이너리 확인
ls -la /usr/local/bin/ensm-scripts/system/run_script
file /usr/local/bin/ensm-scripts/system/run_script
```

---

## 8. 사용자 및 권한 확인

```bash
# ensm 사용자 확인
id ensm
getent passwd ensm

# 로그 디렉토리 권한
ls -ld /var/log/ensm/
ls -ld /var/log/ensm/auth/
ls -ld /var/log/ensm/main/

# 설정 디렉토리 권한
ls -ld /opt/ensm/
ls -ld /opt/ensm/config/
```

---

## 9. 의존성 확인

```bash
# Java 버전 확인
java -version
which java

# Caddy 상태 확인
systemctl status caddy
caddy version

# Grafana 상태 확인
systemctl status grafana-server
```

---

## 10. 수동 실행 테스트

```bash
# ensm 사용자로 전환하여 수동 실행
su - ensm
cd /opt/ensm
java -jar ensm-auth.jar

# 또는 백그라운드로
nohup java -jar /opt/ensm/ensm-auth.jar > /tmp/ensm-auth-test.log 2>&1 &
```

---

## 11. RPM 설치 로그 확인

```bash
# RPM 설치 로그 확인 (최근 설치)
rpm -qa | grep ensm
rpm -qi ensm

# 설치 스크립트 실행 로그 확인
journalctl -u ensm-postinstall.service -n 100 --no-pager
```

---

## 12. 환경 변수 및 설정 확인

```bash
# 시스템 환경 변수
env | grep -E 'JAVA|PATH|HOME'

# ensm 사용자 환경 변수
su - ensm -c 'env | grep -E "JAVA|PATH|HOME"'

# 서비스 환경 변수 확인 (서비스 파일에서)
grep -E 'Environment|ExecStart' /usr/lib/systemd/system/ensm-auth.service
```

---

## 수집된 정보 제공 방법

위의 명령어들을 실행한 후, 다음 정보를 제공해주세요:

1. **서비스 상태 출력** (1번 항목)
2. **journalctl 로그** (2번 항목 - 가장 중요)
3. **애플리케이션 로그** (3번 항목 - 있으면)
4. **서비스 파일 내용** (5번 항목)
5. **프로세스 확인 결과** (6번 항목)
6. **파일 권한 확인** (7번, 8번 항목)
7. **수동 실행 결과** (10번 항목 - 오류 메시지)

---

## 빠른 진단 스크립트

다음 스크립트를 실행하면 주요 정보를 한 번에 수집할 수 있습니다:

```bash
#!/bin/bash
echo "=== ENSM 서비스 진단 정보 ===" > /tmp/ensm-diagnosis.txt
echo "" >> /tmp/ensm-diagnosis.txt

echo "=== 1. 서비스 상태 ===" >> /tmp/ensm-diagnosis.txt
systemctl status ensm-auth.service >> /tmp/ensm-diagnosis.txt 2>&1
systemctl status ensm-main.service >> /tmp/ensm-diagnosis.txt 2>&1
echo "" >> /tmp/ensm-diagnosis.txt

echo "=== 2. 서비스 로그 ===" >> /tmp/ensm-diagnosis.txt
journalctl -u ensm-auth.service -n 50 --no-pager >> /tmp/ensm-diagnosis.txt 2>&1
journalctl -u ensm-main.service -n 50 --no-pager >> /tmp/ensm-diagnosis.txt 2>&1
echo "" >> /tmp/ensm-diagnosis.txt

echo "=== 3. 파일 확인 ===" >> /tmp/ensm-diagnosis.txt
ls -la /opt/ensm/ >> /tmp/ensm-diagnosis.txt 2>&1
ls -la /var/log/ensm/ >> /tmp/ensm-diagnosis.txt 2>&1
echo "" >> /tmp/ensm-diagnosis.txt

echo "=== 4. 프로세스 확인 ===" >> /tmp/ensm-diagnosis.txt
ps aux | grep -E 'ensm|java' >> /tmp/ensm-diagnosis.txt 2>&1
echo "" >> /tmp/ensm-diagnosis.txt

echo "=== 5. 포트 확인 ===" >> /tmp/ensm-diagnosis.txt
netstat -tlnp | grep -E '55556|55557' >> /tmp/ensm-diagnosis.txt 2>&1
echo "" >> /tmp/ensm-diagnosis.txt

cat /tmp/ensm-diagnosis.txt
```

---

## 예상되는 문제들

1. **서비스 파일 오류**: ExecStart 경로나 옵션 오류
2. **권한 문제**: ensm 사용자 권한 부족
3. **의존성 문제**: ensm-main이 ensm-auth를 기다리지 못함
4. **포트 충돌**: 이미 사용 중인 포트
5. **Java 경로 문제**: JAVA_HOME 설정 오류
6. **로그 디렉토리 권한**: 로그 파일 생성 실패
7. **설정 파일 누락**: users.yml 또는 ensm-config.yml 문제

