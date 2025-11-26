# SSH 공개키 경로

## 개요

복사할 공개키 파일의 경로를 지정하는 설정입니다. 이 키를 원격 서버에 복사하여 비밀번호 없이 SSH 접속을 가능하게 합니다.

## 설정 방법

공개키 파일의 전체 경로를 입력합니다:

```
~/.ssh/id_rsa.pub
```

또는 절대 경로:

```
/home/user/.ssh/id_rsa.pub
```

## 주요 특징

- **전체 경로**: 공개키 파일의 전체 경로를 지정해야 합니다
- **파일 확장자**: 일반적으로 `.pub` 확장자를 가집니다
- **읽기 권한**: 파일을 읽을 수 있어야 합니다

## 일반적인 사용 예시

```
# RSA 키
~/.ssh/id_rsa.pub
/home/user/.ssh/id_rsa.pub

# ED25519 키
~/.ssh/id_ed25519.pub
/home/user/.ssh/id_ed25519.pub

# ECDSA 키
~/.ssh/id_ecdsa.pub
/home/user/.ssh/id_ecdsa.pub
```

## 기본 키 위치

SSH 키는 일반적으로 다음 위치에 있습니다:

- **RSA**: `~/.ssh/id_rsa.pub`
- **ED25519**: `~/.ssh/id_ed25519.pub`
- **ECDSA**: `~/.ssh/id_ecdsa.pub`

## 주의사항

- **파일 존재**: 지정한 경로에 공개키 파일이 존재해야 합니다
- **읽기 권한**: 파일을 읽을 수 있어야 합니다
- **공개키**: 개인키가 아닌 공개키 파일을 지정해야 합니다

## 공개키 확인

공개키 파일의 내용을 확인하려면:

```bash
cat ~/.ssh/id_rsa.pub
```

공개키는 다음과 같은 형식입니다:

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQ... user@hostname
```

## 권장 사항

1. **절대 경로 사용**: `~` 대신 절대 경로 사용 권장
2. **키 확인**: 복사하기 전에 키 파일이 올바른지 확인
3. **백업**: 중요한 키는 백업 보관

