#!/bin/bash
# SSH 자동화 스크립트
# ENSM에서 SSH 키 생성 및 복사를 수행하는 스크립트

case "$1" in
    generate_key)
        # SSH 키 생성
        KEY_TYPE="$2"
        KEY_SIZE="$3"
        COMMENT="$4"
        
        if [ -z "$KEY_TYPE" ]; then
            echo "❌ 키 타입이 지정되지 않았습니다."
            exit 1
        fi
        
        # 키 크기 기본값
        if [ -z "$KEY_SIZE" ]; then
            KEY_SIZE="2048"
        fi
        
        # 키 이름 생성 (타임스탬프 포함)
        KEY_NAME="id_${KEY_TYPE}_$(date +%s)"
        KEY_PATH="/tmp/${KEY_NAME}"
        
        # ssh-keygen 실행
        if [ -n "$COMMENT" ]; then
            ssh-keygen -t "$KEY_TYPE" -b "$KEY_SIZE" -f "$KEY_PATH" -N "" -C "$COMMENT" 2>&1
        else
            ssh-keygen -t "$KEY_TYPE" -b "$KEY_SIZE" -f "$KEY_PATH" -N "" 2>&1
        fi
        
        if [ $? -eq 0 ]; then
            echo "✅ SSH 키가 생성되었습니다: ${KEY_PATH}"
            echo "공개키 경로: ${KEY_PATH}.pub"
        else
            echo "❌ SSH 키 생성 실패"
            exit 1
        fi
        ;;
    copy_key)
        # SSH 키 복사
        PUBLIC_KEY_PATH="$2"
        USER="$3"
        HOST="$4"
        PORT="$5"
        
        if [ -z "$PUBLIC_KEY_PATH" ] || [ -z "$USER" ] || [ -z "$HOST" ]; then
            echo "❌ 사용법: $0 copy_key <public_key_path> <user> <host> [port]"
            exit 1
        fi
        
        # 포트 기본값
        if [ -z "$PORT" ]; then
            PORT="22"
        fi
        
        # 공개키 파일 존재 확인
        if [ ! -f "$PUBLIC_KEY_PATH" ]; then
            echo "❌ 공개키 파일을 찾을 수 없습니다: ${PUBLIC_KEY_PATH}"
            exit 1
        fi
        
        # ssh-copy-id 실행
        if [ "$PORT" != "22" ]; then
            ssh-copy-id -p "$PORT" "${USER}@${HOST}" 2>&1
        else
            ssh-copy-id "${USER}@${HOST}" 2>&1
        fi
        
        if [ $? -eq 0 ]; then
            echo "✅ SSH 키가 복사되었습니다."
        else
            echo "❌ SSH 키 복사 실패"
            exit 1
        fi
        ;;
    *)
        echo "사용법: $0 {generate_key|copy_key} [인자...]"
        echo "  generate_key <key_type> [key_size] [comment] - SSH 키 생성"
        echo "  copy_key <public_key_path> <user> <host> [port] - SSH 키 복사"
        exit 1
        ;;
esac

exit 0

