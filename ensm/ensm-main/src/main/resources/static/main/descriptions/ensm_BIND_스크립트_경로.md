# ENSM BIND 스크립트 경로

## 개요

BIND DNS 설정을 변경하는 쉘 스크립트의 전체 경로를 지정하는 설정입니다. ENSM이 BIND DNS 설정을 변경할 때 이 스크립트를 실행합니다.

## 설정 방법

BIND 설정 스크립트의 전체 경로를 지정합니다:

```
/usr/local/bin/ensm-scripts/bind/configure_bind.sh
```

## 주요 특징

- **전체 경로**: 스크립트 파일의 전체 경로를 지정해야 합니다
- **실행 권한**: 스크립트 파일에 실행 권한이 있어야 합니다
- **스크립트 기능**: BIND 설정 변경, 검증, 재시작 등을 수행합니다

## 일반적인 사용 예시

```
/usr/local/bin/ensm-scripts/bind/configure_bind.sh
/opt/ensm/scripts/bind/configure_bind.sh
```

## 주의사항

- **파일 존재**: 지정한 경로에 스크립트 파일이 존재해야 합니다
- **실행 권한**: 스크립트 파일에 실행 권한이 있어야 합니다 (`chmod +x`)
- **권한**: ENSM 사용자가 스크립트를 실행할 수 있어야 합니다

## 기본값

RPM 패키지 설치 시 기본값은 `/usr/local/bin/ensm-scripts/bind/configure_bind.sh`입니다.

## 스크립트 기능

이 스크립트는 다음 기능을 제공합니다:

- BIND 설정 파일(`/etc/named.conf`) 수정
- Zone 파일 생성 및 수정
- 설정 검증 (`named-checkconf`)
- BIND 서비스 재시작
- 설정 파일 백업

