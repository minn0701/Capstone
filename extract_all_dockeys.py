#!/usr/bin/env python3
# 프론트엔드에서 모든 docKey 추출 (docKey 직접 지정 + menu+label 조합)

import os
import re
from pathlib import Path

src_dir = Path("ensm/ensm-main/src/main/resources/static/main/src")
descriptions_dir = Path("ensm/ensm-main/src/main/resources/static/main/descriptions")

# 문서 키 추출 함수 (SettingItem의 getDocumentKey 로직과 동일)
def sanitize_label(label):
    """label을 파일명에 적합한 형식으로 변환"""
    # 공백을 언더스코어로, 특수문자 제거하되 한글은 유지
    sanitized = label.replace(" ", "_").replace("\t", "_").replace("\n", "_")
    # 영문, 숫자, 언더스코어, 한글만 남김
    sanitized = re.sub(r'[^a-zA-Z0-9_가-힣]', '', sanitized)
    return sanitized

def get_document_key(docKey, menu, label):
    """SettingItem의 getDocumentKey 로직과 동일"""
    if docKey:
        return docKey
    if menu:
        sanitized_label = sanitize_label(label)
        return f"{menu}_{sanitized_label}"
    # menu도 없으면 label만 사용
    return sanitize_label(label)

dockeys = set()

# 모든 JSX 파일에서 SettingItem 사용 찾기
for jsx_file in src_dir.rglob("*.jsx"):
    content = jsx_file.read_text(encoding="utf-8")
    
    # SettingItem 컴포넌트 사용 찾기
    setting_item_pattern = r'<SettingItem[^>]*>'
    matches = re.finditer(setting_item_pattern, content, re.DOTALL)
    
    for match in matches:
        # SettingItem 시작부터 닫는 태그까지 추출
        start = match.start()
        # 닫는 태그 찾기 (간단한 방법: /> 또는 </SettingItem>)
        closing = content.find('/>', start)
        if closing == -1:
            closing = content.find('</SettingItem>', start)
        if closing == -1:
            continue
        
        item_content = content[start:closing+2]
        
        # docKey 추출
        docKey_match = re.search(r'docKey=["\']([^"\']+)["\']', item_content)
        docKey = docKey_match.group(1) if docKey_match else None
        
        # menu 추출
        menu_match = re.search(r'menu=["\']([^"\']+)["\']', item_content)
        menu = menu_match.group(1) if menu_match else None
        
        # label 추출
        label_match = re.search(r'label=["\']([^"\']+)["\']', item_content)
        label = label_match.group(1) if label_match else None
        
        if label:  # label은 필수
            document_key = get_document_key(docKey, menu, label)
            dockeys.add(document_key)

print(f"총 {len(dockeys)} 개의 documentKey 발견\n")

# descriptions 디렉토리의 파일 목록 (확장자 제외)
existing_files = {f.stem for f in descriptions_dir.glob("*.md")}
print(f"기존 문서 파일: {len(existing_files)} 개\n")

# 누락된 문서 찾기
missing = []
for dockey in sorted(dockeys):
    if dockey not in existing_files:
        missing.append(dockey)
        print(f"❌ 누락: {dockey}.md")

print(f"\n총 {len(missing)} 개의 문서가 누락되었습니다.")

# 누락된 문서 목록을 파일로 저장
if missing:
    with open("missing_guides.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(missing))
    print(f"\n누락된 문서 목록이 missing_guides.txt에 저장되었습니다.")

