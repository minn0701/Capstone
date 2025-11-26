# CRON 명령어

## 개요

CRON 작업에서 실행할 명령어 또는 스크립트의 전체 경로를 지정하는 설정입니다.

## 설정 방법

실행할 명령어 또는 스크립트의 전체 경로를 입력합니다:

```
/usr/bin/command
```

또는 스크립트:

```
/usr/local/bin/myscript.sh
```

## 주요 특징

- **전체 경로**: 명령어나 스크립트의 전체 경로를 지정해야 합니다
- **실행 권한**: 스크립트인 경우 실행 권한이 있어야 합니다
- **환경 변수**: CRON은 제한된 환경 변수를 사용합니다

## 일반적인 사용 예시

```
# 시스템 명령어
/usr/bin/date
/usr/bin/echo "Hello"

# 스크립트 실행
/usr/local/bin/backup.sh
/home/user/scripts/cleanup.sh

# 명령어와 인자
/usr/bin/find /tmp -type f -mtime +7 -delete
```

## 주의사항

- **전체 경로**: 상대 경로가 아닌 절대 경로를 사용해야 합니다
- **환경 변수**: CRON은 최소한의 환경 변수만 사용하므로 필요한 경우 스크립트 내에서 설정해야 합니다
- **출력 리다이렉션**: 출력을 파일로 저장하려면 리다이렉션을 사용하세요

## 출력 리다이렉션

CRON 작업의 출력을 파일로 저장:

```
/usr/local/bin/script.sh >> /var/log/script.log 2>&1
```

- `>>`: 출력을 파일에 추가
- `2>&1`: 에러 출력도 함께 리다이렉션

## 환경 변수 설정

CRON 작업에서 환경 변수를 사용하려면:

```
PATH=/usr/bin:/usr/local/bin
0 0 * * * /usr/local/bin/script.sh
```

또는 스크립트 내에서 설정:

```bash
#!/bin/bash
export PATH=/usr/bin:/usr/local/bin
# 스크립트 내용
```

## 권장 사항

1. **스크립트 사용**: 복잡한 작업은 스크립트로 작성
2. **로그 기록**: 작업 결과를 로그 파일에 기록
3. **에러 처리**: 스크립트에 에러 처리를 포함
4. **테스트**: CRON 작업을 추가하기 전에 수동으로 테스트

