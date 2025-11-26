# 제한된 디렉토리 내 쓰기 허용 (Allow Writeable Chroot)

## 이 옵션이 하는 일

`chroot_local_user`가 활성화되어 사용자가 홈 디렉토리로 제한되었을 때, 그 디렉토리 내에서 파일 쓰기(업로드, 수정, 삭제)를 허용할지 결정합니다.

## 동작 방식

### 활성화 시 (ON)
- chroot된 디렉토리 내에서 쓰기 가능
- 파일 업로드, 수정, 삭제 가능
- 사용자가 자신의 홈 디렉토리에서 작업 가능

### 비활성화 시 (OFF, 기본값)
- chroot된 디렉토리는 읽기 전용
- 쓰기 불가 (보안상 안전)
- 하위 디렉토리에만 쓰기 권한 부여 필요

## 사용 시나리오

### 활성화가 필요한 경우
- **파일 업로드 서비스**: 사용자가 파일을 업로드해야 함
- **웹 호스팅**: 웹사이트 파일 관리
- **일반적인 FTP 서버**: 대부분의 경우

### 비활성화가 권장되는 경우
- **읽기 전용 서버**: 다운로드만 제공
- **최고 보안**: 쓰기 권한 완전 차단

## 알아야 할 것들

### chroot와의 관계

이 옵션은 `chroot_local_user`가 활성화되어 있을 때만 의미가 있습니다:
- `chroot_local_user` OFF: 이 옵션 무시됨
- `chroot_local_user` ON + `allow_writeable_chroot` OFF: 읽기 전용
- `chroot_local_user` ON + `allow_writeable_chroot` ON: 읽기/쓰기 가능

### 보안 고려사항

**활성화 시**:
- 사용자가 자신의 디렉토리에서 파일 관리 가능
- 디렉토리 구조 변경 가능
- 적절한 권한 관리 필요

**비활성화 시**:
- 최고 보안
- 쓰기 불가로 인한 제한

### 대안: 하위 디렉토리만 쓰기 허용

`allow_writeable_chroot`를 비활성화하고 하위 디렉토리에만 쓰기 권한을 부여할 수 있습니다:

```bash
# 홈 디렉토리는 읽기 전용
chmod 555 /home/username

# 하위 디렉토리만 쓰기 가능
chmod 775 /home/username/uploads
```

## 자주 발생하는 오류

### "500 OOPS: vsftpd: refusing to run with writable root inside chroot()"
**원인**: 
- `chroot_local_user` ON
- `allow_writeable_chroot` OFF
- 홈 디렉토리가 쓰기 가능함

**해결 방법**:
1. `allow_writeable_chroot` 활성화
2. 또는 홈 디렉토리를 읽기 전용으로 변경: `chmod 555 /home/username`

### 파일을 업로드할 수 없음
**원인**: `allow_writeable_chroot`가 비활성화됨

**해결 방법**:
1. `allow_writeable_chroot` 활성화
2. 또는 하위 디렉토리에만 쓰기 권한 부여

