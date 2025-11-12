# ENSM RPM 패키징 가이드

ENSM 프로젝트를 단일 RPM 패키지로 빌드하고 배포하는 방법을 설명합니다.

## 📦 패키지 구조

ENSM은 **단일 RPM 패키지 (`ensm.rpm`)** 하나로 모든 구성 요소를 포함합니다:

- **ensm-auth.jar**: 인증 서버 (포트 55556)
- **ensm-main.jar**: 메인 서버 (포트 55557)
- **ensm-scripts/**: 시스템 관리 스크립트
- **Caddy 설정**: 자동 설치 및 설정
- **Grafana 설정**: 자동 설치 및 설정

## 🔧 사전 요구사항

### 빌드 환경

- **Java 21+**: JDK 설치 필요
- **Gradle**: 프로젝트에 포함된 Gradle Wrapper 사용
- **RPM 빌드 도구**: Linux 환경에서 빌드 시 필요
  - `rpm-build` 패키지

### 런타임 환경 (자동 설치됨)

- **Java 21 Runtime**: `java-21-openjdk` (의존성)
- **systemd**: 서비스 관리용 (의존성)
- **Caddy**: 리버스 프록시 (자동 설치)
- **Grafana**: 모니터링 대시보드 (자동 설치)
- **Rocky Linux 9.6** (또는 호환되는 RHEL 계열)

## 🏗️ 빌드 방법

### Linux에서 빌드 (권장)

```bash
# 빌드 스크립트 실행
chmod +x build-rpm.sh
./build-rpm.sh
```

빌드된 RPM 파일은 `build/distributions/` 디렉토리에 생성됩니다.

### 수동 빌드

```bash
# 1. 서브프로젝트 빌드
cd ensm-auth
./gradlew clean build bootJar
cd ../ensm-main
./gradlew clean build bootJar
cd ..

# 2. 루트 프로젝트에서 RPM 빌드
./gradlew clean buildRpm
```

## 📥 설치 방법

### 신규 설치

```bash
# RPM 패키지 설치 (모든 의존성 자동 설치 및 설정)
sudo rpm -ivh ensm-0.0.1-1.noarch.rpm
```

설치 시 자동으로 수행되는 작업:

1. ✅ `ensm` 사용자 및 그룹 생성
2. ✅ JAR 파일 배치 (`/opt/ensm/`)
3. ✅ 스크립트 배치 (`/usr/local/bin/ensm-scripts/`)
4. ✅ Caddy 설치 및 설정
5. ✅ Grafana 설치 및 설정 (서브패스 구성)
6. ✅ systemd 서비스 등록 및 시작
7. ✅ 디렉토리 및 권한 설정

### 업그레이드

```bash
# 기존 패키지 업그레이드
sudo rpm -Uvh ensm-0.0.1-1.noarch.rpm
```

## 📁 설치된 파일 위치

```
/opt/ensm/
├── ensm-auth.jar          # 인증 서버 JAR
└── ensm-main.jar          # 메인 서버 JAR

/etc/ensm/
├── ensm-config.yml        # 시스템 설정 (설치 후 생성)
└── users.yml              # 사용자 정보 (설치 후 생성)

/etc/caddy/
└── Caddyfile              # Caddy 리버스 프록시 설정

/etc/grafana/
└── grafana.ini            # Grafana 설정 (서브패스 자동 구성)

/usr/local/bin/ensm-scripts/
├── apache/
├── bind/
├── network/
└── ...

/var/log/ensm/
├── auth/
│   └── auth-app.log       # 인증 서버 로그
└── main/
    └── main-app.log       # 메인 서버 로그

/usr/lib/systemd/system/
├── ensm-auth.service      # 인증 서버 systemd 서비스
└── ensm-main.service      # 메인 서버 systemd 서비스
```

## 🔍 설치 후 확인

### 서비스 상태 확인

```bash
# 모든 서비스 상태 확인
systemctl status ensm-auth
systemctl status ensm-main
systemctl status caddy
systemctl status grafana-server
```

### 로그 확인

```bash
# ENSM 서비스 로그
journalctl -u ensm-auth -f
journalctl -u ensm-main -f

# 파일 로그
tail -f /var/log/ensm/auth/auth-app.log
tail -f /var/log/ensm/main/main-app.log

# Caddy 로그
journalctl -u caddy -f

# Grafana 로그
journalctl -u grafana-server -f
```

### 웹 접속 확인

```bash
# Caddy를 통한 접속 (포트 55555)
curl http://localhost:55555

# Grafana 접속
curl http://localhost:55555/grafana
```

브라우저에서 접속:
- **메인 애플리케이션**: `http://your-server:55555`
- **Grafana**: `http://your-server:55555/grafana`

## ⚙️ 서비스 관리

### 서비스 시작/중지/재시작

```bash
# 인증 서버
sudo systemctl start ensm-auth
sudo systemctl stop ensm-auth
sudo systemctl restart ensm-auth

# 메인 서버
sudo systemctl start ensm-main
sudo systemctl stop ensm-main
sudo systemctl restart ensm-main

# Caddy
sudo systemctl restart caddy

# Grafana
sudo systemctl restart grafana-server
```

### 자동 시작 설정

모든 서비스는 설치 시 자동으로 활성화됩니다:

```bash
# 확인
systemctl is-enabled ensm-auth
systemctl is-enabled ensm-main
systemctl is-enabled caddy
systemctl is-enabled grafana-server
```

## 🔧 설정 수정

### ENSM 설정

웹 UI를 통해 설정할 수 있습니다:
- 접속: `http://your-server:55555`
- 경로: `/main/ensm/settings`

또는 직접 파일 수정:
```bash
sudo vi /etc/ensm/ensm-config.yml
sudo systemctl restart ensm-auth
sudo systemctl restart ensm-main
```

### Caddy 설정

```bash
sudo vi /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl restart caddy
```

### Grafana 설정

```bash
sudo vi /etc/grafana/grafana.ini
sudo systemctl restart grafana-server
```

## 🗑️ 제거 방법

### 패키지 제거

```bash
# 서비스 중지 및 제거
sudo rpm -e ensm
```

**주의**: 제거 시 다음 항목은 유지됩니다:
- 설정 파일 (`/etc/ensm/`, `/etc/caddy/`, `/etc/grafana/`)
- 로그 파일 (`/var/log/ensm/`)
- 사용자 및 그룹 (`ensm`)
- Caddy 및 Grafana (별도 제거 필요)

완전히 제거하려면:

```bash
# 사용자 제거
sudo userdel ensm

# 디렉토리 제거
sudo rm -rf /opt/ensm
sudo rm -rf /etc/ensm
sudo rm -rf /var/log/ensm
sudo rm -rf /usr/local/bin/ensm-scripts

# Caddy 제거 (선택사항)
sudo dnf remove caddy

# Grafana 제거 (선택사항)
sudo dnf remove grafana
```

## 🔍 문제 해결

### 서비스가 시작되지 않는 경우

1. **Java 확인**:
   ```bash
   java -version
   # Java 21이 설치되어 있어야 합니다
   ```

2. **포트 확인**:
   ```bash
   sudo netstat -tlnp | grep -E '55555|55556|55557|3000'
   # 포트가 이미 사용 중인지 확인
   ```

3. **로그 확인**:
   ```bash
   sudo journalctl -u ensm-auth -n 50
   sudo journalctl -u ensm-main -n 50
   ```

4. **권한 확인**:
   ```bash
   ls -la /opt/ensm/
   ls -la /etc/ensm/
   ls -la /var/log/ensm/
   # ensm 사용자 소유여야 합니다
   ```

### Caddy/Grafana 설치 실패

자동 설치가 실패한 경우 수동 설치:

**Caddy**:
```bash
# Rocky Linux 9.6
sudo dnf install -y 'dnf-command(copr)'
sudo dnf copr enable -y @caddy/caddy
sudo dnf install -y caddy
```

**Grafana**:
```bash
# Rocky Linux 9.6
cat > /etc/yum.repos.d/grafana.repo <<EOF
[grafana]
name=grafana
baseurl=https://rpm.grafana.com
repo_gpgcheck=1
enabled=1
gpgcheck=1
gpgkey=https://rpm.grafana.com/gpg.key
EOF
sudo dnf install -y grafana
```

### RPM 빌드 실패

1. **Gradle 플러그인 확인**:
   ```bash
   ./gradlew tasks --all | grep rpm
   # buildRpm 태스크가 있는지 확인
   ```

2. **의존성 확인**:
   ```bash
   ./gradlew dependencies
   ```

3. **빌드 로그 확인**:
   ```bash
   ./gradlew buildRpm --info
   ```

## 📝 참고사항

- RPM 패키지는 `noarch` 아키텍처로 빌드됩니다 (Java 애플리케이션이므로)
- Caddy와 Grafana는 설치 시 자동으로 설치되며, 이미 설치되어 있으면 건너뜁니다
- Grafana는 자동으로 서브패스(`/grafana`) 설정이 적용됩니다
- 설정 파일은 설치 후 웹 UI에서 관리할 수 있습니다
- 로그 파일은 자동으로 로테이션되지 않으므로 `logrotate` 설정을 추가하는 것을 권장합니다

## 🔗 관련 문서

- [배포 가이드](./배포_가이드.md)
- [ENSM Scripts README](../ensm-scripts/README.md)
- [Grafana 서브패스 설정](./Grafana_서브패스_설정.md)

