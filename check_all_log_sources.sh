#!/bin/bash
# 모든 로그 소스 확인

echo "=========================================="
echo "1. journald에 ENSM 로그가 있는지 확인"
echo "=========================================="
echo ""

JOURNAL_RECENT=$(journalctl -u ensm-main.service --since "5 minutes ago" --no-pager | wc -l)
JOURNAL_TOTAL=$(journalctl -u ensm-main.service --no-pager | wc -l)

echo "journald 로그 개수:"
echo "  전체: $JOURNAL_TOTAL 줄"
echo "  최근 5분: $JOURNAL_RECENT 줄"

if [ "$JOURNAL_RECENT" -gt 5 ]; then
    echo "  ✅ journald에 로그가 기록되고 있음!"
    echo ""
    echo "  최근 로그 예시:"
    journalctl -u ensm-main.service -n 3 --no-pager --no-hostname | tail -2
else
    echo "  ❌ journald에도 로그가 거의 없음"
fi

echo -e "\n=========================================="
echo "2. 파일에 로그가 쓰여지는지 확인"
echo "=========================================="
echo ""

FILE_BEFORE=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
echo "API 호출 전 파일 크기: $FILE_BEFORE bytes"

curl -s http://localhost:55557/main/api/packages > /dev/null
sleep 3

FILE_AFTER=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
echo "API 호출 후 파일 크기: $FILE_AFTER bytes"

if [ "$FILE_AFTER" -gt "$FILE_BEFORE" ]; then
    echo "  ✅ 파일에 로그가 기록됨!"
else
    echo "  ❌ 파일에 로그가 기록되지 않음"
fi

echo -e "\n=========================================="
echo "3. Promtail이 수집하는 로그 확인"
echo "=========================================="
echo ""

echo "Loki에 있는 job 라벨:"
curl -s "http://localhost:3100/loki/api/v1/label/job/values" 2>/dev/null | jq -r '.data[]' | sort

echo ""
echo "각 job별 로그 수 (최근 1시간):"
for job in ensm varlogs journald; do
    COUNT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
        --data-urlencode "query={job=\"$job\"}" \
        --data-urlencode "start=$(date -d '1 hour ago' +%s)000000000" \
        --data-urlencode "end=$(date +%s)000000000" \
        --data-urlencode "limit=100" 2>/dev/null | jq '[.data.result[].values[]] | length' || echo 0)
    echo "  $job: $COUNT 개 로그 엔트리"
done

echo -e "\n=========================================="
echo "4. 결론 및 해결 방법"
echo "=========================================="
echo ""

if [ "$JOURNAL_RECENT" -gt 5 ]; then
    echo "✅ journald에 로그가 있음"
    JOURNAL_IN_LOKI=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
        --data-urlencode "query={job=\"journald\", unit=\"ensm-main.service\"}" \
        --data-urlencode "start=$(date -d '1 hour ago' +%s)000000000" \
        --data-urlencode "end=$(date +%s)000000000" \
        --data-urlencode "limit=1" 2>/dev/null | jq '.data.result | length' || echo 0)
    
    if [ "$JOURNAL_IN_LOKI" -gt 0 ]; then
        echo "✅ Loki에도 journald 로그가 수집되고 있음"
        echo ""
        echo "→ 해결: Grafana 대시보드에서 journald 로그를 보면 됩니다!"
        echo "  하지만 파일 로그도 함께 사용하는 것이 좋습니다."
    else
        echo "⚠️ journald에 로그가 있지만 Loki에 수집되지 않음"
        echo "  Promtail 설정 확인 필요"
    fi
else
    echo "❌ journald에도 로그가 없음"
    echo "→ 해결: Spring Boot가 로그를 출력하도록 설정 수정 필요"
fi

if [ "$FILE_AFTER" -gt "$FILE_BEFORE" ]; then
    echo "✅ 파일에도 로그가 기록됨"
else
    echo "❌ 파일에 로그가 기록되지 않음"
    echo "→ 해결: Spring Boot logging.file.name 설정 확인 및 수정"
fi
