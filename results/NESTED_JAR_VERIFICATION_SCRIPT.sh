#!/bin/bash
# 중첩된 JAR 파일 검증 스크립트

JAR_FILE="/root/cloud/Data/ensm-rpm/SOURCES/ensm-main-0.0.1-SNAPSHOT.jar"
TEMP_DIR="/tmp/jar-extract-$$"

echo "=== 중첩된 JAR 파일 검증 ==="
echo "JAR 파일: $JAR_FILE"
echo ""

# 임시 디렉토리 생성
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# JAR 파일 추출
echo "1. JAR 파일 추출 중..."
unzip -q "$JAR_FILE" BOOT-INF/lib/*.jar 2>&1

if [ $? -ne 0 ]; then
    echo "오류: JAR 파일 추출 실패"
    exit 1
fi

# 각 중첩된 JAR 파일 검증
echo ""
echo "2. 중첩된 JAR 파일 검증 중..."
echo ""

ERROR_COUNT=0
TOTAL_COUNT=0

for jar in BOOT-INF/lib/*.jar; do
    if [ -f "$jar" ]; then
        TOTAL_COUNT=$((TOTAL_COUNT + 1))
        JAR_NAME=$(basename "$jar")
        JAR_SIZE=$(ls -lh "$jar" | awk '{print $5}')
        
        # JAR 파일 무결성 테스트
        unzip -t "$jar" > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "✓ OK: $JAR_NAME ($JAR_SIZE)"
        else
            ERROR_COUNT=$((ERROR_COUNT + 1))
            echo "✗ ERROR: $JAR_NAME ($JAR_SIZE) - 손상됨!"
            
            # 상세 오류 정보
            echo "  상세 오류:"
            unzip -t "$jar" 2>&1 | head -5 | sed 's/^/    /'
        fi
    fi
done

echo ""
echo "=== 검증 결과 ==="
echo "전체: $TOTAL_COUNT"
echo "정상: $((TOTAL_COUNT - ERROR_COUNT))"
echo "오류: $ERROR_COUNT"

# 정리
cd /
rm -rf "$TEMP_DIR"

if [ $ERROR_COUNT -gt 0 ]; then
    echo ""
    echo "경고: 손상된 JAR 파일이 발견되었습니다!"
    exit 1
else
    echo ""
    echo "모든 중첩된 JAR 파일이 정상입니다."
    exit 0
fi

