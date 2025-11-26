# BIND Zone 파일 Serial 번호

## 개요

Zone 파일의 SOA 레코드에서 Zone 파일의 버전 번호를 지정하는 설정입니다. Zone 파일이 변경될 때마다 증가시켜야 하며, Slave 서버가 변경사항을 감지하는 데 사용됩니다.

## 설정 방법

SOA 레코드 내에서:

```
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101  ; Serial
                3600        ; Refresh
                1800        ; Retry
                604800      ; Expire
                86400       ; Minimum TTL
        )
```

## Serial 번호 형식

### 날짜 기반 (권장)

`YYYYMMDDNN` 형식:
- `2024010101`: 2024년 1월 1일, 첫 번째 수정
- `2024010102`: 2024년 1월 1일, 두 번째 수정
- `2024010201`: 2024년 1월 2일, 첫 번째 수정

### 순차 번호

단순히 증가하는 번호:
- `1`, `2`, `3`, ...

## 일반적인 사용 예시

```
; 날짜 기반 Serial (권장)
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101  ; 2024-01-01 첫 번째 수정
                3600
                1800
                604800
                86400
        )

; Zone 파일 수정 시 Serial 증가
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010102  ; 2024-01-01 두 번째 수정
                3600
                1800
                604800
                86400
        )
```

## 주의사항

- **반드시 증가**: Zone 파일을 수정할 때마다 Serial 번호를 증가시켜야 합니다
- **Slave 동기화**: Serial이 증가하지 않으면 Slave 서버가 변경사항을 감지하지 못합니다
- **32비트 정수**: Serial은 32비트 정수 범위 내에서만 유효합니다 (최대 4294967295)

## 자동 증가 스크립트 예시

```bash
#!/bin/bash
# Serial 번호 자동 증가
ZONE_FILE="/var/named/example.com.zone"
CURRENT_SERIAL=$(grep -E "^\s*[0-9]+\s*;" $ZONE_FILE | head -1 | awk '{print $1}')
NEW_SERIAL=$((CURRENT_SERIAL + 1))
sed -i "s/$CURRENT_SERIAL/$NEW_SERIAL/" $ZONE_FILE
```

## 오류 해결

### Slave 서버가 업데이트되지 않는 경우

1. Serial 번호가 증가했는지 확인
2. Slave 서버의 `refresh` 시간 확인
3. BIND 로그 확인: `tail -f /var/log/messages | grep named`

