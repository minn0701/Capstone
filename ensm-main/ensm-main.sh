#!/bin/bash

# ensm-main 프로젝트 빌드 및 배포 스크립트
# 사용법: ./ensm-main.sh [build|deploy]
# build: 빌드만 수행
# deploy: 빌드 후 서버로 배포 (기본값)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

ACTION="${1:-deploy}"

# Gradle 빌드
echo "🔨 ensm-main Gradle 빌드 시작..."
./gradlew clean build || { 
    echo "❌ Gradle 빌드 실패"
    exit 1
}

if [ "$ACTION" = "build" ]; then
    echo "✅ 빌드 완료: build/libs/ensm-main-0.0.1-SNAPSHOT.jar"
    exit 0
fi

# 배포 모드: SCP로 서버에 전송
cd build/libs || { 
    echo "❌ build/libs 디렉토리 이동 실패"
    exit 1
}

JAR_NAME="ensm-main-0.0.1-SNAPSHOT.jar"

if [ ! -f "$JAR_NAME" ]; then
    echo "❌ JAR 파일을 찾을 수 없습니다: $JAR_NAME"
    exit 1
fi

echo "📦 JAR 파일 전송 중..."
expect <<EOF
spawn scp -P 999 "$JAR_NAME" sa@minn0701.iptime.org:/home/sa
expect "password:"
send "1006\r"
expect eof
EOF

echo "✅ ensm-main JAR 전송 완료"
