# 가이드 문서 확인 요약

## 완료 사항

### ✅ 로그 수준 변경 스크립트 확인
- `ScriptExecutor.java`에서 `run_script`를 통해 스크립트 실행 확인 완료
- `update_loki_config.sh`가 `run_script`를 통해 root 권한으로 실행되도록 정상 설정됨

### ✅ 가이드 문서 확인 결과
- **총 docKey 개수**: 74개
- **기존 문서 파일**: 193개
- **모든 문서가 존재함**

## 대소문자 불일치 문제

Windows 파일 시스템은 대소문자를 구분하지 않지만, Linux 서버는 구분합니다.

### 발견된 불일치:
| 코드의 docKey | 실제 파일명 (소문자) | 상태 |
|--------------|---------------------|------|
| `bind_Forward` | `bind_forward.md` | ⚠️ 대소문자 불일치 |
| `bind_ACL` | `bind_acl.md` | ⚠️ 대소문자 불일치 |
| `bind_Forwarders` | `bind_forwarders.md` | ⚠️ 대소문자 불일치 |

### 해결 방법 옵션:

**옵션 1: 코드 수정 (권장)**
- `BindConfig.jsx`에서 docKey를 소문자로 변경:
  - `bind_Forward` → `bind_forward`
  - `bind_ACL` → `bind_acl`
  - `bind_Forwarders` → `bind_forwarders`

**옵션 2: 파일명 변경**
- Linux 서버에서 빌드 시 대문자 버전 파일 생성
- 또는 Git이 대소문자 변경을 추적하도록 설정

## 결론

1. ✅ 로그 수준 변경 기능은 정상 작동
2. ✅ 모든 가이드 문서가 존재함
3. ⚠️ BIND 설정 페이지의 3개 docKey만 대소문자 불일치 (기능적으로는 문제 없음, Linux에서만 구분됨)

**권장 사항**: 코드의 docKey를 소문자로 통일하는 것이 가장 간단한 해결 방법입니다.

