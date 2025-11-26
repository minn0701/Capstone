#!/bin/bash
# LVM 관리 스크립트
# ENSM에서 LVM (PV/VG/LV)을 관리하는 스크립트

case "$1" in
    pv_list)
        # 물리 볼륨(PV) 목록 조회 (JSON 형식)
        if ! command -v pvs &> /dev/null; then
            echo "[]"
            exit 1
        fi
        
        echo "["
        FIRST=true
        
        pvs --noheadings --units g --separator "|" 2>/dev/null | while IFS='|' read -r pv vg fmt attr psize pfree; do
            if [ -z "$pv" ]; then
                continue
            fi
            
            # 공백 제거
            pv=$(echo "$pv" | xargs)
            vg=$(echo "$vg" | xargs)
            psize=$(echo "$psize" | sed 's/[^0-9.]//g')
            
            if [ "$FIRST" = true ]; then
                FIRST=false
            else
                echo ","
            fi
            
            echo -n "  {"
            echo -n "\"name\": \"${pv}\","
            echo -n "\"device\": \"${pv}\","
            echo -n "\"size\": \"${psize}G\","
            echo -n "\"vg\": \"${vg}\""
            echo -n "}"
        done
        
        echo ""
        echo "]"
        ;;
    pv_create)
        # 물리 볼륨 생성
        DEVICE="$2"
        
        if [ -z "$DEVICE" ]; then
            echo "❌ 디바이스를 지정해주세요."
            exit 1
        fi
        
        if [ ! -b "$DEVICE" ]; then
            echo "❌ 디바이스를 찾을 수 없습니다: ${DEVICE}"
            exit 1
        fi
        
        if ! command -v pvcreate &> /dev/null; then
            echo "❌ pvcreate 명령어를 찾을 수 없습니다."
            exit 1
        fi
        
        pvcreate "$DEVICE" 2>&1
        
        if [ $? -eq 0 ]; then
            echo "✅ 물리 볼륨이 생성되었습니다."
        else
            echo "❌ 물리 볼륨 생성 실패"
            exit 1
        fi
        ;;
    vg_list)
        # 볼륨 그룹(VG) 목록 조회 (JSON 형식)
        if ! command -v vgs &> /dev/null; then
            echo "[]"
            exit 1
        fi
        
        echo "["
        FIRST=true
        
        vgs --noheadings --units g --separator "|" 2>/dev/null | while IFS='|' read -r vg pv lv sn attr vsize vfree vg_uuid; do
            if [ -z "$vg" ]; then
                continue
            fi
            
            # 공백 제거
            vg=$(echo "$vg" | xargs)
            pv=$(echo "$pv" | xargs)
            vsize=$(echo "$vsize" | sed 's/[^0-9.]//g')
            vfree=$(echo "$vfree" | sed 's/[^0-9.]//g')
            vused=$(echo "$vsize $vfree" | awk '{printf "%.2f", $1 - $2}')
            
            if [ "$FIRST" = true ]; then
                FIRST=false
            else
                echo ","
            fi
            
            echo -n "  {"
            echo -n "\"name\": \"${vg}\","
            echo -n "\"size\": \"${vsize}G\","
            echo -n "\"used\": \"${vused}G\","
            echo -n "\"free\": \"${vfree}G\","
            echo -n "\"pvCount\": ${pv}"
            echo -n "}"
        done
        
        echo ""
        echo "]"
        ;;
    vg_create)
        # 볼륨 그룹 생성
        VG_NAME="$2"
        PVS="$3"
        
        if [ -z "$VG_NAME" ] || [ -z "$PVS" ]; then
            echo "❌ 볼륨 그룹 이름과 물리 볼륨을 지정해주세요."
            exit 1
        fi
        
        if ! command -v vgcreate &> /dev/null; then
            echo "❌ vgcreate 명령어를 찾을 수 없습니다."
            exit 1
        fi
        
        # PV 배열 파싱
        PV_ARRAY=($PVS)
        
        # 볼륨 그룹 생성
        vgcreate "$VG_NAME" "${PV_ARRAY[@]}" 2>&1
        
        if [ $? -eq 0 ]; then
            echo "✅ 볼륨 그룹이 생성되었습니다."
        else
            echo "❌ 볼륨 그룹 생성 실패"
            exit 1
        fi
        ;;
    vg_expand)
        # 볼륨 그룹 확장 (PV 추가)
        VG_NAME="$2"
        PVS="$3"
        
        if [ -z "$VG_NAME" ] || [ -z "$PVS" ]; then
            echo "❌ 볼륨 그룹 이름과 물리 볼륨을 지정해주세요."
            exit 1
        fi
        
        if ! command -v vgextend &> /dev/null; then
            echo "❌ vgextend 명령어를 찾을 수 없습니다."
            exit 1
        fi
        
        # PV 배열 파싱
        PV_ARRAY=($PVS)
        
        # 볼륨 그룹 확장
        vgextend "$VG_NAME" "${PV_ARRAY[@]}" 2>&1
        
        if [ $? -eq 0 ]; then
            echo "✅ 볼륨 그룹이 확장되었습니다."
        else
            echo "❌ 볼륨 그룹 확장 실패"
            exit 1
        fi
        ;;
    lv_list)
        # 논리 볼륨(LV) 목록 조회 (JSON 형식)
        if ! command -v lvs &> /dev/null; then
            echo "[]"
            exit 1
        fi
        
        echo "["
        FIRST=true
        
        lvs --noheadings --units g --separator "|" 2>/dev/null | while IFS='|' read -r lv vg attr lsize pool origin data meta move log cpy_sync convert lv_uuid; do
            if [ -z "$lv" ]; then
                continue
            fi
            
            # 공백 제거
            lv=$(echo "$lv" | xargs)
            vg=$(echo "$vg" | xargs)
            lsize=$(echo "$lsize" | sed 's/[^0-9.]//g')
            
            # LV 경로
            LV_PATH="/dev/${vg}/${lv}"
            
            # 마운트 포인트 확인
            MOUNT_POINT=$(findmnt -n -o TARGET "$LV_PATH" 2>/dev/null || echo "")
            
            if [ "$FIRST" = true ]; then
                FIRST=false
            else
                echo ","
            fi
            
            echo -n "  {"
            echo -n "\"name\": \"${lv}\","
            echo -n "\"vg\": \"${vg}\","
            echo -n "\"size\": \"${lsize}G\","
            echo -n "\"path\": \"${LV_PATH}\","
            echo -n "\"mountPoint\": \"${MOUNT_POINT}\""
            echo -n "}"
        done
        
        echo ""
        echo "]"
        ;;
    lv_create)
        # 논리 볼륨 생성
        LV_NAME="$2"
        VG_NAME="$3"
        SIZE="$4"
        SIZE_UNIT="$5"
        MOUNT_POINT="$6"
        
        if [ -z "$LV_NAME" ] || [ -z "$VG_NAME" ] || [ -z "$SIZE" ]; then
            echo "❌ 논리 볼륨 이름, 볼륨 그룹, 크기를 지정해주세요."
            exit 1
        fi
        
        if ! command -v lvcreate &> /dev/null; then
            echo "❌ lvcreate 명령어를 찾을 수 없습니다."
            exit 1
        fi
        
        # 논리 볼륨 생성
        lvcreate -L "${SIZE}${SIZE_UNIT}" -n "$LV_NAME" "$VG_NAME" 2>&1
        
        if [ $? -eq 0 ]; then
            # 마운트 포인트가 지정된 경우 포맷 및 마운트
            if [ -n "$MOUNT_POINT" ]; then
                LV_PATH="/dev/${VG_NAME}/${LV_NAME}"
                # 포맷 (ext4 기본)
                mkfs.ext4 "$LV_PATH" 2>&1
                # 마운트 포인트 생성 및 마운트
                mkdir -p "$MOUNT_POINT" 2>/dev/null || true
                mount "$LV_PATH" "$MOUNT_POINT" 2>&1
            fi
            echo "✅ 논리 볼륨이 생성되었습니다."
        else
            echo "❌ 논리 볼륨 생성 실패"
            exit 1
        fi
        ;;
    lv_expand)
        # 논리 볼륨 확장
        LV_PATH="$2"
        SIZE="$3"
        SIZE_UNIT="$4"
        
        if [ -z "$LV_PATH" ] || [ -z "$SIZE" ]; then
            echo "❌ 논리 볼륨 경로와 크기를 지정해주세요."
            exit 1
        fi
        
        if [ ! -b "$LV_PATH" ]; then
            echo "❌ 논리 볼륨을 찾을 수 없습니다: ${LV_PATH}"
            exit 1
        fi
        
        if ! command -v lvextend &> /dev/null; then
            echo "❌ lvextend 명령어를 찾을 수 없습니다."
            exit 1
        fi
        
        # 논리 볼륨 확장
        lvextend -L "+${SIZE}${SIZE_UNIT}" "$LV_PATH" 2>&1
        
        if [ $? -eq 0 ]; then
            # 파일 시스템 확장
            FSTYPE=$(blkid -s TYPE -o value "$LV_PATH" 2>/dev/null || echo "")
            case "$FSTYPE" in
                "ext4"|"ext3")
                    resize2fs "$LV_PATH" 2>&1
                    ;;
                "xfs")
                    xfs_growfs "$LV_PATH" 2>&1
                    ;;
            esac
            echo "✅ 논리 볼륨이 확장되었습니다."
        else
            echo "❌ 논리 볼륨 확장 실패"
            exit 1
        fi
        ;;
    lv_shrink)
        # 논리 볼륨 축소
        LV_PATH="$2"
        SIZE="$3"
        SIZE_UNIT="$4"
        
        if [ -z "$LV_PATH" ] || [ -z "$SIZE" ]; then
            echo "❌ 논리 볼륨 경로와 크기를 지정해주세요."
            exit 1
        fi
        
        if [ ! -b "$LV_PATH" ]; then
            echo "❌ 논리 볼륨을 찾을 수 없습니다: ${LV_PATH}"
            exit 1
        fi
        
        if ! command -v lvreduce &> /dev/null; then
            echo "❌ lvreduce 명령어를 찾을 수 없습니다."
            exit 1
        fi
        
        # 파일 시스템 축소 (먼저)
        FSTYPE=$(blkid -s TYPE -o value "$LV_PATH" 2>/dev/null || echo "")
        case "$FSTYPE" in
            "ext4"|"ext3")
                # 현재 크기 확인
                CURRENT_SIZE=$(lvs --noheadings --units g -o lv_size "$LV_PATH" 2>/dev/null | sed 's/[^0-9.]//g')
                NEW_SIZE=$(echo "$CURRENT_SIZE $SIZE" | awk '{printf "%.2f", $1 - $2}')
                # 파일 시스템 크기 조정
                resize2fs "$LV_PATH" "${NEW_SIZE}G" 2>&1
                ;;
            "xfs")
                echo "❌ XFS 파일 시스템은 축소를 지원하지 않습니다."
                exit 1
                ;;
        esac
        
        # 논리 볼륨 축소
        lvreduce -L "-${SIZE}${SIZE_UNIT}" "$LV_PATH" 2>&1
        
        if [ $? -eq 0 ]; then
            echo "✅ 논리 볼륨이 축소되었습니다."
        else
            echo "❌ 논리 볼륨 축소 실패"
            exit 1
        fi
        ;;
    *)
        echo "사용법: $0 {pv_list|pv_create|vg_list|vg_create|vg_expand|lv_list|lv_create|lv_expand|lv_shrink} [인자...]"
        echo "  pv_list                 - 물리 볼륨 목록 조회 (JSON)"
        echo "  pv_create <device>      - 물리 볼륨 생성"
        echo "  vg_list                 - 볼륨 그룹 목록 조회 (JSON)"
        echo "  vg_create <vg_name> <pvs> - 볼륨 그룹 생성"
        echo "  vg_expand <vg_name> <pvs> - 볼륨 그룹 확장"
        echo "  lv_list                 - 논리 볼륨 목록 조회 (JSON)"
        echo "  lv_create <lv_name> <vg_name> <size> <unit> [mountpoint] - 논리 볼륨 생성"
        echo "  lv_expand <lv_path> <size> <unit> - 논리 볼륨 확장"
        echo "  lv_shrink <lv_path> <size> <unit> - 논리 볼륨 축소"
        exit 1
        ;;
esac

exit 0

