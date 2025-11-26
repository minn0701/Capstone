#!/bin/bash
# 네트워크 로그 조회 스크립트
# ENSM에서 네트워크 관련 로그를 조회하는 스크립트

case "$1" in
    get_log)
        # 네트워크 로그 조회 (JSON 형식)
        LOG_TYPE="$2"
        LINES="$3"
        
        if [ -z "$LOG_TYPE" ]; then
            echo "{\"error\": \"로그 타입이 지정되지 않았습니다.\"}"
            exit 1
        fi
        
        # 라인 수 기본값
        if [ -z "$LINES" ]; then
            LINES="100"
        fi
        
        LOG_CONTENT=""
        
        case "$LOG_TYPE" in
            messages)
                # 시스템 로그
                if [ -f /var/log/messages ]; then
                    LOG_CONTENT=$(tail -n "$LINES" /var/log/messages)
                else
                    echo "{\"error\": \"/var/log/messages 파일을 찾을 수 없습니다.\"}"
                    exit 1
                fi
                ;;
            secure)
                # 보안 로그
                if [ -f /var/log/secure ]; then
                    LOG_CONTENT=$(tail -n "$LINES" /var/log/secure)
                else
                    echo "{\"error\": \"/var/log/secure 파일을 찾을 수 없습니다.\"}"
                    exit 1
                fi
                ;;
            network)
                # NetworkManager 로그
                if command -v journalctl &> /dev/null; then
                    LOG_CONTENT=$(journalctl -u NetworkManager -n "$LINES" --no-pager)
                else
                    echo "{\"error\": \"journalctl을 찾을 수 없습니다.\"}"
                    exit 1
                fi
                ;;
            dmesg)
                # 커널 네트워크 로그
                LOG_CONTENT=$(dmesg | grep -i network | tail -n "$LINES")
                ;;
            *)
                echo "{\"error\": \"지원하지 않는 로그 타입입니다: ${LOG_TYPE}\"}"
                exit 1
                ;;
        esac
        
        # JSON 형식으로 출력
        if command -v jq &> /dev/null; then
            echo "{\"log\": $(echo "$LOG_CONTENT" | jq -Rs .)}"
        else
            # jq가 없는 경우 간단한 이스케이프
            ESCAPED=$(echo "$LOG_CONTENT" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
            echo "{\"log\": \"$ESCAPED\"}"
        fi
        ;;
    get_stats)
        # 네트워크 통계 정보 (JSON 형식)
        echo "{"
        
        # 네트워크 인터페이스 통계
        echo -n "  \"interfaces\": "
        if [ -f /proc/net/dev ]; then
            INTERFACES=$(cat /proc/net/dev | tail -n +3)
            if command -v jq &> /dev/null; then
                echo "$INTERFACES" | jq -Rs .
            else
                ESCAPED=$(echo "$INTERFACES" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
                echo "\"$ESCAPED\""
            fi
        else
            echo "\"\""
        fi
        echo ","
        
        # 네트워크 연결 통계
        echo -n "  \"connections\": "
        if command -v ss &> /dev/null; then
            CONNECTIONS=$(ss -s)
            if command -v jq &> /dev/null; then
                echo "$CONNECTIONS" | jq -Rs .
            else
                ESCAPED=$(echo "$CONNECTIONS" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
                echo "\"$ESCAPED\""
            fi
        else
            echo "\"\""
        fi
        echo ","
        
        # 라우팅 테이블
        echo -n "  \"routes\": "
        if command -v ip &> /dev/null; then
            ROUTES=$(ip route show)
            if command -v jq &> /dev/null; then
                echo "$ROUTES" | jq -Rs .
            else
                ESCAPED=$(echo "$ROUTES" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
                echo "\"$ESCAPED\""
            fi
        else
            echo "\"\""
        fi
        
        echo "}"
        ;;
    *)
        echo "사용법: $0 {get_log|get_stats} [인자...]"
        echo "  get_log <type> [lines] - 네트워크 로그 조회 (type: messages, secure, network, dmesg)"
        echo "  get_stats              - 네트워크 통계 정보 조회"
        exit 1
        ;;
esac

exit 0

