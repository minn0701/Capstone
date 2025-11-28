#!/bin/bash
# VM snapshot 환경에서 로그 실제 상태 확인

echo "=== 1. 시스템 시간 확인 ==="
echo "현재 시간: $(date)"
echo "UTC 시간: $(date -u)"
echo "부팅 시간: $(uptime -s)"
echo ""

echo "=== 2. 로그 파일 실제 상태 ==="
echo "auth-app.log:"
if [ -f /var/log/ensm/auth/auth-app.log ]; then
    ls -lh /var/log/ensm/auth/auth-app.log
    echo "  최근 수정: $(stat -c %y /var/log/ensm/auth/auth-app.log)"
    echo "  최근 로그:"
    tail -2 /var/log/ensm/auth/auth-app.log | head -2
else
    echo "  ❌ 파일 없음"
fi

echo ""
echo "main-app.log:"
if [ -f /var/log/ensm/main/main-app.log ]; then
    ls -lh /var/log/ensm/main/main-app.log
    echo "  최근 수정: $(stat -c %y /var/log/ensm/main/main-app.log)"
    echo "  최근 로그:"
    tail -2 /var/log/ensm/main/main-app.log | head -2
else
    echo "  ❌ 파일 없음"
fi

echo -e "\n=== 3. 로그가 실제로 생성되고 있는지 확인 (30초 모니터링) ==="
BEFORE_AUTH=$(stat -c %s /var/log/ensm/auth/auth-app.log 2>/dev/null || echo 0)
BEFORE_MAIN=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
echo "시작 크기: auth=$BEFORE_AUTH bytes, main=$BEFORE_MAIN bytes"
echo "30초 대기 중... (웹 UI에 접속하거나 API 호출 해보세요)"
sleep 30
AFTER_AUTH=$(stat -c %s /var/log/ensm/auth/auth-app.log 2>/dev/null || echo 0)
AFTER_MAIN=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
echo "30초 후 크기: auth=$AFTER_AUTH bytes, main=$AFTER_MAIN bytes"

if [ "$AFTER_MAIN" -gt "$BEFORE_MAIN" ]; then
    echo "✅ main-app.log가 증가했습니다! (새로운 로그 생성 중)"
    DIFF=$((AFTER_MAIN - BEFORE_MAIN))
    echo "   증가량: $DIFF bytes"
else
    echo "⚠️ main-app.log가 증가하지 않았습니다. (새로운 로그 없음)"
fi

if [ "$AFTER_AUTH" -gt "$BEFORE_AUTH" ]; then
    echo "✅ auth-app.log가 증가했습니다!"
else
    echo "⚠️ auth-app.log가 증가하지 않았습니다."
fi

echo -e "\n=== 4. Loki에 저장된 로그 타임스탬프 상세 분석 ==="
END=$(date +%s)000000000
START_24H=$(date -d '24 hours ago' +%s)000000000

ENSM_RESULT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"ensm\"}" \
  --data-urlencode "start=${START_24H}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=1")

if [ -n "$(echo "$ENSM_RESULT" | jq -r '.data.result[0]' 2>/dev/null)" ]; then
    TIMESTAMP=$(echo "$ENSM_RESULT" | jq -r '.data.result[0].values[-1][0]' 2>/dev/null)
    LOG_CONTENT=$(echo "$ENSM_RESULT" | jq -r '.data.result[0].values[-1][1]' 2>/dev/null | head -c 100)
    
    if [ -n "$TIMESTAMP" ] && [ "$TIMESTAMP" != "null" ]; then
        SEC=$(echo "$TIMESTAMP" | cut -c1-10)
        LOG_TIME=$(date -d @$SEC)
        NOW_TIME=$(date)
        
        echo "Loki에 저장된 마지막 ENSM 로그:"
        echo "  타임스탬프: $TIMESTAMP"
        echo "  변환된 시간: $LOG_TIME"
        echo "  현재 시간: $NOW_TIME"
        echo "  로그 내용: $LOG_CONTENT..."
        
        # 시간 차이 계산 (초)
        LOG_SEC=$(date -d "$LOG_TIME" +%s 2>/dev/null || echo 0)
        NOW_SEC=$(date +%s)
        DIFF_SEC=$((NOW_SEC - LOG_SEC))
        
        echo ""
        echo "  시간 차이: $DIFF_SEC 초 ($(echo "scale=1; $DIFF_SEC/60" | bc) 분, $(echo "scale=1; $DIFF_SEC/3600" | bc) 시간)"
        
        if [ "$DIFF_SEC" -gt 86400 ]; then
            echo "  ❌ 로그가 24시간보다 오래되었습니다! (retention으로 삭제될 수 있음)"
        elif [ "$DIFF_SEC" -gt 3600 ]; then
            echo "  ⚠️ 로그가 1시간보다 오래되었습니다."
        else
            echo "  ✅ 로그가 최근 것입니다."
        fi
    fi
else
    echo "❌ Loki에 ENSM 로그가 없습니다!"
fi

echo -e "\n=== 5. Loki retention 정책 확인 ==="
RETENTION=$(grep "retention_period" /etc/loki/config.yml | awk '{print $2}' || echo "알 수 없음")
echo "Loki retention 기간: $RETENTION"
if [ "$RETENTION" = "24h" ]; then
    echo "⚠️ 24시간보다 오래된 로그는 자동으로 삭제됩니다!"
fi

echo -e "\n=== 6. 새로운 로그 생성 테스트 ==="
echo "ENSM 서비스에 요청을 보내서 새 로그를 생성해보겠습니다..."
curl -s http://localhost:55557/main/api/packages > /dev/null 2>&1
echo "요청 완료. 5초 후 로그 확인..."
sleep 5

NEW_LOG=$(tail -1 /var/log/ensm/main/main-app.log 2>/dev/null | head -c 150)
echo "새로 생성된 로그: $NEW_LOG"

echo -e "\n=== 7. Promtail이 새 로그를 읽는지 확인 ==="
echo "Promtail이 최근에 읽은 ENSM 로그:"
sudo grep "ensm" /var/lib/promtail/positions.yaml 2>/dev/null | head -2 || echo "확인 불가 (권한 문제)"
