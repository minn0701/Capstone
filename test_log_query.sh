#!/bin/bash
# 로그 쿼리 문제 테스트

END=$(date +%s)000000000
START_24H=$(date -d '24 hours ago' +%s)000000000

echo "=== 문제 재현: 전체 쿼리에서 ensm, varlogs가 빠지는지 확인 ==="

# 개별 쿼리
echo -e "\n1. 개별 job 쿼리:"
echo -n "  ensm: "
curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"ensm\"}" \
  --data-urlencode "start=${START_24H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=1" | jq '.data.result | length'

echo -n "  varlogs: "
curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"varlogs\"}" \
  --data-urlencode "start=${START_24H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=1" | jq '.data.result | length'

# 전체 쿼리 - OR 연산자 사용
echo -e "\n2. 전체 쿼리 (OR 연산자):"
RESULT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=~\"varlogs|ensm|journald\"}" \
  --data-urlencode "start=${START_24H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=100")

STREAM_COUNT=$(echo "$RESULT" | jq '.data.result | length')
echo "  스트림 개수: $STREAM_COUNT"

echo -e "\n  각 job별 스트림:"
echo "$RESULT" | jq -r '.data.result[] | "    - job: \(.stream.job), filename: \(.stream.filename // "null"), entries: \(.values | length)"' | sort -u

# 각 job을 개별적으로 OR로 연결
echo -e "\n3. 각 job을 개별 쿼리로 합치기:"
ENSM=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"ensm\"}" \
  --data-urlencode "start=${START_24H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=100" | jq '.data.result | length')

VARLOGS=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"varlogs\"}" \
  --data-urlencode "start=${START_24H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=100" | jq '.data.result | length')

JOURNALD=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"journald\"}" \
  --data-urlencode "start=${START_24H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=100" | jq '.data.result | length')

TOTAL_INDIVIDUAL=$((ENSM + VARLOGS + JOURNALD))
echo "  개별 합계: $TOTAL_INDIVIDUAL (ensm: $ENSM, varlogs: $VARLOGS, journald: $JOURNALD)"
echo "  전체 쿼리: $STREAM_COUNT"
echo "  차이: $((TOTAL_INDIVIDUAL - STREAM_COUNT))"

echo -e "\n=== 해결 방법 테스트: 쿼리 변경 ==="
echo "4. 다른 방식의 쿼리:"
echo -n "  {job=\"ensm\"} or {job=\"varlogs\"} or {job=\"journald\"}: "
curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"ensm\"} or {job=\"varlogs\"} or {job=\"journald\"}" \
  --data-urlencode "start=${START_24H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=1" | jq '.data.result | length'
