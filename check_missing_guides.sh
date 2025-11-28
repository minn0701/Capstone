#!/bin/bash
# 누락된 가이드 문서 찾기

echo "=== 모든 docKey 추출 ==="
DOCKEYS=$(grep -r 'docKey=' ensm/ensm-main/src/main/resources/static/main/src --include="*.jsx" | sed -n 's/.*docKey="\([^"]*\)".*/\1/p' | sort -u)
echo "$DOCKEYS" | wc -l | xargs echo "총 docKey 개수:"

echo -e "\n=== descriptions 디렉토리 파일 목록 ==="
EXISTING=$(ls -1 ensm/ensm-main/src/main/resources/static/main/descriptions/*.md 2>/dev/null | xargs -n 1 basename | sed 's/\.md$//' | sort -u)
echo "$EXISTING" | wc -l | xargs echo "기존 문서 파일 개수:"

echo -e "\n=== 누락된 문서 찾기 ==="
MISSING=0
while IFS= read -r dockey; do
    if ! echo "$EXISTING" | grep -qi "^${dockey}$"; then
        echo "❌ 누락: ${dockey}.md"
        MISSING=$((MISSING + 1))
    fi
done <<< "$DOCKEYS"

echo -e "\n총 $MISSING 개의 문서가 누락되었습니다."

echo -e "\n=== 대소문자 차이 확인 ==="
echo "코드의 docKey와 파일명이 다른 경우 (대소문자만):"
while IFS= read -r dockey; do
    if ! echo "$EXISTING" | grep -qi "^${dockey}$"; then
        # 대소문자 무시하고 찾기
        MATCH=$(echo "$EXISTING" | grep -i "^${dockey}$" | head -1)
        if [ -n "$MATCH" ]; then
            echo "  코드: $dockey → 파일: $MATCH.md (대소문자 불일치)"
        fi
    fi
done <<< "$DOCKEYS"
