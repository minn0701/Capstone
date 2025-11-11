#!/bin/bash

# ENSM 스크립트 배포 스크립트
# 서버에 ensm-scripts 폴더를 배포합니다.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="/usr/local/bin"
SSH_USER="sa"
SSH_HOST="minn0701.iptime.org"
SSH_PORT="999"

echo "📦 ENSM 스크립트 배포 시작..."

# 스크립트 파일에 실행 권한 부여
find "$SCRIPT_DIR" -name "*.sh" -type f -exec chmod +x {} \;

# deploy.sh 자체는 제외하고 배포
TEMP_DIR=$(mktemp -d)
cp -r "$SCRIPT_DIR" "$TEMP_DIR/ensm-scripts"
rm -f "$TEMP_DIR/ensm-scripts/deploy.sh"

# 서버에 스크립트 폴더 전송
echo "📤 스크립트 폴더 전송 중..."
expect <<EOF
spawn scp -r -P $SSH_PORT "$TEMP_DIR/ensm-scripts" ${SSH_USER}@${SSH_HOST}:${TARGET_DIR}/
expect "password:"
send "1006\r"
expect eof
EOF

# 임시 디렉토리 정리
rm -rf "$TEMP_DIR"

if [ $? -eq 0 ]; then
    echo "✅ 스크립트 배포 완료: ${SSH_HOST}:${TARGET_DIR}/ensm-scripts"
    echo ""
    echo "서버에서 실행 권한 부여 중..."
    expect <<EOF
spawn ssh -p $SSH_PORT ${SSH_USER}@${SSH_HOST} "sudo chmod +x ${TARGET_DIR}/ensm-scripts/*/*.sh 2>/dev/null || chmod +x ${TARGET_DIR}/ensm-scripts/*/*.sh"
expect "password:"
send "1006\r"
expect eof
EOF
    echo "✅ 배포 및 권한 설정 완료"
else
    echo "❌ 스크립트 배포 실패"
    exit 1
fi

