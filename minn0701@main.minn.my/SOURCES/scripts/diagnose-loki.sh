#!/bin/bash
# Loki 문제 진단 스크립트

echo "=========================================="
echo "Loki 문제 진단"
echo "=========================================="
echo ""

# 1. Loki 바이너리 확인
echo "1. Loki 바이너리 확인"
echo "----------------------------------------"
if [ -f /usr/local/bin/loki ]; then
    echo "✓ 바이너리 존재: /usr/local/bin/loki"
    ls -lh /usr/local/bin/loki
    echo ""
    echo "바이너리 버전 확인:"
    /usr/local/bin/loki --version 2>&1 || echo "버전 확인 실패"
else
    echo "✗ 바이너리가 없습니다: /usr/local/bin/loki"
fi
echo ""

# 2. Loki 사용자 확인
echo "2. Loki 사용자 확인"
echo "----------------------------------------"
if id -u loki >/dev/null 2>&1; then
    echo "✓ Loki 사용자 존재"
    id loki
else
    echo "✗ Loki 사용자가 없습니다"
fi
echo ""

# 3. 디렉토리 확인
echo "3. 디렉토리 확인"
echo "----------------------------------------"
for dir in /etc/loki /var/lib/loki /var/lib/loki/chunks /var/lib/loki/index /var/lib/loki/rules; do
    if [ -d "$dir" ]; then
        echo "✓ $dir"
        ls -ld "$dir" | awk '{print "  권한: " $1 " 소유자: " $3 ":" $4}'
    else
        echo "✗ $dir (없음)"
    fi
done
echo ""

# 4. 설정 파일 확인
echo "4. 설정 파일 확인"
echo "----------------------------------------"
if [ -f /etc/loki/config.yml ]; then
    echo "✓ 설정 파일 존재: /etc/loki/config.yml"
    echo "파일 크기: $(stat -c%s /etc/loki/config.yml) bytes"
    echo "권한: $(stat -c%a /etc/loki/config.yml)"
    echo "소유자: $(stat -c%U:%G /etc/loki/config.yml)"
    echo ""
    echo "설정 파일 내용:"
    cat /etc/loki/config.yml
    echo ""
else
    echo "✗ 설정 파일이 없습니다: /etc/loki/config.yml"
fi
echo ""

# 5. 설정 파일 검증
echo "5. 설정 파일 검증"
echo "----------------------------------------"
if [ -f /usr/local/bin/loki ] && [ -f /etc/loki/config.yml ]; then
    echo "설정 파일 검증 중..."
    sudo -u loki /usr/local/bin/loki --config.file=/etc/loki/config.yml --verify-config 2>&1
    echo ""
else
    echo "⚠️ 바이너리 또는 설정 파일이 없어 검증할 수 없습니다"
fi
echo ""

# 6. 서비스 파일 확인
echo "6. 서비스 파일 확인"
echo "----------------------------------------"
if [ -f /usr/lib/systemd/system/loki.service ]; then
    echo "✓ 서비스 파일 존재: /usr/lib/systemd/system/loki.service"
    echo ""
    echo "서비스 파일 내용:"
    cat /usr/lib/systemd/system/loki.service
    echo ""
else
    echo "✗ 서비스 파일이 없습니다: /usr/lib/systemd/system/loki.service"
fi
echo ""

# 7. 서비스 상태 확인
echo "7. 서비스 상태 확인"
echo "----------------------------------------"
systemctl status loki.service --no-pager -l | head -30
echo ""

# 8. 최근 로그 확인
echo "8. 최근 로그 확인 (최근 50줄)"
echo "----------------------------------------"
journalctl -u loki.service -n 50 --no-pager
echo ""

# 9. 포트 확인
echo "9. 포트 3100 확인"
echo "----------------------------------------"
if netstat -tuln 2>/dev/null | grep -q ":3100 " || ss -tuln 2>/dev/null | grep -q ":3100 "; then
    echo "⚠️ 포트 3100이 사용 중입니다:"
    netstat -tuln 2>/dev/null | grep ":3100 " || ss -tuln 2>/dev/null | grep ":3100 "
    echo ""
    echo "프로세스 확인:"
    lsof -i :3100 2>/dev/null || fuser 3100/tcp 2>/dev/null || echo "프로세스 확인 실패"
else
    echo "✓ 포트 3100 사용 가능"
fi
echo ""

# 10. 디렉토리 권한 확인
echo "10. 디렉토리 권한 상세 확인"
echo "----------------------------------------"
echo "/etc/loki 권한:"
ls -la /etc/loki/ 2>/dev/null || echo "디렉토리 접근 불가"
echo ""
echo "/var/lib/loki 권한:"
ls -la /var/lib/loki/ 2>/dev/null || echo "디렉토리 접근 불가"
echo ""

# 11. 수동 실행 테스트
echo "11. 수동 실행 테스트 (loki 사용자로)"
echo "----------------------------------------"
if [ -f /usr/local/bin/loki ] && [ -f /etc/loki/config.yml ]; then
    echo "수동 실행 테스트 (5초 후 종료)..."
    timeout 5 sudo -u loki /usr/local/bin/loki --config.file=/etc/loki/config.yml 2>&1 || true
    echo ""
else
    echo "⚠️ 바이너리 또는 설정 파일이 없어 테스트할 수 없습니다"
fi
echo ""

# 12. SELinux 확인 (Rocky Linux)
echo "12. SELinux 확인"
echo "----------------------------------------"
if command -v getenforce >/dev/null 2>&1; then
    echo "SELinux 상태: $(getenforce)"
    if [ "$(getenforce)" = "Enforcing" ]; then
        echo "⚠️ SELinux가 Enforcing 모드입니다. 로그 확인:"
        ausearch -m avc -ts recent 2>/dev/null | grep loki | tail -5 || echo "최근 Loki 관련 SELinux 로그 없음"
    fi
else
    echo "SELinux 확인 불가"
fi
echo ""

echo "=========================================="
echo "진단 완료"
echo "=========================================="
echo ""
echo "위 정보를 확인하여 문제를 파악하세요."
echo "특히 다음을 확인하세요:"
echo "  - 설정 파일 검증 오류 메시지"
echo "  - 최근 로그의 오류 메시지"
echo "  - 디렉토리 권한 문제"
echo "  - 포트 충돌"

