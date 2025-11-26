#!/bin/bash
# RAID 관리 스크립트
# ENSM에서 RAID를 생성/삭제/조회하는 스크립트

case "$1" in
    list)
        # RAID 목록 조회 (JSON 형식)
        if [ ! -f /proc/mdstat ]; then
            echo "[]"
            exit 0
        fi
        
        echo "["
        FIRST=true
        
        # /proc/mdstat 파싱
        while IFS= read -r line; do
            # md 디바이스 라인 찾기 (예: md0 : active raid1 sda1[0] sdb1[1])
            if [[ "$line" =~ ^md[0-9]+[[:space:]]*:[[:space:]]*active[[:space:]]+raid([0-9]+) ]]; then
                MD_NAME=$(echo "$line" | awk '{print $1}')
                RAID_LEVEL="${BASH_REMATCH[1]}"
                
                # 디바이스 목록 추출
                DEVICES=$(echo "$line" | sed 's/.*raid[0-9]*[[:space:]]*//' | sed 's/\[[0-9]*\]//g')
                
                # 크기 확인
                SIZE=$(mdadm --detail "/dev/${MD_NAME}" 2>/dev/null | grep "Array Size" | awk '{print $3, $4}' || echo "0")
                
                # 상태 확인
                STATE="active"
                if mdadm --detail "/dev/${MD_NAME}" 2>/dev/null | grep -q "State.*clean"; then
                    STATE="clean"
                fi
                
                if [ "$FIRST" = true ]; then
                    FIRST=false
                else
                    echo ","
                fi
                
                echo -n "  {"
                echo -n "\"name\": \"/dev/${MD_NAME}\","
                echo -n "\"level\": \"${RAID_LEVEL}\","
                echo -n "\"devices\": ["
                
                # 디바이스 배열 생성
                DEV_FIRST=true
                for dev in $DEVICES; do
                    if [ "$DEV_FIRST" = true ]; then
                        DEV_FIRST=false
                    else
                        echo -n ","
                    fi
                    echo -n "\"/dev/${dev}\""
                done
                
                echo -n "],"
                echo -n "\"spare\": 0,"
                echo -n "\"chunkSize\": 512,"
                echo -n "\"state\": \"${STATE}\""
                echo -n "}"
            fi
        done < /proc/mdstat
        
        echo ""
        echo "]"
        ;;
    create)
        # RAID 생성
        NAME="$2"
        LEVEL="$3"
        DEVICES="$4"
        SPARE="$5"
        CHUNK_SIZE="$6"
        
        if [ -z "$NAME" ] || [ -z "$LEVEL" ] || [ -z "$DEVICES" ]; then
            echo "❌ RAID 이름, 레벨, 디바이스를 지정해주세요."
            exit 1
        fi
        
        if ! command -v mdadm &> /dev/null; then
            echo "❌ mdadm 명령어를 찾을 수 없습니다."
            exit 1
        fi
        
        # 디바이스 배열 파싱 (공백으로 구분)
        DEVICE_ARRAY=($DEVICES)
        DEVICE_COUNT=${#DEVICE_ARRAY[@]}
        
        if [ "$DEVICE_COUNT" -lt 2 ]; then
            echo "❌ RAID를 생성하려면 최소 2개의 디스크가 필요합니다."
            exit 1
        fi
        
        # 디바이스 존재 확인
        for dev in "${DEVICE_ARRAY[@]}"; do
            if [ ! -b "$dev" ]; then
                echo "❌ 디스크를 찾을 수 없습니다: ${dev}"
                exit 1
            fi
        done
        
        # RAID 생성
        if [ -n "$CHUNK_SIZE" ] && [ "$CHUNK_SIZE" != "512" ]; then
            mdadm --create "$NAME" --level="$LEVEL" --raid-devices="$DEVICE_COUNT" --chunk="$CHUNK_SIZE" "${DEVICE_ARRAY[@]}" 2>&1
        else
            mdadm --create "$NAME" --level="$LEVEL" --raid-devices="$DEVICE_COUNT" "${DEVICE_ARRAY[@]}" 2>&1
        fi
        
        if [ $? -eq 0 ]; then
            # mdadm.conf에 추가
            mdadm --detail --scan >> /etc/mdadm.conf 2>/dev/null || true
            echo "✅ RAID가 생성되었습니다."
        else
            echo "❌ RAID 생성 실패"
            exit 1
        fi
        ;;
    delete)
        # RAID 삭제
        NAME="$2"
        
        if [ -z "$NAME" ]; then
            echo "❌ RAID 이름을 지정해주세요."
            exit 1
        fi
        
        if [ ! -b "$NAME" ]; then
            echo "❌ RAID를 찾을 수 없습니다: ${NAME}"
            exit 1
        fi
        
        # RAID 중지
        mdadm --stop "$NAME" 2>&1
        
        if [ $? -eq 0 ]; then
            # 슈퍼블록 제거
            mdadm --zero-superblock "${NAME}"* 2>/dev/null || true
            echo "✅ RAID가 삭제되었습니다."
        else
            echo "❌ RAID 삭제 실패"
            exit 1
        fi
        ;;
    *)
        echo "사용법: $0 {list|create|delete} [인자...]"
        echo "  list                    - RAID 목록 조회 (JSON)"
        echo "  create <name> <level> <devices> [spare] [chunk] - RAID 생성"
        echo "  delete <name>           - RAID 삭제"
        exit 1
        ;;
esac

exit 0

