#!/bin/bash
# 로그 타임스탬프 분석 및 문제 원인 파악

echo "=== 로그 타임스탬프 변환 및 비교 ==="

# 타임스탬프 변환 함수
timestamp_to_date() {
    local ts=$1
    local sec=$(echo "$ts" | cut -c1-10)
    date -d @$sec "+%Y-%m-%d %H:%M:%S %Z"
}

END=$(date +%s)000000000
START_1H=$(date -d '1 hour ago' +%s)000000000
START_24H=$(date -d '24 hours ago' +%s)000000000

echo "현재 시간: $(date)"
echo "쿼리 시작 시간 (1시간): $(timestamp_to_date $START_1H)"
echo "쿼리 시작 시간 (24시간): $(timestamp_to_date $START_24H)"
echo "쿼리 종료 시간: $(timestamp_to_date $END)"
echo ""

echo "=== ENSM 로그 타임스탬프 분석 ==="
ENSM_RESULT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"ensm\"}" \
  --data-urlencode "start=${START_24H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=10")

echo "$ENSM_RESULT" | jq -r '.data.result[] | "스트림: \(.stream.filename)\n로그 개수: \(.values | length)\n첫 로그 시간: \(.values[0][0])\n마지막 로그 시간: \(.values[-1][0])\n---"'

echo -e "\n=== varlogs 로그 타임스탬프 분석 ==="
VARLOGS_RESULT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"varlogs\"}" \
  --data-urlencode "start=${START_24H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=10")

echo "$VARLOGS_RESULT" | jq -r '.data.result[] | "스트림: \(.stream.filename)\n로그 개수: \(.values | length)\n첫 로그 시간: \(.values[0][0])\n마지막 로그 시간: \(.values[-1][0])\n---"'

echo -e "\n=== 전체 쿼리 결과 상세 분석 ==="
ALL_RESULT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=~\"varlogs|ensm|journald\"}" \
  --data-urlencode "start=${START_24H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=100")

echo "전체 쿼리 결과 스트림 개수: $(echo "$ALL_RESULT" | jq '.data.result | length')"
echo ""
echo "각 스트림의 job:"
echo "$ALL_RESULT" | jq -r '.data.result[] | "job: \(.stream.job), filename: \(.stream.filename // "null"), unit: \(.stream.unit // "null"), entries: \(.values | length)"'

echo -e "\n=== 문제 진단: 왜 전체 쿼리에서 ensm과 varlogs가 빠지는가? ==="
echo ""
echo "1. 개별 쿼리로 확인:"
echo -n "  - ensm 개별: "
echo "$ENSM_RESULT" | jq '.data.result | length'
echo -n "  - varlogs 개별: "
echo "$VARLOGS_RESULT" | jq '.data.result | length'
echo -n "  - 전체 쿼리: "
echo "$ALL_RESULT" | jq '.data.result | length'

echo -e "\n2. 시간 범위 확인:"
ENSM_LAST=$(echo "$ENSM_RESULT" | jq -r '.data.result[0].values[-1][0]' 2>/dev/null)
if [ -n "$ENSM_LAST" ] && [ "$ENSM_LAST" != "null" ]; then
    ENSM_LAST_SEC=$(echo "$ENSM_LAST" | cut -c1-10)
    echo "  - ENSM 마지막 로그 시간: $(timestamp_to_date $ENSM_LAST)"
    echo "    쿼리 시작 시간과 비교:"
    echo "    로그: $ENSM_LAST_SEC 초"
    echo "    쿼리 시작: $(echo $START_24H | cut -c1-10) 초"
    if [ "$ENSM_LAST_SEC" -lt "$(echo $START_24H | cut -c1-10)" ]; then
        echo "    ❌ 문제: ENSM 로그가 쿼리 시간 범위 밖입니다!"
    else
        echo "    ✅ 시간 범위 안에 있습니다."
    fi
fi
