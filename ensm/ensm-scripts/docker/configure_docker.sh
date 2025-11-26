#!/bin/bash
# Docker 설정 스크립트
# ENSM에서 Docker /etc/docker/daemon.json 파일을 수정하는 스크립트

DAEMON_JSON="/etc/docker/daemon.json"
BACKUP_DIR="/etc/docker/backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 백업 디렉토리 생성
mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$DAEMON_JSON")"

# 설정 파일 백업
backup_config() {
    if [ -f "$DAEMON_JSON" ] && [ ! -f "${DAEMON_JSON}.backup.${TIMESTAMP}" ]; then
        cp "$DAEMON_JSON" "${DAEMON_JSON}.backup.${TIMESTAMP}" 2>/dev/null || true
        echo "✅ 설정 파일이 백업되었습니다: ${DAEMON_JSON}.backup.${TIMESTAMP}"
    fi
}

# JSON 파일 읽기
read_json() {
    if [ -f "$DAEMON_JSON" ]; then
        cat "$DAEMON_JSON"
    else
        echo "{}"
    fi
}

# JSON 파일 쓰기
write_json() {
    local json="$1"
    backup_config
    echo "$json" > "$DAEMON_JSON"
    echo "✅ Docker 설정이 업데이트되었습니다."
}

# Data root 설정
set_data_root() {
    local root="$1"
    if [ -z "$root" ]; then
        echo "❌ 데이터 루트 경로가 지정되지 않았습니다."
        exit 1
    fi
    
    local json=$(read_json | jq ". + {\"data-root\": \"${root}\"}")
    write_json "$json"
}

# Log driver 설정
set_log_driver() {
    local driver="$1"
    if [ -z "$driver" ]; then
        echo "❌ 로그 드라이버가 지정되지 않았습니다."
        exit 1
    fi
    
    local json=$(read_json | jq ". + {\"log-driver\": \"${driver}\"}")
    write_json "$json"
}

# Log options 설정
set_log_opts() {
    local max_size="$1"
    local max_file="$2"
    
    local json=$(read_json)
    if [ -n "$max_size" ] && [ -n "$max_file" ]; then
        json=$(echo "$json" | jq ". + {\"log-opts\": {\"max-size\": \"${max_size}\", \"max-file\": \"${max_file}\"}}")
    elif [ -n "$max_size" ]; then
        json=$(echo "$json" | jq ". + {\"log-opts\": {\"max-size\": \"${max_size}\"}}")
    elif [ -n "$max_file" ]; then
        json=$(echo "$json" | jq ". + {\"log-opts\": {\"max-file\": \"${max_file}\"}}")
    fi
    write_json "$json"
}

# Storage driver 설정
set_storage_driver() {
    local driver="$1"
    if [ -z "$driver" ]; then
        echo "❌ 스토리지 드라이버가 지정되지 않았습니다."
        exit 1
    fi
    
    local json=$(read_json | jq ". + {\"storage-driver\": \"${driver}\"}")
    write_json "$json"
}

# DNS 설정
set_dns() {
    local dns="$1"
    if [ -z "$dns" ]; then
        echo "❌ DNS 서버가 지정되지 않았습니다."
        exit 1
    fi
    
    local json=$(read_json | jq ". + {\"dns\": [\"${dns}\"]}")
    write_json "$json"
}

# Default address pool 설정
set_default_address_pool() {
    local pool="$1"
    if [ -z "$pool" ]; then
        # 빈 값이면 제거
        local json=$(read_json | jq "del(.\"default-address-pools\")")
        write_json "$json"
    else
        local base=$(echo "$pool" | cut -d'/' -f1)
        local size=$(echo "$pool" | cut -d'/' -f2)
        local json=$(read_json | jq ". + {\"default-address-pools\": [{\"base\": \"${base}\", \"size\": ${size}}]}")
        write_json "$json"
    fi
}

# Live restore 설정
set_live_restore() {
    local value="$1"
    local bool_value="false"
    if [ "$value" = "true" ] || [ "$value" = "1" ] || [ "$value" = "yes" ] || [ "$value" = "YES" ]; then
        bool_value="true"
    fi
    
    local json=$(read_json | jq ". + {\"live-restore\": ${bool_value}}")
    write_json "$json"
}

# Userland proxy 설정
set_userland_proxy() {
    local value="$1"
    local bool_value="false"
    if [ "$value" = "true" ] || [ "$value" = "1" ] || [ "$value" = "yes" ] || [ "$value" = "YES" ]; then
        bool_value="true"
    fi
    
    local json=$(read_json | jq ". + {\"userland-proxy\": ${bool_value}}")
    write_json "$json"
}

# IPv6 설정
set_ipv6() {
    local value="$1"
    local bool_value="false"
    if [ "$value" = "true" ] || [ "$value" = "1" ] || [ "$value" = "yes" ] || [ "$value" = "YES" ]; then
        bool_value="true"
    fi
    
    local json=$(read_json | jq ". + {\"ipv6\": ${bool_value}}")
    write_json "$json"
}

# 설정 적용 (Docker 서비스 재시작)
apply() {
    echo "🔍 Docker 설정 파일 검증 중..."
    if docker info >/dev/null 2>&1; then
        echo "✅ Docker 설정 파일 검증 성공"
        echo "🔄 Docker 서비스 재시작 중..."
        if systemctl restart docker 2>&1; then
            echo "✅ Docker 서비스가 성공적으로 재시작되었습니다."
        else
            echo "❌ Docker 서비스 재시작 실패"
            exit 1
        fi
    else
        echo "⚠️ Docker 데몬이 실행 중이 아닙니다. 설정은 저장되었지만 서비스를 재시작할 수 없습니다."
    fi
}

# 모든 설정 읽기 (JSON 형식)
get_all() {
    if [ -f "$DAEMON_JSON" ]; then
        cat "$DAEMON_JSON" | jq -c .
    else
        echo "{}"
    fi
}

# 메인 로직
case "$1" in
    set_data_root)
        set_data_root "$2"
        ;;
    set_log_driver)
        set_log_driver "$2"
        ;;
    set_log_opts)
        set_log_opts "$2" "$3"
        ;;
    set_storage_driver)
        set_storage_driver "$2"
        ;;
    set_dns)
        set_dns "$2"
        ;;
    set_default_address_pool)
        set_default_address_pool "$2"
        ;;
    set_live_restore)
        set_live_restore "$2"
        ;;
    set_userland_proxy)
        set_userland_proxy "$2"
        ;;
    set_ipv6)
        set_ipv6 "$2"
        ;;
    apply)
        apply
        ;;
    get_all)
        get_all
        ;;
    *)
        echo "사용법: $0 {set_data_root|set_log_driver|set_log_opts|set_storage_driver|set_dns|set_default_address_pool|set_live_restore|set_userland_proxy|set_ipv6|apply|get_all} [값]"
        exit 1
        ;;
esac

