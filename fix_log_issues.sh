#!/bin/bash
# 로그 관련 문제 해결 스크립트

set -e

echo "=== 1. 로그 수준 변경 스크립트 설치 ==="
sudo mkdir -p /usr/local/bin/ensm-scripts/system

sudo tee /usr/local/bin/ensm-scripts/system/update_loki_config.sh > /dev/null <<'EOF'
#!/bin/bash
# Loki 설정 파일의 로그 레벨을 업데이트하는 스크립트

LOG_LEVEL="$1"

if [ -z "$LOG_LEVEL" ]; then
    echo "오류: 로그 레벨이 지정되지 않았습니다."
    exit 1
fi

# 유효한 로그 레벨 확인
case "$LOG_LEVEL" in
    debug|info|warn|error)
        ;;
    *)
        echo "오류: 유효하지 않은 로그 레벨입니다. (debug, info, warn, error 중 하나여야 합니다)"
        exit 1
        ;;
esac

LOKI_CONFIG_FILE="/etc/loki/config.yml"

if [ ! -f "$LOKI_CONFIG_FILE" ]; then
    echo "오류: Loki 설정 파일을 찾을 수 없습니다: $LOKI_CONFIG_FILE"
    exit 1
fi

# 기존 설정 파일 백업
BACKUP_FILE="${LOKI_CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$LOKI_CONFIG_FILE" "$BACKUP_FILE" || {
    echo "오류: 설정 파일 백업 실패"
    exit 1
}

# log_level 업데이트 (sed를 사용하여 server 섹션의 log_level 변경)
if grep -q "^  log_level:" "$LOKI_CONFIG_FILE"; then
    # 기존 log_level 줄이 있으면 업데이트 (들여쓰기 포함)
    sed -i "s/^  log_level:.*/  log_level: $LOG_LEVEL/" "$LOKI_CONFIG_FILE"
elif grep -q "^log_level:" "$LOKI_CONFIG_FILE"; then
    # log_level이 있지만 들여쓰기가 없으면 수정
    sed -i "s/^log_level:.*/  log_level: $LOG_LEVEL/" "$LOKI_CONFIG_FILE"
else
    # log_level 줄이 없으면 server 섹션 다음에 추가
    sed -i "/^server:/a\\  log_level: $LOG_LEVEL" "$LOKI_CONFIG_FILE"
fi

# 설정 파일 검증
if ! grep -q "log_level: $LOG_LEVEL" "$LOKI_CONFIG_FILE"; then
    echo "오류: 설정 파일 업데이트 실패"
    # 백업에서 복원
    cp "$BACKUP_FILE" "$LOKI_CONFIG_FILE"
    exit 1
fi

# Loki 서비스 재시작
if systemctl is-active --quiet loki.service 2>/dev/null; then
    echo "Loki 서비스 재시작 중..."
    systemctl restart loki.service
    if [ $? -eq 0 ]; then
        echo "✅ Loki 설정이 업데이트되었고 서비스가 재시작되었습니다. (로그 레벨: $LOG_LEVEL)"
    else
        echo "경고: Loki 서비스 재시작 실패. 설정은 업데이트되었지만 서비스를 수동으로 재시작해야 할 수 있습니다."
        exit 1
    fi
else
    echo "경고: Loki 서비스가 실행 중이 아닙니다. 설정은 업데이트되었지만 서비스를 시작해야 합니다."
fi

exit 0
EOF

sudo chmod +x /usr/local/bin/ensm-scripts/system/update_loki_config.sh
echo "✅ 스크립트 설치 완료"

echo -e "\n=== 2. 현재 Loki 설정 파일 확인 ==="
sudo cat /etc/loki/config.yml | head -10

echo -e "\n=== 3. Loki 설정 파일에 log_level 추가 (없는 경우) ==="
if ! sudo grep -q "log_level:" /etc/loki/config.yml; then
    echo "log_level 설정이 없습니다. 추가합니다..."
    sudo sed -i '/^server:/a\  log_level: error' /etc/loki/config.yml
    echo "✅ log_level 추가 완료"
else
    echo "log_level 설정이 이미 있습니다."
fi

echo -e "\n=== 4. 업데이트된 설정 확인 ==="
sudo grep -A 3 "^server:" /etc/loki/config.yml

echo -e "\n=== 5. 대시보드 로그 표시 문제 진단 ==="
echo "Loki에 저장된 로그 스트림 상세 확인:"
START=$(date -d '24 hours ago' +%s)000000000
END=$(date +%s)000000000

echo -e "\n각 job별 스트림 개수:"
for job in ensm varlogs journald; do
    COUNT=$(curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
      --data-urlencode "query={job=\"$job\"}" \
      --data-urlencode "start=${START}" \
      --data-urlencode "end=${END}" \
      --data-urlencode "limit=1" | jq '.data.result | length')
    echo "  $job: $COUNT 개"
done

echo -e "\n전체 쿼리 결과:"
curl -s -G "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=~\"varlogs|ensm|journald\"}" \
  --data-urlencode "start=${START}" \
  --data-urlencode "end=${END}" \
  --data-urlencode "limit=5" | jq '.data.result[] | {job: .stream.job, filename: .stream.filename, unit: .stream.unit, entries: (.values | length)}'

echo -e "\n=== 완료 ==="
