# BIND Zone 파일 Expire 시간

## 개요

Zone 파일의 SOA 레코드에서 Slave 서버가 Master 서버에 접근할 수 없을 때 Zone 데이터를 유지하는 최대 시간을 지정하는 설정입니다. 단위는 초(seconds)입니다.

## 설정 방법

SOA 레코드 내에서:

```
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101
                3600        ; Refresh
                1800        ; Retry
                604800      ; Expire (초)
                86400       ; Minimum TTL
        )
```

## 주요 특징

- **데이터 유지**: Master 접근 불가 시 Zone 데이터 유지 시간
- **단위**: 초(seconds)
- **권장값**: 604800초(7일) ~ 2592000초(30일)

## 일반적인 사용 예시

```
; 7일간 유지
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101
                3600
                1800
                604800      ; 7일
                86400
        )

; 14일간 유지
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101
                3600
                1800
                1209600     ; 14일
                86400
        )

; 30일간 유지
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101
                3600
                1800
                2592000     ; 30일
                86400
        )
```

## Expire 시간 선택 가이드

- **네트워크 안정성**: 네트워크가 불안정하면 길게 설정
- **Master 가용성**: Master 서버가 자주 다운되면 길게 설정
- **데이터 신선도**: 짧게 설정하면 오래된 데이터를 빨리 제거

## 주의사항

- **Refresh보다 길어야 함**: Expire는 Refresh보다 훨씬 길어야 합니다
- **Retry보다 길어야 함**: Expire는 Retry보다 훨씬 길어야 합니다
- **Zone 삭제**: Expire 시간 내에 Master에 접근하지 못하면 Zone 데이터가 삭제됩니다

## 권장 설정

일반적인 권장 설정:

```
Refresh: 3600 (1시간)
Retry: 1800 (30분)
Expire: 604800 (7일) - 일반적으로 7일
Minimum TTL: 86400 (24시간)
```

## 시간 변환 참고

- 3600초 = 1시간
- 86400초 = 24시간 = 1일
- 604800초 = 7일
- 2592000초 = 30일

