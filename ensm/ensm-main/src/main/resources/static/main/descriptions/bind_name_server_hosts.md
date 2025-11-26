# BIND /etc/hosts 네임 서버 설정

## 개요

로컬 호스트 파일(`/etc/hosts`)에 네임 서버 이름과 IP 주소를 매핑하는 설정입니다. 시스템이 도메인 이름을 IP 주소로 변환할 때 사용됩니다.

## 설정 방법

`/etc/hosts` 파일에 추가:

```
192.168.1.5    ns1.example.com    ns1
192.168.1.6    ns2.example.com    ns2
```

## 주요 특징

- **로컬 해석**: DNS 쿼리 전에 먼저 확인
- **우선순위**: DNS보다 우선적으로 사용
- **정적 매핑**: 파일에 직접 작성하여 관리

## 일반적인 사용 예시

```
# /etc/hosts 파일
127.0.0.1   localhost localhost.localdomain
192.168.1.5    ns1.example.com    ns1
192.168.1.6    ns2.example.com    ns2
192.168.1.100  www.example.com    www
```

## 형식

```
IP주소    FQDN    호스트명
```

- **IP 주소**: 매핑할 IP 주소
- **FQDN**: 정규화된 도메인 이름
- **호스트명**: 짧은 호스트명 (선택사항)

## 주의사항

- **DNS 우선순위**: `/etc/nsswitch.conf`에서 설정에 따라 DNS보다 우선할 수 있습니다
- **정적 관리**: 파일을 직접 수정하여 관리
- **테스트 용도**: 개발/테스트 환경에서 유용

## 오류 해결

### hosts 파일 확인

```bash
cat /etc/hosts
```

### DNS 우선순위 확인

```bash
cat /etc/nsswitch.conf | grep hosts
```

