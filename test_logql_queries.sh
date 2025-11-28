#!/bin/bash
# LogQL 쿼리 문법 테스트

START=$(date -d '24 hours ago' +%s)000000000
END=$(date +%s)000000000

echo "=== LogQL 쿼리 문법 테스트 ==="
echo ""

echo "1. 정규식 쿼리 (기존):"
RESULT1=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=~\"varlogs|ensm|journald\"}" \
  --data-urlencode "start=${START}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=10")
COUNT1=$(echo "$RESULT1" | jq '.data.result | length' 2>/dev/null || echo "에러")
echo "  결과: $COUNT1 개"
echo "  job 분포:"
echo "$RESULT1" | jq -r '.data.result[] | .stream.job' 2>/dev/null | sort | uniq -c || echo "  파싱 실패"

echo -e "\n2. OR 연산자 (괄호 포함):"
RESULT2=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query=({job=\"ensm\"} or {job=\"varlogs\"}) or {job=\"journald\"}" \
  --data-urlencode "start=${START}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=10")
COUNT2=$(echo "$RESULT2" | jq '.data.result | length' 2>/dev/null || echo "에러")
echo "  결과: $COUNT2 개"

echo -e "\n3. 각 job을 개별 쿼리로 합치기 (Grafana에서 여러 target 사용):"
echo "  이 방법은 Grafana 대시보드에서 여러 target을 추가하는 방식입니다."
echo "  각 target:"
echo "    - {job=\"ensm\"}"
echo "    - {job=\"varlogs\"}"
echo "    - {job=\"journald\"}"

echo -e "\n4. 정규식 쿼리 (다른 형식):"
RESULT4=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=~\"^(ensm|varlogs|journald)$\"}" \
  --data-urlencode "start=${START}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=10")
COUNT4=$(echo "$RESULT4" | jq '.data.result | length' 2>/dev/null || echo "에러")
echo "  결과: $COUNT4 개"
echo "  job 분포:"
echo "$RESULT4" | jq -r '.data.result[] | .stream.job' 2>/dev/null | sort | uniq -c || echo "  파싱 실패"

echo -e "\n5. 각 job 개별 확인:"
for job in ensm varlogs journald; do
    COUNT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
      --data-urlencode "query={job=\"$job\"}" \
      --data-urlencode "start=${START}" \
      --data-urlencode "end=${END}" \
      --data-urlencode "limit=1" | jq '.data.result | length' 2>/dev/null || echo 0)
    echo "  $job: $COUNT 개"
done
