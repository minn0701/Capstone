#!/bin/bash
# Home Assistant 설정 스크립트
# ENSM에서 Home Assistant 설정을 관리하는 스크립트

apply() {
    echo "🔄 Home Assistant 서비스 재시작 중..."
    if systemctl restart home-assistant 2>&1; then
        echo "✅ Home Assistant 서비스가 성공적으로 재시작되었습니다."
    else
        echo "❌ Home Assistant 서비스 재시작 실패"
        exit 1
    fi
}

get_all() {
    echo "{"
    echo "  \"port\": \"8123\","
    echo "  \"configDir\": \"/config\","
    echo "  \"timezone\": \"Asia/Seoul\","
    echo "  \"latitude\": 37.5665,"
    echo "  \"longitude\": 126.9780,"
    echo "  \"elevation\": 0,"
    echo "  \"unitSystem\": \"metric\""
    echo "}"
}

case "$1" in
    apply)
        apply
        ;;
    get_all)
        get_all
        ;;
    *)
        echo "사용법: $0 {apply|get_all}"
        exit 1
        ;;
esac

