#!/bin/bash
# ENSM 패키지 관리 스크립트
# 패키지 설치/제거 및 서비스 제어

ACTION="$1"
PACKAGE="$2"
SERVICE_ACTION="$3"

# 패키지별 서비스 이름 및 RPM 패키지 이름 매핑
get_service_name() {
    case "$1" in
        "apache")
            echo "httpd"
            ;;
        "bind")
            echo "named"
            ;;
        "vsftpd")
            echo "vsftpd"
            ;;
        "docker")
            echo "docker"
            ;;
        "plex")
            echo "plexmediaserver"
            ;;
        "home-assistant")
            echo "home-assistant"
            ;;
        *)
            echo "$1"
            ;;
    esac
}

get_rpm_package() {
    case "$1" in
        "apache")
            echo "httpd"
            ;;
        "bind")
            echo "bind bind-utils"
            ;;
        "vsftpd")
            echo "vsftpd"
            ;;
        "docker")
            echo "docker docker-ce"
            ;;
        "plex")
            echo "plexmediaserver"
            ;;
        "home-assistant")
            echo "home-assistant"
            ;;
        *)
            echo "$1"
            ;;
    esac
}

# 패키지 설치
install_package() {
    local pkg="$1"
    local rpm_pkg=$(get_rpm_package "$pkg")
    local service=$(get_service_name "$pkg")
    
    # 패키지 설치
    if command -v dnf &> /dev/null; then
        dnf install -y $rpm_pkg 2>&1
    elif command -v yum &> /dev/null; then
        yum install -y $rpm_pkg 2>&1
    else
        echo "❌ 패키지 관리자를 찾을 수 없습니다."
        exit 1
    fi
    
    if [ $? -eq 0 ]; then
        # 서비스가 있는 경우 시작 및 활성화
        if [ -n "$service" ] && systemctl list-unit-files | grep -q "${service}.service"; then
            systemctl enable "${service}.service" 2>/dev/null || true
            systemctl start "${service}.service" 2>/dev/null || true
        fi
        echo "✅ ${pkg}가 설치되었습니다."
    else
        echo "❌ ${pkg} 설치 실패"
        exit 1
    fi
}

# 패키지 제거
remove_package() {
    local pkg="$1"
    local rpm_pkg=$(get_rpm_package "$pkg")
    local service=$(get_service_name "$pkg")
    
    # 서비스 중지 및 비활성화
    if [ -n "$service" ] && systemctl list-unit-files | grep -q "${service}.service"; then
        systemctl stop "${service}.service" 2>/dev/null || true
        systemctl disable "${service}.service" 2>/dev/null || true
    fi
    
    # 패키지 제거
    if command -v dnf &> /dev/null; then
        dnf remove -y $rpm_pkg 2>/dev/null || true
    elif command -v yum &> /dev/null; then
        yum remove -y $rpm_pkg 2>/dev/null || true
    fi
    
    echo "✅ ${pkg}가 제거되었습니다."
}

# 패키지 설치 여부 확인
is_installed() {
    local pkg="$1"
    local rpm_pkg=$(get_rpm_package "$pkg")
    
    # 첫 번째 패키지만 확인
    local first_pkg=$(echo "$rpm_pkg" | awk '{print $1}')
    rpm -q "$first_pkg" >/dev/null 2>&1
}

# 서비스 상태 확인
get_service_status() {
    local service="$1"
    
    if [ -z "$service" ]; then
        echo "stopped"
        return
    fi
    
    if ! systemctl list-unit-files | grep -q "${service}.service"; then
        echo "stopped"
        return
    fi
    
    if systemctl is-active --quiet "${service}.service" 2>/dev/null; then
        echo "running"
    else
        echo "stopped"
    fi
}

# 자동 시작 여부 확인
is_autostart() {
    local service="$1"
    
    if [ -z "$service" ]; then
        echo "false"
        return
    fi
    
    if systemctl is-enabled --quiet "${service}.service" 2>/dev/null; then
        echo "true"
    else
        echo "false"
    fi
}

# 서비스 제어
control_service() {
    local service="$1"
    local action="$2"
    
    if [ -z "$service" ]; then
        echo "❌ 이 패키지는 서비스를 지원하지 않습니다."
        exit 1
    fi
    
    case "$action" in
        "start")
            systemctl start "${service}.service" 2>/dev/null && echo "✅ ${service} 서비스가 시작되었습니다." || echo "❌ ${service} 서비스 시작 실패"
            ;;
        "stop")
            systemctl stop "${service}.service" 2>/dev/null && echo "✅ ${service} 서비스가 중지되었습니다." || echo "❌ ${service} 서비스 중지 실패"
            ;;
        "restart")
            systemctl restart "${service}.service" 2>/dev/null && echo "✅ ${service} 서비스가 재시작되었습니다." || echo "❌ ${service} 서비스 재시작 실패"
            ;;
        "reload")
            systemctl reload "${service}.service" 2>/dev/null && echo "✅ ${service} 서비스가 리로드되었습니다." || echo "❌ ${service} 서비스 리로드 실패"
            ;;
        *)
            echo "❌ 지원하지 않는 액션: $action"
            exit 1
            ;;
    esac
}

# 자동 시작 토글
toggle_autostart() {
    local service="$1"
    local enable="$2"
    
    if [ -z "$service" ]; then
        echo "❌ 이 패키지는 서비스를 지원하지 않습니다."
        exit 1
    fi
    
    if [ "$enable" = "true" ]; then
        systemctl enable "${service}.service" 2>/dev/null && echo "✅ 자동 시작이 활성화되었습니다." || echo "❌ 자동 시작 활성화 실패"
    else
        systemctl disable "${service}.service" 2>/dev/null && echo "✅ 자동 시작이 비활성화되었습니다." || echo "❌ 자동 시작 비활성화 실패"
    fi
}

# 패키지 목록 조회 (JSON 형식)
list_packages() {
    echo "["
    FIRST=true
    
    # 지원하는 패키지 목록
    PACKAGES=("apache" "bind" "vsftpd" "docker" "plex" "home-assistant")
    
    for pkg in "${PACKAGES[@]}"; do
        local service=$(get_service_name "$pkg")
        local installed="false"
        local service_status="stopped"
        local autostart="false"
        
        if is_installed "$pkg"; then
            installed="true"
            service_status=$(get_service_status "$service")
            autostart=$(is_autostart "$service")
        fi
        
        if [ "$FIRST" = true ]; then
            FIRST=false
        else
            echo ","
        fi
        
        echo -n "  {"
        echo -n "\"id\": \"${pkg}\","
        echo -n "\"installed\": ${installed},"
        echo -n "\"serviceStatus\": \"${service_status}\","
        echo -n "\"autoStart\": ${autostart}"
        echo -n "}"
    done
    
    echo ""
    echo "]"
}

# 메인 로직
case "$ACTION" in
    "list")
        list_packages
        ;;
    "install")
        if [ -z "$PACKAGE" ]; then
            echo "❌ 패키지 이름이 필요합니다."
            exit 1
        fi
        install_package "$PACKAGE"
        ;;
    "remove")
        if [ -z "$PACKAGE" ]; then
            echo "❌ 패키지 이름이 필요합니다."
            exit 1
        fi
        remove_package "$PACKAGE"
        ;;
    "is_installed")
        if [ -z "$PACKAGE" ]; then
            echo "❌ 패키지 이름이 필요합니다."
            exit 1
        fi
        if is_installed "$PACKAGE"; then
            echo "installed"
        else
            echo "not_installed"
        fi
        ;;
    "service")
        if [ -z "$PACKAGE" ] || [ -z "$SERVICE_ACTION" ]; then
            echo "❌ 패키지 이름과 서비스 액션이 필요합니다."
            exit 1
        fi
        service=$(get_service_name "$PACKAGE")
        control_service "$service" "$SERVICE_ACTION"
        ;;
    "autostart")
        if [ -z "$PACKAGE" ] || [ -z "$SERVICE_ACTION" ]; then
            echo "❌ 패키지 이름과 enable 값이 필요합니다."
            exit 1
        fi
        service=$(get_service_name "$PACKAGE")
        toggle_autostart "$service" "$SERVICE_ACTION"
        ;;
    *)
        echo "사용법: $0 {list|install|remove|is_installed|service|autostart} [package] [action]"
        echo "  list                    - 패키지 목록 조회 (JSON)"
        echo "  install <package>       - 패키지 설치"
        echo "  remove <package>        - 패키지 제거"
        echo "  is_installed <package>  - 설치 여부 확인"
        echo "  service <package> <action> - 서비스 제어 (start/stop/restart/reload)"
        echo "  autostart <package> <true|false> - 자동 시작 토글"
        exit 1
        ;;
esac

exit 0

