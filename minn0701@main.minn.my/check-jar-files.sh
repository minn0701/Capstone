#!/bin/bash
# JAR 파일 상태 확인 및 복사 스크립트

echo "=========================================="
echo "JAR 파일 상태 확인"
echo "=========================================="

SOURCE_DIR="/home/minn0701/ensm-rpm/SOURCES"
TARGET_DIR="/root/rpmbuild/SOURCES"

echo ""
echo "1. 원본 파일 확인:"
echo "   위치: $SOURCE_DIR"
if [ -f "$SOURCE_DIR/ensm-auth-0.0.1-SNAPSHOT.jar" ]; then
    echo "   ✅ ensm-auth-0.0.1-SNAPSHOT.jar 존재"
    ls -lh "$SOURCE_DIR/ensm-auth-0.0.1-SNAPSHOT.jar"
    # JAR 파일이 유효한 ZIP인지 확인
    if unzip -t "$SOURCE_DIR/ensm-auth-0.0.1-SNAPSHOT.jar" >/dev/null 2>&1; then
        echo "   ✅ JAR 파일이 유효합니다 (ZIP 형식 확인)"
    else
        echo "   ❌ JAR 파일이 손상되었을 수 있습니다!"
    fi
else
    echo "   ❌ ensm-auth-0.0.1-SNAPSHOT.jar 없음"
fi

if [ -f "$SOURCE_DIR/ensm-main-0.0.1-SNAPSHOT.jar" ]; then
    echo "   ✅ ensm-main-0.0.1-SNAPSHOT.jar 존재"
    ls -lh "$SOURCE_DIR/ensm-main-0.0.1-SNAPSHOT.jar"
    # JAR 파일이 유효한 ZIP인지 확인
    if unzip -t "$SOURCE_DIR/ensm-main-0.0.1-SNAPSHOT.jar" >/dev/null 2>&1; then
        echo "   ✅ JAR 파일이 유효합니다 (ZIP 형식 확인)"
    else
        echo "   ❌ JAR 파일이 손상되었을 수 있습니다!"
    fi
else
    echo "   ❌ ensm-main-0.0.1-SNAPSHOT.jar 없음"
fi

echo ""
echo "2. 대상 디렉토리 확인:"
echo "   위치: $TARGET_DIR"
if [ -d "$TARGET_DIR" ]; then
    echo "   ✅ 디렉토리 존재"
    if [ -f "$TARGET_DIR/ensm-auth-0.0.1-SNAPSHOT.jar" ]; then
        echo "   ✅ ensm-auth-0.0.1-SNAPSHOT.jar 존재"
        ls -lh "$TARGET_DIR/ensm-auth-0.0.1-SNAPSHOT.jar"
    else
        echo "   ❌ ensm-auth-0.0.1-SNAPSHOT.jar 없음 (복사 필요)"
    fi
    
    if [ -f "$TARGET_DIR/ensm-main-0.0.1-SNAPSHOT.jar" ]; then
        echo "   ✅ ensm-main-0.0.1-SNAPSHOT.jar 존재"
        ls -lh "$TARGET_DIR/ensm-main-0.0.1-SNAPSHOT.jar"
    else
        echo "   ❌ ensm-main-0.0.1-SNAPSHOT.jar 없음 (복사 필요)"
    fi
else
    echo "   ❌ 디렉토리 없음 (생성 필요)"
fi

echo ""
echo "3. 파일 복사 실행..."
mkdir -p "$TARGET_DIR"

if [ -f "$SOURCE_DIR/ensm-auth-0.0.1-SNAPSHOT.jar" ]; then
    cp -v "$SOURCE_DIR/ensm-auth-0.0.1-SNAPSHOT.jar" "$TARGET_DIR/"
    if [ $? -eq 0 ]; then
        echo "   ✅ ensm-auth JAR 복사 완료"
    else
        echo "   ❌ ensm-auth JAR 복사 실패"
    fi
fi

if [ -f "$SOURCE_DIR/ensm-main-0.0.1-SNAPSHOT.jar" ]; then
    cp -v "$SOURCE_DIR/ensm-main-0.0.1-SNAPSHOT.jar" "$TARGET_DIR/"
    if [ $? -eq 0 ]; then
        echo "   ✅ ensm-main JAR 복사 완료"
    else
        echo "   ❌ ensm-main JAR 복사 실패"
    fi
fi

echo ""
echo "4. 최종 확인:"
if [ -f "$TARGET_DIR/ensm-auth-0.0.1-SNAPSHOT.jar" ] && [ -f "$TARGET_DIR/ensm-main-0.0.1-SNAPSHOT.jar" ]; then
    echo "   ✅ 모든 JAR 파일이 /root/rpmbuild/SOURCES/에 준비되었습니다!"
    echo ""
    echo "   파일 목록:"
    ls -lh "$TARGET_DIR"/*.jar
else
    echo "   ❌ 일부 JAR 파일이 누락되었습니다."
fi

echo ""
echo "=========================================="

