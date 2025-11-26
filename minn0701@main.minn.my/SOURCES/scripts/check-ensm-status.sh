#!/bin/bash
# ENSM 서비스 상태 및 로그 확인 스크립트
# 
# 사용법: ./check-ensm-status.sh [--logs] [--all]
#   --logs: 실행 안 되는 서비스의 로그도 표시
#   --all: 모든 서비스의 로그 표시

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_LINES=20

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 옵션 파싱
SHOW_LOGS=false
SHOW_ALL_LOGS=false

for arg in "$@"; do
    case $arg in
        --logs)
            SHOW_LOGS=true
            shift
            ;;
        --all)
            SHOW_ALL_LOGS=true
            SHOW_LOGS=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# ENSM 관련 서비스 목록
SERVICES=(
    "ensm-auth"
    "ensm-main"
    "prometheus"
    "grafana-server"
    "loki"
    "promtail"
    "node_exporter"
    "caddy"
)

echo "=========================================="
echo "ENSM 서비스 상태 확인"
echo "=========================================="
echo ""

# 서비스 상태 확인
ACTIVE_SERVICES=()
INACTIVE_SERVICES=()
FAILED_SERVICES=()

for service in "${SERVICES[@]}"; do
    if systemctl list-unit-files | grep -q "^${service}.service"; then
        status=$(systemctl is-active "${service}.service" 2>/dev/null)
        enabled=$(systemctl is-enabled "${service}.service" 2>/dev/null)
        
        if [ "$status" = "active" ]; then
            ACTIVE_SERVICES+=("$service")
            echo -e "${GREEN}✓${NC} ${service}: ${GREEN}실행 중${NC} (enabled: $enabled)"
        elif [ "$status" = "failed" ]; then
            FAILED_SERVICES+=("$service")
            echo -e "${RED}✗${NC} ${service}: ${RED}실패${NC} (enabled: $enabled)"
        else
            INACTIVE_SERVICES+=("$service")
            echo -e "${YELLOW}○${NC} ${service}: ${YELLOW}중지됨${NC} (enabled: $enabled)"
        fi
    else
        echo -e "${BLUE}?${NC} ${service}: ${BLUE}서비스 없음${NC}"
    fi
done

echo ""
echo "=========================================="
echo "요약"
echo "=========================================="
echo -e "실행 중: ${GREEN}${#ACTIVE_SERVICES[@]}${NC}"
echo -e "중지됨: ${YELLOW}${#INACTIVE_SERVICES[@]}${NC}"
echo -e "실패: ${RED}${#FAILED_SERVICES[@]}${NC}"
echo ""

# 실패한 서비스 상세 정보
if [ ${#FAILED_SERVICES[@]} -gt 0 ]; then
    echo "=========================================="
    echo "실패한 서비스 상세 정보"
    echo "=========================================="
    for service in "${FAILED_SERVICES[@]}"; do
        echo ""
        echo -e "${RED}━━━ ${service}.service ━━━${NC}"
        systemctl status "${service}.service" --no-pager -l | head -15
    done
    echo ""
fi

# 로그 표시
if [ "$SHOW_LOGS" = true ]; then
    # 실행 안 되는 서비스의 로그
    if [ ${#INACTIVE_SERVICES[@]} -gt 0 ] || [ ${#FAILED_SERVICES[@]} -gt 0 ]; then
        echo "=========================================="
        echo "중지/실패 서비스 로그 (최근 ${LOG_LINES}줄)"
        echo "=========================================="
        
        for service in "${INACTIVE_SERVICES[@]}" "${FAILED_SERVICES[@]}"; do
            if systemctl list-unit-files | grep -q "^${service}.service"; then
                echo ""
                echo -e "${YELLOW}━━━ ${service}.service 로그 ━━━${NC}"
                journalctl -u "${service}.service" -n ${LOG_LINES} --no-pager -l
            fi
        done
        echo ""
    fi
    
    # 모든 서비스 로그 (--all 옵션)
    if [ "$SHOW_ALL_LOGS" = true ]; then
        echo "=========================================="
        echo "모든 서비스 로그 (최근 ${LOG_LINES}줄)"
        echo "=========================================="
        
        for service in "${SERVICES[@]}"; do
            if systemctl list-unit-files | grep -q "^${service}.service"; then
                echo ""
                echo -e "${BLUE}━━━ ${service}.service 로그 ━━━${NC}"
                journalctl -u "${service}.service" -n ${LOG_LINES} --no-pager -l
            fi
        done
        echo ""
    fi
fi

# 포트 확인
echo "=========================================="
echo "포트 사용 현황"
echo "=========================================="
PORTS=("55555:ensm-main (Caddy)" "55556:ensm-auth" "55557:ensm-main" "3000:Grafana" "9090:Prometheus" "3100:Loki" "9080:Promtail" "9100:node_exporter")

for port_info in "${PORTS[@]}"; do
    port=$(echo $port_info | cut -d: -f1)
    name=$(echo $port_info | cut -d: -f2)
    
    if netstat -tlnp 2>/dev/null | grep -q ":${port} " || ss -tlnp 2>/dev/null | grep -q ":${port} "; then
        process=$(netstat -tlnp 2>/dev/null | grep ":${port} " | awk '{print $7}' | head -1)
        if [ -z "$process" ]; then
            process=$(ss -tlnp 2>/dev/null | grep ":${port} " | awk '{print $6}' | head -1)
        fi
        echo -e "${GREEN}✓${NC} 포트 ${port} (${name}): ${GREEN}사용 중${NC} - $process"
    else
        echo -e "${YELLOW}○${NC} 포트 ${port} (${name}): ${YELLOW}미사용${NC}"
    fi
done

echo ""
echo "=========================================="
echo "완료"
echo "=========================================="

