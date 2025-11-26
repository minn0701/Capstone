#!/bin/bash
# VSFTPD 설정 스크립트
# ENSM에서 VSFTPD /etc/vsftpd/vsftpd.conf 파일을 수정하는 스크립트

CONFIG_FILE="/etc/vsftpd/vsftpd.conf"
BACKUP_DIR="/etc/vsftpd/backup"
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
    
    backup_config
    
    # 주석 처리된 라인도 포함하여 검색
    if grep -q "^[[:space:]]*#*[[:space:]]*${key}[[:space:]]*=" "$CONFIG_FILE"; then
        # 기존 설정이 있으면 주석 해제하고 값 변경
        sed -i "s|^[[:space:]]*#*[[:space:]]*${key}[[:space:]]*=.*|${key}=${value}|" "$CONFIG_FILE"
        echo "✅ ${key} 설정이 ${value}로 변경되었습니다."
    else
        # 설정이 없으면 파일 끝에 추가
        echo "${key}=${value}" >> "$CONFIG_FILE"
        echo "✅ ${key}=${value} 설정이 추가되었습니다."
    fi
}

# Port 설정
set_port() {
    local port="$1"
    if [ -z "$port" ]; then
        echo "❌ 포트 번호가 지정되지 않았습니다."
        exit 1
    fi
    set_config_value "listen_port" "$port"
}

# Local root 설정
set_local_root() {
    local root="$1"
    if [ -z "$root" ]; then
        echo "❌ 로컬 루트 경로가 지정되지 않았습니다."
        exit 1
    fi
    set_config_value "local_root" "$root"
}

# PASV 최소 포트 설정
set_pasv_min_port() {
    local port="$1"
    if [ -z "$port" ]; then
        echo "❌ PASV 최소 포트가 지정되지 않았습니다."
        exit 1
    fi
    set_config_value "pasv_min_port" "$port"
}

# PASV 최대 포트 설정
set_pasv_max_port() {
    local port="$1"
    if [ -z "$port" ]; then
        echo "❌ PASV 최대 포트가 지정되지 않았습니다."
        exit 1
    fi
    set_config_value "pasv_max_port" "$port"
}

# 최대 클라이언트 수 설정
set_max_clients() {
    local max="$1"
    if [ -z "$max" ] || [ "$max" = "0" ]; then
        # 0이면 설정 제거 또는 주석 처리
        sed -i "s|^[[:space:]]*max_clients[[:space:]]*=.*|#max_clients=0|" "$CONFIG_FILE" 2>/dev/null || true
        echo "✅ max_clients 제한이 해제되었습니다."
    else
        set_config_value "max_clients" "$max"
    fi
}

# IP당 최대 연결 수 설정
set_max_per_ip() {
    local max="$1"
    if [ -z "$max" ] || [ "$max" = "0" ]; then
        sed -i "s|^[[:space:]]*max_per_ip[[:space:]]*=.*|#max_per_ip=0|" "$CONFIG_FILE" 2>/dev/null || true
        echo "✅ max_per_ip 제한이 해제되었습니다."
    else
        set_config_value "max_per_ip" "$max"
    fi
}

# 유휴 세션 타임아웃 설정
set_idle_session_timeout() {
    local timeout="$1"
    if [ -z "$timeout" ]; then
        echo "❌ 타임아웃 값이 지정되지 않았습니다."
        exit 1
    fi
    set_config_value "idle_session_timeout" "$timeout"
}

# 데이터 연결 타임아웃 설정
set_data_connection_timeout() {
    local timeout="$1"
    if [ -z "$timeout" ]; then
        echo "❌ 타임아웃 값이 지정되지 않았습니다."
        exit 1
    fi
    set_config_value "data_connection_timeout" "$timeout"
}

# Boolean 설정 함수
set_boolean() {
    local key="$1"
    local value="$2"
    
    backup_config
    
    if [ "$value" = "YES" ] || [ "$value" = "yes" ] || [ "$value" = "true" ] || [ "$value" = "1" ]; then
        value="YES"
    else
        value="NO"
    fi
    
    if grep -q "^[[:space:]]*#*[[:space:]]*${key}[[:space:]]*=" "$CONFIG_FILE"; then
        sed -i "s|^[[:space:]]*#*[[:space:]]*${key}[[:space:]]*=.*|${key}=${value}|" "$CONFIG_FILE"
        echo "✅ ${key} 설정이 ${value}로 변경되었습니다."
    else
        echo "${key}=${value}" >> "$CONFIG_FILE"
        echo "✅ ${key}=${value} 설정이 추가되었습니다."
    fi
}

# Anonymous enable 설정
set_anonymous_enable() {
    local value="$1"
    set_boolean "anonymous_enable" "$value"
}

# Local enable 설정
set_local_enable() {
    local value="$1"
    set_boolean "local_enable" "$value"
}

# Write enable 설정
set_write_enable() {
    local value="$1"
    set_boolean "write_enable" "$value"
}

# Chroot local user 설정
set_chroot_local_user() {
    local value="$1"
    set_boolean "chroot_local_user" "$value"
}

# Allow writeable chroot 설정
set_allow_writeable_chroot() {
    local value="$1"
    set_boolean "allow_writeable_chroot" "$value"
}

# Userlist enable 설정
set_userlist_enable() {
    local value="$1"
    set_boolean "userlist_enable" "$value"
}

# SSL enable 설정
set_ssl_enable() {
    local value="$1"
    set_boolean "ssl_enable" "$value"
}

# PASV enable 설정
set_pasv_enable() {
    local value="$1"
    set_boolean "pasv_enable" "$value"
}

# TCP wrappers 설정
set_tcp_wrappers() {
    local value="$1"
    set_boolean "tcp_wrappers" "$value"
}

# 설정 적용 (설정 검증 및 VSFTPD 재시작)
apply() {
    echo "🔍 VSFTPD 설정 파일 검증 중..."
    if vsftpd -olisten=NO "$CONFIG_FILE" >/dev/null 2>&1; then
        echo "✅ 설정 파일 검증 성공"
        echo "🔄 VSFTPD 서비스 재시작 중..."
        if systemctl restart vsftpd 2>&1; then
            echo "✅ VSFTPD 서비스가 성공적으로 재시작되었습니다."
        else
            echo "❌ VSFTPD 서비스 재시작 실패"
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
    if [ ! -f "$CONFIG_FILE" ]; then
        echo ""
        return
    fi
    grep "^[[:space:]]*${key}[[:space:]]*=" "$CONFIG_FILE" 2>/dev/null | head -1 | sed "s/^[[:space:]]*${key}[[:space:]]*=[[:space:]]*//" | sed 's/^"//' | sed 's/"$//' | tr -d '\n'
}

# Boolean 값 읽기
get_boolean() {
    local key="$1"
    local value=$(get_config_value "$key")
    if [ "$value" = "YES" ] || [ "$value" = "yes" ] || [ "$value" = "true" ] || [ "$value" = "1" ]; then
        echo "true"
    else
        echo "false"
    fi
}

# 모든 설정 읽기 (JSON 형식)
get_all() {
    echo "{"
    echo "  \"port\": \"$(get_config_value 'listen_port' || echo '21')\","
    echo "  \"local_root\": \"$(get_config_value 'local_root' || echo '/var/ftp')\","
    echo "  \"pasv_min_port\": \"$(get_config_value 'pasv_min_port' || echo '21100')\","
    echo "  \"pasv_max_port\": \"$(get_config_value 'pasv_max_port' || echo '21110')\","
    echo "  \"max_clients\": \"$(get_config_value 'max_clients' || echo '0')\","
    echo "  \"max_per_ip\": \"$(get_config_value 'max_per_ip' || echo '0')\","
    echo "  \"idle_session_timeout\": \"$(get_config_value 'idle_session_timeout' || echo '600')\","
    echo "  \"data_connection_timeout\": \"$(get_config_value 'data_connection_timeout' || echo '300')\","
    echo "  \"anonymous_enable\": $(get_boolean 'anonymous_enable'),"
    echo "  \"local_enable\": $(get_boolean 'local_enable'),"
    echo "  \"write_enable\": $(get_boolean 'write_enable'),"
    echo "  \"chroot_local_user\": $(get_boolean 'chroot_local_user'),"
    echo "  \"allow_writeable_chroot\": $(get_boolean 'allow_writeable_chroot'),"
    echo "  \"userlist_enable\": $(get_boolean 'userlist_enable'),"
    echo "  \"ssl_enable\": $(get_boolean 'ssl_enable'),"
    echo "  \"pasv_enable\": $(get_boolean 'pasv_enable'),"
    echo "  \"tcp_wrappers\": $(get_boolean 'tcp_wrappers')"
    echo "}"
}

# 메인 로직
case "$1" in
    set_port)
        set_port "$2"
        ;;
    set_local_root)
        set_local_root "$2"
        ;;
    set_pasv_min_port)
        set_pasv_min_port "$2"
        ;;
    set_pasv_max_port)
        set_pasv_max_port "$2"
        ;;
    set_max_clients)
        set_max_clients "$2"
        ;;
    set_max_per_ip)
        set_max_per_ip "$2"
        ;;
    set_idle_session_timeout)
        set_idle_session_timeout "$2"
        ;;
    set_data_connection_timeout)
        set_data_connection_timeout "$2"
        ;;
    set_anonymous_enable)
        set_anonymous_enable "$2"
        ;;
    set_local_enable)
        set_local_enable "$2"
        ;;
    set_write_enable)
        set_write_enable "$2"
        ;;
    set_chroot_local_user)
        set_chroot_local_user "$2"
        ;;
    set_allow_writeable_chroot)
        set_allow_writeable_chroot "$2"
        ;;
    set_userlist_enable)
        set_userlist_enable "$2"
        ;;
    set_ssl_enable)
        set_ssl_enable "$2"
        ;;
    set_pasv_enable)
        set_pasv_enable "$2"
        ;;
    set_tcp_wrappers)
        set_tcp_wrappers "$2"
        ;;
    apply)
        apply
        ;;
    get_all)
        get_all
        ;;
    *)
        echo "사용법: $0 {set_port|set_local_root|set_pasv_min_port|set_pasv_max_port|set_max_clients|set_max_per_ip|set_idle_session_timeout|set_data_connection_timeout|set_anonymous_enable|set_local_enable|set_write_enable|set_chroot_local_user|set_allow_writeable_chroot|set_userlist_enable|set_ssl_enable|set_pasv_enable|set_tcp_wrappers|apply|get_all} [값]"
        exit 1
        ;;
esac

