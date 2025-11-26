# 로컬 사용자 루트 디렉토리 (Local Root)

## 이 옵션이 하는 일

로컬 사용자가 FTP로 로그인했을 때 기본으로 이동할 디렉토리 경로를 지정합니다. 사용자별로 다른 디렉토리를 지정할 수 있습니다.

## 기본값

- **기본값**: `/var/ftp` (익명 사용자용)
- **로컬 사용자**: 일반적으로 사용자의 홈 디렉토리

## 설정 예시

### 공통 디렉토리
```
/var/ftp
/srv/ftp
/home/ftp
```

### 사용자별 디렉토리
```
/home/username
/home/username/public_html
/home/username/ftp
```

### 웹 호스팅
```
/home/username/public_html
/var/www/username
```

## 알아야 할 것들

### 사용자 홈 디렉토리와의 관계

일반적으로:
- `local_root`를 설정하지 않으면 사용자의 홈 디렉토리 사용
- 설정하면 지정한 디렉토리로 이동

### chroot와의 관계

`chroot_local_user` 활성화 시:
- 사용자는 `local_root` 디렉토리로 제한됨
- 상위 디렉토리 접근 불가

### 디렉토리 권한

디렉토리에 적절한 권한이 필요합니다:

```bash
# 디렉토리 생성 및 권한 설정
sudo mkdir -p /var/ftp
sudo chown ftp:ftp /var/ftp
sudo chmod 755 /var/ftp
```

## 자주 발생하는 오류

### "550 Failed to change directory" 오류
**원인**: 
- 디렉토리가 존재하지 않음
- 권한이 없음
- 경로가 잘못됨

**해결 방법**:
1. 디렉토리 존재 확인
2. 권한 설정
3. 경로 확인

### 사용자가 다른 디렉토리에 접근하려고 함
**원인**: chroot가 비활성화됨

**해결 방법**:
- `chroot_local_user` 활성화
- 사용자를 지정 디렉토리로 제한

