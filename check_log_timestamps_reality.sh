#!/bin/bash
# 로그 타임스탬프 실제 확인 (VM snapshot 문제 포함)

echo "=== 1. 시스템 시간 vs 로그 타임스탬프 비교 ==="
echo "현재 시스템 시간: $(date)"
echo "시스템 UTC 시간: $(date -u)"
echo ""

# 타임스탬프 변환 함수
ts_to_date() {
    local ts=$1
    local sec=$(echo "$ts" | cut -c1-10)
    local nsec=$(echo "$ts" | cut -c11-19)
    echo "$(date -d @$sec) (나노초: $nsec)"
}

echo "=== 2. ENSM 로그 파일의 실제 생성/수정 시간 ==="
if [ -f /var/log/ensm/auth/auth-app.log ]; then
    echo "auth-app.log:"
    echo "  생성 시간: $(stat -c %w /var/log/ensm/auth/auth-app.log 2>/dev/null || echo "알 수 없음")"
    echo "  수정 시간: $(stat -c %y /var/log/ensm/auth/auth-app.log)"
    echo "  파일 크기: $(stat -c %s /var/log/ensm/auth/auth-app.log) bytes"
    echo "  최근 로그 라인:"
    tail -1 /var/log/ensm/auth/auth-app.log | head -c 100
    echo ""
fi

if [ -f /var/log/ensm/main/main-app.log ]; then
    echo "main-app.log:"
    echo "  생성 시간: $(stat -c %w /var/log/ensm/main/main-app.log 2>/dev/null || echo "알 수 없음")"
    echo "  수정 시간: $(stat -c %y /var/log/ensm/main/main-app.log)"
    echo "  파일 크기: $(stat -c %s /var/log/ensm/main/main-app.log) bytes"
    echo "  최근 로그 라인:"
    tail -1 /var/log/ensm/main/main-app.log | head -c 100
    echo ""
fi

echo "=== 3. Loki에 저장된 로그의 실제 타임스탬프 변환 ==="
END=$(date +%s)000000000
START_24H=$(date -d '24 hours ago' +%s)000000000

echo "쿼리 시간 범위:"
echo "  시작: $(date -d @$(echo $START_24H | cut -c1-10))"
echo "  종료: $(date -d @$(echo $END | cut -c1-10))"
echo ""

ENSM_RESULT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"ensm\"}" \
  --data-urlencode "start=${START_24H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=5")

echo "ENSM 로그 타임스탬프 (Loki에 저장된):"
ENSM_FIRST=$(echo "$ENSM_RESULT" | jq -r '.data.result[0].values[0][0]' 2>/dev/null)
ENSM_LAST=$(echo "$ENSM_RESULT" | jq -r '.data.result[0].values[-1][0]' 2>/dev/null)

if [ -n "$ENSM_FIRST" ] && [ "$ENSM_FIRST" != "null" ]; then
    FIRST_SEC=$(echo "$ENSM_FIRST" | cut -c1-10)
    echo "  첫 로그: $(date -d @$FIRST_SEC)"
    echo "  타임스탬프: $ENSM_FIRST"
    
    LAST_SEC=$(echo "$ENSM_LAST" | cut -c1-10)
    echo "  마지막 로그: $(date -d @$LAST_SEC)"
    echo "  타임스탬프: $ENSM_LAST"
    
    echo ""
    echo "  시간 범위 확인:"
    QUERY_START_SEC=$(echo $START_24H | cut -c1-10)
    QUERY_END_SEC=$(echo $END | cut -c1-10)
    
    if [ "$FIRST_SEC" -lt "$QUERY_START_SEC" ] || [ "$FIRST_SEC" -gt "$QUERY_END_SEC" ]; then
        echo "  ❌ 첫 로그가 쿼리 시간 범위 밖입니다!"
    else
        echo "  ✅ 첫 로그가 쿼리 시간 범위 안에 있습니다."
    fi
    
    if [ "$LAST_SEC" -lt "$QUERY_START_SEC" ] || [ "$LAST_SEC" -gt "$QUERY_END_SEC" ]; then
        echo "  ❌ 마지막 로그가 쿼리 시간 범위 밖입니다!"
    else
        echo "  ✅ 마지막 로그가 쿼리 시간 범위 안에 있습니다."
    fi
fi

echo -e "\n=== 4. 로그 파일 내용 vs Loki 저장 내용 비교 ==="
echo "실제 로그 파일의 최근 3줄:"
tail -3 /var/log/ensm/main/main-app.log 2>/dev/null | head -3

echo -e "\nLoki에 저장된 최근 3개 로그:"
echo "$ENSM_RESULT" | jq -r '.data.result[0].values[-3:] | .[] | "\(.[0]) | \(.[1][:80])"'

echo -e "\n=== 5. Loki retention 정책 확인 ==="
grep -i retention /etc/loki/config.yml || echo "retention 설정 없음"

echo -e "\n=== 6. 실제로 로그가 계속 생성되고 있는지 확인 ==="
echo "ENSM 서비스 상태:"
systemctl is-active ensm-main.service ensm-auth.service

echo -e "\n최근 10초 동안 로그 파일 변경 확인:"
echo "로그 파일 모니터링 시작 (10초간)..."
BEFORE_SIZE=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
sleep 10
AFTER_SIZE=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
if [ "$AFTER_SIZE" -gt "$BEFORE_SIZE" ]; then
    echo "✅ 로그 파일이 증가했습니다. ($BEFORE_SIZE -> $AFTER_SIZE bytes)"
else
    echo "⚠️ 로그 파일이 증가하지 않았습니다. (현재: $AFTER_SIZE bytes)"
fi

echo -e "\n=== 7. 전체 쿼리 문제 재확인 (시간 범위 확대) ==="
# 48시간 범위로 확대
START_48H=$(date -d '48 hours ago' +%s)000000000
echo "48시간 범위로 확대한 쿼리:"
RESULT_48H=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=~\"varlogs|ensm|journald\"}" \
  --data-urlencode "start=${START_48H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=100")

echo "스트림 개수: $(echo "$RESULT_48H" | jq '.data.result | length')"
echo "job별 분포:"
echo "$RESULT_48H" | jq -r '.data.result[] | .stream.job' | sort | uniq -c
