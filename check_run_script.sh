#!/bin/bash
# run_script 상태 확인 스크립트

echo "=========================================="
echo "run_script 상태 확인"
echo "=========================================="
echo ""

echo "1. run_script 파일 존재 여부:"
if [ -f /usr/local/bin/ensm-scripts/system/run_script ]; then
    echo "   ✅ 파일 존재"
    echo ""
    echo "2. 파일 권한 및 소유자:"
    ls -la /usr/local/bin/ensm-scripts/system/run_script
    echo ""
    echo "3. setuid 비트 확인:"
    PERM=$(stat -c '%a' /usr/local/bin/ensm-scripts/system/run_script 2>/dev/null)
    if [ "$PERM" = "4755" ] || [ "$PERM" = "6755" ]; then
        echo "   ✅ setuid 비트 설정됨 (권한: $PERM)"
    else
        echo "   ❌ setuid 비트 설정 안됨 (권한: $PERM, 예상: 4755)"
    fi
    echo ""
    echo "4. 소유자 확인:"
    OWNER=$(stat -c '%U:%G' /usr/local/bin/ensm-scripts/system/run_script 2>/dev/null)
    if [ "$OWNER" = "root:root" ]; then
        echo "   ✅ root:root 소유"
    else
        echo "   ❌ 소유자가 root:root가 아님 (현재: $OWNER)"
    fi
    echo ""
    echo "5. SELinux 컨텍스트:"
    ls -laZ /usr/local/bin/ensm-scripts/system/run_script 2>/dev/null || echo "   ⚠️ SELinux 정보 확인 불가"
    echo ""
    echo "6. run_script.c 소스 파일:"
    if [ -f /usr/local/bin/ensm-scripts/system/run_script.c ]; then
        echo "   ✅ 소스 파일 존재"
    else
        echo "   ❌ 소스 파일 없음"
    fi
    echo ""
    echo "7. gcc 설치 여부:"
    if command -v gcc &> /dev/null; then
        echo "   ✅ gcc 설치됨"
        gcc --version | head -1
    else
        echo "   ❌ gcc 미설치"
    fi
    echo ""
    echo "8. run_script 테스트 (ensm 사용자로):"
    echo "   실제 UID와 유효 UID 확인:"
    sudo -u ensm /usr/local/bin/ensm-scripts/system/run_script /bin/sh -c 'echo "실제 UID: $(id -ru), 유효 UID: $(id -u)"' 2>&1 | head -5
else
    echo "   ❌ 파일 없음"
    echo ""
    echo "run_script 파일이 없습니다. 다음을 확인하세요:"
    echo "  - RPM 패키지가 제대로 설치되었는지"
    echo "  - %post 스크립트가 실행되었는지"
    echo "  - /usr/local/bin/ensm-scripts/system/ 디렉토리 존재 여부"
fi

echo ""
echo "=========================================="
echo "SELinux 상태:"
echo "=========================================="
getenforce 2>/dev/null || echo "SELinux 확인 불가"
echo ""
echo "설치된 SELinux 모듈 (ensm_run_script 관련):"
semodule -l | grep ensm_run_script || echo "   관련 모듈 없음"

