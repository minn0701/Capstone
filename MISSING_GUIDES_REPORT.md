# 누락된 가이드 문서 확인 보고서

## 1. 대소문자 불일치 문제

### 발견된 불일치:
| 코드의 docKey | 실제 파일명 | 상태 |
|--------------|------------|------|
| `bind_Forward` | `bind_forward.md` | ❌ 대소문자 불일치 |
| `bind_ACL` | `bind_acl.md` | ❌ 대소문자 불일치 |

**해결 방법**: 파일명을 코드의 docKey와 일치시키기 위해 다음 파일을 생성/변경해야 함:
- `bind_Forward.md` (현재 `bind_forward.md` 존재)
- `bind_ACL.md` (현재 `bind_acl.md` 존재)

## 2. 코드에서 사용하는 모든 docKey 목록

### Apache (19개) - 모두 존재 ✅
- apache_Port
- apache_Firewall
- apache_ServerName_global
- apache_DocumentRoot
- apache_ServerAdmin
- apache_Require
- apache_AllowOverride
- apache_Indexes
- apache_LogLevel
- apache_ErrorLog
- apache_CustomLog
- apache_User
- apache_Group
- apache_ServerTokens
- apache_Timeout
- apache_HostnameLookups
- apache_FollowSymLinks
- apache_SymLinksIfOwnerMatch
- apache_ExecCGI

### BIND (13개) - 2개 대소문자 불일치 ⚠️
- bind_Port ✅
- bind_Firewall ✅
- bind_ListenOn ✅
- bind_ListenOnV6 ✅
- bind_Forward → `bind_forward.md` (대소문자 불일치) ❌
- bind_Forwarders → `bind_forwarders.md` (확인 필요) ⚠️
- bind_AllowQuery ✅
- bind_AllowTransfer ✅
- bind_ACL → `bind_acl.md` (대소문자 불일치) ❌
- bind_ZoneDomain ✅
- bind_ZoneType ✅
- bind_ZoneFile ✅

### Docker (10개) - 모두 존재 ✅
- docker_DataRoot
- docker_StorageDriver
- docker_DNS
- docker_LogDriver
- docker_MaxLogSize
- docker_LogOptMaxFile
- docker_AddressPool
- docker_LiveRestore
- docker_UserlandProxy
- docker_IPv6

### Plex (5개) - 모두 존재 ✅
- plex_Port
- plex_Firewall
- plex_RemoteAccess
- plex_DataDir
- plex_AllowedNetworks

### Home Assistant (8개) - 모두 존재 ✅
- homeassistant_Port
- homeassistant_Firewall
- homeassistant_ConfigDir
- homeassistant_Timezone
- homeassistant_Latitude
- homeassistant_Longitude
- homeassistant_Elevation
- homeassistant_UnitSystem

### Vsftpd (19개) - 모두 존재 ✅
- vsftpd_Port
- vsftpd_Firewall
- vsftpd_Local
- vsftpd_Anonymous
- vsftpd_Write
- vsftpd_Chroot
- vsftpd_AllowWriteableChroot
- vsftpd_Userlist
- vsftpd_LocalRoot
- vsftpd_Pasv
- vsftpd_PasvMinPort
- vsftpd_PasvMaxPort
- vsftpd_SSL
- vsftpd_TcpWrappers
- vsftpd_MaxClients
- vsftpd_MaxPerIp
- vsftpd_IdleTimeout
- vsftpd_DataTimeout

## 3. 해결 방법

### 방법 1: 파일명 변경 (권장)
기존 파일을 새 이름으로 복사:
- `bind_forward.md` → `bind_Forward.md`
- `bind_acl.md` → `bind_ACL.md`

### 방법 2: 심볼릭 링크 생성 (Linux/Mac)
- `bind_Forward.md` → `bind_forward.md` 링크
- `bind_ACL.md` → `bind_acl.md` 링크

### 방법 3: 코드 수정
docKey를 소문자로 변경:
- `bind_Forward` → `bind_forward`
- `bind_ACL` → `bind_acl`

## 4. 추가 확인 필요

`bind_Forwarders`의 경우:
- 코드: `bind_Forwarders`
- 파일: `bind_forwarders.md`
- 상태: 대소문자 불일치 가능성

