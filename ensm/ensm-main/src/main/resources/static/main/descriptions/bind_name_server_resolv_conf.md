# BIND /etc/resolv.conf 네임 서버 설정

## 개요

시스템의 DNS 해석을 위한 네임 서버를 지정하는 설정입니다. `/etc/resolv.conf` 파일에 DNS 서버 주소를 지정합니다.

## 설정 방법

`/etc/resolv.conf` 파일에 추가:

```
nameserver 192.168.1.5
nameserver 192.168.1.6
```

## 주요 특징

- **DNS 서버 지정**: 시스템이 사용할 DNS 서버 지정
- **순차 시도**: 여러 서버를 지정하면 순서대로 시도
- **동적 관리**: NetworkManager 등에 의해 자동 관리될 수 있음

## 일반적인 사용 예시

```
# 단일 DNS 서버
nameserver 192.168.1.5

# 여러 DNS 서버 (순차 시도)
nameserver 192.168.1.5
nameserver 192.168.1.6
nameserver 8.8.8.8

# IPv6 DNS 서버
nameserver 2001:db8::5
```

## 주의사항

- **NetworkManager**: NetworkManager가 활성화된 경우 자동으로 덮어쓸 수 있습니다
- **최대 3개**: 일반적으로 최대 3개의 nameserver 지정 가능
- **순서**: 첫 번째 서버가 응답하지 않으면 다음 서버로 시도

## NetworkManager와의 관계

NetworkManager가 활성화된 경우:

```bash
# NetworkManager 설정 확인
nmcli connection show

# 수동 설정 방지
echo "nameserver 192.168.1.5" | sudo tee /etc/resolv.conf
chattr +i /etc/resolv.conf  # 파일 보호 (선택사항)
```

## 오류 해결

### resolv.conf가 자동으로 변경되는 경우

NetworkManager 설정 확인:

```bash
# NetworkManager 비활성화 (권장하지 않음)
systemctl disable NetworkManager

# 또는 NetworkManager에서 DNS 설정
nmcli connection modify "connection-name" ipv4.dns "192.168.1.5"
```

### DNS 쿼리 실패

```bash
# DNS 서버 응답 테스트
dig @192.168.1.5 example.com

# resolv.conf 확인
cat /etc/resolv.conf
```

