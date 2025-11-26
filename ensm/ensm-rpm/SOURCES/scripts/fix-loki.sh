#!/bin/bash
# Loki 서비스 문제 해결 스크립트

set -euo pipefail

echo "=========================================="
echo "Loki 서비스 문제 진단 및 수정"
echo "=========================================="
echo ""

# 1. Loki 바이너리 확인
echo "1. Loki 바이너리 확인..."
if [ -f /usr/local/bin/loki ]; then
    echo "   ✓ Loki 바이너리 존재: /usr/local/bin/loki"
    ls -lh /usr/local/bin/loki
    if [ ! -x /usr/local/bin/loki ]; then
        echo "   ⚠️ 실행 권한 없음. 수정 중..."
        chmod +x /usr/local/bin/loki
        echo "   ✓ 실행 권한 추가 완료"
    fi
else
    echo "   ✗ Loki 바이너리가 없습니다: /usr/local/bin/loki"
    exit 1
fi

# 2. Loki 사용자 확인
echo ""
echo "2. Loki 사용자 확인..."
if id -u loki >/dev/null 2>&1; then
    echo "   ✓ Loki 사용자 존재"
else
    echo "   ⚠️ Loki 사용자가 없습니다. 생성 중..."
    /usr/sbin/useradd --no-create-home --shell /sbin/nologin loki
    echo "   ✓ Loki 사용자 생성 완료"
fi

# 3. 디렉토리 확인 및 생성
echo ""
echo "3. 디렉토리 확인 및 생성..."
for dir in /etc/loki /var/lib/loki /var/lib/loki/chunks /var/lib/loki/index /var/lib/loki/rules /var/lib/loki/wal; do
    if [ ! -d "$dir" ]; then
        echo "   ⚠️ 디렉토리 없음: $dir (생성 중...)"
        mkdir -p "$dir"
    else
        echo "   ✓ 디렉토리 존재: $dir"
    fi
done

# 4. 설정 파일 확인
echo ""
echo "4. 설정 파일 확인..."
if [ -f /etc/loki/config.yml ]; then
    echo "   ✓ 설정 파일 존재: /etc/loki/config.yml"
    # 설정 파일 검증
    if /usr/local/bin/loki --config.file=/etc/loki/config.yml --verify-config 2>&1 | grep -q "error"; then
        echo "   ✗ 설정 파일에 오류가 있습니다:"
        /usr/local/bin/loki --config.file=/etc/loki/config.yml --verify-config 2>&1 | grep -i error || true
    else
        echo "   ✓ 설정 파일 검증 통과"
    fi
else
    echo "   ✗ 설정 파일이 없습니다: /etc/loki/config.yml"
    exit 1
fi

# 5. 권한 설정
echo ""
echo "5. 권한 설정..."
chown -R loki:loki /etc/loki /var/lib/loki
chmod 755 /etc/loki
chmod 755 /var/lib/loki
chmod 644 /etc/loki/config.yml
chmod +x /usr/local/bin/loki
echo "   ✓ 권한 설정 완료"

# 6. 서비스 파일 확인
echo ""
echo "6. 서비스 파일 확인..."
if [ -f /usr/lib/systemd/system/loki.service ]; then
    echo "   ✓ 서비스 파일 존재: /usr/lib/systemd/system/loki.service"
    systemctl daemon-reload
    echo "   ✓ systemd 데몬 리로드 완료"
else
    echo "   ✗ 서비스 파일이 없습니다: /usr/lib/systemd/system/loki.service"
    exit 1
fi

# 7. 포트 확인
echo ""
echo "7. 포트 3100 확인..."
if netstat -tuln 2>/dev/null | grep -q ":3100 " || ss -tuln 2>/dev/null | grep -q ":3100 "; then
    echo "   ⚠️ 포트 3100이 이미 사용 중입니다"
    netstat -tuln 2>/dev/null | grep ":3100 " || ss -tuln 2>/dev/null | grep ":3100 " || true
else
    echo "   ✓ 포트 3100 사용 가능"
fi

# 8. 서비스 시작 시도
echo ""
echo "8. 서비스 시작 시도..."
systemctl stop loki.service 2>/dev/null || true
sleep 2

# 수동으로 실행하여 오류 확인
echo "   수동 실행 테스트 중..."
if sudo -u loki /usr/local/bin/loki --config.file=/etc/loki/config.yml --verify-config >/dev/null 2>&1; then
    echo "   ✓ 설정 파일 검증 성공"
else
    echo "   ✗ 설정 파일 검증 실패. 상세 오류:"
    sudo -u loki /usr/local/bin/loki --config.file=/etc/loki/config.yml --verify-config 2>&1 || true
fi

# 서비스 시작
echo ""
echo "   서비스 시작 중..."
if systemctl start loki.service; then
    sleep 3
    if systemctl is-active --quiet loki.service; then
        echo "   ✓ Loki 서비스 시작 성공"
        systemctl status loki.service --no-pager -l | head -20
    else
        echo "   ✗ Loki 서비스 시작 실패"
        echo "   상세 로그:"
        journalctl -u loki.service -n 50 --no-pager || true
        exit 1
    fi
else
    echo "   ✗ 서비스 시작 명령 실패"
    journalctl -u loki.service -n 50 --no-pager || true
    exit 1
fi

# 9. 서비스 활성화
echo ""
echo "9. 서비스 자동 시작 활성화..."
systemctl enable loki.service
echo "   ✓ 자동 시작 활성화 완료"

# 10. 최종 확인
echo ""
echo "=========================================="
echo "최종 확인"
echo "=========================================="
systemctl status loki.service --no-pager -l | head -15

echo ""
echo "Loki 서비스가 정상적으로 시작되었습니다!"
echo "포트 3100 확인: curl http://localhost:3100/ready"

