#!/bin/bash
# 로그 강제 발생 및 대시보드 표시 테스트

echo "=== 1. 현재 ENSM 로그 상태 ==="
echo "로그 파일 크기:"
ls -lh /var/log/ensm/*/*.log 2>/dev/null | awk '{print $5, $9}'

echo -e "\n최근 로그 3줄:"
tail -3 /var/log/ensm/main/main-app.log 2>/dev/null

echo -e "\n=== 2. 강제로 로그 생성 (API 호출) ==="
echo "2-1. 패키지 목록 조회 API 호출..."
BEFORE_SIZE=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
echo "  호출 전 로그 크기: $BEFORE_SIZE bytes"

curl -s http://localhost:55557/main/api/packages > /dev/null
sleep 2

AFTER_SIZE=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
echo "  호출 후 로그 크기: $AFTER_SIZE bytes"

if [ "$AFTER_SIZE" -gt "$BEFORE_SIZE" ]; then
    echo "  ✅ 로그가 생성되었습니다! (+$((AFTER_SIZE - BEFORE_SIZE)) bytes)"
    echo -e "\n  새로 생성된 로그:"
    tail -5 /var/log/ensm/main/main-app.log | head -5
else
    echo "  ⚠️ 로그가 생성되지 않았습니다."
fi

echo -e "\n2-2. 여러 API 호출로 더 많은 로그 생성..."
for i in {1..3}; do
    curl -s http://localhost:55557/main/api/system-info/disk > /dev/null
    curl -s http://localhost:55557/main/api/system-info/network > /dev/null
    sleep 1
done
echo "  API 호출 완료. 3초 대기..."
sleep 3

echo -e "\n=== 3. Promtail이 새 로그를 읽었는지 확인 ==="
echo "Promtail positions 파일 확인:"
sudo grep "ensm" /var/lib/promtail/positions.yaml 2>/dev/null | head -3 || echo "확인 불가"

echo -e "\n=== 4. Loki에 새 로그가 저장되었는지 확인 ==="
END=$(date +%s)000000000
START_5M=$(date -d '5 minutes ago' +%s)000000000

echo "최근 5분간의 ENSM 로그:"
ENSM_RESULT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"ensm\"}" \
  --data-urlencode "start=${START_5M}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=10")

COUNT=$(echo "$ENSM_RESULT" | jq '.data.result[0].values | length' 2>/dev/null || echo 0)
echo "  로그 엔트리 개수: $COUNT"

if [ "$COUNT" -gt 0 ]; then
    echo "  ✅ Loki에 로그가 저장되었습니다!"
    echo -e "\n  최근 로그 3개:"
    echo "$ENSM_RESULT" | jq -r '.data.result[0].values[-3:] | .[] | "    \(.[1][:120])"' 2>/dev/null | head -3
else
    echo "  ❌ Loki에 로그가 없습니다."
fi

echo -e "\n=== 5. 대시보드 쿼리 테스트 (개별 job) ==="
echo "각 job별 최근 로그 확인:"
for job in ensm varlogs journald; do
    COUNT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
      --data-urlencode "query={job=\"$job\"}" \
      --data-urlencode "start=${START_5M}" \
      --data-urlencode "end=${END}" \
      --data-urlencode "limit=5" | jq '.data.result[0].values | length' 2>/dev/null || echo 0)
    echo "  $job: $COUNT 개"
done

echo -e "\n=== 테스트 완료 ==="
echo "이제 Grafana 대시보드를 확인해보세요!"
echo "URL: http://localhost:3000 (또는 외부 접속 주소)"
