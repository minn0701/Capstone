# BIND /etc/hosts IP 주소 설정

## 개요

로컬 호스트 파일(`/etc/hosts`)에 IP 주소를 지정하는 설정입니다. 도메인 이름과 IP 주소를 매핑하는 데 사용됩니다.

## 설정 방법

`/etc/hosts` 파일에 추가:

```
192.168.1.5    ns1.example.com
```

## 주요 특징

- **IPv4/IPv6**: IPv4와 IPv6 주소 모두 지원
- **로컬 해석**: DNS 쿼리 전에 먼저 확인
- **정적 매핑**: 파일에 직접 작성

## 일반적인 사용 예시

```
# IPv4 주소
192.168.1.5    ns1.example.com
192.168.1.6    ns2.example.com
192.168.1.100  www.example.com

# IPv6 주소
2001:db8::1    ns1.example.com
2001:db8::2    ns2.example.com

# 여러 호스트명
192.168.1.100  www.example.com www
```

## 형식

```
IP주소    호스트명1    호스트명2    ...
```

## 주의사항

- **유효한 IP**: 올바른 IP 주소 형식이어야 합니다
- **중복 방지**: 같은 IP에 여러 호스트명 지정 가능
- **로컬호스트**: `127.0.0.1`은 로컬호스트로 예약되어 있습니다

## 오류 해결

### IP 주소 형식 오류

올바른 IP 주소 형식 확인:
- IPv4: `192.168.1.5`
- IPv6: `2001:db8::1`

### hosts 파일 권한

```bash
# 파일 권한 확인
ls -l /etc/hosts

# 일반적으로 root 소유, 644 권한
chmod 644 /etc/hosts
```

