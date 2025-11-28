# 누락된 가이드 문서 완전 목록

## 확인 방법
SettingItem의 getDocumentKey 함수:
- docKey가 있으면: 그대로 사용
- docKey가 없고 menu가 있으면: `${menu}_${sanitizedLabel}` 형식
- sanitizedLabel: label의 공백을 언더스코어로, 특수문자 제거 (한글 유지)

## Settings.jsx (ensm menu)

### 필요한 문서:
1. ❌ `ensm_시스템_이름` - "시스템 이름" (label) + menu="ensm"
2. ❌ `ensm_다크_모드` - "다크 모드" (label) + menu="ensm"
3. ❌ `ensm_Loki_로그_레벨` - "Loki 로그 레벨" (label) + menu="ensm"
4. ❌ `ensm_시스템_알림` - "시스템 알림" (label) + menu="ensm"
5. ❌ `ensm_자동_새로고침` - "자동 새로고침" (label) + menu="ensm"
6. ❌ `ensm_새로고침_주기초` - "새로고침 주기(초)" (label) + menu="ensm"

### 기존 파일 확인:
- `ensm_시스템_이름.md` ✅ 존재

## DdnsManagement.jsx (ddns menu)

### 필요한 문서:
1. ❌ `ddns_DDNS_기능_활성화` - "DDNS 기능 활성화" (label) + menu="ddns"
   - 기존: `ddns_DDNS_활성화.md` (파일명 불일치)
2. ✅ `ddns_Cloudflare_API_토큰` - "Cloudflare API 토큰" (label) + menu="ddns"
3. ⚠️ `ddns_Zone_이름_도메인` - "Zone 이름 (도메인)" (label) + menu="ddns"
   - 기존: `ddns_Zone_이름.md` (괄호 부분 빠짐)
4. ✅ `ddns_레코드_이름` - "레코드 이름" (label) + menu="ddns"
5. ⚠️ `ddns_TTL` - "TTL" (label) + menu="ddns"
   - 기존: `ddns_TTL_초.md` (불일치)

## SSHAutomation.jsx (ssh menu)

### 필요한 문서:
1. ⚠️ `ssh_키_알고리즘` - "키 알고리즘" (label) + menu="ssh"
   - 기존: `ssh_키_타입.md` (파일명 불일치)
2. ⚠️ `ssh_키_크기_Bits` - "키 크기 (Bits)" (label) + menu="ssh"
   - 기존: `ssh_키_크기.md` (파일명 불일치)
3. ⚠️ `ssh_주석_Comment` - "주석 (Comment)" (label) + menu="ssh"
   - 기존: `ssh_주석.md` (파일명 불일치)
4. ✅ `ssh_공개키_경로` - "공개키 경로" (label) + menu="ssh"
5. ⚠️ `ssh_원격_사용자` - "원격 사용자" (label) + menu="ssh"
   - 기존: `ssh_사용자.md` (파일명 불일치)
6. ⚠️ `ssh_원격_호스트_IP` - "원격 호스트 IP" (label) + menu="ssh"
   - 기존: `ssh_호스트.md` (파일명 불일치)
7. ⚠️ `ssh_SSH_포트` - "SSH 포트" (label) + menu="ssh"
   - 기존: `ssh_포트.md` (파일명 불일치)

## CronManagement.jsx (cron menu)

### 필요한 문서:
1. ⚠️ `cron_실행_명령어` - "실행 명령어" (label) + menu="cron"
   - 기존: `cron_명령어.md` (파일명 불일치)

## DiskManagement.jsx (system menu)

### 필요한 문서:
1. ❌ `system_디스크_선택` - "디스크 선택"
2. ❌ `system_파티션_크기` - "파티션 크기"
3. ❌ `system_파티션_타입` - "파티션 타입"
4. ❌ `system_파일시스템` - "파일시스템"
5. ❌ `system_파티션_선택` - "파티션 선택"
6. ❌ `system_레이블_선택` - "레이블 (선택)"
7. ❌ `system_마운트_위치` - "마운트 위치"

## LvmManagement.jsx (system menu)

### 필요한 문서:
1. ❌ `system_VG_이름` - "VG 이름"
2. ❌ `system_물리_볼륨PV` - "물리 볼륨(PV)"
3. ❌ `system_대상_VG` - "대상 VG"
4. ❌ `system_LV_이름` - "LV 이름"
5. ❌ `system_크기` - "크기"
6. ❌ `system_파일시스템` - "파일시스템" (중복)

## RaidManagement.jsx (system menu)

### 필요한 문서:
1. ❌ `system_RAID_이름` - "RAID 이름"
2. ❌ `system_RAID_레벨` - "RAID 레벨"
3. ❌ `system_사용할_디스크` - "사용할 디스크"
4. ❌ `system_스페어_디스크` - "스페어 디스크"
5. ❌ `system_청크_크기_KB` - "청크 크기 (KB)"

## 해결 방법

### 방법 1: 파일명 변경 (기존 파일 활용)
기존 파일을 새 이름으로 복사 또는 심볼릭 링크

### 방법 2: 새 문서 작성 (권장)
누락된 문서를 기존 양식에 맞춰 작성

