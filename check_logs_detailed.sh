#!/bin/bash
# 대시보드 로그 표시 문제 상세 진단

echo "=== 1. 각 job별 상세 로그 확인 (최근 1시간) ==="
START=$(date -d '1 hour ago' +%s)000000000
END=$(date +%s)000000000

for job in ensm varlogs journald; do
    echo -e "\n--- $job job 로그 ---"
    RESULT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
      --data-urlencode "query={job=\"$job\"}" \
      --data-urlencode "start=${START}" \
      --data-urlencode "end=${END}" \
      --data-urlencode "limit=5" | jq '.data.result')
    
    STREAM_COUNT=$(echo "$RESULT" | jq 'length')
    echo "스트림 개수: $STREAM_COUNT"
    
    if [ "$STREAM_COUNT" -gt 0 ]; then
        echo "스트림 정보:"
        echo "$RESULT" | jq '.[] | {job: .stream.job, filename: .stream.filename, unit: .stream.unit, log_entries: (.values | length), latest_time: .values[0][0], latest_log: (.values[0][1][:80])}'
    else
        echo "❌ 로그 없음"
    fi
done

echo -e "\n=== 2. 대시보드와 동일한 쿼리 (1시간 범위) ==="
RESULT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=~\"varlogs|ensm|journald\"}" \
  --data-urlencode "start=${START}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=50")

TOTAL_STREAMS=$(echo "$RESULT" | jq '.data.result | length')
echo "전체 스트림 개수: $TOTAL_STREAMS"

echo -e "\n스트림 상세:"
echo "$RESULT" | jq '.data.result[] | {job: .stream.job, filename: .stream.filename, unit: .stream.unit, entries: (.values | length)}'

echo -e "\n=== 3. 24시간 범위로 확대해서 확인 ==="
START_24H=$(date -d '24 hours ago' +%s)000000000

for job in ensm varlogs journald; do
    echo -n "$job (24h): "
    COUNT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
      --data-urlencode "query={job=\"$job\"}" \
      --data-urlencode "start=${START_24H}" \
      --data-urlencode "end=${END}" \
      --data-urlencode "limit=1" | jq '.data.result | length')
    echo "$COUNT 개"
done

echo -e "\n전체 쿼리 (24h):"
TOTAL_24H=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=~\"varlogs|ensm|journald\"}" \
  --data-urlencode "start=${START_24H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=50" | jq '.data.result | length')
echo "스트림 개수: $TOTAL_24H 개"

echo -e "\n=== 4. Grafana 대시보드 시간 범위 확인 ==="
echo "대시보드는 'now-24h' ~ 'now' 범위를 사용합니다."
echo "현재 시각: $(date)"
echo "24시간 전: $(date -d '24 hours ago')"

echo -e "\n=== 5. 로그 타임스탬프 확인 ==="
echo "ENSM 로그의 실제 타임스탬프:"
curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"ensm\"}" \
  --data-urlencode "start=${START_24H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=3" | jq '.data.result[] | {job: .stream.job, filename: .stream.filename, timestamps: [.values[][0]]}'
