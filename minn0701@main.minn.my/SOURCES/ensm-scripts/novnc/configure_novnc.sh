#!/bin/bash
# noVNC 설정 스크립트
# ENSM에서 noVNC 설정을 관리하는 스크립트

apply() {
    echo "🔄 noVNC 서비스 재시작 중..."
    if systemctl restart novnc 2>&1; then
        echo "✅ noVNC 서비스가 성공적으로 재시작되었습니다."
    else
        echo "❌ noVNC 서비스 재시작 실패"
        exit 1
    fi
}

get_all() {
    echo "{"
    echo "  \"port\": \"6080\","
    echo "  \"websocketPort\": \"6081\","
    echo "  \"vncHost\": \"localhost\","
    echo "  \"vncPort\": \"5900\","
    echo "  \"password\": \"\","
    echo "  \"enableSSL\": false"
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

