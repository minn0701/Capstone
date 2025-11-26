%define _sourcedir /home/minn0701/ensm-rpm/SOURCES
%define name ensm
%define version 0.0.1
%define release 1
%define buildroot %{_topdir}/BUILDROOT

Summary: ENSM - Enterprise Network System Management
Name: %{name}
Version: %{version}
Release: %{release}
License: Proprietary
Group: Applications/System
BuildArch: x86_64
Vendor: ENSM Project
URL: https://github.com/ensm/ensm
Packager: ENSM Team

Requires: systemd
Requires: java-21-openjdk >= 21
Requires: gcc
Requires: util-linux
Requires: parted
Requires: mdadm
Requires: lvm2
Requires: jq
Requires: unzip
Requires: tar

%description
ENSM (Enterprise Network System Management) - 통합 시스템 관리 플랫폼
- 인증 서버 (ensm-auth)
- 메인 서버 (ensm-main)
- 시스템 관리 스크립트
  * 디스크 및 파티션 관리
  * RAID 관리
  * LVM 관리
  * 패키지 관리
  * CRON 작업 관리
  * 네트워크 관리
- Caddy 리버스 프록시 통합
- Grafana 모니터링 통합

%prep
echo "[1/10] 준비 단계 시작..."
# SOURCES 디렉토리에 직접 파일이 있으므로 %setup 불필요
echo "[1/10] 준비 단계 완료"

%build
echo "[2/10] 빌드 단계 시작..."
# Gradle로 빌드 (이미 빌드된 JAR 파일 사용)
# 실제 빌드는 빌드 스크립트에서 수행
echo "[2/10] 빌드 단계 완료"

%install
echo "[3/10] 설치 단계 시작..."
echo "[3/10] 디렉토리 생성 중..."
# 디렉토리 생성
mkdir -p %{buildroot}/opt/ensm
mkdir -p %{buildroot}/usr/local/bin/ensm-scripts
mkdir -p %{buildroot}/usr/local/bin
mkdir -p %{buildroot}/usr/lib/systemd/system
mkdir -p %{buildroot}/etc/caddy
mkdir -p %{buildroot}/etc/prometheus
mkdir -p %{buildroot}/etc/loki
mkdir -p %{buildroot}/etc/promtail
mkdir -p %{buildroot}/etc/ensm
mkdir -p %{buildroot}/var/log/ensm/auth
mkdir -p %{buildroot}/var/log/ensm/main
mkdir -p %{buildroot}/var/lib/prometheus
mkdir -p %{buildroot}/var/lib/loki
mkdir -p %{buildroot}/var/lib/promtail
echo "[4/10] JAR 파일 복사 중..."
# JAR 파일 복사
cp %{_sourcedir}/ensm-auth-0.0.1-SNAPSHOT.jar %{buildroot}/opt/ensm/ensm-auth.jar
cp %{_sourcedir}/ensm-main-0.0.1-SNAPSHOT.jar %{buildroot}/opt/ensm/ensm-main.jar
# JAR 파일 권한 설정 (읽기 가능하도록)
chmod 644 %{buildroot}/opt/ensm/ensm-auth.jar
chmod 644 %{buildroot}/opt/ensm/ensm-main.jar
echo "[5/10] 스크립트 파일 복사 중..."
# 스크립트 복사 (모든 파일 포함: .sh, .c 등)
if [ -d %{_sourcedir}/ensm-scripts ]; then
    cp -r %{_sourcedir}/ensm-scripts/. %{buildroot}/usr/local/bin/ensm-scripts/
else
    echo "경고: ensm-scripts 디렉토리를 찾을 수 없습니다: %{_sourcedir}/ensm-scripts"
fi
# 모든 쉘 스크립트를 700 권한으로 설정 (보안: 소유자만 접근 가능)
find %{buildroot}/usr/local/bin/ensm-scripts -name "*.sh" -type f -exec chmod 700 {} \;
# C 소스 파일은 그대로 유지 (컴파일은 %post에서 수행)
# README.md 파일은 644 권한으로 설정 (문서)
find %{buildroot}/usr/local/bin/ensm-scripts -name "README.md" -type f -exec chmod 644 {} \;
echo "[6/10] systemd 서비스 파일 복사 중..."
# ENSM 상태 확인 스크립트 복사
if [ -f %{_sourcedir}/scripts/check-ensm-status.sh ]; then
    cp %{_sourcedir}/scripts/check-ensm-status.sh %{buildroot}/usr/local/bin/check-ensm-status
    chmod 755 %{buildroot}/usr/local/bin/check-ensm-status
fi

# Loki 문제 해결 스크립트 복사
if [ -f %{_sourcedir}/scripts/fix-loki.sh ]; then
    cp %{_sourcedir}/scripts/fix-loki.sh %{buildroot}/usr/local/bin/fix-loki
    chmod 755 %{buildroot}/usr/local/bin/fix-loki
fi

# 패키지 설치 디버깅 스크립트 복사
if [ -f %{_sourcedir}/scripts/debug-package-install.sh ]; then
    cp %{_sourcedir}/scripts/debug-package-install.sh %{buildroot}/usr/local/bin/debug-package-install
    chmod 755 %{buildroot}/usr/local/bin/debug-package-install
fi

# systemd 서비스 파일 복사
if [ -d %{_sourcedir}/systemd ]; then
    cp %{_sourcedir}/systemd/ensm.service %{buildroot}/usr/lib/systemd/system/ 2>/dev/null || true
    cp %{_sourcedir}/systemd/ensm-auth.service %{buildroot}/usr/lib/systemd/system/ 2>/dev/null || true
    cp %{_sourcedir}/systemd/ensm-main.service %{buildroot}/usr/lib/systemd/system/ 2>/dev/null || true
    cp %{_sourcedir}/systemd/prometheus.service %{buildroot}/usr/lib/systemd/system/ 2>/dev/null || true
    cp %{_sourcedir}/systemd/node_exporter.service %{buildroot}/usr/lib/systemd/system/ 2>/dev/null || true
    cp %{_sourcedir}/systemd/loki.service %{buildroot}/usr/lib/systemd/system/ 2>/dev/null || true
    cp %{_sourcedir}/systemd/promtail.service %{buildroot}/usr/lib/systemd/system/ 2>/dev/null || true
    cp %{_sourcedir}/systemd/ensm-postinstall.service %{buildroot}/usr/lib/systemd/system/ 2>/dev/null || true
else
    echo "경고: systemd 디렉토리를 찾을 수 없습니다: %{_sourcedir}/systemd"
fi
echo "[7/10] 모니터링 설정 파일 복사 중..."
# Caddyfile은 %post에서 직접 생성 (파일 충돌 방지)

# Grafana 설정은 %post에서 기존 grafana.ini를 직접 수정

# Prometheus 설정 파일 복사
if [ -f %{_sourcedir}/prometheus/prometheus.yml ]; then
    cp %{_sourcedir}/prometheus/prometheus.yml %{buildroot}/etc/prometheus/
else
    echo "경고: prometheus.yml을 찾을 수 없습니다"
fi

# Loki 설정 파일 복사
if [ -f %{_sourcedir}/loki/config.yml ]; then
    cp %{_sourcedir}/loki/config.yml %{buildroot}/etc/loki/
else
    echo "경고: loki config.yml을 찾을 수 없습니다"
fi

# Promtail 설정 파일 복사
if [ -f %{_sourcedir}/promtail/config.yml ]; then
    cp %{_sourcedir}/promtail/config.yml %{buildroot}/etc/promtail/
else
    echo "경고: promtail config.yml을 찾을 수 없습니다"
fi
echo "[8/10] 모니터링 바이너리 압축 해제 중..."
# 바이너리 파일 압축 해제 및 복사 (dependencies 폴더에서)
mkdir -p %{buildroot}/usr/local/bin
mkdir -p %{buildroot}/usr/local/prometheus

# Prometheus 바이너리 압축 해제 및 복사
cd %{buildroot}/usr/local/prometheus
tar -xzf %{_sourcedir}/dependencies/prometheus-2.55.0.linux-amd64.tar.gz --strip-components=1
cp prometheus %{buildroot}/usr/local/bin/
cp promtool %{buildroot}/usr/local/bin/ 2>/dev/null || true
# 불필요한 파일 제거 (RPM 패키징 시 오류 방지)
rm -f %{buildroot}/usr/local/prometheus/LICENSE %{buildroot}/usr/local/prometheus/README.md 2>/dev/null || true
rm -f %{buildroot}/LICENSE %{buildroot}/README.md 2>/dev/null || true

# node_exporter 바이너리 압축 해제 및 복사
cd %{buildroot}
tar -xzf %{_sourcedir}/dependencies/node_exporter-1.8.2.linux-amd64.tar.gz
cp node_exporter-1.8.2.linux-amd64/node_exporter %{buildroot}/usr/local/bin/
rm -rf node_exporter-1.8.2.linux-amd64
# 불필요한 파일 제거
rm -f %{buildroot}/LICENSE %{buildroot}/README.md 2>/dev/null || true

# Loki 바이너리 압축 해제 및 복사
cd %{buildroot}
unzip -o %{_sourcedir}/dependencies/loki-linux-amd64.zip loki-linux-amd64
cp loki-linux-amd64 %{buildroot}/usr/local/bin/loki
rm -f loki-linux-amd64
# 불필요한 파일 제거
rm -f %{buildroot}/LICENSE %{buildroot}/README.md 2>/dev/null || true

# Promtail 바이너리 압축 해제 및 복사
cd %{buildroot}
unzip -o %{_sourcedir}/dependencies/promtail-linux-amd64.zip promtail-linux-amd64
cp promtail-linux-amd64 %{buildroot}/usr/local/bin/promtail
rm -f promtail-linux-amd64
# 불필요한 파일 제거
rm -f %{buildroot}/LICENSE %{buildroot}/README.md 2>/dev/null || true

# 바이너리 실행 권한 부여
chmod +x %{buildroot}/usr/local/bin/prometheus
chmod +x %{buildroot}/usr/local/bin/promtool 2>/dev/null || true
chmod +x %{buildroot}/usr/local/bin/node_exporter
chmod +x %{buildroot}/usr/local/bin/loki
chmod +x %{buildroot}/usr/local/bin/promtail

# Caddy 바이너리 압축 해제 및 복사
echo "[9/10] Caddy 바이너리 설치 중..."
CADDY_FILE=$(ls %{_sourcedir}/dependencies/caddy*.tar.gz 2>/dev/null | head -1)
if [ -n "$CADDY_FILE" ] && [ -f "$CADDY_FILE" ]; then
    cd %{buildroot}
    tar -xzf "$CADDY_FILE" 2>/dev/null || true
    # caddy 바이너리 찾기 및 복사
    if [ -f caddy ]; then
        cp caddy %{buildroot}/usr/local/bin/
        chmod +x %{buildroot}/usr/local/bin/caddy
    else
        find . -maxdepth 2 -name "caddy" -type f -exec cp {} %{buildroot}/usr/local/bin/ \; 2>/dev/null || true
        chmod +x %{buildroot}/usr/local/bin/caddy 2>/dev/null || true
    fi
    # 불필요한 파일 제거
    rm -rf caddy* LICENSE README.md 2>/dev/null || true
    rm -f %{buildroot}/LICENSE %{buildroot}/README.md 2>/dev/null || true
fi

# Grafana 바이너리 압축 해제 및 복사
echo "[9/10] Grafana 바이너리 설치 중..."
GRAFANA_FILE=$(ls %{_sourcedir}/dependencies/grafana*.tar.gz 2>/dev/null | head -1)
if [ -n "$GRAFANA_FILE" ] && [ -f "$GRAFANA_FILE" ]; then
    cd %{buildroot}
    mkdir -p %{buildroot}/usr/local/grafana
    tar -xzf "$GRAFANA_FILE" --strip-components=1 -C %{buildroot}/usr/local/grafana/ 2>/dev/null || true
    # Grafana는 전체 디렉토리 구조가 필요하므로 그대로 유지
    # grafana 바이너리를 /usr/local/bin에 심볼릭 링크 생성 (grafana-server가 내부적으로 필요)
    if [ -f %{buildroot}/usr/local/grafana/bin/grafana ]; then
        ln -sf /usr/local/grafana/bin/grafana %{buildroot}/usr/local/bin/grafana 2>/dev/null || true
    fi
    # grafana-server 바이너리도 심볼릭 링크 생성 (호환성)
    if [ -f %{buildroot}/usr/local/grafana/bin/grafana-server ]; then
        ln -sf /usr/local/grafana/bin/grafana-server %{buildroot}/usr/local/bin/grafana-server 2>/dev/null || true
    fi
    # Grafana 설정 디렉토리 생성
    mkdir -p %{buildroot}/etc/grafana
    mkdir -p %{buildroot}/var/lib/grafana
    mkdir -p %{buildroot}/var/log/grafana
    # 불필요한 파일 제거
    rm -f %{buildroot}/usr/local/grafana/LICENSE %{buildroot}/usr/local/grafana/README.md 2>/dev/null || true
    rm -f %{buildroot}/LICENSE %{buildroot}/README.md 2>/dev/null || true
fi

# Caddy systemd 서비스 파일 생성 (바이너리 포함 시)
if [ -f %{buildroot}/usr/local/bin/caddy ]; then
    cat > %{buildroot}/usr/lib/systemd/system/caddy.service <<'CADDY_SERVICE_EOF'
[Unit]
Description=Caddy - The Ultimate Server with Automatic HTTPS
Documentation=https://caddyserver.com/docs/
After=network.target

[Service]
Type=notify
ExecStart=/usr/local/bin/caddy run --environ --config /etc/caddy/Caddyfile
ExecReload=/usr/local/bin/caddy reload --config /etc/caddy/Caddyfile --force
TimeoutStopSec=5s
LimitNOFILE=1048576
LimitNPROC=512
PrivateTmp=true
ProtectSystem=full
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
CADDY_SERVICE_EOF
fi

# Grafana systemd 서비스 파일 생성 (바이너리 포함 시)
if [ -f %{buildroot}/usr/local/grafana/bin/grafana ] || [ -f %{buildroot}/usr/local/grafana/bin/grafana-server ]; then
    cat > %{buildroot}/usr/lib/systemd/system/grafana-server.service <<'GRAFANA_SERVICE_EOF'
[Unit]
Description=Grafana instance
Documentation=http://docs.grafana.org
Wants=network-online.target
After=network-online.target
After=postgresql.service mariadb.service mysql.service

[Service]
Type=notify
User=grafana
Group=grafana
RuntimeDirectory=grafana
RuntimeDirectoryMode=0750
WorkingDirectory=/usr/local/grafana
Environment="PATH=/usr/local/bin:/usr/local/grafana/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ExecStart=/usr/local/grafana/bin/grafana-server --config=/etc/grafana/grafana.ini --pidfile=/run/grafana/grafana-server.pid --packaging=tar cfg:default.paths.logs=/var/log/grafana cfg:default.paths.data=/var/lib/grafana cfg:default.paths.plugins=/var/lib/grafana/plugins --homepath=/usr/local/grafana
Restart=on-failure
RestartSec=5
TimeoutStopSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
GRAFANA_SERVICE_EOF
fi

echo "[9/10] 설치 단계 완료"

# BUILDROOT 루트에 생성된 불필요한 파일 최종 정리
rm -f %{buildroot}/LICENSE %{buildroot}/README.md 2>/dev/null || true

%pre
echo "[10/10] 사전 설치 스크립트 실행 중..."
# 설치 전 스크립트
# Caddy와 Grafana는 바이너리로 포함되므로 저장소 설정 불필요

# ENSM 사용자 생성
if ! id -u ensm >/dev/null 2>&1; then
    /usr/sbin/useradd -r -M -s /sbin/nologin -d /opt/ensm -c "ENSM System User" ensm
fi

mkdir -p /opt/ensm
mkdir -p /etc/ensm
mkdir -p /var/log/ensm/auth
mkdir -p /var/log/ensm/main
mkdir -p /var/log/ensm
mkdir -p /usr/local/bin/ensm-scripts
mkdir -p /var/lib/ddns_last_ip
mkdir -p /root/config
mkdir -p /etc/prometheus /var/lib/prometheus
mkdir -p /etc/loki /var/lib/loki/{chunks,rules,index,wal}
mkdir -p /etc/promtail /var/lib/promtail

# Prometheus 관련 사용자 생성
if ! id -u prometheus >/dev/null 2>&1; then
    /usr/sbin/useradd -M --no-create-home --shell /sbin/nologin prometheus
fi

if ! id -u node_exporter >/dev/null 2>&1; then
    /usr/sbin/useradd -M --no-create-home --shell /sbin/nologin node_exporter
fi

if ! id -u loki >/dev/null 2>&1; then
    /usr/sbin/useradd -M --no-create-home --shell /sbin/nologin loki
fi

if ! id -u promtail >/dev/null 2>&1; then
    /usr/sbin/useradd -M --no-create-home --shell /sbin/nologin promtail
fi

# Grafana 사용자 생성 (바이너리 포함 시)
if ! id -u grafana >/dev/null 2>&1; then
    /usr/sbin/useradd -M --system --no-create-home --shell /sbin/nologin --comment "Grafana Server" grafana
fi

chown -R ensm:ensm /opt/ensm
chmod 644 /opt/ensm/*.jar 2>/dev/null || true
chown -R ensm:ensm /etc/ensm
chown -R ensm:ensm /var/log/ensm
# 모든 스크립트를 ensm:ensm 소유로 설정
chown -R ensm:ensm /usr/local/bin/ensm-scripts
# run_script는 root 소유로 설정 (setuid wrapper이므로)
if [ -f %{buildroot}/usr/local/bin/ensm-scripts/system/run_script ]; then
    chown root:root %{buildroot}/usr/local/bin/ensm-scripts/system/run_script
    chmod 4755 %{buildroot}/usr/local/bin/ensm-scripts/system/run_script
fi
# 모든 쉘 스크립트를 700 권한으로 설정 (소유자만 접근 가능)
find /usr/local/bin/ensm-scripts -name "*.sh" -type f -exec chmod 700 {} \;
chown -R ensm:ensm /var/lib/ddns_last_ip
chown -R root:root /root/config
chmod 755 /root/config
chown -R prometheus:prometheus /etc/prometheus /var/lib/prometheus
chown -R loki:loki /etc/loki /var/lib/loki
chown -R promtail:promtail /etc/promtail /var/lib/promtail
echo "[10/10] 사전 설치 스크립트 완료"

%post
echo "설치 후 스크립트 실행 중..."
# 설치 후 스크립트 (즉시 실행)

# ENSM 전용 JDK 심볼릭 링크 설정
if rpm -q java-21-openjdk >/dev/null 2>&1; then
    JDIR="/usr/lib/jvm/$(rpm -q --qf '%%{NAME}-%%{VERSION}-%%{RELEASE}.%%{ARCH}' java-21-openjdk 2>/dev/null)"
    if [ -x "$JDIR/bin/java" ]; then
        mkdir -p /opt/ensm/java
        ln -sfn "$JDIR" /opt/ensm/java/jdk
        echo "✅ ENSM 전용 JDK 심볼릭 링크가 설정되었습니다: /opt/ensm/java/jdk -> $JDIR"
    else
        echo "⚠️ JDK 경로를 찾을 수 없습니다: $JDIR"
    fi
else
    echo "⚠️ java-21-openjdk 패키지가 설치되어 있지 않습니다."
fi

# 모든 쉘 스크립트를 ensm:ensm 소유, 700 권한으로 설정 (보안: 소유자만 접근 가능)
# 단, run_script는 root:root로 유지해야 하므로 먼저 제외하고 설정
chown -R ensm:ensm /usr/local/bin/ensm-scripts

# 범용 스크립트 실행 wrapper 컴파일 및 setuid 설정
if [ -f /usr/local/bin/ensm-scripts/system/run_script.c ]; then
    if command -v gcc &> /dev/null; then
        echo "run_script wrapper 컴파일 중..."
        gcc -o /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/run_script.c
        if [ $? -eq 0 ] && [ -f /usr/local/bin/ensm-scripts/system/run_script ]; then
            chown root:root /usr/local/bin/ensm-scripts/system/run_script
            chmod 4755 /usr/local/bin/ensm-scripts/system/run_script
            echo "✅ run_script wrapper가 설정되었습니다."
        else
            echo "❌ run_script wrapper 컴파일 실패"
        fi
    else
        echo "⚠️ gcc가 설치되어 있지 않아 run_script wrapper를 컴파일할 수 없습니다."
        echo "⚠️ 패키지 관리 기능을 사용하려면 'dnf install gcc'를 실행하세요."
    fi
else
    echo "⚠️ run_script.c 소스 파일을 찾을 수 없습니다."
fi

# run_script가 존재하는 경우 다시 한번 확인 및 설정 (이중 체크)
if [ -f /usr/local/bin/ensm-scripts/system/run_script ]; then
    # 소유권 확인 및 수정
    CURRENT_OWNER=$(stat -c '%U:%G' /usr/local/bin/ensm-scripts/system/run_script 2>/dev/null)
    if [ "$CURRENT_OWNER" != "root:root" ]; then
        chown root:root /usr/local/bin/ensm-scripts/system/run_script
        echo "✅ run_script 소유권을 root:root로 수정했습니다."
    fi
    # 권한 확인 및 수정
    CURRENT_PERM=$(stat -c '%a' /usr/local/bin/ensm-scripts/system/run_script 2>/dev/null)
    if [ "$CURRENT_PERM" != "4755" ]; then
        chmod 4755 /usr/local/bin/ensm-scripts/system/run_script
        echo "✅ run_script 권한을 4755로 수정했습니다."
    fi
fi
find /usr/local/bin/ensm-scripts -name "*.sh" -type f -exec chmod 700 {} \; 2>/dev/null || true
# README.md 파일은 644 권한으로 설정 (문서)
find /usr/local/bin/ensm-scripts -name "README.md" -type f -exec chmod 644 {} \; 2>/dev/null || true
# system 디렉토리는 750 권한으로 설정 (ensm 그룹만 접근 가능, run_script setuid 바이너리 접근을 위해)
# 750 = 소유자(ensm) 읽기/쓰기/실행, 그룹(ensm) 읽기/실행, 다른 사용자 접근 불가
chmod 750 /usr/local/bin/ensm-scripts/system 2>/dev/null || true

    # SELinux 컨텍스트 설정 (SELinux가 활성화된 경우)
    if command -v chcon &> /dev/null && [ -f /etc/selinux/config ]; then
        SELINUX_STATUS=$(getenforce 2>/dev/null || echo "Disabled")
        if [ "$SELINUX_STATUS" != "Disabled" ]; then
            # unconfined_exec_t 타입으로 설정 (setuid 실행 허용)
            # bin_t는 setuid를 허용하지 않을 수 있으므로 unconfined_exec_t 사용
            if [ -f /usr/local/bin/ensm-scripts/system/run_script ]; then
                # 먼저 unconfined_exec_t 시도
                chcon -t unconfined_exec_t /usr/local/bin/ensm-scripts/system/run_script 2>/dev/null || \
                # 실패하면 bin_t 시도
                chcon -t bin_t /usr/local/bin/ensm-scripts/system/run_script 2>/dev/null || \
                # 둘 다 실패하면 restorecon 시도
                restorecon /usr/local/bin/ensm-scripts/system/run_script 2>/dev/null || true
                echo "✅ run_script SELinux 컨텍스트 설정 완료"
            fi
            # 쉘 스크립트는 shell_exec_t (하지만 700 권한으로 소유자만 접근 가능)
            find /usr/local/bin/ensm-scripts -name "*.sh" -type f -exec chcon -t shell_exec_t {} \; 2>/dev/null || true
            
            # SELinux 정책 모듈 설치 (unconfined_service_t에서 unconfined_exec_t 실행 허용)
            if command -v checkmodule >/dev/null 2>&1 && command -v semodule_package >/dev/null 2>&1 && command -v semodule >/dev/null 2>&1; then
                # 기존 정책 제거 (있다면)
                semodule -r ensm_run_script 2>/dev/null || semodule -r ensm_run_script_v2 2>/dev/null || semodule -r ensm_run_script_v3 2>/dev/null || true
                
                # 정책 모듈 파일 생성
                cat > /tmp/ensm_run_script.te <<'SELINUX_POLICY_EOF'
module ensm_run_script 1.0;

require {
    type unconfined_service_t;
    type unconfined_exec_t;
    class file { entrypoint execute execute_no_trans };
}

# Allow unconfined_service_t to execute unconfined_exec_t
allow unconfined_service_t unconfined_exec_t:file entrypoint;
allow unconfined_service_t unconfined_exec_t:file { execute execute_no_trans };
SELINUX_POLICY_EOF
                
                # 정책 컴파일 및 설치
                if checkmodule -M -m -o /tmp/ensm_run_script.mod /tmp/ensm_run_script.te 2>/dev/null; then
                    if semodule_package -o /tmp/ensm_run_script.pp -m /tmp/ensm_run_script.mod 2>/dev/null; then
                        if semodule -i /tmp/ensm_run_script.pp 2>/dev/null; then
                            echo "✅ SELinux 정책 모듈 설치 완료 (ensm_run_script)"
                            rm -f /tmp/ensm_run_script.te /tmp/ensm_run_script.mod /tmp/ensm_run_script.pp 2>/dev/null || true
                        else
                            echo "⚠️ SELinux 정책 모듈 설치 실패 (semodule)"
                        fi
                    else
                        echo "⚠️ SELinux 정책 패키지 생성 실패 (semodule_package)"
                    fi
                else
                    echo "⚠️ SELinux 정책 컴파일 실패 (checkmodule)"
                fi
            else
                echo "⚠️ SELinux 정책 모듈 도구가 없어 정책을 설치할 수 없습니다 (policycoreutils-devel 필요)"
            fi
            
            echo "✅ SELinux 컨텍스트가 설정되었습니다."
        fi
    fi

# Caddyfile 생성 (ENSM 작동을 위해 기존 파일이 있어도 덮어씀)
# /etc/caddy 디렉토리 생성 확인
mkdir -p /etc/caddy

# 기존 파일이 있으면 백업
if [ -f /etc/caddy/Caddyfile ]; then
    cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup.$(date +%%Y%%m%%d_%%H%%M%%S) 2>/dev/null || true
    echo "⚠️ 기존 Caddyfile을 백업했습니다."
fi

cat > /etc/caddy/Caddyfile <<'CADDYFILE_EOF'
# Caddy 리버스 프록시 설정

# 포트 55555에서 외부 접속을 받아 내부 서버로 라우팅

:55555 {

    # 정적 파일 및 리소스는 직접 처리

    # auth 서버의 정적 파일 (/auth/static/*)

    handle /auth/static/* {

        reverse_proxy localhost:55556 {

            header_up X-Forwarded-Proto {scheme}

            header_up X-Forwarded-Host {host}

            header_up X-Forwarded-Port {port}

        }

    }





    # main 서버의 정적 파일 (/main/static/*)

    handle /main/static/* {

        reverse_proxy localhost:55557 {

            header_up X-Forwarded-Proto {scheme}

            header_up X-Forwarded-Host {host}

            header_up X-Forwarded-Port {port}

        }

    }

    handle /main/descriptions/* {

        reverse_proxy localhost:55557 {

            header_up X-Forwarded-Proto {scheme}

            header_up X-Forwarded-Host {host}

            header_up X-Forwarded-Port {port}

        }

    }

    handle /main/favicon.ico {

        reverse_proxy localhost:55557 {

            header_up X-Forwarded-Proto {scheme}

            header_up X-Forwarded-Host {host}

            header_up X-Forwarded-Port {port}

        }

    }

    handle /main/manifest.json {

        reverse_proxy localhost:55557 {

            header_up X-Forwarded-Proto {scheme}

            header_up X-Forwarded-Host {host}

            header_up X-Forwarded-Port {port}

        }

    }

    # auth 서버의 favicon, manifest 등

    handle /auth/favicon.ico {

        reverse_proxy localhost:55556 {

            header_up X-Forwarded-Proto {scheme}

            header_up X-Forwarded-Host {host}

            header_up X-Forwarded-Port {port}

        }

    }

    handle /auth/manifest.json {

        reverse_proxy localhost:55556 {

            header_up X-Forwarded-Proto {scheme}

            header_up X-Forwarded-Host {host}

            header_up X-Forwarded-Port {port}

        }

    }

    # 루트 경로의 favicon, manifest (하위 호환성)

    handle /favicon.ico {

        reverse_proxy localhost:55556 {

            header_up X-Forwarded-Proto {scheme}

            header_up X-Forwarded-Host {host}

            header_up X-Forwarded-Port {port}

        }

    }

    handle /manifest.json {

        reverse_proxy localhost:55556 {

            header_up X-Forwarded-Proto {scheme}

            header_up X-Forwarded-Host {host}

            header_up X-Forwarded-Port {port}

        }

    }

    # Grafana 요청 처리
    handle /grafana/* {
        reverse_proxy localhost:3000 {
            header_up X-Forwarded-Proto {scheme}
            header_up X-Forwarded-Host {host}
            header_up X-Forwarded-Port {port}
            # X-Frame-Options 헤더 제거 (Grafana에서 설정하므로)
            header_down -X-Frame-Options
        }
    }

    # Kibana 요청 처리 (나중에 Prometheus + Grafana로 변경 예정)

    handle /kibana/* {

        reverse_proxy localhost:5601 {

            header_up X-Forwarded-Proto {scheme}

            header_up X-Forwarded-Host {host}

            header_up X-Forwarded-Port {port}

        }

    }

    # 인증 관련 요청은 auth 서버(55556)로

    handle /auth/* {

        reverse_proxy localhost:55556 {

            header_up X-Forwarded-Proto {scheme}

            header_up X-Forwarded-Host {host}

            header_up X-Forwarded-Port {port}

        }

    }

    # 메인 애플리케이션 요청은 main 서버(55557)로
    # /main/api/*는 /main/* 핸들러에서 처리됨

    handle /main/* {

        reverse_proxy localhost:55557 {

            header_up X-Forwarded-Proto {scheme}

            header_up X-Forwarded-Host {host}

            header_up X-Forwarded-Port {port}

        }

    }

    # 루트 경로는 auth 서버로 (로그인 페이지)

    handle / {

        reverse_proxy localhost:55556 {

            header_up X-Forwarded-Proto {scheme}

            header_up X-Forwarded-Host {host}

            header_up X-Forwarded-Port {port}

        }

    }

}
CADDYFILE_EOF
chmod 644 /etc/caddy/Caddyfile
chown root:root /etc/caddy/Caddyfile
echo "✅ ENSM Caddyfile이 /etc/caddy/Caddyfile로 생성되었습니다."

# Firewall 포트 열기 (55555/tcp)
if command -v firewall-cmd &> /dev/null; then
    if firewall-cmd --state &> /dev/null; then
        firewall-cmd --permanent --add-port=55555/tcp 2>/dev/null || true
        firewall-cmd --reload 2>/dev/null || true
        echo "✅ 방화벽 포트 55555/tcp가 열렸습니다."
    else
        echo "⚠️ 방화벽이 실행 중이지 않습니다. 포트 55555/tcp를 수동으로 열어주세요."
    fi
else
    echo "⚠️ firewall-cmd가 설치되어 있지 않습니다. 포트 55555/tcp를 수동으로 열어주세요."
fi

# ENSM config 디렉토리 및 초기 users.yml 파일 생성
if [ ! -d /opt/ensm/config ]; then
    mkdir -p /opt/ensm/config
    chown ensm:ensm /opt/ensm/config
    chmod 755 /opt/ensm/config
    echo "✅ ENSM config 디렉토리가 생성되었습니다."
fi

# 초기 users.yml 파일 생성 (root/root 계정)
if [ ! -f /opt/ensm/config/users.yml ]; then
    cat > /opt/ensm/config/users.yml <<'USERS_YML_EOF'
users:
  - username: root
    password: $2a$10$9bk1sN.cx/GdQ0nONn6cmufL2zkGpT3SWZCwKGJGbyoRWBLxpMBM2
USERS_YML_EOF
    chown ensm:ensm /opt/ensm/config/users.yml
    chmod 600 /opt/ensm/config/users.yml
    echo "✅ 초기 users.yml 파일이 생성되었습니다 (root/root 계정)."
fi

# postinstall 스크립트 실행 권한 설정
chmod +x /usr/local/bin/ensm-scripts/system/ensm-postinstall.sh 2>/dev/null || true

# systemd 데몬 리로드 (최소한만 수행)
systemctl daemon-reload

# postinstall 서비스 활성화 (실제 무거운 작업은 이 서비스에서 백그라운드로 수행)
# 이렇게 하면 RPM 트랜잭션이 블로킹되지 않음
systemctl enable ensm-postinstall.service
systemctl start ensm-postinstall.service || true
echo "설치 후 스크립트 완료"

%posttrans
echo "최종 설정 단계 실행 중..."
# 모든 트랜잭션이 완료된 후 실행
# Caddy와 Grafana는 바이너리로 포함됨
# 여기서는 설정 및 서비스 활성화만 수행

# Prometheus 바이너리 권한 설정 (RPM 패키지에 포함됨)
if [ -f /usr/local/bin/prometheus ]; then
    echo "✅ Prometheus 바이너리가 설치되어 있습니다."
    chown prometheus:prometheus /usr/local/bin/prometheus
    [ -f /usr/local/bin/promtool ] && chown prometheus:prometheus /usr/local/bin/promtool
    chown -R prometheus:prometheus /usr/local/prometheus /etc/prometheus /var/lib/prometheus
fi

# node_exporter 바이너리 권한 설정 (RPM 패키지에 포함됨)
if [ -f /usr/local/bin/node_exporter ]; then
    echo "✅ node_exporter 바이너리가 설치되어 있습니다."
    chown node_exporter:node_exporter /usr/local/bin/node_exporter
fi

# Loki 설치 확인 (RPM 패키지에 이미 포함되어 있음)
if [ -f /usr/local/bin/loki ]; then
    echo "✅ Loki 바이너리가 설치되어 있습니다."
    chown loki:loki /usr/local/bin/loki
    chown -R loki:loki /etc/loki /var/lib/loki
else
    echo "⚠️ Loki 설치 실패"
fi

# Promtail 설치 확인 (RPM 패키지에 이미 포함되어 있음)
if [ -f /usr/local/bin/promtail ]; then
    echo "✅ Promtail 바이너리가 설치되어 있습니다."
    # Promtail은 root로 실행 (권한 문제 해결)
    chown root:root /usr/local/bin/promtail
    chown -R root:root /etc/promtail /var/lib/promtail
else
    echo "⚠️ Promtail 설치 실패"
fi

# Caddy 설정 검증 (바이너리로 포함됨)
if [ -f /usr/local/bin/caddy ] && [ -f /etc/caddy/Caddyfile ]; then
    /usr/local/bin/caddy validate --config /etc/caddy/Caddyfile 2>/dev/null || echo "⚠️ Caddy 설정 검증 경고 (무시 가능)"
fi

# Grafana 설정 파일 생성 (바이너리 포함 시)
if [ -f /usr/local/grafana/bin/grafana ] || [ -f /usr/local/grafana/bin/grafana-server ]; then
    # Grafana 디렉토리 및 권한 설정
    mkdir -p /etc/grafana
    mkdir -p /var/lib/grafana
    mkdir -p /var/log/grafana
    mkdir -p /var/run/grafana
    chown -R grafana:grafana /var/lib/grafana /var/log/grafana /var/run/grafana 2>/dev/null || true
    chmod 755 /var/lib/grafana /var/log/grafana /var/run/grafana 2>/dev/null || true
    
    # Grafana 기본 설정 파일 생성
    if [ ! -f /etc/grafana/grafana.ini ]; then
        /usr/local/grafana/bin/grafana-server --config=/etc/grafana/grafana.ini --packaging=tar cfg:default.paths.logs=/var/log/grafana cfg:default.paths.data=/var/lib/grafana cfg:default.paths.plugins=/var/lib/grafana/plugins --homepath=/usr/local/grafana --config:defaults 2>/dev/null || \
        cat > /etc/grafana/grafana.ini <<'GRAFANA_INI_EOF'
[paths]
data = /var/lib/grafana
logs = /var/log/grafana
plugins = /var/lib/grafana/plugins
provisioning = /etc/grafana/provisioning

[server]
http_port = 3000
GRAFANA_INI_EOF
    fi
    chown root:grafana /etc/grafana/grafana.ini
    chmod 640 /etc/grafana/grafana.ini
fi

# Grafana 서브패스 설정
if [ -f /etc/grafana/grafana.ini ]; then
    # 백업 파일이 있으면 백업 (glob 패턴 대신 ls 사용)
    if ls /etc/grafana/grafana.ini.backup.* >/dev/null 2>&1; then
        cp /etc/grafana/grafana.ini /etc/grafana/grafana.ini.backup.$(date +%%Y%%m%%d_%%H%%M%%S)
    fi
    
    # [paths] 섹션에 provisioning 경로 추가 (대시보드 provisioning을 위해 필수)
    if grep -q "^\[paths\]" /etc/grafana/grafana.ini 2>/dev/null; then
        if ! grep -q "^provisioning" /etc/grafana/grafana.ini 2>/dev/null; then
            sed -i '/^\[paths\]/a provisioning = /etc/grafana/provisioning' /etc/grafana/grafana.ini
        else
            sed -i 's|^provisioning.*|provisioning = /etc/grafana/provisioning|' /etc/grafana/grafana.ini
        fi
    fi
    
    # 실제 접속 도메인 확인 (Caddyfile에서 사용하는 도메인)
    # 기본값은 localhost이지만, 실제 도메인이 있으면 사용
    GRAFANA_ROOT_URL="http://localhost:55555/grafana/"
    if [ -f /etc/caddy/Caddyfile ]; then
        # Caddyfile에서 ServerName이나 도메인 추출 시도
        DOMAIN=$(grep -E "^[a-zA-Z0-9.-]+:" /etc/caddy/Caddyfile | head -1 | cut -d: -f1 | tr -d '[:space:]' || echo "")
        if [ -n "$DOMAIN" ] && [ "$DOMAIN" != "localhost" ]; then
            GRAFANA_ROOT_URL="http://${DOMAIN}:55555/grafana/"
        fi
    fi
    
    # root_url 설정 (기존 값이 있으면 교체, 없으면 추가)
    if grep -q "^root_url" /etc/grafana/grafana.ini 2>/dev/null; then
        sed -i "s|^root_url.*|root_url = ${GRAFANA_ROOT_URL}|" /etc/grafana/grafana.ini
    else
        if grep -q "^\[server\]" /etc/grafana/grafana.ini 2>/dev/null; then
            sed -i "/^\[server\]/a root_url = ${GRAFANA_ROOT_URL}" /etc/grafana/grafana.ini
        else
            echo "" >> /etc/grafana/grafana.ini
            echo "[server]" >> /etc/grafana/grafana.ini
            echo "root_url = ${GRAFANA_ROOT_URL}" >> /etc/grafana/grafana.ini
        fi
    fi
    
    # serve_from_sub_path 설정
    if grep -q "^serve_from_sub_path" /etc/grafana/grafana.ini 2>/dev/null; then
        sed -i 's|^serve_from_sub_path.*|serve_from_sub_path = true|' /etc/grafana/grafana.ini
    else
        sed -i "/^root_url = /a serve_from_sub_path = true" /etc/grafana/grafana.ini 2>/dev/null || \
        echo "serve_from_sub_path = true" >> /etc/grafana/grafana.ini
    fi
    
    # Security 설정 (iframe 임베드 허용)
    if ! grep -q "^\[security\]" /etc/grafana/grafana.ini 2>/dev/null; then
        echo "" >> /etc/grafana/grafana.ini
        echo "[security]" >> /etc/grafana/grafana.ini
        echo "x_frame_options = allow" >> /etc/grafana/grafana.ini
        echo "allow_embedding = true" >> /etc/grafana/grafana.ini
    else
        # x_frame_options 설정
        if grep -q "^x_frame_options" /etc/grafana/grafana.ini 2>/dev/null; then
            sed -i 's|^x_frame_options.*|x_frame_options = allow|' /etc/grafana/grafana.ini
        else
            sed -i '/^\[security\]/a x_frame_options = allow' /etc/grafana/grafana.ini
        fi
        # allow_embedding 설정
        if grep -q "^allow_embedding" /etc/grafana/grafana.ini 2>/dev/null; then
            sed -i 's|^allow_embedding.*|allow_embedding = true|' /etc/grafana/grafana.ini
        else
            sed -i '/^\[security\]/a allow_embedding = true' /etc/grafana/grafana.ini
        fi
    fi
    
    # 익명 접근 설정 (로그인 없이 iframe에서 접근 가능하도록)
    # [auth.anonymous] 섹션을 완전히 재작성하여 중복 제거 및 올바른 설정 적용
    if grep -q "^\[auth.anonymous\]" /etc/grafana/grafana.ini 2>/dev/null; then
        # 기존 [auth.anonymous] 섹션 전체 제거 (다음 섹션까지)
        sed -i '/^\[auth\.anonymous\]/,/^\[/{/^\[auth\.anonymous\]/!{/^\[/!d;};}' /etc/grafana/grafana.ini
        # [auth.anonymous] 라인도 제거
        sed -i '/^\[auth\.anonymous\]/d' /etc/grafana/grafana.ini
    fi
    
    # [auth.anonymous] 섹션 추가 (auth 섹션 다음에 삽입)
    if grep -q "^\[auth\]" /etc/grafana/grafana.ini 2>/dev/null; then
        # [auth] 섹션 다음에 [auth.anonymous] 섹션 추가
        sed -i '/^\[auth\]/a [auth.anonymous]\nenabled = true\norg_name = Main Org.\norg_role = Viewer' /etc/grafana/grafana.ini
    else
        # [auth] 섹션이 없으면 파일 끝에 추가
        echo "" >> /etc/grafana/grafana.ini
        echo "[auth.anonymous]" >> /etc/grafana/grafana.ini
        echo "enabled = true" >> /etc/grafana/grafana.ini
        echo "org_name = Main Org." >> /etc/grafana/grafana.ini
        echo "org_role = Viewer" >> /etc/grafana/grafana.ini
    fi
    
    chown root:grafana /etc/grafana/grafana.ini
    chmod 640 /etc/grafana/grafana.ini
fi

# Grafana Provisioning 설정 (데이터소스 및 대시보드 자동 구성)
mkdir -p /etc/grafana/provisioning/datasources
mkdir -p /etc/grafana/provisioning/dashboards
mkdir -p /var/lib/grafana/dashboards

# 데이터소스 자동 구성 (Prometheus, Loki)
cat > /etc/grafana/provisioning/datasources/datasources.yaml <<'EOF'
apiVersion: 1
deleteDatasources:
  - name: Prometheus
    orgId: 1
  - name: Loki
    orgId: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://127.0.0.1:9090
    isDefault: true
    jsonData:
      httpMethod: POST
  - name: Loki
    type: loki
    access: proxy
    url: http://127.0.0.1:3100
    jsonData:
      maxLines: 1000
EOF

# 대시보드 자동 구성
cat > /etc/grafana/provisioning/dashboards/dashboards.yaml <<'EOF'
apiVersion: 1
providers:
  - name: 'System Monitoring'
    orgId: 1
    folder: 'System'
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: true
EOF

# 시스템 모니터링 대시보드 생성 (CPU, Memory, Disk 게이지 + 로그)
cat > /var/lib/grafana/dashboards/system-monitor-gauge-logs.json <<'EOF'
{
  "id": null,
  "uid": "sysmon-gauges",
  "title": "System Monitor (Gauge + Logs)",
  "timezone": "browser",
  "schemaVersion": 38,
  "version": 1,
  "refresh": "10s",
  "panels": [
    {
      "id": 1,
      "type": "gauge",
      "title": "CPU Usage (%)",
      "gridPos": { "x": 0, "y": 0, "w": 8, "h": 8 },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": null },
          "expr": "100 - (avg by (instance) (irate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)",
          "refId": "A"
        }
      ],
      "fieldConfig": {
        "defaults": {
          "unit": "percent",
          "min": 0,
          "max": 100,
          "thresholds": {
            "mode": "percentage",
            "steps": [
              { "color": "green" },
              { "color": "orange", "value": 70 },
              { "color": "red", "value": 90 }
            ]
          }
        },
        "overrides": []
      },
      "options": {
        "reduceOptions": {
          "calcs": ["lastNotNull"],
          "values": false
        },
        "showThresholdLabels": false,
        "showThresholdMarkers": true
      }
    },
    {
      "id": 2,
      "type": "gauge",
      "title": "Memory Usage (%)",
      "gridPos": { "x": 8, "y": 0, "w": 8, "h": 8 },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": null },
          "expr": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100",
          "refId": "A"
        }
      ],
      "fieldConfig": {
        "defaults": {
          "unit": "percent",
          "min": 0,
          "max": 100,
          "thresholds": {
            "mode": "percentage",
            "steps": [
              { "color": "green" },
              { "color": "orange", "value": 70 },
              { "color": "red", "value": 90 }
            ]
          }
        },
        "overrides": []
      },
      "options": {
        "reduceOptions": {
          "calcs": ["lastNotNull"],
          "values": false
        },
        "showThresholdLabels": false,
        "showThresholdMarkers": true
      }
    },
    {
      "id": 3,
      "type": "gauge",
      "title": "Disk Usage (%) (/ mount)",
      "gridPos": { "x": 16, "y": 0, "w": 8, "h": 8 },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": null },
          "expr": "(1 - (node_filesystem_avail_bytes{mountpoint=\"/\",fstype!~\"tmpfs|overlay\"} / node_filesystem_size_bytes{mountpoint=\"/\",fstype!~\"tmpfs|overlay\"})) * 100",
          "refId": "A"
        }
      ],
      "fieldConfig": {
        "defaults": {
          "unit": "percent",
          "min": 0,
          "max": 100,
          "thresholds": {
            "mode": "percentage",
            "steps": [
              { "color": "green" },
              { "color": "orange", "value": 70 },
              { "color": "red", "value": 90 }
            ]
          }
        },
        "overrides": []
      },
      "options": {
        "reduceOptions": {
          "calcs": ["lastNotNull"],
          "values": false
        },
        "showThresholdLabels": false,
        "showThresholdMarkers": true
      }
    },
    {
      "id": 4,
      "type": "logs",
      "title": "System Logs (journald / varlogs)",
      "gridPos": { "x": 0, "y": 8, "w": 24, "h": 12 },
      "targets": [
        {
          "datasource": { "type": "loki", "uid": null },
          "expr": "{job=\"varlogs\"}",
          "refId": "A"
        }
      ],
      "options": {
        "showTime": true,
        "wrapLogMessage": true
      }
    }
  ],
  "templating": { "list": [] },
  "time": { "from": "now-6h", "to": "now" }
}
EOF

# Grafana 디렉토리 및 권한 설정 (서비스 시작 전 필수)
mkdir -p /var/lib/grafana /var/log/grafana
chown -R grafana:grafana /etc/grafana/provisioning /var/lib/grafana /var/log/grafana 2>/dev/null || true
chmod -R 755 /etc/grafana/provisioning
chmod 755 /var/lib/grafana /var/log/grafana 2>/dev/null || true
chmod -R 755 /var/lib/grafana/dashboards

# Grafana 서비스 활성화 (바이너리로 포함됨)
if [ -f /usr/lib/systemd/system/grafana-server.service ] && ([ -f /usr/local/grafana/bin/grafana ] || [ -f /usr/local/grafana/bin/grafana-server ]); then
    systemctl enable grafana-server.service
fi

# 모든 ENSM 서비스 활성화 (재부팅 시 자동 시작)
systemctl enable ensm-auth.service 2>/dev/null || true
systemctl enable ensm-main.service 2>/dev/null || true
systemctl enable ensm.service 2>/dev/null || true

# 모니터링 스택 서비스 활성화
if [ -f /usr/local/bin/prometheus ] || command -v prometheus &> /dev/null; then
    systemctl enable prometheus.service 2>/dev/null || true
fi
if [ -f /usr/local/bin/node_exporter ] || command -v node_exporter &> /dev/null; then
    systemctl enable node_exporter.service 2>/dev/null || true
fi
if [ -f /usr/local/bin/loki ] || command -v loki &> /dev/null; then
    systemctl enable loki.service 2>/dev/null || true
fi
if [ -f /usr/local/bin/promtail ] || command -v promtail &> /dev/null; then
    systemctl enable promtail.service 2>/dev/null || true
fi
if [ -f /usr/local/bin/caddy ]; then
    systemctl enable caddy.service 2>/dev/null || true
fi

# 통합 서비스 시작 (모든 의존 서비스 자동 시작)
systemctl start ensm.service || echo "ensm 통합 서비스 시작 실패 (로그 확인 필요)"

# 모니터링 스택 서비스 시작 (바이너리가 설치된 경우에만)
if [ -f /usr/local/bin/prometheus ] || command -v prometheus &> /dev/null; then
    systemctl start prometheus.service || echo "Prometheus 시작 실패"
fi

if [ -f /usr/local/bin/node_exporter ] || command -v node_exporter &> /dev/null; then
    systemctl start node_exporter.service || echo "node_exporter 시작 실패"
fi

if [ -f /usr/local/bin/loki ] || command -v loki &> /dev/null; then
    systemctl start loki.service || echo "Loki 시작 실패"
fi

if [ -f /usr/local/bin/promtail ] || command -v promtail &> /dev/null; then
    systemctl start promtail.service || echo "Promtail 시작 실패"
fi

# Grafana 서비스 시작 (provisioning 설정 후 재시작)
# provisioning 파일이 적용되도록 재시작 필요
if systemctl is-active --quiet grafana-server.service 2>/dev/null; then
    systemctl restart grafana-server.service || echo "Grafana 재시작 실패"
else
    systemctl start grafana-server.service || echo "Grafana 시작 실패"
fi

# Grafana가 provisioning을 로드할 시간을 주기 위해 잠시 대기
sleep 2

# Grafana 10.x에서 Viewer 역할에 dashboards:read 권한 추가 (익명 사용자가 대시보드를 읽을 수 있도록)
if [ -f /var/lib/grafana/grafana.db ] && command -v sqlite3 >/dev/null 2>&1; then
    echo "Viewer 역할에 dashboards:read 권한 추가 중..."
    sqlite3 /var/lib/grafana/grafana.db <<'SQL_EOF'
INSERT OR IGNORE INTO permission (role_id, action, scope, created, updated)
VALUES (2, 'dashboards:read', '', datetime('now'), datetime('now'));
SQL_EOF
    if [ $? -eq 0 ]; then
        echo "✅ Viewer 역할에 dashboards:read 권한 추가 완료"
    else
        echo "⚠️ Viewer 역할 권한 추가 실패 (수동으로 추가 필요)"
    fi
elif [ -f /var/lib/grafana/grafana.db ] && command -v python3 >/dev/null 2>&1; then
    echo "Viewer 역할에 dashboards:read 권한 추가 중 (Python 사용)..."
    python3 << 'PYTHON_EOF'
import sqlite3
try:
    conn = sqlite3.connect('/var/lib/grafana/grafana.db')
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR IGNORE INTO permission (role_id, action, scope, created, updated)
        VALUES (2, 'dashboards:read', '', datetime('now'), datetime('now'))
    """)
    conn.commit()
    print("✅ Viewer 역할에 dashboards:read 권한 추가 완료")
    conn.close()
except Exception as e:
    print(f"⚠️ Viewer 역할 권한 추가 실패: {e}")
PYTHON_EOF
else
    echo "⚠️ sqlite3 또는 python3가 없어 Viewer 역할 권한을 자동으로 추가할 수 없습니다."
    echo "   수동으로 추가: sqlite3 /var/lib/grafana/grafana.db \"INSERT OR IGNORE INTO permission (role_id, action, scope, created, updated) VALUES (2, 'dashboards:read', '', datetime('now'), datetime('now'));\""
fi

echo ""
echo "=========================================="
echo "ENSM 설치 완료!"
echo "=========================================="
echo "최종 설정 단계 완료"

%preun
# 제거 전 스크립트
if [ $1 -eq 0 ]; then
    # 서비스 중지 시 타임아웃 설정 (기본 90초가 너무 길 수 있음)
    TIMEOUT=10
    
    # 통합 서비스 중지 및 비활성화
    if systemctl is-active --quiet ensm.service 2>/dev/null; then
        timeout $TIMEOUT systemctl stop ensm.service 2>/dev/null || systemctl kill --signal=SIGKILL ensm.service 2>/dev/null || true
    fi
    if systemctl is-enabled --quiet ensm.service 2>/dev/null; then
        systemctl disable ensm.service 2>/dev/null || true
    fi
    
    # ENSM 서비스 중지 및 비활성화
    if systemctl is-active --quiet ensm-auth.service 2>/dev/null; then
        timeout $TIMEOUT systemctl stop ensm-auth.service 2>/dev/null || systemctl kill --signal=SIGKILL ensm-auth.service 2>/dev/null || true
    fi
    if systemctl is-active --quiet ensm-main.service 2>/dev/null; then
        timeout $TIMEOUT systemctl stop ensm-main.service 2>/dev/null || systemctl kill --signal=SIGKILL ensm-main.service 2>/dev/null || true
    fi
    if systemctl is-enabled --quiet ensm-auth.service 2>/dev/null; then
        systemctl disable ensm-auth.service 2>/dev/null || true
    fi
    if systemctl is-enabled --quiet ensm-main.service 2>/dev/null; then
        systemctl disable ensm-main.service 2>/dev/null || true
    fi
    
    # 모니터링 스택 서비스 중지 및 비활성화
    if systemctl is-active --quiet prometheus.service 2>/dev/null; then
        timeout $TIMEOUT systemctl stop prometheus.service 2>/dev/null || systemctl kill --signal=SIGKILL prometheus.service 2>/dev/null || true
    fi
    if systemctl is-active --quiet node_exporter.service 2>/dev/null; then
        timeout $TIMEOUT systemctl stop node_exporter.service 2>/dev/null || systemctl kill --signal=SIGKILL node_exporter.service 2>/dev/null || true
    fi
    if systemctl is-active --quiet loki.service 2>/dev/null; then
        timeout $TIMEOUT systemctl stop loki.service 2>/dev/null || systemctl kill --signal=SIGKILL loki.service 2>/dev/null || true
    fi
    if systemctl is-active --quiet promtail.service 2>/dev/null; then
        timeout $TIMEOUT systemctl stop promtail.service 2>/dev/null || systemctl kill --signal=SIGKILL promtail.service 2>/dev/null || true
    fi
    
    # Caddy 서비스 중지 및 비활성화
    if systemctl is-active --quiet caddy.service 2>/dev/null; then
        timeout $TIMEOUT systemctl stop caddy.service 2>/dev/null || systemctl kill --signal=SIGKILL caddy.service 2>/dev/null || true
    fi
    if systemctl is-enabled --quiet caddy.service 2>/dev/null; then
        systemctl disable caddy.service 2>/dev/null || true
    fi
    
    # Grafana 서비스 중지 및 비활성화
    if systemctl is-active --quiet grafana-server.service 2>/dev/null; then
        timeout $TIMEOUT systemctl stop grafana-server.service 2>/dev/null || systemctl kill --signal=SIGKILL grafana-server.service 2>/dev/null || true
    fi
    if systemctl is-enabled --quiet grafana-server.service 2>/dev/null; then
        systemctl disable grafana-server.service 2>/dev/null || true
    fi
    
    if systemctl is-enabled --quiet prometheus.service 2>/dev/null; then
        systemctl disable prometheus.service 2>/dev/null || true
    fi
    if systemctl is-enabled --quiet node_exporter.service 2>/dev/null; then
        systemctl disable node_exporter.service 2>/dev/null || true
    fi
    if systemctl is-enabled --quiet loki.service 2>/dev/null; then
        systemctl disable loki.service 2>/dev/null || true
    fi
    if systemctl is-enabled --quiet promtail.service 2>/dev/null; then
        systemctl disable promtail.service 2>/dev/null || true
    fi
    
    # postinstall 서비스 중지 및 비활성화
    if systemctl is-active --quiet ensm-postinstall.service 2>/dev/null; then
        timeout $TIMEOUT systemctl stop ensm-postinstall.service 2>/dev/null || systemctl kill --signal=SIGKILL ensm-postinstall.service 2>/dev/null || true
    fi
    if systemctl is-enabled --quiet ensm-postinstall.service 2>/dev/null; then
        systemctl disable ensm-postinstall.service 2>/dev/null || true
    fi
fi

%postun
# 제거 후 스크립트
if [ $1 -eq 0 ]; then
    # C wrapper 바이너리 제거
    [ -f /usr/local/bin/ensm-scripts/system/run_script ] && rm -f /usr/local/bin/ensm-scripts/system/run_script || true
    
    # postinstall 서비스 파일 제거
    [ -f /usr/lib/systemd/system/ensm-postinstall.service ] && rm -f /usr/lib/systemd/system/ensm-postinstall.service || true
    
    systemctl daemon-reload
    
    # ENSM 설정 파일 및 로그 제거
    if [ -d /etc/ensm ]; then
        rm -rf /etc/ensm
        echo "✅ ENSM 설정 파일 제거: /etc/ensm/"
    fi
    
    if [ -d /var/log/ensm ]; then
        rm -rf /var/log/ensm
        echo "✅ ENSM 로그 파일 제거: /var/log/ensm/"
    fi
    
    # 모니터링 스택 바이너리 제거
    if [ -f /usr/local/bin/prometheus ]; then
        rm -f /usr/local/bin/prometheus
        echo "✅ Prometheus 바이너리 제거: /usr/local/bin/prometheus"
    fi
    if [ -f /usr/local/bin/promtool ]; then
        rm -f /usr/local/bin/promtool
        echo "✅ Promtool 바이너리 제거: /usr/local/bin/promtool"
    fi
    if [ -f /usr/local/bin/node_exporter ]; then
        rm -f /usr/local/bin/node_exporter
        echo "✅ node_exporter 바이너리 제거: /usr/local/bin/node_exporter"
    fi
    if [ -f /usr/local/bin/loki ]; then
        rm -f /usr/local/bin/loki
        echo "✅ Loki 바이너리 제거: /usr/local/bin/loki"
    fi
    if [ -f /usr/local/bin/promtail ]; then
        rm -f /usr/local/bin/promtail
        echo "✅ Promtail 바이너리 제거: /usr/local/bin/promtail"
    fi
    
    # Caddy 바이너리 제거
    if [ -f /usr/local/bin/caddy ]; then
        rm -f /usr/local/bin/caddy
        echo "✅ Caddy 바이너리 제거: /usr/local/bin/caddy"
    fi
    if [ -f /usr/lib/systemd/system/caddy.service ]; then
        rm -f /usr/lib/systemd/system/caddy.service
        echo "✅ Caddy 서비스 파일 제거"
    fi
    
    # Grafana 바이너리 제거
    # Grafana 심볼릭 링크 제거 (있는 경우)
    if [ -L /usr/local/bin/grafana-server ]; then
        rm -f /usr/local/bin/grafana-server
        echo "✅ Grafana-server 심볼릭 링크 제거: /usr/local/bin/grafana-server"
    fi
    if [ -d /usr/local/grafana ]; then
        rm -rf /usr/local/grafana
        echo "✅ Grafana 디렉토리 제거: /usr/local/grafana"
    fi
    if [ -f /usr/lib/systemd/system/grafana-server.service ]; then
        rm -f /usr/lib/systemd/system/grafana-server.service
        echo "✅ Grafana 서비스 파일 제거"
    fi
    
    # Prometheus 디렉토리 제거
    if [ -d /usr/local/prometheus ]; then
        rm -rf /usr/local/prometheus
        echo "✅ Prometheus 디렉토리 제거: /usr/local/prometheus"
    fi
    
    # 모니터링 스택 설정 파일 제거 (ENSM 패키지가 설치한 것만)
    if [ -f /etc/prometheus/prometheus.yml ]; then
        rm -f /etc/prometheus/prometheus.yml
        echo "✅ Prometheus 설정 파일 제거: /etc/prometheus/prometheus.yml"
    fi
    if [ -f /etc/loki/config.yml ]; then
        rm -f /etc/loki/config.yml
        echo "✅ Loki 설정 파일 제거: /etc/loki/config.yml"
    fi
    if [ -f /etc/promtail/config.yml ]; then
        rm -f /etc/promtail/config.yml
        echo "✅ Promtail 설정 파일 제거: /etc/promtail/config.yml"
    fi
    
    # 모니터링 스택 데이터 디렉토리 제거 (선택사항 - 데이터 보존을 원하면 주석 처리)
    if [ -d /var/lib/prometheus ]; then
        rm -rf /var/lib/prometheus
        echo "✅ Prometheus 데이터 디렉토리 제거: /var/lib/prometheus"
    fi
    if [ -d /var/lib/loki ]; then
        rm -rf /var/lib/loki
        echo "✅ Loki 데이터 디렉토리 제거: /var/lib/loki"
    fi
    if [ -d /var/lib/promtail ]; then
        rm -rf /var/lib/promtail
        echo "✅ Promtail 데이터 디렉토리 제거: /var/lib/promtail"
    fi
    
    # 모니터링 스택 사용자 제거 (선택사항)
    if id -u prometheus >/dev/null 2>&1; then
        userdel prometheus 2>/dev/null || true
        echo "✅ Prometheus 사용자 제거"
    fi
    if id -u node_exporter >/dev/null 2>&1; then
        userdel node_exporter 2>/dev/null || true
        echo "✅ node_exporter 사용자 제거"
    fi
    if id -u loki >/dev/null 2>&1; then
        userdel loki 2>/dev/null || true
        echo "✅ Loki 사용자 제거"
    fi
    if id -u promtail >/dev/null 2>&1; then
        userdel promtail 2>/dev/null || true
        echo "✅ Promtail 사용자 제거"
    fi
    
    # Grafana 사용자 제거 (선택사항)
    if id -u grafana >/dev/null 2>&1; then
        userdel grafana 2>/dev/null || true
        echo "✅ Grafana 사용자 제거"
    fi
    
    # ENSM 사용자 제거 (선택사항)
    if id -u ensm >/dev/null 2>&1; then
        userdel ensm 2>/dev/null || true
        echo "✅ ENSM 사용자 제거"
    fi
    
    # Java 링크 파일 제거
    if [ -L /opt/ensm/java/jdk ] || [ -d /opt/ensm/java ]; then
        rm -rf /opt/ensm/java
        echo "✅ Java 링크 파일 제거: /opt/ensm/java/"
    fi
    
    # 방화벽 포트 닫기 (55555/tcp)
    if command -v firewall-cmd &> /dev/null; then
        if firewall-cmd --state &> /dev/null; then
            firewall-cmd --permanent --remove-port=55555/tcp 2>/dev/null || true
            firewall-cmd --reload 2>/dev/null || true
            echo "✅ 방화벽 포트 55555/tcp가 닫혔습니다."
        fi
    fi
    
    # Caddy 설정 파일 제거
    if [ -f /etc/caddy/Caddyfile ]; then
        rm -f /etc/caddy/Caddyfile
        echo "✅ Caddy 설정 파일 제거: /etc/caddy/Caddyfile"
    fi
    if [ -d /etc/caddy ]; then
        rm -rf /etc/caddy
        echo "✅ Caddy 설정 디렉토리 제거: /etc/caddy/"
    fi
    
    # Grafana 설정 파일 제거
    if [ -f /etc/grafana/grafana.ini ]; then
        rm -f /etc/grafana/grafana.ini
        echo "✅ Grafana 설정 파일 제거: /etc/grafana/grafana.ini"
    fi
    if [ -d /etc/grafana/provisioning ]; then
        rm -rf /etc/grafana/provisioning
        echo "✅ Grafana provisioning 제거"
    fi
    if [ -d /etc/grafana ]; then
        rm -rf /etc/grafana
        echo "✅ Grafana 설정 디렉토리 제거: /etc/grafana/"
    fi
    if [ -d /var/lib/grafana ]; then
        rm -rf /var/lib/grafana
        echo "✅ Grafana 데이터 디렉토리 제거: /var/lib/grafana"
    fi
    if [ -d /var/log/grafana ]; then
        rm -rf /var/log/grafana
        echo "✅ Grafana 로그 디렉토리 제거: /var/log/grafana"
    fi
    
    echo ""
    echo "=========================================="
    echo "ENSM 제거 완료!"
    echo "=========================================="
    echo ""
fi

%files
%defattr(-,root,root,-)
/opt/ensm/ensm-auth.jar
/opt/ensm/ensm-main.jar
/usr/local/bin/ensm-scripts
# C wrapper 소스 파일은 /usr/local/bin/ensm-scripts 디렉토리 포함으로 자동 포함됨
/usr/local/bin/prometheus
/usr/local/bin/promtool
/usr/local/bin/node_exporter
/usr/local/bin/loki
/usr/local/bin/promtail
/usr/local/bin/caddy
/usr/local/bin/grafana
/usr/local/bin/grafana-server
/usr/local/grafana
/usr/local/bin/check-ensm-status
/usr/local/bin/fix-loki
/usr/local/bin/debug-package-install
/usr/local/prometheus
/usr/lib/systemd/system/ensm.service
/usr/lib/systemd/system/ensm-auth.service
/usr/lib/systemd/system/ensm-main.service
/usr/lib/systemd/system/prometheus.service
/usr/lib/systemd/system/node_exporter.service
/usr/lib/systemd/system/loki.service
/usr/lib/systemd/system/promtail.service
/usr/lib/systemd/system/ensm-postinstall.service
/usr/lib/systemd/system/caddy.service
/usr/lib/systemd/system/grafana-server.service
/etc/prometheus/prometheus.yml
/etc/loki/config.yml
/etc/promtail/config.yml
%dir /etc/ensm
%dir /var/log/ensm
%dir /var/log/ensm/auth
%dir /var/log/ensm/main
%dir /var/lib/prometheus
%dir /var/lib/loki
%dir /var/lib/promtail

%changelog
* Mon Jan 01 2024 ENSM Team <team@ensm.example.com> - 0.0.1-1
- Initial release of ENSM
- Includes ensm-auth and ensm-main servers
- Automatic Caddy and Grafana installation and configuration
- Systemd service integration
- Disk and partition management scripts
- RAID management scripts
- LVM management scripts (PV/VG/LV)
- Enhanced package management with JSON output
- Network management scripts
- CRON job management

