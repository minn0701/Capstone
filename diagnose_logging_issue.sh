#!/bin/bash
# 로깅 문제 종합 진단

echo "=== 문제 분석: 로그가 파일에 기록되지 않음 ==="
echo ""
echo "현재 상황:"
echo "  - 로그 파일: /var/log/ensm/main/main-app.log"
echo "  - 파일 크기: $(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0) bytes"
echo "  - 마지막 수정: $(stat -c %y /var/log/ensm/main/main-app.log 2>/dev/null | cut -d. -f1 || echo 'N/A')"
echo ""

echo "=== 1. journald 로그 확인 ==="
echo "최근 journald 로그 (5개):"
journalctl -u ensm-main.service -n 5 --no-pager --no-hostname | tail -3

echo -e "\n=== 2. API 호출 후 로그 생성 테스트 ==="
BEFORE_FILE=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
BEFORE_JOURNAL=$(journalctl -u ensm-main.service --since "1 minute ago" --no-pager | wc -l)

echo "API 호출 전:"
echo "  파일 크기: $BEFORE_FILE bytes"
echo "  journald 줄 수: $BEFORE_JOURNAL"

echo "API 호출 중..."
curl -s http://localhost:55557/main/api/packages > /dev/null
curl -s http://localhost:55557/main/api/system-info/disk > /dev/null
sleep 3

AFTER_FILE=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
AFTER_JOURNAL=$(journalctl -u ensm-main.service --since "1 minute ago" --no-pager | wc -l)

echo "API 호출 후:"
echo "  파일 크기: $AFTER_FILE bytes"
echo "  journald 줄 수: $AFTER_JOURNAL"

if [ "$AFTER_FILE" -gt "$BEFORE_FILE" ]; then
    echo "  ✅ 로그 파일에 기록됨!"
elif [ "$AFTER_JOURNAL" -gt "$BEFORE_JOURNAL" ]; then
    echo "  ⚠️ journald에는 기록되지만 파일에는 기록되지 않음"
    echo "  → systemd의 StandardOutput/StandardError 설정 때문일 수 있음"
else
    echo "  ❌ 어디에도 기록되지 않음"
fi

echo -e "\n=== 3. 로깅 설정 확인 ==="
echo "systemd 서비스 설정:"
grep -E "StandardOutput|StandardError|LOG_PATH" /usr/lib/systemd/system/ensm-main.service

echo -e "\n환경 변수:"
systemctl show ensm-main.service | grep -E "LOG_PATH|JAVA_OPTS"

echo -e "\n=== 4. 원인 분석 ==="
echo ""
if grep -q "StandardOutput=journal" /usr/lib/systemd/system/ensm-main.service; then
    echo "⚠️ 문제 발견: StandardOutput=journal 설정"
    echo "  이것은 Spring Boot의 로그를 journald로만 리디렉션합니다."
    echo "  logging.file.name 설정이 있어도 파일로 기록되지 않을 수 있습니다."
    echo ""
    echo "해결 방법:"
    echo "  1. StandardOutput과 StandardError를 제거 (권장)"
    echo "     → Spring Boot가 logging.file.name으로 직접 파일에 기록"
    echo ""
    echo "  2. 또는 둘 다 사용:"
    echo "     → StandardOutput=journal (journald에도 기록)"
    echo "     → logging.file.name 설정 유지 (파일에도 기록)"
fi

echo -e "\n=== 5. 로그 파일 디렉토리 권한 확인 ==="
ls -ld /var/log/ensm/main/ 2>/dev/null || echo "디렉토리 없음"
ls -la /var/log/ensm/main/main-app.log 2>/dev/null | head -1
