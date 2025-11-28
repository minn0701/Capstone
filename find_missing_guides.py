#!/usr/bin/env python3
# 누락된 가이드 문서 찾기

import os
import re
from pathlib import Path

# 모든 docKey 추출
src_dir = Path("ensm/ensm-main/src/main/resources/static/main/src")
descriptions_dir = Path("ensm/ensm-main/src/main/resources/static/main/descriptions")

# docKey 패턴 추출
dockeys = set()
for jsx_file in src_dir.rglob("*.jsx"):
    content = jsx_file.read_text(encoding="utf-8")
    matches = re.findall(r'docKey="([^"]+)"', content)
    dockeys.update(matches)

print(f"총 {len(dockeys)} 개의 docKey 발견\n")

# descriptions 디렉토리의 파일 목록
existing_files = {f.stem for f in descriptions_dir.glob("*.md")}
print(f"기존 문서 파일: {len(existing_files)} 개\n")

# 누락된 문서 찾기
missing = []
for dockey in sorted(dockeys):
    if dockey not in existing_files:
        missing.append(dockey)
        print(f"❌ 누락: {dockey}.md")

print(f"\n총 {len(missing)} 개의 문서가 누락되었습니다.")
