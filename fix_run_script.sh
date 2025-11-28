#!/bin/bash
# run_script 수동 수정 스크립트

echo "=========================================="
echo "run_script 수동 수정"
echo "=========================================="
echo ""

# 1. gcc 확인 및 설치
if ! command -v gcc &> /dev/null; then
    echo "❌ gcc가 설치되어 있지 않습니다."
    echo "다음 명령으로 설치하세요:"
    echo "  dnf install -y gcc"
    exit 1
fi

# 2. run_script.c 확인
if [ ! -f /usr/local/bin/ensm-scripts/system/run_script.c ]; then
    echo "❌ run_script.c 소스 파일을 찾을 수 없습니다."
    exit 1
fi

# 3. 컴파일
echo "run_script 컴파일 중..."
gcc -o /usr/local/bin/ensm-scripts/system/run_script /usr/local/bin/ensm-scripts/system/run_script.c

if [ $? -ne 0 ]; then
    echo "❌ 컴파일 실패"
    exit 1
fi

# 4. 권한 설정
echo "권한 설정 중..."
chown root:root /usr/local/bin/ensm-scripts/system/run_script
chmod 4755 /usr/local/bin/ensm-scripts/system/run_script

# 5. SELinux 컨텍스트 설정
if command -v chcon &> /dev/null && [ "$(getenforce)" != "Disabled" ]; then
    echo "SELinux 컨텍스트 설정 중..."
    chcon -t unconfined_exec_t /usr/local/bin/ensm-scripts/system/run_script 2>/dev/null || \
    chcon -t bin_t /usr/local/bin/ensm-scripts/system/run_script 2>/dev/null || true
fi

# 6. 확인
echo ""
echo "설정 완료. 확인:"
ls -laZ /usr/local/bin/ensm-scripts/system/run_script

echo ""
echo "테스트:"
sudo -u ensm /usr/local/bin/ensm-scripts/system/run_script /bin/sh -c 'echo "실제 UID: $(id -ru), 유효 UID: $(id -u)"' 2>&1

