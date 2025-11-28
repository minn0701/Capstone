# 누락된 가이드 문서 완전 분석

## SettingItem의 getDocumentKey 로직 분석

```javascript
const getDocumentKey = () => {
    if (docKey) return docKey;
    if (menu) {
        const sanitizedLabel = label.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_가-힣]/g, '');
        return `${menu}_${sanitizedLabel}`;
    }
    return label.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_가-힣]/g, '');
};
```

**핵심**: label에서 공백을 언더스코어로, 특수문자(괄호 등) 제거하되 한글은 유지

## 누락된 문서 목록

### Settings.jsx (ensm menu)
1. ❌ `ensm_다크_모드` - label: "다크 모드"
2. ❌ `ensm_Loki_로그_레벨` - label: "Loki 로그 레벨"
3. ❌ `ensm_시스템_알림` - label: "시스템 알림"
4. ❌ `ensm_자동_새로고침` - label: "자동 새로고침"
5. ❌ `ensm_새로고침_주기초` - label: "새로고침 주기(초)" → 괄호 제거됨

### DdnsManagement.jsx (ddns menu)
1. ❌ `ddns_DDNS_기능_활성화` - label: "DDNS 기능 활성화"
   - 기존 파일: `ddns_DDNS_활성화.md` (불일치)
2. ⚠️ `ddns_Zone_이름_도메인` - label: "Zone 이름 (도메인)"
   - 기존 파일: `ddns_Zone_이름.md` (괄호 부분 빠짐)

### DiskManagement.jsx, LvmManagement.jsx, RaidManagement.jsx, SSHAutomation.jsx, CronManagement.jsx
- 모든 system, ssh, cron menu 문서도 확인 필요

