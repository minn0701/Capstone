#!/bin/bash
# Plex 설정 스크립트
# ENSM에서 Plex 설정을 관리하는 스크립트

apply() {
    echo "🔄 Plex Media Server 서비스 재시작 중..."
    if systemctl restart plexmediaserver 2>&1; then
        echo "✅ Plex Media Server 서비스가 성공적으로 재시작되었습니다."
    else
        echo "❌ Plex Media Server 서비스 재시작 실패"
        exit 1
    fi
}

get_all() {
    echo "{"
    echo "  \"port\": \"32400\","
    echo "  \"dataDir\": \"/var/lib/plexmediaserver\","
    echo "  \"allowedNetworks\": \"192.168.0.0/16\","
    echo "  \"enableRemoteAccess\": true"
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

