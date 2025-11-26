# BIND Zone 파일 $TTL 설정

## 개요

Zone 파일에서 DNS 레코드의 기본 TTL(Time To Live) 값을 지정하는 설정입니다. TTL은 DNS 레코드가 캐시에 저장될 수 있는 시간(초)을 의미합니다.

## 설정 방법

Zone 파일 최상단에 설정:

```
$TTL 3600
```

## 주요 특징

- **캐시 시간**: DNS 클라이언트가 레코드를 캐시하는 시간
- **기본값**: 개별 레코드에 TTL이 없으면 이 값 사용
- **단위**: 초(seconds) 단위

## 일반적인 TTL 값

- **3600 (1시간)**: 일반적인 웹사이트
- **86400 (24시간)**: 안정적인 서비스
- **300 (5분)**: 자주 변경되는 레코드
- **1800 (30분)**: 중간 정도의 변경 빈도

## 일반적인 사용 예시

```
$TTL 3600
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101  ; Serial
                3600        ; Refresh
                1800        ; Retry
                604800      ; Expire
                86400       ; Minimum TTL
        )

; 개별 레코드에 다른 TTL 지정 가능
www     IN A    192.168.1.100
www     IN A    192.168.1.100    ; TTL 3600 사용 (기본값)

api     300 IN A    192.168.1.101    ; TTL 300 사용 (5분)
```

## TTL 선택 가이드

1. **변경 빈도**: 자주 변경되면 짧은 TTL, 안정적이면 긴 TTL
2. **트래픽**: 짧은 TTL은 DNS 쿼리 증가, 긴 TTL은 변경 반영 지연
3. **DDNS**: 동적 DNS 사용 시 짧은 TTL 권장 (300-600초)

## 주의사항

- **Zone 파일 최상단**: `$TTL`은 Zone 파일의 첫 번째 지시어여야 합니다
- **SOA Minimum TTL**: SOA 레코드의 Minimum TTL과 일치시키는 것이 좋습니다
- **변경 반영 시간**: TTL이 길면 DNS 변경이 전파되는데 시간이 걸립니다

## 오류 해결

### TTL 설정 오류

Zone 파일 검증:

```bash
named-checkzone example.com /var/named/example.com.zone
```

### 변경이 반영되지 않는 경우

- TTL 시간만큼 기다려야 변경이 전파됩니다
- DNS 캐시를 강제로 갱신하려면 TTL을 짧게 설정 후 변경

