# 로그 수준 변경 및 가이드 문서 확인 요약

## 1. 로그 수준 변경 스크립트 확인

### ✅ 확인 완료
- `ScriptExecutor.java`에서 `run_script`를 통해 스크립트를 실행함 (73-74줄)
- `SystemConfigController.java`에서 `update_loki_config.sh`를 호출할 때 `scriptExecutor.executeScript("system/update_loki_config.sh", ...)` 사용
- **결론**: `run_script`를 통해 root 권한으로 실행되도록 정상적으로 설정되어 있음

## 2. 가이드 문서 현황

### 파일명 대소문자 차이 발견

코드에서 사용하는 docKey와 실제 파일명이 다른 경우:

| 코드의 docKey | 실제 파일명 | 상태 |
|--------------|------------|------|
| `bind_Forward` | `bind_forward.md` | ❌ 대소문자 불일치 |
| `bind_ACL` | `bind_acl.md` | ❌ 대소문자 불일치 |

### 존재하는 문서
- `plex_RemoteAccess.md` ✅
- `plex_AllowedNetworks.md` ✅
- `bind_forward.md` ✅ (대소문자만 다름)
- `bind_acl.md` ✅ (대소문자만 다름)

## 3. 해결 방안

### 옵션 1: 파일명 수정 (권장)
- `bind_forward.md` → `bind_Forward.md`
- `bind_acl.md` → `bind_ACL.md`

### 옵션 2: 코드의 docKey 수정
- `bind_Forward` → `bind_forward`
- `bind_ACL` → `bind_acl`

### 옵션 3: 파일명 대소문자 무시 확인
- Linux는 대소문자를 구분하므로 파일명을 정확히 맞춰야 함

## 4. 다음 단계

1. 파일명을 코드의 docKey와 일치시킬지 결정
2. 파일명 변경 또는 코드 수정
3. 누락된 문서가 있는지 추가 확인

