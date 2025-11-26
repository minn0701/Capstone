# 방화벽 포트 허용 (Firewall)

## 이 옵션이 하는 일

Apache가 사용하는 포트를 시스템 방화벽에서 자동으로 열어주는 기능입니다. 이 옵션을 활성화하면 외부에서 웹 서버에 접속할 수 있도록 방화벽 규칙이 자동으로 설정됩니다.

## 왜 필요한가요?

기본적으로 Linux 방화벽은 대부분의 포트를 차단합니다. 웹 서버를 외부에서 접속하려면 방화벽에서 해당 포트를 열어야 합니다. 이 옵션을 사용하면 수동으로 방화벽을 설정할 필요가 없습니다.

## 동작 방식

### 활성화 시 (ON)
- Apache가 사용하는 포트(예: 80, 443)를 방화벽에서 자동으로 허용
- 외부에서 웹 서버 접속 가능
- 서버 재시작 후에도 규칙이 유지됨

### 비활성화 시 (OFF)
- 방화벽 규칙이 추가되지 않음
- 로컬(localhost)에서만 접속 가능
- 외부에서는 접속 불가

## 지원하는 방화벽

이 기능은 다음 방화벽을 자동으로 감지하고 설정합니다:

- **ufw** (Ubuntu/Debian 기본 방화벽)
- **firewalld** (CentOS/RHEL 기본 방화벽)

## 알아야 할 것들

### 방화벽 상태 확인

```bash
# ufw 상태 확인
sudo ufw status

# firewalld 상태 확인
sudo firewall-cmd --list-all
```

### 수동으로 포트 열기 (옵션 비활성화 시)

```bash
# ufw 사용 시
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# firewalld 사용 시
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

### 방화벽 규칙 제거

옵션을 비활성화하면 자동으로 추가된 규칙이 제거됩니다:

```bash
# ufw
sudo ufw delete allow 80/tcp

# firewalld
sudo firewall-cmd --permanent --remove-port=80/tcp
sudo firewall-cmd --reload
```

## 자주 발생하는 오류

### 방화벽이 설치되어 있지 않음
**증상**: 옵션을 활성화해도 작동하지 않음

**해결 방법**: 
- Ubuntu/Debian: `sudo apt install ufw`
- CentOS/RHEL: `sudo yum install firewalld`

### 권한 부족
**증상**: "Permission denied" 오류

**해결 방법**: 방화벽 설정은 root 권한이 필요합니다. 관리자 권한으로 실행하세요.

### 포트는 열렸는데 여전히 접속 불가
**확인 사항**:
1. 클라우드 환경(예: AWS, Azure)에서는 보안 그룹/네트워크 보안 그룹에서도 포트를 열어야 합니다
2. 라우터의 포트 포워딩 설정 확인 (홈 서버인 경우)
3. Apache가 실제로 실행 중인지 확인

