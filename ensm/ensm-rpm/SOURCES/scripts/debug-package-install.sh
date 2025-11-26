#!/bin/bash
# 패키지 설치 디버깅 스크립트
# 
# 사용법: ./debug-package-install.sh [package_name]

PACKAGE="${1:-apache}"

echo "=========================================="
echo "패키지 설치 디버깅: $PACKAGE"
echo "=========================================="
echo ""

# 1. run_script 확인
echo "━━━ 1. run_script 확인 ━━━"
if [ -f /usr/local/bin/ensm-scripts/system/run_script ]; then
    echo "✓ run_script 파일 존재"
    ls -la /usr/local/bin/ensm-scripts/system/run_script
    echo ""
    
    # 소유권 확인
    OWNER=$(stat -c '%U:%G' /usr/local/bin/ensm-scripts/system/run_script 2>/dev/null)
    PERM=$(stat -c '%a' /usr/local/bin/ensm-scripts/system/run_script 2>/dev/null)
    
    if [ "$OWNER" = "root:root" ]; then
        echo "✓ 소유권: $OWNER (정상)"
    else
        echo "✗ 소유권: $OWNER (root:root여야 함)"
    fi
    
    if [ "$PERM" = "4755" ]; then
        echo "✓ 권한: $PERM (정상)"
    else
        echo "✗ 권한: $PERM (4755여야 함)"
    fi
else
    echo "✗ run_script 파일이 없습니다!"
    echo "  컴파일 필요: gcc -o /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/run_script.c"
    echo "  setuid 설정: chown root:root /usr/local/bin/ensm-scripts/system/run_script && chmod 4755 /usr/local/bin/ensm-scripts/system/run_script"
fi
echo ""

# 2. manage_packages.sh 확인
echo "━━━ 2. manage_packages.sh 확인 ━━━"
if [ -f /usr/local/bin/ensm-scripts/system/manage_packages.sh ]; then
    echo "✓ manage_packages.sh 파일 존재"
    ls -la /usr/local/bin/ensm-scripts/system/manage_packages.sh
else
    echo "✗ manage_packages.sh 파일이 없습니다!"
fi
echo ""

# 3. run_script로 직접 테스트
echo "━━━ 3. run_script 직접 테스트 ━━━"
echo "명령어: /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/manage_packages.sh list"
echo ""
/usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/manage_packages.sh list 2>&1 | head -20
echo ""

# 3-1. run_script가 실제로 root로 실행되는지 테스트
echo "━━━ 3-1. run_script root 권한 테스트 ━━━"
echo "명령어: /usr/local/bin/ensm-scripts/system/run_script /bin/sh -c 'id'"
echo ""
/usr/local/bin/ensm-scripts/system/run_script /bin/sh -c 'id' 2>&1
echo ""

# 3-2. SELinux 확인
echo "━━━ 3-2. SELinux 상태 확인 ━━━"
if command -v getenforce &> /dev/null; then
    SELINUX_STATUS=$(getenforce 2>/dev/null)
    echo "SELinux 상태: $SELINUX_STATUS"
    if [ "$SELINUX_STATUS" = "Enforcing" ]; then
        echo "⚠️ SELinux가 Enforcing 모드입니다. setuid 실행이 차단될 수 있습니다."
        echo "  run_script의 SELinux 컨텍스트 확인:"
        ls -Z /usr/local/bin/ensm-scripts/system/run_script 2>/dev/null || echo "  ls -Z 명령 실패"
    fi
else
    echo "SELinux가 설치되어 있지 않습니다."
fi
echo ""

# 3-3. 파일 시스템 마운트 옵션 확인
echo "━━━ 3-3. 파일 시스템 마운트 옵션 확인 ━━━"
MOUNT_POINT=$(df /usr/local/bin/ensm-scripts/system/run_script | tail -1 | awk '{print $NF}')
echo "마운트 포인트: $MOUNT_POINT"
MOUNT_OPTS=$(mount | grep " $MOUNT_POINT " | grep -o "nosuid" || echo "")
if [ -n "$MOUNT_OPTS" ]; then
    echo "⚠️ 파일 시스템이 nosuid 옵션으로 마운트되어 있습니다!"
    echo "  setuid가 작동하지 않습니다."
else
    echo "✓ nosuid 옵션이 없습니다."
fi
echo ""

# 4. 패키지 설치 테스트 (실제 설치하지 않고 확인만)
echo "━━━ 4. 패키지 설치 여부 확인 ━━━"
/usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/manage_packages.sh is_installed "$PACKAGE" 2>&1
echo ""

# 5. 백엔드 로그 확인
echo "━━━ 5. 백엔드 로그 (최근 30줄) ━━━"
echo "journalctl -u ensm-main.service -n 30 --no-pager"
echo ""
journalctl -u ensm-main.service -n 30 --no-pager | grep -i -E "(package|install|manage_packages|run_script|오류|error)" || echo "관련 로그 없음"
echo ""

# 6. 애플리케이션 로그 파일 확인
echo "━━━ 6. 애플리케이션 로그 파일 (최근 30줄) ━━━"
if [ -f /var/log/ensm/main/main-app.log ]; then
    echo "tail -n 30 /var/log/ensm/main/main-app.log"
    echo ""
    tail -n 30 /var/log/ensm/main/main-app.log | grep -i -E "(package|install|manage_packages|run_script|오류|error)" || echo "관련 로그 없음"
else
    echo "✗ 로그 파일이 없습니다: /var/log/ensm/main/main-app.log"
fi
echo ""

# 7. 실제 설치 시도 (선택사항)
echo "━━━ 7. 실제 설치 테스트 (선택사항) ━━━"
echo "다음 명령어로 실제 설치를 테스트할 수 있습니다:"
echo "  /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/manage_packages.sh install $PACKAGE"
echo ""
read -p "실제 설치를 시도하시겠습니까? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "설치 시도 중..."
    /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/manage_packages.sh install "$PACKAGE" 2>&1
    echo ""
    echo "설치 완료. 상태 확인:"
    /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/manage_packages.sh is_installed "$PACKAGE" 2>&1
fi

echo ""
echo "=========================================="
echo "디버깅 완료"
echo "=========================================="

