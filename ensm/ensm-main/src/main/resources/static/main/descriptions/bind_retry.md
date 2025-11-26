# BIND Zone 파일 Retry 시간

## 개요

Zone 파일의 SOA 레코드에서 Refresh 실패 시 Slave 서버가 Master 서버에 재시도하는 주기를 지정하는 설정입니다. 단위는 초(seconds)입니다.

## 설정 방법

SOA 레코드 내에서:

```
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101
                3600        ; Refresh
                1800        ; Retry (초)
                604800      ; Expire
                86400       ; Minimum TTL
        )
```

## 주요 특징

- **재시도 주기**: Refresh 실패 시 재시도 간격
- **단위**: 초(seconds)
- **권장값**: Refresh 시간의 절반 정도

## 일반적인 사용 예시

```
; Refresh 1시간, Retry 30분
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101
                3600        ; Refresh: 1시간
                1800        ; Retry: 30분
                604800      ; Expire
                86400       ; Minimum TTL
        )

; Refresh 30분, Retry 15분
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101
                1800        ; Refresh: 30분
                900         ; Retry: 15분
                604800      ; Expire
                86400       ; Minimum TTL
        )
```

## Retry 시간 선택 가이드

- **Refresh의 절반**: 일반적으로 Refresh 시간의 절반 정도
- **네트워크 안정성**: 네트워크가 불안정하면 짧게 설정
- **서버 부하**: 너무 짧으면 Master 서버 부하 증가

## 주의사항

- **Refresh보다 짧음**: Retry는 반드시 Refresh보다 짧아야 합니다
- **Expire와의 관계**: Retry는 Expire보다 훨씬 짧아야 합니다
- **재시도 로직**: Refresh 실패 시 Retry 시간마다 재시도, Expire 시간 내에 성공하지 못하면 Zone 데이터 삭제

## 권장 설정

일반적인 권장 설정:

```
Refresh: 3600 (1시간)
Retry: 1800 (30분) - Refresh의 절반
Expire: 604800 (7일)
Minimum TTL: 86400 (24시간)
```

