#!/bin/bash
# 두 가지 문제 해결

echo "=== 1. 스크립트 설치 디렉토리 확인 및 생성 ==="
sudo mkdir -p /usr/local/bin/ensm-scripts/system
ls -la /usr/local/bin/ensm-scripts/system/ | head -5

echo -e "\n=== 2. 스크립트 설치 ==="
sudo tee /usr/local/bin/ensm-scripts/system/update_loki_config.sh > /dev/null <<'EOF'
#!/bin/bash
LOG_LEVEL="$1"
[ -z "$LOG_LEVEL" ] && { echo "오류: 로그 레벨이 지정되지 않았습니다."; exit 1; }
case "$LOG_LEVEL" in
    debug|info|warn|error) ;;
    *) echo "오류: 유효하지 않은 로그 레벨입니다."; exit 1 ;;
esac
LOKI_CONFIG="/etc/loki/config.yml"
[ ! -f "$LOKI_CONFIG" ] && { echo "오류: Loki 설정 파일을 찾을 수 없습니다."; exit 1; }
BACKUP="${LOKI_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$LOKI_CONFIG" "$BACKUP" || { echo "오류: 백업 실패"; exit 1; }
if grep -q "^  log_level:" "$LOKI_CONFIG"; then
    sed -i "s/^  log_level:.*/  log_level: $LOG_LEVEL/" "$LOKI_CONFIG"
elif grep -q "^log_level:" "$LOKI_CONFIG"; then
    sed -i "s/^log_level:.*/  log_level: $LOG_LEVEL/" "$LOKI_CONFIG"
else
    sed -i "/^server:/a\\  log_level: $LOG_LEVEL" "$LOKI_CONFIG"
fi
grep -q "log_level: $LOG_LEVEL" "$LOKI_CONFIG" || { echo "오류: 업데이트 실패"; cp "$BACKUP" "$LOKI_CONFIG"; exit 1; }
if systemctl is-active --quiet loki.service 2>/dev/null; then
    systemctl restart loki.service && echo "✅ Loki 설정이 업데이트되었습니다. (로그 레벨: $LOG_LEVEL)" || exit 1
fi
EOF

sudo chmod +x /usr/local/bin/ensm-scripts/system/update_loki_config.sh
echo "✅ 스크립트 설치 완료"
ls -la /usr/local/bin/ensm-scripts/system/update_loki_config.sh

echo -e "\n=== 3. 로그 생성 문제 진단 ==="
echo "3-1. ENSM 서비스 상태:"
systemctl is-active ensm-main.service ensm-auth.service

echo -e "\n3-2. 로그 파일 권한 확인:"
ls -la /var/log/ensm/*/*.log

echo -e "\n3-3. 로그 파일이 실제로 쓰기 가능한지 확인:"
echo "현재 시간 추가 테스트..."
echo "$(date): 테스트 로그" | sudo tee -a /var/log/ensm/main/main-app.log > /dev/null
sleep 1
tail -1 /var/log/ensm/main/main-app.log

echo -e "\n3-4. ENSM 애플리케이션 로깅 설정 확인:"
echo "application.properties 확인:"
grep -i "logging" /opt/ensm/ensm-main.jar 2>/dev/null || echo "JAR 파일에서 직접 확인 불가"

echo -e "\n3-5. 로그 파일에 실제로 쓰여지는지 모니터링 (10초):"
BEFORE_SIZE=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
echo "시작 크기: $BEFORE_SIZE bytes"
echo "웹 브라우저에서 ENSM 페이지를 새로고침하거나 API를 호출해보세요..."
sleep 10
AFTER_SIZE=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
echo "10초 후 크기: $AFTER_SIZE bytes"

if [ "$AFTER_SIZE" -gt "$BEFORE_SIZE" ]; then
    echo "✅ 로그가 증가했습니다! (+$((AFTER_SIZE - BEFORE_SIZE)) bytes)"
    echo "새로 추가된 로그:"
    tail -$(echo "($AFTER_SIZE - $BEFORE_SIZE) / 100 + 1" | bc) /var/log/ensm/main/main-app.log | head -5
else
    echo "❌ 로그가 증가하지 않았습니다."
    echo "가능한 원인:"
    echo "  - 애플리케이션이 로그를 파일에 쓰지 않음"
    echo "  - 로그 레벨이 너무 높음"
    echo "  - 로그 파일 경로 설정 문제"
fi
