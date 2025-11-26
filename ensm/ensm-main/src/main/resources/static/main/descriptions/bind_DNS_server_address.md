# BIND Zone 파일 DNS 서버 주소

## 개요

Zone 파일에서 네임 서버(NS) 레코드에 대한 A 레코드를 지정하는 설정입니다. NS 레코드로 지정된 네임 서버의 IP 주소를 매핑합니다.

## 설정 방법

Zone 파일 내에서:

```
; 네임 서버 레코드
@       IN NS   ns1.example.com.
@       IN NS   ns2.example.com.

; 네임 서버 주소
ns1     IN A    192.168.1.5
ns2     IN A    192.168.1.6
```

## 주요 특징

- **NS 레코드**: 네임 서버를 지정
- **A 레코드**: 네임 서버의 IP 주소 매핑
- **필수**: NS 레코드로 지정된 서버는 반드시 A 레코드가 있어야 합니다

## 일반적인 사용 예시

```
; 네임 서버 지정
@       IN NS   ns1.example.com.
@       IN NS   ns2.example.com.

; IPv4 주소
ns1     IN A    192.168.1.5
ns2     IN A    192.168.1.6

; IPv6 주소
ns1     IN AAAA 2001:db8::5
ns2     IN AAAA 2001:db8::6
```

## 주의사항

- **NS 레코드 필수**: Zone 파일에는 최소 하나의 NS 레코드가 필요합니다
- **A 레코드 필수**: NS 레코드로 지정된 서버는 반드시 A 또는 AAAA 레코드가 있어야 합니다
- **도메인 끝 점**: FQDN은 끝에 점(`.`)을 붙여야 합니다

## 오류 해결

### NS 레코드에 대한 A 레코드가 없는 경우

Zone 파일 검증 시 경고가 발생합니다:

```bash
named-checkzone example.com /var/named/example.com.zone
```

NS 레코드로 지정된 모든 서버에 대해 A 또는 AAAA 레코드를 추가해야 합니다.

