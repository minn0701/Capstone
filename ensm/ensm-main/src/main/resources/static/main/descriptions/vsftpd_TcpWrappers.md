# TCP Wrappers 사용 (TCP Wrappers)

## 이 옵션이 하는 일

TCP Wrappers를 사용하여 호스트 기반 접근 제어를 할지 결정합니다. `/etc/hosts.allow`와 `/etc/hosts.deny` 파일을 사용하여 특정 IP 주소나 호스트의 접근을 허용하거나 차단할 수 있습니다.

## 동작 방식

### 활성화 시 (ON)
- TCP Wrappers 사용
- `/etc/hosts.allow`와 `/etc/hosts.deny` 파일로 접근 제어
- IP 주소 기반 필터링

### 비활성화 시 (OFF)
- TCP Wrappers 사용 안 함
- vsftpd 자체 접근 제어만 사용

## 사용 시나리오

### 활성화가 유용한 경우
- **IP 기반 필터링**: 특정 IP만 허용 또는 차단
- **추가 보안 레이어**: vsftpd 설정과 함께 사용
- **중앙 관리**: 여러 서비스에 동일한 접근 규칙 적용

### 비활성화가 가능한 경우
- **간단한 설정**: TCP Wrappers 관리 불필요
- **vsftpd 설정만 사용**: vsftpd 자체 접근 제어로 충분

## 알아야 할 것들

### TCP Wrappers 파일

**/etc/hosts.allow**:
```
vsftpd: 192.168.1.0/24
vsftpd: 10.0.0.0/8
```
→ 허용할 IP 주소

**/etc/hosts.deny**:
```
vsftpd: ALL
```
→ 차단할 IP 주소 (기본 정책)

### 접근 제어 우선순위

1. `/etc/hosts.allow` 확인 (허용 목록)
2. `/etc/hosts.deny` 확인 (차단 목록)
3. 둘 다 없으면 허용

### vsftpd와의 관계

TCP Wrappers는 vsftpd 설정보다 먼저 적용됩니다:
- TCP Wrappers에서 차단되면 vsftpd 설정까지 도달하지 않음
- 추가 보안 레이어 역할

## 자주 발생하는 오류

### 특정 IP에서 접속이 안 됨
**원인**: TCP Wrappers에서 차단됨

**해결 방법**:
1. `/etc/hosts.allow`에 IP 추가
2. `/etc/hosts.deny`에서 제거
3. 파일 형식 확인

### 모든 접속이 차단됨
**원인**: `/etc/hosts.deny`에 `ALL` 설정

**해결 방법**:
1. `/etc/hosts.allow`에 허용할 IP 추가
2. 또는 `/etc/hosts.deny` 수정

### TCP Wrappers가 작동하지 않음
**확인 사항**:
1. `tcp_wrappers` 옵션 활성화 확인
2. TCP Wrappers 라이브러리 설치 확인
3. 파일 권한 확인

