# BIND listen-on-v6 port 53 설정

## 개요

BIND DNS 서버가 IPv6 주소에서 DNS 쿼리를 수신할 네트워크 인터페이스와 포트를 지정하는 설정입니다. IPv4의 `listen-on`과 유사하지만 IPv6 전용입니다.

## 설정 방법

```named
options {
    listen-on-v6 port 53 { ::1; };
};
```

또는 모든 IPv6 인터페이스에서 수신:

```named
options {
    listen-on-v6 port 53 { any; };
};
```

## 주요 특징

- **IPv6 전용**: IPv6 주소만 지정 가능
- **기본 포트**: DNS는 표준적으로 53번 포트를 사용합니다
- **로컬호스트**: `::1`은 IPv6의 로컬호스트 주소입니다

## 일반적인 사용 예시

```named
# IPv6 로컬호스트에서만 수신
listen-on-v6 port 53 { ::1; };

# 모든 IPv6 인터페이스에서 수신
listen-on-v6 port 53 { any; };

# 특정 IPv6 주소에서 수신
listen-on-v6 port 53 { 2001:db8::1; };

# IPv6 비활성화
listen-on-v6 port 53 { none; };
```

## IPv4와 IPv6 동시 사용

IPv4와 IPv6를 모두 지원하려면:

```named
options {
    listen-on port 53 { 127.0.0.1; 192.168.1.100; };
    listen-on-v6 port 53 { ::1; 2001:db8::1; };
};
```

## 주의사항

- **IPv6 비활성화**: IPv6를 사용하지 않는 경우 `none`으로 설정
- **네트워크 설정**: 시스템에 IPv6가 활성화되어 있어야 합니다
- **방화벽**: IPv6 방화벽 규칙도 별도로 설정 필요

## 오류 해결

### IPv6 주소를 찾을 수 없는 경우

```bash
# IPv6 주소 확인
ip -6 addr show

# IPv6 활성화 확인
sysctl net.ipv6.conf.all.disable_ipv6
```

### IPv6 비활성화

IPv6를 사용하지 않는 경우:

```named
listen-on-v6 port 53 { none; };
```

