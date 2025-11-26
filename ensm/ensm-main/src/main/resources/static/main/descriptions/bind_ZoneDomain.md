# Zone 도메인명 (Zone Domain)

## 이 옵션이 하는 일

BIND가 관리할 도메인(Zone)의 이름을 지정합니다. 이 도메인에 대한 DNS 레코드를 관리하고 응답합니다.

## 설정 예시

### 일반 도메인
```
example.com
mydomain.org
test.net
```

### 서브도메인
```
sub.example.com
www.example.com
mail.example.com
```

### 루트 도메인
```
@
```
→ 루트 도메인을 의미 (일부 설정에서 사용)

## 알아야 할 것들

### Zone이란?

DNS에서 Zone은 특정 도메인과 그 하위 도메인을 관리하는 단위입니다:
- `example.com` Zone: `example.com`과 `*.example.com` 관리
- `sub.example.com` Zone: `sub.example.com`과 `*.sub.example.com` 관리

### 도메인 등록 필요

Zone을 설정하려면:
1. 도메인을 등록해야 함 (도메인 등록업체에서)
2. 도메인의 네임서버를 이 BIND 서버로 설정
3. Zone 파일에 DNS 레코드 작성

### Zone 파일과의 관계

Zone 도메인명은 Zone 파일의 이름과 일치해야 합니다:
- 도메인: `example.com`
- Zone 파일: `/var/named/example.com.zone`

## 자주 발생하는 오류

### "Zone not found" 오류
**원인**: 
- Zone 도메인명이 잘못됨
- Zone 파일이 없음
- BIND 설정에 Zone이 등록되지 않음

**해결 방법**:
1. 도메인명 확인
2. Zone 파일 생성
3. BIND 설정 파일에 Zone 등록

### 도메인으로 접속이 안 됨
**확인 사항**:
1. 도메인 등록 확인
2. 네임서버 설정 확인
3. DNS 전파 시간 대기 (최대 48시간)
4. Zone 파일의 레코드 확인

### 서브도메인이 안 됨
**원인**: 서브도메인을 별도 Zone으로 설정해야 할 수도 있음

**해결 방법**:
- 일반적으로는 메인 Zone에 레코드 추가
- 또는 별도 Zone 생성

