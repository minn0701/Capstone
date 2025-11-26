# BIND /etc/resolv.conf IP 주소 설정

## 개요

`/etc/resolv.conf` 파일에서 DNS 서버의 IP 주소를 지정하는 설정입니다. `nameserver` 지시어와 함께 사용됩니다.

## 설정 방법

`/etc/resolv.conf` 파일에 추가:

```
nameserver 192.168.1.5
```

## 주요 특징

- **IPv4/IPv6**: IPv4와 IPv6 주소 모두 지원
- **다중 서버**: 여러 DNS 서버 지정 가능
- **순차 시도**: 지정된 순서대로 시도

## 일반적인 사용 예시

```
# IPv4 주소
nameserver 192.168.1.5
nameserver 192.168.1.6

# IPv6 주소
nameserver 2001:db8::5

# 공용 DNS 서버
nameserver 8.8.8.8
nameserver 1.1.1.1
```

## 주의사항

- **유효한 IP**: 올바른 IP 주소 형식이어야 합니다
- **접근 가능**: 지정한 DNS 서버에 네트워크로 접근 가능해야 합니다
- **포트**: 기본적으로 포트 53 사용 (명시 불필요)

## 오류 해결

### DNS 서버 응답 없음

```bash
# DNS 서버 응답 테스트
dig @192.168.1.5 example.com

# 네트워크 연결 확인
ping 192.168.1.5

# 방화벽 확인
firewall-cmd --list-all
```

### IP 주소 형식 오류

올바른 IP 주소 형식 확인:
- IPv4: `192.168.1.5`
- IPv6: `2001:db8::5`

