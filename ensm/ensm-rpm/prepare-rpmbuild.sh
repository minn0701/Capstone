#!/bin/bash
# RPM 빌드를 위해 SOURCES 파일들을 rpmbuild 디렉토리로 복사하는 스크립트
# 
# 사용법: ./prepare-rpmbuild.sh
# 
# 작업 내용:
# 1. rpmbuild 디렉토리 구조 생성
# 2. SOURCES 디렉토리의 모든 파일을 /root/rpmbuild/SOURCES로 복사

set -e

echo "=========================================="
echo "RPM 빌드 준비 시작"
echo "=========================================="

# 현재 스크립트 위치 확인
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCES_DIR="$SCRIPT_DIR/SOURCES"
RPMBUILD_SOURCES="/root/rpmbuild/SOURCES"

echo ""
echo "소스 디렉토리: $SOURCES_DIR"
echo "대상 디렉토리: $RPMBUILD_SOURCES"
echo ""

# rpmbuild 디렉토리 구조 생성
echo "rpmbuild 디렉토리 구조 생성 중..."
mkdir -p "$RPMBUILD_SOURCES"
mkdir -p /root/rpmbuild/SPECS
mkdir -p /root/rpmbuild/BUILD
mkdir -p /root/rpmbuild/BUILDROOT
mkdir -p /root/rpmbuild/RPMS
mkdir -p /root/rpmbuild/SRPMS

# SPEC 파일 복사
if [ -f "$SCRIPT_DIR/SPECS/ensm.spec" ]; then
    echo "SPEC 파일 복사 중..."
    cp "$SCRIPT_DIR/SPECS/ensm.spec" /root/rpmbuild/SPECS/
    echo "✅ SPEC 파일 복사 완료"
else
    echo "⚠️  경고: SPEC 파일을 찾을 수 없습니다: $SCRIPT_DIR/SPECS/ensm.spec"
fi

# SOURCES 디렉토리 확인
if [ ! -d "$SOURCES_DIR" ]; then
    echo "❌ 오류: SOURCES 디렉토리를 찾을 수 없습니다: $SOURCES_DIR"
    exit 1
fi

# SOURCES 디렉토리의 모든 파일 및 디렉토리를 rpmbuild/SOURCES로 복사
echo ""
echo "SOURCES 파일 복사 중..."
echo "  - JAR 파일"
echo "  - 스크립트 디렉토리"
echo "  - 설정 파일"
echo "  - 의존성 파일"
echo "  - systemd 서비스 파일"
echo ""

# 기존 파일이 있으면 백업 (선택사항)
if [ -d "$RPMBUILD_SOURCES" ] && [ "$(ls -A $RPMBUILD_SOURCES 2>/dev/null)" ]; then
    echo "⚠️  기존 SOURCES 파일이 있습니다. 백업 중..."
    BACKUP_DIR="/root/rpmbuild/SOURCES.backup.$(date +%Y%m%d_%H%M%S)"
    mv "$RPMBUILD_SOURCES" "$BACKUP_DIR"
    mkdir -p "$RPMBUILD_SOURCES"
    echo "✅ 백업 완료: $BACKUP_DIR"
fi

# 모든 파일 및 디렉토리 복사
cp -r "$SOURCES_DIR"/* "$RPMBUILD_SOURCES/"

# 복사 확인
if [ -f "$RPMBUILD_SOURCES/ensm-auth-0.0.1-SNAPSHOT.jar" ] && \
   [ -f "$RPMBUILD_SOURCES/ensm-main-0.0.1-SNAPSHOT.jar" ]; then
    echo "✅ JAR 파일 복사 완료"
else
    echo "⚠️  경고: 일부 JAR 파일이 복사되지 않았을 수 있습니다."
fi

# 파일 목록 표시
echo ""
echo "복사된 파일 확인:"
echo "  - JAR 파일:"
ls -lh "$RPMBUILD_SOURCES"/*.jar 2>/dev/null | awk '{print "    " $9 " (" $5 ")"}' || echo "    (JAR 파일 없음)"
echo "  - 디렉토리:"
ls -d "$RPMBUILD_SOURCES"/*/ 2>/dev/null | awk -F'/' '{print "    " $NF}' || echo "    (디렉토리 없음)"

echo ""
echo "=========================================="
echo "RPM 빌드 준비 완료!"
echo "=========================================="
echo ""
echo "다음 명령어로 RPM 빌드를 실행하세요:"
echo "  rpmbuild -ba /root/rpmbuild/SPECS/ensm.spec"
echo ""
echo "또는 ensm-rpm 디렉토리에서:"
echo "  cd $SCRIPT_DIR"
echo "  rpmbuild -ba SPECS/ensm.spec"
echo ""

