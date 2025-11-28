#!/bin/bash
# 로그 출력 위치 확인

echo "=== 1. journald에 있는 ENSM 로그 확인 ==="
echo "최근 ENSM main 서비스 로그 (journald):"
journalctl -u ensm-main.service -n 20 --no-pager | tail -10

echo -e "\n=== 2. 실제 로그 파일 vs journald 비교 ==="
echo "로그 파일의 마지막 수정 시간:"
stat -c %y /var/log/ensm/main/main-app.log

echo -e "\njournald의 최근 로그 시간:"
journalctl -u ensm-main.service -n 1 --no-pager | head -1 | awk '{print $1, $2, $3}'

echo -e "\n=== 3. API 호출 후 journald 로그 확인 ==="
echo "API 호출 전 journald 로그 개수:"
BEFORE_COUNT=$(journalctl -u ensm-main.service --since "1 minute ago" --no-pager | grep -c "^" || echo 0)
echo "  $BEFORE_COUNT 줄"

echo "API 호출 중..."
curl -s http://localhost:55557/main/api/packages > /dev/null
sleep 2

AFTER_COUNT=$(journalctl -u ensm-main.service --since "1 minute ago" --no-pager | grep -c "^" || echo 0)
echo "API 호출 후 journald 로그 개수:"
echo "  $AFTER_COUNT 줄"

if [ "$AFTER_COUNT" -gt "$BEFORE_COUNT" ]; then
    echo "  ✅ journald에 새 로그가 추가되었습니다!"
    echo -e "\n  최근 journald 로그:"
    journalctl -u ensm-main.service -n 5 --no-pager | tail -3
else
    echo "  ⚠️ journald에도 새 로그가 없습니다."
fi

echo -e "\n=== 4. 로그 파일 경로 설정 확인 ==="
echo "환경 변수:"
systemctl show ensm-main.service | grep LOG_PATH

echo -e "\n실제 로그 파일 존재 여부:"
ls -la /var/log/ensm/main/main-app.log 2>/dev/null && echo "  ✅ 파일 존재" || echo "  ❌ 파일 없음"

echo -e "\n=== 5. 로그 파일 내용 vs journald 내용 비교 ==="
echo "로그 파일의 마지막 3줄:"
tail -3 /var/log/ensm/main/main-app.log 2>/dev/null || echo "파일 읽기 실패"

echo -e "\njournald의 최근 3줄:"
journalctl -u ensm-main.service -n 3 --no-pager | tail -3
