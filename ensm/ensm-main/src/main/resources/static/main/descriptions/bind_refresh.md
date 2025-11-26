# BIND Zone 파일 Refresh 시간

## 개요

Zone 파일의 SOA 레코드에서 Slave 서버가 Master 서버를 확인하여 Zone 데이터를 갱신하는 주기를 지정하는 설정입니다. 단위는 초(seconds)입니다.

## 설정 방법

SOA 레코드 내에서:

```
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101
                3600        ; Refresh (초)
                1800        ; Retry
                604800      ; Expire
                86400       ; Minimum TTL
        )
```

## 주요 특징

- **갱신 주기**: Slave 서버가 Master를 확인하는 주기
- **단위**: 초(seconds)
- **권장값**: 3600초(1시간) ~ 86400초(24시간)

## 일반적인 사용 예시

```
; 1시간마다 확인
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101
                3600        ; 1시간
                1800
                604800
                86400
        )

; 30분마다 확인
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101
                1800        ; 30분
                900
                604800
                86400
        )

; 24시간마다 확인
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101
                86400       ; 24시간
                3600
                604800
                86400
        )
```

## Refresh 시간 선택 가이드

- **자주 변경**: Zone이 자주 변경되면 짧은 시간 (1800-3600초)
- **안정적**: Zone이 안정적이면 긴 시간 (86400초)
- **트래픽 고려**: 짧은 시간은 Master 서버 부하 증가

## 주의사항

- **Retry와의 관계**: Refresh 실패 시 Retry 시간 후 재시도
- **Expire와의 관계**: Refresh는 Expire보다 짧아야 합니다
- **네트워크 부하**: 너무 짧은 Refresh는 네트워크 부하 증가

## 권장 설정

일반적인 권장 설정:

```
Refresh: 3600 (1시간)
Retry: 1800 (30분)
Expire: 604800 (7일)
Minimum TTL: 86400 (24시간)
```

