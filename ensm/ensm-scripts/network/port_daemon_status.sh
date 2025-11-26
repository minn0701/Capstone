#!/bin/bash
# 포트 및 데몬 상태 조회 스크립트
# ENSM에서 개방 포트와 데몬 상태를 조회하는 스크립트

case "$1" in
    get_ports)
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
    get_services)
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
        echo "사용법: $0 {get_ports|get_services}"
        echo "  get_ports     - 개방 포트 정보 조회 (JSON)"
        echo "  get_services  - 실행 중인 서비스 목록 조회 (JSON)"
        exit 1
        ;;
esac

exit 0

