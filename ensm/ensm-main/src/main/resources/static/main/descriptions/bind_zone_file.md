# BIND Zone 파일 설정 항목

## 개요

BIND Zone 파일 내의 주요 설정 항목들에 대한 설명입니다. Zone 파일은 DNS 레코드를 정의하는 텍스트 파일입니다.

## 주요 레코드 타입

### SOA (Start of Authority)

Zone의 권한 시작 레코드:

```
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101  ; Serial
                3600        ; Refresh
                1800        ; Retry
                604800      ; Expire
                86400       ; Minimum TTL
        )
```

### A 레코드

IPv4 주소 매핑:

```
www     IN A    192.168.1.100
api     IN A    192.168.1.101
```

### AAAA 레코드

IPv6 주소 매핑:

```
www     IN AAAA 2001:db8::1
```

### CNAME 레코드

별칭(Canonical Name):

```
www     IN CNAME    example.com.
ftp     IN CNAME    example.com.
```

### MX 레코드

메일 서버:

```
@       IN MX   10  mail.example.com.
@       IN MX   20  mail2.example.com.
```

### NS 레코드

네임 서버:

```
@       IN NS   ns1.example.com.
@       IN NS   ns2.example.com.
```

## Zone 파일 구조 예시

```
$TTL 3600
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101  ; Serial
                3600        ; Refresh
                1800        ; Retry
                604800      ; Expire
                86400       ; Minimum TTL
        )

; 네임 서버
@       IN NS   ns1.example.com.
@       IN NS   ns2.example.com.

; 네임 서버 주소
ns1     IN A    192.168.1.5
ns2     IN A    192.168.1.6

; 웹 서버
@       IN A    192.168.1.100
www     IN A    192.168.1.100

; 메일 서버
@       IN MX   10  mail.example.com.
mail    IN A    192.168.1.200
```

## SOA 레코드 필드 설명

1. **Serial**: Zone 파일 버전 번호 (변경 시마다 증가)
2. **Refresh**: Slave 서버가 Master를 확인하는 주기 (초)
3. **Retry**: Refresh 실패 시 재시도 주기 (초)
4. **Expire**: Master에 접근 불가 시 데이터 유지 시간 (초)
5. **Minimum TTL**: 음의 캐시 TTL 값 (초)

## 주의사항

- **도메인 끝 점**: FQDN은 끝에 점(`.`)을 붙여야 합니다
- **Serial 번호**: Zone 파일 변경 시마다 증가시켜야 합니다
- **파일 권한**: BIND 사용자가 읽을 수 있어야 합니다

## 오류 해결

### Zone 파일 검증

```bash
named-checkzone example.com /var/named/example.com.zone
```

### 일반적인 오류

- **도메인 끝 점 누락**: `example.com.` (점 필요)
- **Serial 번호 미증가**: 변경 시마다 증가 필요
- **파일 권한**: `chmod 644`, `chown named:named`

