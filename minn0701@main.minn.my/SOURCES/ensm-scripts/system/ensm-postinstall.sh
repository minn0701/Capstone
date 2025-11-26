#!/bin/bash
# ENSM Post-Installation Setup Script
# 
# 이 스크립트는 RPM 설치 후 초기 설정을 수행합니다.
# 실제 무거운 작업은 %posttrans에서 수행되므로,
# 여기서는 추가적인 초기화 작업만 수행합니다.

set -e

echo "ENSM Post-Installation Setup 시작..."

# 추가 초기화 작업이 필요한 경우 여기에 작성
# 현재는 %posttrans에서 모든 작업을 수행하므로 빈 스크립트

echo "ENSM Post-Installation Setup 완료."

exit 0

