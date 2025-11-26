#!/bin/bash
# BIND DNS 서버 설정 스크립트
# ENSM에서 BIND named.conf 파일을 수정하는 스크립트

CONFIG_FILE="/etc/named.conf"
BACKUP_DIR="/etc/named/backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 백업 디렉토리 생성
mkdir -p "$BACKUP_DIR"

# 설정 파일 백업
backup_config() {
    if [ ! -f "${CONFIG_FILE}.backup.${TIMESTAMP}" ]; then
        cp "$CONFIG_FILE" "${CONFIG_FILE}.backup.${TIMESTAMP}" 2>/dev/null || true
        echo "✅ 설정 파일이 백업되었습니다: ${CONFIG_FILE}.backup.${TIMESTAMP}"
    fi
}

# options 블록 내 설정 변경
set_option_value() {
    local key="$1"
    local value="$2"
    
    backup_config
    
    # options 블록 내에서 설정 찾기 및 변경
    if grep -q "options[[:space:]]*{" "$CONFIG_FILE"; then
        # options 블록 내에서 해당 키 찾기
        if sed -n '/options[[:space:]]*{/,/};/p' "$CONFIG_FILE" | grep -q "[[:space:]]*${key}[[:space:]]"; then
            # 기존 설정 변경
            sed -i "/options[[:space:]]*{/,/};/s|^[[:space:]]*#*[[:space:]]*${key}[[:space:]].*|        ${key} ${value};|" "$CONFIG_FILE"
            echo "✅ options 블록 내 ${key} 설정이 ${value}로 변경되었습니다."
        else
            # options 블록 내에 설정 추가 (}; 바로 앞에)
            sed -i '/options[[:space:]]*{/,/};/s/};/        '"${key}"' '"${value}"';\n    };/' "$CONFIG_FILE"
            echo "✅ options 블록 내 ${key} ${value} 설정이 추가되었습니다."
        fi
    else
        echo "❌ options 블록을 찾을 수 없습니다."
        exit 1
    fi
}

# listen-on 설정
set_listen_on() {
    local value="$1"
    if [ -z "$value" ]; then
        echo "❌ listen-on 값이 지정되지 않았습니다."
        exit 1
    fi
    set_option_value "listen-on port 53" "{ ${value}; }"
}

# listen-on-v6 설정
set_listen_on_v6() {
    local value="$1"
    if [ -z "$value" ]; then
        echo "❌ listen-on-v6 값이 지정되지 않았습니다."
        exit 1
    fi
    set_option_value "listen-on-v6 port 53" "{ ${value}; }"
}

# forward 설정
set_forward() {
    local value="$1"
    if [ -z "$value" ]; then
        echo "❌ forward 값이 지정되지 않았습니다."
        exit 1
    fi
    set_option_value "forward" "${value};"
}

# forwarders 설정
set_forwarders() {
    local value="$1"
    if [ -z "$value" ]; then
        echo "❌ forwarders 값이 지정되지 않았습니다."
        exit 1
    fi
    # 세미콜론이 없으면 추가
    if [[ ! "$value" =~ \;$ ]]; then
        value="${value};"
    fi
    set_option_value "forwarders" "{ ${value} }"
}

# allow-query 설정
set_allow_query() {
    local value="$1"
    if [ -z "$value" ]; then
        echo "❌ allow-query 값이 지정되지 않았습니다."
        exit 1
    fi
    set_option_value "allow-query" "{ ${value}; }"
}

# allow-transfer 설정
set_allow_transfer() {
    local value="$1"
    if [ -z "$value" ]; then
        echo "❌ allow-transfer 값이 지정되지 않았습니다."
        exit 1
    fi
    set_option_value "allow-transfer" "{ ${value}; }"
}

# acl 설정
set_acl() {
    local value="$1"
    if [ -z "$value" ]; then
        echo "❌ acl 값이 지정되지 않았습니다."
        exit 1
    fi
    backup_config
    
    # acl은 options 블록 밖에 정의됨
    if grep -q "^[[:space:]]*acl[[:space:]]" "$CONFIG_FILE"; then
        # 기존 acl이 있으면 주석 처리하고 새로 추가
        sed -i "s|^[[:space:]]*acl[[:space:]].*|${value};|" "$CONFIG_FILE"
        echo "✅ acl 설정이 변경되었습니다."
    else
        # options 블록 앞에 추가
        sed -i '/options[[:space:]]*{/i '"${value}"';' "$CONFIG_FILE"
        echo "✅ acl 설정이 추가되었습니다."
    fi
}

# zone 설정
set_zone() {
    local domain="$1"
    local type="$2"
    local file="$3"
    
    if [ -z "$domain" ] || [ -z "$type" ] || [ -z "$file" ]; then
        echo "❌ zone 설정에 필요한 모든 값이 지정되지 않았습니다."
        exit 1
    fi
    
    backup_config
    
    # zone 블록 생성
    local zone_block="zone \"${domain}\" IN {
    type ${type};
    file \"${file}\";
};"
    
    # 기존 zone이 있으면 제거하고 새로 추가
    if grep -q "zone[[:space:]]*\"${domain}\"" "$CONFIG_FILE"; then
        # 기존 zone 블록 제거
        sed -i "/zone[[:space:]]*\"${domain}\"/,/};/d" "$CONFIG_FILE"
    fi
    
    # zone 블록 추가 (options 블록 뒤에)
    sed -i '/^};$/a \
'"${zone_block}" "$CONFIG_FILE"
    
    echo "✅ zone \"${domain}\" 설정이 추가되었습니다."
}

# 설정 적용 (설정 검증 및 BIND 재시작)
apply() {
    echo "🔍 BIND 설정 파일 검증 중..."
    if named-checkconf 2>&1; then
        echo "✅ 설정 파일 검증 성공"
        echo "🔄 BIND 서비스 재시작 중..."
        if systemctl restart named 2>&1; then
            echo "✅ BIND 서비스가 성공적으로 재시작되었습니다."
        else
            echo "❌ BIND 서비스 재시작 실패"
            exit 1
        fi
    else
        echo "❌ 설정 파일 검증 실패. 변경사항이 적용되지 않았습니다."
        exit 1
    fi
}

# 설정 값 읽기 함수
get_option_value() {
    local key="$1"
    # 설정 파일이 존재하는지 확인
    if [ ! -f "$CONFIG_FILE" ]; then
        echo ""
        return
    fi
    # options 블록 내에서 주석 처리되지 않은 값 추출
    sed -n '/options[[:space:]]*{/,/};/p' "$CONFIG_FILE" 2>/dev/null | grep "^[[:space:]]*${key}[[:space:]]" | head -1 | sed "s/^[[:space:]]*${key}[[:space:]]*//" | sed 's/;$//' | sed 's/^{[[:space:]]*//' | sed 's/[[:space:]]*}.*$//' | tr -d '\n'
}

# listen-on 읽기
get_listen_on() {
    local value=$(get_option_value "listen-on port 53")
    if [ -n "$value" ]; then
        echo "$value" | sed 's/{[[:space:]]*//' | sed 's/[[:space:]]*}//' | sed 's/;//'
    else
        echo ""
    fi
}

# listen-on-v6 읽기
get_listen_on_v6() {
    local value=$(get_option_value "listen-on-v6 port 53")
    if [ -n "$value" ]; then
        echo "$value" | sed 's/{[[:space:]]*//' | sed 's/[[:space:]]*}//' | sed 's/;//'
    else
        echo ""
    fi
}

# forward 읽기
get_forward() {
    local value=$(get_option_value "forward")
    if [ -n "$value" ]; then
        echo "$value" | sed 's/;//'
    else
        echo ""
    fi
}

# forwarders 읽기
get_forwarders() {
    local value=$(get_option_value "forwarders")
    if [ -n "$value" ]; then
        echo "$value" | sed 's/{[[:space:]]*//' | sed 's/[[:space:]]*}//' | sed 's/;//'
    else
        echo ""
    fi
}

# allow-query 읽기
get_allow_query() {
    local value=$(get_option_value "allow-query")
    if [ -n "$value" ]; then
        echo "$value" | sed 's/{[[:space:]]*//' | sed 's/[[:space:]]*}//' | sed 's/;//'
    else
        echo ""
    fi
}

# allow-transfer 읽기
get_allow_transfer() {
    local value=$(get_option_value "allow-transfer")
    if [ -n "$value" ]; then
        echo "$value" | sed 's/{[[:space:]]*//' | sed 's/[[:space:]]*}//' | sed 's/;//'
    else
        echo ""
    fi
}

# acl 읽기 (간단한 형태만)
get_acl() {
    # 설정 파일이 존재하는지 확인
    if [ ! -f "$CONFIG_FILE" ]; then
        echo ""
        return
    fi
    # acl은 복잡하므로 간단히 첫 번째 acl 블록만 반환
    sed -n '/^[[:space:]]*acl[[:space:]]/,/};/p' "$CONFIG_FILE" 2>/dev/null | head -5 | tr '\n' ' ' | sed 's/[[:space:]]*$//'
}

# 모든 설정 읽기 (JSON 형식)
get_all() {
    echo "{"
    echo "  \"listenOn\": \"$(get_listen_on)\","
    echo "  \"listenOnV6\": \"$(get_listen_on_v6)\","
    echo "  \"forward\": \"$(get_forward)\","
    echo "  \"forwarders\": \"$(get_forwarders)\","
    echo "  \"allowQuery\": \"$(get_allow_query)\","
    echo "  \"allowTransfer\": \"$(get_allow_transfer)\","
    echo "  \"acl\": \"$(get_acl)\""
    echo "}"
}

# 메인 로직
case "$1" in
    set_listen_on)
        set_listen_on "$2"
        ;;
    set_listen_on_v6)
        set_listen_on_v6 "$2"
        ;;
    set_forward)
        set_forward "$2"
        ;;
    set_forwarders)
        set_forwarders "$2"
        ;;
    set_allow_query)
        set_allow_query "$2"
        ;;
    set_allow_transfer)
        set_allow_transfer "$2"
        ;;
    set_acl)
        set_acl "$2"
        ;;
    set_zone)
        set_zone "$2" "$3" "$4"
        ;;
    apply)
        apply
        ;;
    get_listen_on)
        get_listen_on
        ;;
    get_listen_on_v6)
        get_listen_on_v6
        ;;
    get_forward)
        get_forward
        ;;
    get_forwarders)
        get_forwarders
        ;;
    get_allow_query)
        get_allow_query
        ;;
    get_allow_transfer)
        get_allow_transfer
        ;;
    get_acl)
        get_acl
        ;;
    get_all)
        get_all
        ;;
    *)
        echo "사용법: $0 {set_listen_on|set_listen_on_v6|set_forward|set_forwarders|set_allow_query|set_allow_transfer|set_acl|set_zone|apply|get_listen_on|get_listen_on_v6|get_forward|get_forwarders|get_allow_query|get_allow_transfer|get_acl|get_all} [값...]"
        exit 1
        ;;
esac

exit 0

