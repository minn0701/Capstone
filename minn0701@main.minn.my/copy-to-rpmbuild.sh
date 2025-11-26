#!/bin/bash
# SOURCES 파일을 /root/rpmbuild/SOURCES로 복사하는 스크립트

SOURCE_DIR="/home/minn0701/ensm-rpm/SOURCES"
TARGET_DIR="/root/rpmbuild/SOURCES"

echo "=========================================="
echo "SOURCES 파일 복사"
echo "=========================================="
echo ""
echo "소스: $SOURCE_DIR"
echo "대상: $TARGET_DIR"
echo ""

# 디렉토리 생성
mkdir -p "$TARGET_DIR"

# 원본 디렉토리 확인
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ 오류: 소스 디렉토리를 찾을 수 없습니다: $SOURCE_DIR"
    exit 1
fi

# 파일 복사
echo "파일 복사 중..."
cp -rv "$SOURCE_DIR"/* "$TARGET_DIR/"

echo ""
echo "=========================================="
echo "복사 완료! 확인 중..."
echo "=========================================="
echo ""

# 복사 확인
echo "📁 디렉토리:"
ls -d "$TARGET_DIR"/*/ 2>/dev/null | while read dir; do
    echo "  - $(basename "$dir")"
done

echo ""
echo "📦 JAR 파일:"
ls -lh "$TARGET_DIR"/*.jar 2>/dev/null | awk '{print "  - " $9 " (" $5 ")"}' || echo "  (JAR 파일 없음)"

echo ""
echo "🔍 주요 디렉토리 확인:"
[ -d "$TARGET_DIR/ensm-scripts" ] && echo "  ✅ ensm-scripts" || echo "  ❌ ensm-scripts 없음"
[ -d "$TARGET_DIR/systemd" ] && echo "  ✅ systemd" || echo "  ❌ systemd 없음"
[ -d "$TARGET_DIR/scripts" ] && echo "  ✅ scripts" || echo "  ❌ scripts 없음"
[ -d "$TARGET_DIR/prometheus" ] && echo "  ✅ prometheus" || echo "  ❌ prometheus 없음"
[ -d "$TARGET_DIR/loki" ] && echo "  ✅ loki" || echo "  ❌ loki 없음"
[ -d "$TARGET_DIR/promtail" ] && echo "  ✅ promtail" || echo "  ❌ promtail 없음"
[ -d "$TARGET_DIR/dependencies" ] && echo "  ✅ dependencies" || echo "  ❌ dependencies 없음"

echo ""
echo "=========================================="
echo "✅ 복사 완료!"
echo "=========================================="
echo ""
echo "이제 RPM 빌드를 실행할 수 있습니다:"
echo "  cd /home/minn0701/ensm-rpm"
echo "  rpmbuild -ba SPECS/ensm.spec"
echo ""

