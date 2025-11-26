#!/bin/bash
# Jellyfin 설정 스크립트
# ENSM에서 Jellyfin 설정을 관리하는 스크립트

CONFIG_DIR="/var/lib/jellyfin/config"
SYSTEMD_FILE="/etc/systemd/system/jellyfin.service"
BACKUP_DIR="/var/lib/jellyfin/backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# 설정 적용 (Jellyfin 서비스 재시작)
apply() {
    echo "🔄 Jellyfin 서비스 재시작 중..."
    if systemctl restart jellyfin 2>&1; then
        echo "✅ Jellyfin 서비스가 성공적으로 재시작되었습니다."
    else
        echo "❌ Jellyfin 서비스 재시작 실패"
        exit 1
    fi
}

# 모든 설정 읽기 (JSON 형식) - 기본값 반환
get_all() {
    echo "{"
    echo "  \"port\": \"8096\","
    echo "  \"dataDir\": \"/var/lib/jellyfin\","
    echo "  \"cacheDir\": \"/var/cache/jellyfin\","
    echo "  \"logDir\": \"/var/log/jellyfin\","
    echo "  \"enableHttps\": false,"
    echo "  \"httpsPort\": \"8920\""
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

