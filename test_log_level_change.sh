#!/bin/bash
# 로그 수준 변경 테스트 스크립트

echo "=== 1. 로그 수준 변경 기능 테스트 ==="
echo ""

echo "1-1. 현재 Loki log_level 확인:"
CURRENT_LEVEL=$(grep "log_level" /etc/loki/config.yml | head -1 | awk '{print $2}' || echo "없음")
echo "  현재 설정: $CURRENT_LEVEL"

echo -e "\n1-2. 로그 수준 변경 스크립트 존재 확인:"
if [ -f /usr/local/bin/ensm-scripts/system/update_loki_config.sh ]; then
    echo "  ✅ 스크립트 존재"
    ls -la /usr/local/bin/ensm-scripts/system/update_loki_config.sh
else
    echo "  ❌ 스크립트 없음"
    echo "  수동으로 생성해야 합니다."
    exit 1
fi

echo -e "\n1-3. 스크립트 실행 권한 확인:"
if [ -x /usr/local/bin/ensm-scripts/system/update_loki_config.sh ]; then
    echo "  ✅ 실행 가능"
else
    echo "  ⚠️ 실행 권한 없음"
fi

echo -e "\n1-4. run_script를 통한 실행 테스트:"
echo "  테스트: info 레벨로 변경"
sudo /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/update_loki_config.sh info

echo -e "\n1-5. 변경 확인:"
NEW_LEVEL=$(grep "log_level" /etc/loki/config.yml | head -1 | awk '{print $2}' || echo "없음")
echo "  변경 후 설정: $NEW_LEVEL"

if [ "$NEW_LEVEL" = "info" ]; then
    echo "  ✅ 로그 수준 변경 성공!"
else
    echo "  ❌ 로그 수준 변경 실패 (현재: $NEW_LEVEL)"
fi

echo -e "\n1-6. Loki 서비스 상태 확인:"
systemctl status loki.service --no-pager -l | head -10

echo -e "\n1-7. 원래대로 되돌리기 (error):"
sudo /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/update_loki_config.sh error
FINAL_LEVEL=$(grep "log_level" /etc/loki/config.yml | head -1 | awk '{print $2}' || echo "없음")
echo "  최종 설정: $FINAL_LEVEL"
