#!/bin/bash

# 프로젝트 루트로 이동
cd /Users/a/git/Capstone/ensm-server || exit 1

# Gradle 빌드
echo "🔨 Gradle 빌드 시작..."
./gradlew clean build || { echo " Gradle 빌드 실패"; exit 1; }

# 빌드된 JAR 경로로 이동
cd build/libs || { echo "build/libs 디렉토리 이동 실패"; exit 1; }

# JAR 파일명 (정적 or 동적 추출)
JAR_NAME="ensm-server-0.0.1-SNAPSHOT.jar"

# SCP로 서버에 전송
echo "JAR 파일 전송 중..."
expect <<EOF
spawn scp -P 999 "$JAR_NAME" sa@minn0701.iptime.org:/home/sa
expect "password:"
send "1006\r"
expect eof
EOF

echo "ensm jar 전송 완료"
