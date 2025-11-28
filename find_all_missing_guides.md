# 누락된 가이드 문서 목록

## 추출 방법
SettingItem 컴포넌트의 getDocumentKey 로직:
- docKey가 있으면: 그대로 사용
- docKey가 없고 menu가 있으면: `${menu}_${sanitizedLabel}` (label의 공백을 언더스코어로, 특수문자 제거)
- 둘 다 없으면: `sanitizedLabel`만 사용

## Settings.jsx (ensm menu)
1. ensm_시스템_이름 (label: "시스템 이름", menu: "ensm")
2. ensm_다크_모드 (label: "다크 모드", menu: "ensm") ❌
3. ensm_Loki_로그_레벨 (label: "Loki 로그 레벨", menu: "ensm") ❌
4. ensm_시스템_알림 (label: "시스템 알림", menu: "ensm") ❌
5. ensm_자동_새로고침 (label: "자동 새로고침", menu: "ensm") ❌
6. ensm_새로고침_주기초 (label: "새로고침 주기(초)", menu: "ensm") ❌

## DdnsManagement.jsx (ddns menu)
1. ddns_DDNS_기능_활성화 (label: "DDNS 기능 활성화", menu: "ddns") ❌
2. ddns_Cloudflare_API_토큰 (label: "Cloudflare API 토큰", menu: "ddns") ✅
3. ddns_Zone_이름_도메인 (label: "Zone 이름 (도메인)", menu: "ddns") ⚠️ → ddns_Zone_이름.md 존재 (확인 필요)
4. ddns_레코드_이름 (label: "레코드 이름", menu: "ddns") ✅
5. ddns_TTL_초 (label: "TTL", menu: "ddns") ⚠️ → ddns_TTL_초.md 존재하지만 label이 "TTL"이면 "ddns_TTL"일 수도

## DiskManagement.jsx (system menu)
- system_디스크_선택
- system_파티션_크기
- system_파티션_타입
- system_파일시스템
- system_파티션_선택 (2곳에서 사용)
- system_레이블_선택
- system_마운트_위치

## LvmManagement.jsx (system menu)
- system_VG_이름
- system_물리_볼륨PV
- system_대상_VG
- system_LV_이름
- system_크기
- system_파일시스템 (중복)

## RaidManagement.jsx (system menu)
- system_RAID_이름
- system_RAID_레벨
- system_사용할_디스크
- system_스페어_디스크
- system_청크_크기_KB

## CronManagement.jsx (cron menu)
- cron_실행_명령어

## SSHAutomation.jsx (ssh menu)
- ssh_키_알고리즘
- ssh_키_크기_Bits
- ssh_주석_Comment
- ssh_공개키_경로
- ssh_원격_사용자
- ssh_원격_호스트_IP
- ssh_SSH_포트

## 확인 필요 사항
1. 실제로 파일이 존재하는지
2. 파일명 형식이 일치하는지 (특수문자, 괄호 처리 등)

