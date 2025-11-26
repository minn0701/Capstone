# ENSM 스크립트 기본 경로

## 개요

ENSM에서 사용하는 모든 스크립트들이 위치한 기본 디렉토리 경로를 지정하는 설정입니다. 서버에 배포된 스크립트 폴더의 경로입니다.

## 설정 방법

스크립트 기본 경로를 절대 경로로 지정합니다:

```
/usr/local/bin/ensm-scripts
```

## 주요 특징

- **기본 경로**: 모든 ENSM 스크립트의 기본 디렉토리
- **절대 경로**: 전체 경로를 지정해야 합니다
- **하위 디렉토리**: 각 기능별 스크립트가 하위 디렉토리에 위치합니다

## 디렉토리 구조

일반적인 구조:

```
/usr/local/bin/ensm-scripts/
├── apache/
│   └── configure_apache.sh
├── bind/
│   └── configure_bind.sh
├── network/
│   └── ddns_cloudflare.sh
└── system/
    └── manage_cron.sh
```

## 일반적인 사용 예시

```
/usr/local/bin/ensm-scripts
/opt/ensm/scripts
/var/lib/ensm/scripts
```

## 주의사항

- **경로 존재**: 지정한 경로가 실제로 존재해야 합니다
- **실행 권한**: 스크립트 파일에 실행 권한이 있어야 합니다
- **권한**: ENSM 사용자가 스크립트를 읽고 실행할 수 있어야 합니다

## 기본값

RPM 패키지 설치 시 기본값은 `/usr/local/bin/ensm-scripts`입니다.

