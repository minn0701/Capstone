#!/bin/bash
# 로그 관련 문제 진단

echo "=== 1. 스크립트 설치 확인 및 수정 ==="
sudo mkdir -p /usr/local/bin/ensm-scripts/system
if [ -f /usr/local/bin/ensm-scripts/system/update_loki_config.sh ]; then
    echo "✅ 스크립트 존재"
else
    echo "스크립트 생성 중..."
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
    echo "✅ 스크립트 생성 완료"
fi

echo -e "\n=== 2. 로그 생성 문제 진단 ==="
echo "2-1. ENSM 서비스 실제 로그 확인 (journald):"
journalctl -u ensm-main.service -n 10 --no-pager | tail -5

echo -e "\n2-2. API 호출 테스트 (응답 확인):"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost:55557/main/api/packages)
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
echo "  HTTP 응답 코드: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ API 응답 정상"
else
    echo "  ❌ API 응답 오류"
fi

echo -e "\n2-3. 로그 파일 실시간 모니터링 (10초):"
BEFORE_SIZE=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
BEFORE_LINES=$(wc -l < /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
echo "  시작: 크기=$BEFORE_SIZE bytes, 줄 수=$BEFORE_LINES"

echo "  API 호출 중..."
curl -s http://localhost:55557/main/api/packages > /dev/null
curl -s http://localhost:55557/main/api/system-info/disk > /dev/null
curl -s http://localhost:55557/main/dashboard > /dev/null

echo "  5초 대기 중..."
sleep 5

AFTER_SIZE=$(stat -c %s /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
AFTER_LINES=$(wc -l < /var/log/ensm/main/main-app.log 2>/dev/null || echo 0)
echo "  5초 후: 크기=$AFTER_SIZE bytes, 줄 수=$AFTER_LINES"

if [ "$AFTER_SIZE" -gt "$BEFORE_SIZE" ] || [ "$AFTER_LINES" -gt "$BEFORE_LINES" ]; then
    echo "  ✅ 로그가 증가했습니다!"
    DIFF=$((AFTER_LINES - BEFORE_LINES))
    echo "  새로 추가된 줄: $DIFF 줄"
    echo "  최근 로그:"
    tail -$((DIFF + 1)) /var/log/ensm/main/main-app.log | head -5
else
    echo "  ❌ 로그가 증가하지 않았습니다."
    echo "  가능한 원인:"
    echo "    1. 로그 레벨이 너무 높음 (INFO 이상만 기록)"
    echo "    2. Spring Boot 로깅이 파일로 출력되지 않음"
    echo "    3. 로그가 journald로만 출력되고 있음"
fi

echo -e "\n=== 3. 로그 출력 위치 확인 ==="
echo "journald에 있는 ENSM 로그 (최근 5개):"
journalctl -u ensm-main.service -n 5 --no-pager | grep -v "^--" | tail -3

echo -e "\n=== 4. 로그 설정 확인 ==="
echo "application.properties의 로깅 설정:"
jar -tf /opt/ensm/ensm-main.jar | grep "application.properties" && {
    unzip -p /opt/ensm/ensm-main.jar BOOT-INF/classes/application.properties 2>/dev/null | grep -i logging || echo "압축 해제 실패"
} || echo "JAR 파일 확인 불가"

echo -e "\n환경 변수 확인:"
systemctl show ensm-main.service | grep -i "log_path\|java_opts"
