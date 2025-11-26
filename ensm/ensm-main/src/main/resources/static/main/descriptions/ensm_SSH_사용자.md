# ENSM SSH 사용자

## 개요

SSH 접속에 사용할 사용자명을 지정하는 설정입니다. 원격 서버에서 Apache 설정을 변경할 권한이 있는 사용자여야 합니다.

## 설정 방법

SSH 접속에 사용할 사용자명을 입력합니다:

```
root
```

또는:

```
apache-admin
```

## 주요 특징

- **권한**: Apache 설정을 변경할 수 있는 권한이 있어야 합니다
- **sudo 권한**: 일반 사용자인 경우 sudo 권한이 필요할 수 있습니다
- **보안**: 최소 권한 원칙에 따라 필요한 권한만 가진 사용자를 사용하는 것을 권장합니다

## 일반적인 사용 예시

```
root
apache
admin
ensm
```

## 주의사항

- **권한**: Apache 설정 파일을 수정할 수 있는 권한이 필요합니다
- **보안**: root 사용자 사용은 보안 위험이 있으므로 주의해야 합니다
- **sudo**: 일반 사용자를 사용하는 경우 sudo 권한 설정이 필요할 수 있습니다

## 권장 설정

보안을 위해 전용 사용자를 생성하는 것을 권장합니다:

```bash
# 전용 사용자 생성
useradd -r -s /bin/bash apache-admin

# sudo 권한 부여
echo "apache-admin ALL=(ALL) NOPASSWD: /usr/local/bin/ensm-scripts/apache/configure_apache.sh" >> /etc/sudoers
```

