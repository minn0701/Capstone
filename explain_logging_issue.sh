#!/bin/bash
# 로깅 문제 설명 및 해결 방안

echo "=========================================="
echo "로깅 시스템 구조 설명"
echo "=========================================="
echo ""
echo "현재 구조:"
echo "  ENSM 애플리케이션"
echo "    ↓ (로그 출력)"
echo "  [어디로?]"
echo "    ├→ 파일: /var/log/ensm/**/*.log  ❌ 쓰여지지 않음"
echo "    └→ journald: systemd journal      ✅ 확인 필요"
echo ""
echo "  Promtail (로그 수집기)"
echo "    ├→ 파일에서 읽기: /var/log/ensm/**/*.log  ❌ 읽을 게 없음"
echo "    └→ journald에서 읽기: systemd journal     ⚠️ 확인 필요"
echo "    ↓"
echo "  Loki (로그 저장소)"
echo "    ↓"
echo "  Grafana (대시보드)"
echo ""

echo "=========================================="
echo "현재 상황 확인"
echo "=========================================="
echo ""

echo "1. ENSM 로그 파일 상태:"
FILE_SIZE=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
FILE_TIME=$(stat -c %y /var/log/ensm/main/main-app.log 2>/dev/null | cut -d. -f1 || echo "N/A")
echo "   파일 크기: $FILE_SIZE bytes"
echo "   마지막 수정: $FILE_TIME"
if [ "$FILE_SIZE" -eq 0 ] || [ "$FILE_TIME" = "N/A" ]; then
    echo "   ❌ 로그 파일이 비어있거나 오래됨"
else
    echo "   ⚠️ 로그 파일은 있지만 업데이트되지 않음"
fi

echo -e "\n2. journald에 ENSM 로그가 있는지:"
JOURNAL_COUNT=$(journalctl -u ensm-main.service --since "10 minutes ago" --no-pager | grep -c "^" || echo 0)
echo "   최근 10분간 journald 로그: $JOURNAL_COUNT 줄"
if [ "$JOURNAL_COUNT" -gt 10 ]; then
    echo "   ✅ journald에 로그가 있음"
    echo "   최근 로그 예시:"
    journalctl -u ensm-main.service -n 2 --no-pager --no-hostname | tail -1 | cut -c1-80
else
    echo "   ❌ journald에도 로그가 거의 없음"
fi

echo -e "\n3. Promtail이 수집하는 내용 확인:"
echo "   Promtail 설정에서 수집 대상:"
echo "     - job: ensm    → /var/log/ensm/**/*.log (파일)"
echo "     - job: journald → systemd journal"
echo ""
echo "   Loki에 실제로 있는 job 확인:"
curl -s "http://localhost:3100/loki/api/v1/label/job/values" 2>/dev/null | jq -r '.data[]' | while read job; do
    COUNT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
        --data-urlencode "query={job=\"$job\"}" \
        --data-urlencode "start=$(date -d '1 hour ago' +%s)000000000" \
        --data-urlencode "end=$(date +%s)000000000" \
        --data-urlencode "limit=1" 2>/dev/null | jq '.data.result | length' || echo 0)
    echo "     - $job: $COUNT 개 스트림 (최근 1시간)"
done

echo -e "\n=========================================="
echo "문제 원인"
echo "=========================================="
echo ""
echo "ENSM 애플리케이션이 로그를 파일에 쓰지 않고 있습니다."
echo ""
echo "가능한 원인:"
echo "  1. Spring Boot의 logging.file.name 설정이 적용되지 않음"
echo "  2. systemd의 StandardOutput=journal이 파일 출력을 방해함"
echo "  3. 로그 파일 경로나 권한 문제"
echo ""

echo "=========================================="
echo "해결 방법"
echo "=========================================="
echo ""
echo "방법 1: 파일과 journald 둘 다 사용 (권장)"
echo "  - Spring Boot: logging.file.name으로 파일에 기록"
echo "  - systemd: StandardOutput=journal 유지 (journald에도 기록)"
echo "  → Promtail이 파일에서 읽을 수 있음"
echo ""
echo "방법 2: journald만 사용"
echo "  - Promtail이 이미 journald 로그를 수집하도록 설정됨"
echo "  - ENSM 로그가 journald에 제대로 기록되는지 확인 필요"
echo "  → 현재 Promtail 설정으로 수집 가능"
echo ""
echo "=========================================="
echo "다음 단계"
echo "=========================================="
echo ""
echo "1. journald에 로그가 있는지 확인"
echo "2. 있다면 → Promtail이 제대로 수집하는지 확인"
echo "3. 없다면 → Spring Boot가 로그를 파일에 쓰도록 수정"
echo ""

