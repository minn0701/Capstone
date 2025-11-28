#!/bin/bash
# 로그 시스템 빠른 진단

echo "=== 1. 서비스 상태 ==="
systemctl is-active promtail loki grafana-server

echo -e "\n=== 2. 로그 수준 변경 스크립트 확인 ==="
ls -la /usr/local/bin/ensm-scripts/system/update_loki_config.sh 2>/dev/null || echo "❌ 스크립트 없음"

echo -e "\n=== 3. 현재 Loki log_level ==="
grep "^log_level:" /etc/loki/config.yml 2>/dev/null || echo "설정 없음"

echo -e "\n=== 4. Loki에 저장된 job 확인 ==="
curl -s "http://localhost:3100/loki/api/v1/label/job/values" | jq -r '.data[]'

echo -e "\n=== 5. ENSM 로그가 Loki에 있는지 (최근 24h) ==="
START=$(date -d '24 hours ago' +%s)000000000
END=$(date +%s)000000000
COUNT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"ensm\"}" \
  --data-urlencode "start=${START}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=1" | jq '.data.result | length')
echo "ENSM 로그 스트림: $COUNT 개"

echo -e "\n=== 6. 대시보드 쿼리 테스트 ==="
TOTAL=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=~\"varlogs|ensm|journald\"}" \
  --data-urlencode "start=${START}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=1" | jq '.data.result | length')
echo "전체 로그 스트림: $TOTAL 개"

echo -e "\n=== 7. ENSM 로그 파일 ==="
ls -lh /var/log/ensm/*/*.log 2>/dev/null | head -5

echo -e "\n=== 8. Promtail positions (ENSM) ==="
grep "ensm" /var/lib/promtail/positions.yaml 2>/dev/null | head -3
