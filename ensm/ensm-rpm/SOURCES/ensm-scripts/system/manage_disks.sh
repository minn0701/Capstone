#!/bin/bash
# 디스크 관리 스크립트
# ENSM에서 디스크 목록을 조회하는 스크립트

case "$1" in
    list)
        # 디스크 목록 조회 (JSON 형식)
        # lsblk를 사용하여 디스크 정보 조회
        if ! command -v lsblk &> /dev/null; then
            echo "[]"
            exit 1
        fi
        
        # JSON 배열 시작
        echo "["
        FIRST=true
        
        # 디스크만 필터링 (파티션이 없는 디스크)
        lsblk -dno NAME,SIZE,MODEL,TYPE | while IFS= read -r line; do
            if [ -z "$line" ]; then
                continue
            fi
            
            NAME=$(echo "$line" | awk '{print $1}')
            SIZE=$(echo "$line" | awk '{print $2}')
            MODEL=$(echo "$line" | awk '{for(i=3;i<NF;i++) printf "%s ", $i; print $NF}' | sed 's/[[:space:]]*$//')
            TYPE=$(echo "$line" | awk '{print $NF}')
            
            # 디스크만 (TYPE이 disk인 경우)
            if [ "$TYPE" != "disk" ]; then
                continue
            fi
            
            # /dev/ 접두사 추가
            DEVICE="/dev/${NAME}"
            
            # 인터페이스 확인 (SATA/NVMe)
            INTERFACE="SATA"
            if [[ "$NAME" == nvme* ]]; then
                INTERFACE="NVMe"
            fi
            
            # 파티션 개수 확인
            PART_COUNT=$(lsblk -n -o NAME "${DEVICE}" | grep -c "^${NAME}" || echo "0")
            PART_COUNT=$((PART_COUNT - 1)) # 자기 자신 제외
            
            # JSON 객체 출력
            if [ "$FIRST" = true ]; then
                FIRST=false
            else
                echo ","
            fi
            
            echo -n "  {"
            echo -n "\"device\": \"${DEVICE}\","
            echo -n "\"size\": \"${SIZE}\","
            echo -n "\"model\": \"${MODEL}\","
            echo -n "\"interface\": \"${INTERFACE}\","
            echo -n "\"partitionCount\": ${PART_COUNT}"
            echo -n "}"
        done
        
        echo ""
        echo "]"
        ;;
    available)
        # 사용 가능한 디스크 목록 조회 (파티션/LVM/RAID에 사용되지 않은 디스크)
        # 이 스크립트는 백엔드에서 호출되며, 다른 스크립트와 연동하여 사용 중인 디스크를 제외
        # 여기서는 전체 디스크 목록을 반환하고, 백엔드에서 필터링
        
        # list와 동일한 로직
        if ! command -v lsblk &> /dev/null; then
            echo "[]"
            exit 1
        fi
        
        echo "["
        FIRST=true
        
        lsblk -dno NAME,SIZE,MODEL,TYPE | while IFS= read -r line; do
            if [ -z "$line" ]; then
                continue
            fi
            
            NAME=$(echo "$line" | awk '{print $1}')
            SIZE=$(echo "$line" | awk '{print $2}')
            MODEL=$(echo "$line" | awk '{for(i=3;i<NF;i++) printf "%s ", $i; print $NF}' | sed 's/[[:space:]]*$//')
            TYPE=$(echo "$line" | awk '{print $NF}')
            
            if [ "$TYPE" != "disk" ]; then
                continue
            fi
            
            DEVICE="/dev/${NAME}"
            
            INTERFACE="SATA"
            if [[ "$NAME" == nvme* ]]; then
                INTERFACE="NVMe"
            fi
            
            PART_COUNT=$(lsblk -n -o NAME "${DEVICE}" | grep -c "^${NAME}" || echo "0")
            PART_COUNT=$((PART_COUNT - 1))
            
            if [ "$FIRST" = true ]; then
                FIRST=false
            else
                echo ","
            fi
            
            echo -n "  {"
            echo -n "\"device\": \"${DEVICE}\","
            echo -n "\"size\": \"${SIZE}\","
            echo -n "\"model\": \"${MODEL}\","
            echo -n "\"interface\": \"${INTERFACE}\","
            echo -n "\"partitionCount\": ${PART_COUNT}"
            echo -n "}"
        done
        
        echo ""
        echo "]"
        ;;
    *)
        echo "사용법: $0 {list|available}"
        echo "  list      - 디스크 목록 조회 (JSON)"
        echo "  available - 사용 가능한 디스크 목록 조회 (JSON)"
        exit 1
        ;;
esac

exit 0

