#!/bin/bash
# 시스템 정보 조회 스크립트
# ENSM에서 시스템 정보를 조회하는 스크립트

case "$1" in
    get_disk_info)
        # 디스크 사용량 정보 (JSON 형식)
        if ! command -v df &> /dev/null; then
            echo "[]"
            exit 1
        fi
        
        echo "["
        FIRST=true
        
        df -h | tail -n +2 | while IFS= read -r line; do
            if [ -z "$line" ]; then
                continue
            fi
            
            FILESYSTEM=$(echo "$line" | awk '{print $1}')
            SIZE=$(echo "$line" | awk '{print $2}')
            USED=$(echo "$line" | awk '{print $3}')
            AVAIL=$(echo "$line" | awk '{print $4}')
            USE_PERCENT=$(echo "$line" | awk '{print $5}')
            MOUNTED=$(echo "$line" | awk '{print $6}')
            
            if [ "$FIRST" = true ]; then
                FIRST=false
            else
                echo ","
            fi
            
            echo -n "  {"
            echo -n "\"filesystem\": \"${FILESYSTEM}\","
            echo -n "\"size\": \"${SIZE}\","
            echo -n "\"used\": \"${USED}\","
            echo -n "\"avail\": \"${AVAIL}\","
            echo -n "\"usePercent\": \"${USE_PERCENT}\","
            echo -n "\"mounted\": \"${MOUNTED}\""
            echo -n "}"
        done
        
        echo ""
        echo "]"
        ;;
    get_raid_status)
        # RAID 상태 정보
        if [ ! -f /proc/mdstat ]; then
            echo "{\"status\": \"RAID 정보를 사용할 수 없습니다.\"}"
            exit 0
        fi
        
        STATUS=$(cat /proc/mdstat)
        if command -v jq &> /dev/null; then
            echo "{\"status\": $(echo "$STATUS" | jq -Rs .)}"
        else
            echo "{\"status\": \"$STATUS\"}"
        fi
        ;;
    get_network_interfaces)
        # 네트워크 인터페이스 정보 (JSON 형식)
        if ! command -v ip &> /dev/null; then
            echo "[]"
            exit 1
        fi
        
        echo "["
        FIRST=true
        
        # ip -j 명령어가 지원되는 경우
        if ip -j addr show &> /dev/null; then
            ip -j addr show 2>/dev/null | jq -r '.[] | select(.addr_info != null) | .addr_info[] | select(.family == "inet") | "\(.local)|\(.label)"' 2>/dev/null | while IFS='|' read -r ip label; do
                if [ -z "$ip" ]; then
                    continue
                fi
                
                INTERFACE=$(echo "$label" | cut -d'@' -f1)
                
                if [ "$FIRST" = true ]; then
                    FIRST=false
                else
                    echo ","
                fi
                
                echo -n "  {"
                echo -n "\"name\": \"${INTERFACE}\","
                echo -n "\"ip\": \"${ip}\""
                echo -n "}"
            done
        else
            # jq가 없거나 ip -j가 지원되지 않는 경우
            ip addr show | grep -E "^[0-9]+:|inet " | while IFS= read -r line; do
                if [[ "$line" =~ ^[0-9]+:[[:space:]]+([^:]+) ]]; then
                    INTERFACE="${BASH_REMATCH[1]}"
                elif [[ "$line" =~ inet[[:space:]]+([0-9.]+) ]]; then
                    IP="${BASH_REMATCH[1]}"
                    
                    if [ "$FIRST" = true ]; then
                        FIRST=false
                    else
                        echo ","
                    fi
                    
                    echo -n "  {"
                    echo -n "\"name\": \"${INTERFACE}\","
                    echo -n "\"ip\": \"${IP}\""
                    echo -n "}"
                fi
            done
        fi
        
        echo ""
        echo "]"
        ;;
    get_open_ports)
        # 개방 포트 정보 (JSON 형식)
        if ! command -v ss &> /dev/null; then
            echo "[]"
            exit 1
        fi
        
        echo "["
        FIRST=true
        
        ss -tulpn | tail -n +2 | while IFS= read -r line; do
            if [ -z "$line" ]; then
                continue
            fi
            
            NETID=$(echo "$line" | awk '{print $1}')
            STATE=$(echo "$line" | awk '{print $2}')
            LOCAL=$(echo "$line" | awk '{print $5}')
            PROCESS=$(echo "$line" | awk '{print $7}' | sed 's/.*,\(.*\)/\1/' || echo "")
            
            if [ "$FIRST" = true ]; then
                FIRST=false
            else
                echo ","
            fi
            
            echo -n "  {"
            echo -n "\"netid\": \"${NETID}\","
            echo -n "\"state\": \"${STATE}\","
            echo -n "\"local\": \"${LOCAL}\","
            echo -n "\"process\": \"${PROCESS}\""
            echo -n "}"
        done
        
        echo ""
        echo "]"
        ;;
    get_running_services)
        # 실행 중인 서비스 목록 (JSON 형식)
        if ! command -v systemctl &> /dev/null; then
            echo "[]"
            exit 1
        fi
        
        echo "["
        FIRST=true
        
        systemctl list-units --type=service --state=running --no-pager --no-legend | while IFS= read -r line; do
            if [ -z "$line" ]; then
                continue
            fi
            
            NAME=$(echo "$line" | awk '{print $1}')
            LOADED=$(echo "$line" | awk '{print $2}')
            ACTIVE=$(echo "$line" | awk '{print $3}')
            SUB=$(echo "$line" | awk '{print $4}')
            
            if [ "$FIRST" = true ]; then
                FIRST=false
            else
                echo ","
            fi
            
            echo -n "  {"
            echo -n "\"name\": \"${NAME}\","
            echo -n "\"loaded\": \"${LOADED}\","
            echo -n "\"active\": \"${ACTIVE}\","
            echo -n "\"sub\": \"${SUB}\""
            echo -n "}"
        done
        
        echo ""
        echo "]"
        ;;
    *)
        echo "사용법: $0 {get_disk_info|get_raid_status|get_network_interfaces|get_open_ports|get_running_services}"
        exit 1
        ;;
esac

exit 0

