#!/bin/bash
# Apache 설정 스크립트
# ENSM에서 Apache httpd.conf 파일을 수정하는 스크립트

CONFIG_FILE="/etc/httpd/conf/httpd.conf"
BACKUP_DIR="/etc/httpd/conf/backup"
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

# 설정 값 설정 함수
set_config_value() {
    local key="$1"
    local value="$2"
    
    # 주석 처리된 라인도 포함하여 검색
    if grep -q "^[[:space:]]*#*[[:space:]]*${key}[[:space:]]" "$CONFIG_FILE"; then
        # 기존 설정이 있으면 주석 해제하고 값 변경
        sed -i "s|^[[:space:]]*#*[[:space:]]*${key}[[:space:]].*|${key} ${value}|" "$CONFIG_FILE"
        echo "✅ ${key} 설정이 ${value}로 변경되었습니다."
    else
        # 설정이 없으면 추가 (ServerRoot 다음에 추가)
        if grep -q "^[[:space:]]*ServerRoot" "$CONFIG_FILE"; then
            sed -i "/^[[:space:]]*ServerRoot/a ${key} ${value}" "$CONFIG_FILE"
            echo "✅ ${key} ${value} 설정이 추가되었습니다."
        else
            # ServerRoot가 없으면 파일 끝에 추가
            echo "${key} ${value}" >> "$CONFIG_FILE"
            echo "✅ ${key} ${value} 설정이 추가되었습니다."
        fi
    fi
}

# Port 설정
set_port() {
    local port="$1"
    if [ -z "$port" ]; then
        echo "❌ 포트 번호가 지정되지 않았습니다."
        exit 1
    fi
    backup_config
    set_config_value "Listen" "$port"
}

# ServerName 설정
set_servername() {
    local servername="$1"
    if [ -z "$servername" ]; then
        echo "❌ 서버 이름이 지정되지 않았습니다."
        exit 1
    fi
    backup_config
    set_config_value "ServerName" "$servername"
}

# DocumentRoot 설정
set_docroot() {
    local docroot="$1"
    if [ -z "$docroot" ]; then
        echo "❌ 문서 루트 경로가 지정되지 않았습니다."
        exit 1
    fi
    backup_config
    set_config_value "DocumentRoot" "\"${docroot}\""
}

# User 설정
set_user() {
    local user="$1"
    if [ -z "$user" ]; then
        echo "❌ 사용자가 지정되지 않았습니다."
        exit 1
    fi
    backup_config
    set_config_value "User" "$user"
}

# Group 설정
set_group() {
    local group="$1"
    if [ -z "$group" ]; then
        echo "❌ 그룹이 지정되지 않았습니다."
        exit 1
    fi
    backup_config
    set_config_value "Group" "$group"
}

# 설정 적용 (설정 검증 및 Apache 재시작)
apply() {
    echo "🔍 Apache 설정 파일 검증 중..."
    if httpd -t 2>&1; then
        echo "✅ 설정 파일 검증 성공"
        echo "🔄 Apache 서비스 재시작 중..."
        if systemctl restart httpd 2>&1; then
            echo "✅ Apache 서비스가 성공적으로 재시작되었습니다."
        else
            echo "❌ Apache 서비스 재시작 실패"
            exit 1
        fi
    else
        echo "❌ 설정 파일 검증 실패. 변경사항이 적용되지 않았습니다."
        exit 1
    fi
}

# 설정 값 읽기 함수
get_config_value() {
    local key="$1"
    # 설정 파일이 존재하는지 확인
    if [ ! -f "$CONFIG_FILE" ]; then
        echo ""
        return
    fi
    # 주석 처리되지 않은 라인에서 값 추출
    grep "^[[:space:]]*${key}[[:space:]]" "$CONFIG_FILE" 2>/dev/null | head -1 | sed "s/^[[:space:]]*${key}[[:space:]]*//" | sed 's/^"//' | sed 's/"$//' | tr -d '\n'
}

# Port 읽기
get_port() {
    local port=$(get_config_value "Listen")
    if [ -n "$port" ]; then
        echo "$port"
    else
        echo ""
    fi
}

# ServerName 읽기
get_servername() {
    local servername=$(get_config_value "ServerName")
    if [ -n "$servername" ]; then
        echo "$servername"
    else
        echo ""
    fi
}

# DocumentRoot 읽기
get_docroot() {
    local docroot=$(get_config_value "DocumentRoot")
    if [ -n "$docroot" ]; then
        echo "$docroot" | sed 's/^"//' | sed 's/"$//'
    else
        echo ""
    fi
}

# User 읽기
get_user() {
    local user=$(get_config_value "User")
    if [ -n "$user" ]; then
        echo "$user"
    else
        echo ""
    fi
}

# Group 읽기
get_group() {
    local group=$(get_config_value "Group")
    if [ -n "$group" ]; then
        echo "$group"
    else
        echo ""
    fi
}

# 모든 설정 읽기 (JSON 형식)
get_all() {
    echo "{"
    echo "  \"port\": \"$(get_port)\","
    echo "  \"serverName\": \"$(get_servername)\","
    echo "  \"documentRoot\": \"$(get_docroot)\","
    echo "  \"user\": \"$(get_user)\","
    echo "  \"group\": \"$(get_group)\""
    echo "}"
}

# 메인 로직
case "$1" in
    set_port)
        set_port "$2"
        ;;
    set_servername)
        set_servername "$2"
        ;;
    set_docroot)
        set_docroot "$2"
        ;;
    set_user)
        set_user "$2"
        ;;
    set_group)
        set_group "$2"
        ;;
    apply)
        apply
        ;;
    get_port)
        get_port
        ;;
    get_servername)
        get_servername
        ;;
    get_docroot)
        get_docroot
        ;;
    get_user)
        get_user
        ;;
    get_group)
        get_group
        ;;
    get_all)
        get_all
        ;;
    *)
        echo "사용법: $0 {set_port|set_servername|set_docroot|set_user|set_group|apply|get_port|get_servername|get_docroot|get_user|get_group|get_all} [값]"
        exit 1
        ;;
esac

exit 0

