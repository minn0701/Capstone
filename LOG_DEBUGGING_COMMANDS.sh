#!/bin/bash
# 로그 관련 문제 진단 스크립트

echo "=========================================="
echo "로그 시스템 진단 스크립트"
echo "=========================================="
echo ""

echo "1. 서비스 상태 확인"
echo "------------------------------------------"
systemctl status promtail.service --no-pager -l | head -15
echo ""
systemctl status loki.service --no-pager -l | head -15
echo ""
systemctl status grafana-server.service --no-pager -l | head -15
echo ""

echo "2. 로그 수준 변경 스크립트 확인"
echo "------------------------------------------"
if [ -f /usr/local/bin/ensm-scripts/system/update_loki_config.sh ]; then
    echo "✅ 스크립트 파일 존재: /usr/local/bin/ensm-scripts/system/update_loki_config.sh"
    ls -la /usr/local/bin/ensm-scripts/system/update_loki_config.sh
else
    echo "❌ 스크립트 파일 없음: /usr/local/bin/ensm-scripts/system/update_loki_config.sh"
fi
echo ""

echo "3. 현재 Loki 로그 레벨 확인"
echo "------------------------------------------"
if [ -f /etc/loki/config.yml ]; then
    echo "Loki 설정 파일의 log_level:"
    grep "^log_level:" /etc/loki/config.yml || echo "log_level 설정이 없습니다"
else
    echo "❌ Loki 설정 파일 없음: /etc/loki/config.yml"
fi
echo ""

echo "4. Loki에 저장된 job 라벨 확인"
echo "------------------------------------------"
curl -s "http://localhost:3100/loki/api/v1/label/job/values" | jq '.data'
echo ""

echo "5. ENSM 로그가 실제로 Loki에 있는지 확인 (최근 24시간)"
echo "------------------------------------------"
START_TIME=$(date -d '24 hours ago' +%s)000000000
END_TIME=$(date +%s)000000000
curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"ensm\"}" \
  --data-urlencode "start=${START_TIME}" \
  --data-urlencode "end=${END_TIME}" \
  --data-urlencode "limit=5" | jq '.data.result | length' | xargs -I {} echo "ENSM 로그 스트림 개수: {}"
echo ""

echo "6. 모든 job의 최근 로그 확인"
echo "------------------------------------------"
curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=~\"varlogs|ensm|journald\"}" \
  --data-urlencode "start=${START_TIME}" \
  --data-urlencode "end=${END_TIME}" \
  --data-urlencode "limit=10" | jq '.data.result[] | {job: .stream.job, filename: .stream.filename, unit: .stream.unit, log_count: (.values | length)}'
echo ""

echo "7. ENSM 로그 파일 확인"
echo "------------------------------------------"
if [ -d /var/log/ensm ]; then
    echo "✅ ENSM 로그 디렉토리 존재"
    find /var/log/ensm -name "*.log" -type f -exec ls -lh {} \;
    echo ""
    echo "최근 로그 내용 (마지막 5줄):"
    find /var/log/ensm -name "*.log" -type f -exec tail -5 {} \;
else
    echo "❌ ENSM 로그 디렉토리 없음: /var/log/ensm"
fi
echo ""

echo "8. Promtail이 ENSM 로그를 읽고 있는지 확인"
echo "------------------------------------------"
if [ -f /var/lib/promtail/positions.yaml ]; then
    echo "Promtail positions 파일의 ENSM 로그:"
    grep "ensm" /var/lib/promtail/positions.yaml || echo "ENSM 로그가 positions에 없습니다"
else
    echo "❌ Promtail positions 파일 없음"
fi
echo ""

echo "9. Grafana 대시보드 쿼리 테스트"
echo "------------------------------------------"
echo "대시보드에서 사용하는 쿼리와 동일한 쿼리 테스트:"
curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=~\"varlogs|ensm|journald\"}" \
  --data-urlencode "start=${START_TIME}" \
  --data-urlencode "end=${END_TIME}" \
  --data-urlencode "limit=20" | jq '.data.result | length' | xargs -I {} echo "총 로그 스트림 개수: {}"
echo ""

echo "10. Grafana 데이터소스 연결 확인"
echo "------------------------------------------"
if [ -f /etc/grafana/provisioning/datasources/datasources.yaml ]; then
    echo "Loki 데이터소스 설정:"
    grep -A 5 "name: Loki" /etc/grafana/provisioning/datasources/datasources.yaml
else
    echo "❌ Grafana 데이터소스 설정 파일 없음"
fi
echo ""

echo "=========================================="
echo "진단 완료"
echo "=========================================="
