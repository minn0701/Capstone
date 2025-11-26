#!/bin/bash
# 파티션 관리 스크립트
# ENSM에서 파티션을 생성/삭제/포맷/마운트/언마운트하는 스크립트

case "$1" in
    list)
        # 파티션 목록 조회 (JSON 형식)
        if ! command -v lsblk &> /dev/null; then
            echo "[]"
            exit 1
        fi
        
        echo "["
        FIRST=true
        
        # 파티션만 필터링
        lsblk -Jno NAME,SIZE,TYPE,MOUNTPOINT | jq -r '.blockdevices[] | select(.type=="disk") | .children[]? | select(.type=="part") | "\(.name)|\(.size)|\(.mountpoint // "")"' 2>/dev/null | while IFS='|' read -r name size mountpoint; do
            if [ -z "$name" ]; then
                continue
            fi
            
            DEVICE="/dev/${name}"
            
            # 부모 디스크 찾기
            PARENT_DISK=$(lsblk -n -o PKNAME "${DEVICE}" 2>/dev/null | head -1)
            if [ -n "$PARENT_DISK" ]; then
                PARENT_DEVICE="/dev/${PARENT_DISK}"
            else
                # nvme의 경우
                PARENT_DEVICE=$(echo "$DEVICE" | sed 's/p[0-9]*$//')
            fi
            
            # 파일 시스템 확인
            FILESYSTEM=$(lsblk -n -o FSTYPE "${DEVICE}" 2>/dev/null || echo "")
            
            # 파티션 타입 (primary/extended/logical) - 간단히 primary로 가정
            PART_TYPE="primary"
            
            if [ "$FIRST" = true ]; then
                FIRST=false
            else
                echo ","
            fi
            
            echo -n "  {"
            echo -n "\"device\": \"${DEVICE}\","
            echo -n "\"disk\": \"${PARENT_DEVICE}\","
            echo -n "\"size\": \"${SIZE}\","
            echo -n "\"partitionType\": \"${PART_TYPE}\","
            echo -n "\"fileSystem\": \"${FILESYSTEM}\","
            echo -n "\"mountPoint\": \"${mountpoint}\""
            echo -n "}"
        done
        
        echo ""
        echo "]"
        ;;
    create)
        # 파티션 생성
        DISK="$2"
        SIZE="$3"
        SIZE_UNIT="$4"
        PART_TYPE="$5"
        
        if [ -z "$DISK" ] || [ -z "$SIZE" ]; then
            echo "❌ 디스크와 크기를 지정해주세요."
            exit 1
        fi
        
        if [ ! -b "$DISK" ]; then
            echo "❌ 디스크를 찾을 수 없습니다: ${DISK}"
            exit 1
        fi
        
        # parted를 사용하여 파티션 생성
        if ! command -v parted &> /dev/null; then
            echo "❌ parted 명령어를 찾을 수 없습니다."
            exit 1
        fi
        
        # 크기 변환 (G/M/K -> MB)
        SIZE_MB=$(echo "$SIZE $SIZE_UNIT" | awk '{
            if ($2 == "G") print $1 * 1024;
            else if ($2 == "M") print $1;
            else if ($2 == "K") print $1 / 1024;
            else print $1
        }')
        
        # 파티션 생성
        if [ "$PART_TYPE" = "extended" ]; then
            parted -s "$DISK" mkpart extended 0% 100% 2>&1
        else
            # primary 파티션 생성 (크기 지정)
            if [ -n "$SIZE_MB" ] && [ "$SIZE_MB" != "0" ]; then
                # 시작 위치 찾기
                START=$(parted -s "$DISK" print | grep -E "^[[:space:]]*[0-9]+" | tail -1 | awk '{print $3}' || echo "0%")
                END=$(echo "$START $SIZE_MB" | awk '{print $1 + $2}')
                parted -s "$DISK" mkpart primary "${START}" "${END}MB" 2>&1
            else
                # 전체 디스크 사용
                parted -s "$DISK" mkpart primary 0% 100% 2>&1
            fi
        fi
        
        if [ $? -eq 0 ]; then
            echo "✅ 파티션이 생성되었습니다."
        else
            echo "❌ 파티션 생성 실패"
            exit 1
        fi
        ;;
    delete)
        # 파티션 삭제
        PARTITION="$2"
        
        if [ -z "$PARTITION" ]; then
            echo "❌ 파티션을 지정해주세요."
            exit 1
        fi
        
        if [ ! -b "$PARTITION" ]; then
            echo "❌ 파티션을 찾을 수 없습니다: ${PARTITION}"
            exit 1
        fi
        
        # 파티션 번호 추출
        PART_NUM=$(echo "$PARTITION" | sed 's/.*[^0-9]\([0-9]\+\)$/\1/')
        DISK=$(echo "$PARTITION" | sed 's/[0-9]*$//')
        
        # 마운트 확인 및 언마운트
        if mountpoint -q "$PARTITION" 2>/dev/null; then
            umount "$PARTITION" 2>/dev/null || true
        fi
        
        # 파티션 삭제
        parted -s "$DISK" rm "$PART_NUM" 2>&1
        
        if [ $? -eq 0 ]; then
            echo "✅ 파티션이 삭제되었습니다."
        else
            echo "❌ 파티션 삭제 실패"
            exit 1
        fi
        ;;
    format)
        # 파티션 포맷
        PARTITION="$2"
        FILESYSTEM="$3"
        LABEL="$4"
        
        if [ -z "$PARTITION" ] || [ -z "$FILESYSTEM" ]; then
            echo "❌ 파티션과 파일 시스템을 지정해주세요."
            exit 1
        fi
        
        if [ ! -b "$PARTITION" ]; then
            echo "❌ 파티션을 찾을 수 없습니다: ${PARTITION}"
            exit 1
        fi
        
        # 마운트 확인 및 언마운트
        if mountpoint -q "$PARTITION" 2>/dev/null; then
            umount "$PARTITION" 2>/dev/null || {
                echo "❌ 파티션이 마운트되어 있어 포맷할 수 없습니다."
                exit 1
            }
        fi
        
        # 파일 시스템별 포맷 명령어
        case "$FILESYSTEM" in
            "ext4")
                if [ -n "$LABEL" ]; then
                    mkfs.ext4 -L "$LABEL" "$PARTITION" 2>&1
                else
                    mkfs.ext4 "$PARTITION" 2>&1
                fi
                ;;
            "ext3")
                if [ -n "$LABEL" ]; then
                    mkfs.ext3 -L "$LABEL" "$PARTITION" 2>&1
                else
                    mkfs.ext3 "$PARTITION" 2>&1
                fi
                ;;
            "xfs")
                if [ -n "$LABEL" ]; then
                    mkfs.xfs -L "$LABEL" "$PARTITION" 2>&1
                else
                    mkfs.xfs "$PARTITION" 2>&1
                fi
                ;;
            "btrfs")
                if [ -n "$LABEL" ]; then
                    mkfs.btrfs -L "$LABEL" "$PARTITION" 2>&1
                else
                    mkfs.btrfs "$PARTITION" 2>&1
                fi
                ;;
            *)
                echo "❌ 지원하지 않는 파일 시스템: ${FILESYSTEM}"
                exit 1
                ;;
        esac
        
        if [ $? -eq 0 ]; then
            echo "✅ 파티션이 포맷되었습니다."
        else
            echo "❌ 파티션 포맷 실패"
            exit 1
        fi
        ;;
    mount)
        # 파티션 마운트
        PARTITION="$2"
        MOUNT_POINT="$3"
        
        if [ -z "$PARTITION" ] || [ -z "$MOUNT_POINT" ]; then
            echo "❌ 파티션과 마운트 포인트를 지정해주세요."
            exit 1
        fi
        
        if [ ! -b "$PARTITION" ]; then
            echo "❌ 파티션을 찾을 수 없습니다: ${PARTITION}"
            exit 1
        fi
        
        # 마운트 포인트 생성
        mkdir -p "$MOUNT_POINT" 2>/dev/null || true
        
        # 마운트
        mount "$PARTITION" "$MOUNT_POINT" 2>&1
        
        if [ $? -eq 0 ]; then
            # /etc/fstab에 추가 (선택사항)
            echo "✅ 파티션이 마운트되었습니다."
        else
            echo "❌ 파티션 마운트 실패"
            exit 1
        fi
        ;;
    unmount)
        # 파티션 언마운트
        PARTITION="$2"
        
        if [ -z "$PARTITION" ]; then
            echo "❌ 파티션을 지정해주세요."
            exit 1
        fi
        
        # 언마운트
        umount "$PARTITION" 2>&1
        
        if [ $? -eq 0 ]; then
            echo "✅ 파티션이 언마운트되었습니다."
        else
            echo "❌ 파티션 언마운트 실패"
            exit 1
        fi
        ;;
    *)
        echo "사용법: $0 {list|create|delete|format|mount|unmount} [인자...]"
        echo "  list                    - 파티션 목록 조회 (JSON)"
        echo "  create <disk> <size> <unit> <type> - 파티션 생성"
        echo "  delete <partition>      - 파티션 삭제"
        echo "  format <partition> <fs> [label] - 파티션 포맷"
        echo "  mount <partition> <mountpoint> - 파티션 마운트"
        echo "  unmount <partition>     - 파티션 언마운트"
        exit 1
        ;;
esac

exit 0

