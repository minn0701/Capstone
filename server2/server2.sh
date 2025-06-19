#!/bin/bash

# server2 루트 디렉토리 이동
cd /Users/a/git/Capstone/server2 || exit 1

# Gradle 빌드
echo "server2 빌드 시작..."
./gradlew clean build || { echo "빌드 실패"; exit 1; }

# 빌드된 JAR 위치로 이동
cd build/libs || { echo "build/libs 디렉토리 이동 실패"; exit 1; }

# JAR 파일명
JAR_NAME="server2-0.0.1-SNAPSHOT.jar"

# SCP 전송
echo "server2 JAR 전송 중..."
expect <<EOF
spawn scp -P 999 "$JAR_NAME" sa@minn0701.iptime.org:/home/sa
expect "password:"
send "1006\r"
expect eof
EOF

echo "server2 전송 완료"
