#!/bin/bash
# CRON 작업 관리 스크립트
# ENSM에서 CRON 작업을 관리하는 스크립트

case "$1" in
    list_jobs)
        # CRON 작업 목록 조회
        USER="$2"
        if [ -z "$USER" ]; then
            echo "❌ 사용자명이 지정되지 않았습니다."
            exit 1
        fi
        
        # crontab -l -u $USER 실행 (에러는 무시)
        crontab -l -u "$USER" 2>/dev/null || echo ""
        ;;
    add_job)
        # CRON 작업 추가
        USER="$2"
        SCHEDULE="$3"
        COMMAND="$4"
        
        if [ -z "$USER" ] || [ -z "$SCHEDULE" ] || [ -z "$COMMAND" ]; then
            echo "❌ 사용법: $0 add_job <user> <schedule> <command>"
            exit 1
        fi
        
        # 기존 crontab 가져오기
        EXISTING=$(crontab -l -u "$USER" 2>/dev/null || echo "")
        
        # 새 작업 추가
        NEW_JOB="${SCHEDULE} ${COMMAND}"
        
        # 기존 작업과 새 작업 합치기
        if [ -z "$EXISTING" ]; then
            UPDATED="${NEW_JOB}"
        else
            UPDATED="${EXISTING}
${NEW_JOB}"
        fi
        
        # crontab 업데이트
        echo "$UPDATED" | crontab -u "$USER" -
        
        if [ $? -eq 0 ]; then
            echo "✅ CRON 작업이 추가되었습니다."
        else
            echo "❌ CRON 작업 추가 실패"
            exit 1
        fi
        ;;
    delete_job)
        # CRON 작업 삭제
        USER="$2"
        INDEX="$3"
        
        if [ -z "$USER" ] || [ -z "$INDEX" ]; then
            echo "❌ 사용법: $0 delete_job <user> <index>"
            exit 1
        fi
        
        # 기존 crontab 가져오기
        EXISTING=$(crontab -l -u "$USER" 2>/dev/null || echo "")
        
        if [ -z "$EXISTING" ]; then
            echo "❌ CRON 작업이 없습니다."
            exit 1
        fi
        
        # 주석이 아닌 라인만 추출하여 배열로 만들기
        JOBS=()
        while IFS= read -r line; do
            if [[ ! "$line" =~ ^[[:space:]]*# ]] && [[ -n "$line" ]]; then
                JOBS+=("$line")
            fi
        done <<< "$EXISTING"
        
        # 인덱스 검증
        if [ "$INDEX" -lt 0 ] || [ "$INDEX" -ge "${#JOBS[@]}" ]; then
            echo "❌ 유효하지 않은 인덱스입니다."
            exit 1
        fi
        
        # 해당 인덱스의 작업 제거
        unset JOBS[$INDEX]
        
        # 주석과 빈 줄은 유지하고 작업만 재구성
        UPDATED=""
        JOB_COUNT=0
        while IFS= read -r line; do
            if [[ "$line" =~ ^[[:space:]]*# ]] || [[ -z "$line" ]]; then
                # 주석이나 빈 줄은 그대로 유지
                UPDATED="${UPDATED}${line}
"
            else
                # 작업 라인은 배열에서 가져오기 (삭제된 인덱스 제외)
                if [ "$JOB_COUNT" -ne "$INDEX" ]; then
                    # 현재 인덱스가 삭제할 인덱스가 아니면 추가
                    UPDATED="${UPDATED}${JOBS[$JOB_COUNT]}
"
                fi
                ((JOB_COUNT++))
            fi
        done <<< "$EXISTING"
        
        # crontab 업데이트
        echo -e "$UPDATED" | crontab -u "$USER" -
        
        if [ $? -eq 0 ]; then
            echo "✅ CRON 작업이 삭제되었습니다."
        else
            echo "❌ CRON 작업 삭제 실패"
            exit 1
        fi
        ;;
    *)
        echo "사용법: $0 {list_jobs|add_job|delete_job} [인자...]"
        echo "  list_jobs <user>              - CRON 작업 목록 조회"
        echo "  add_job <user> <schedule> <command> - CRON 작업 추가"
        echo "  delete_job <user> <index>     - CRON 작업 삭제"
        exit 1
        ;;
esac

exit 0

