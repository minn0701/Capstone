# Zone 파일 경로 (Zone File)

## 이 옵션이 하는 일

Zone의 DNS 레코드가 저장된 파일의 경로를 지정합니다. 이 파일에 A 레코드, MX 레코드 등 도메인의 DNS 정보가 저장됩니다.

## 기본 경로

- **일반적인 경로**: `/var/named/`
- **Zone 파일 예시**: `/var/named/example.com.zone`

## 경로 설정 예시

### 표준 경로
```
/var/named/example.com.zone
/var/named/example.com
/var/lib/named/example.com.zone
```

### 사용자 정의 경로
```
/etc/bind/zones/example.com.zone
/home/dns/zones/example.com.zone
/opt/dns/example.com.zone
```

## 알아야 할 것들

### Zone 파일 형식

Zone 파일은 특정 형식으로 작성해야 합니다:

```
$TTL 3600
@       IN SOA  ns1.example.com. admin.example.com. (
                2024011501  ; Serial
                3600        ; Refresh
                1800        ; Retry
                604800      ; Expire
                86400       ; Minimum TTL
                )
@       IN NS    ns1.example.com.
@       IN A     192.168.1.100
www     IN A     192.168.1.100
mail    IN A     192.168.1.101
```

### 파일 권한

Zone 파일은 적절한 권한이 필요합니다:

```bash
# 소유권 설정
sudo chown named:named /var/named/example.com.zone

# 권한 설정
sudo chmod 640 /var/named/example.com.zone
```

### 파일 이름 규칙

일반적으로 도메인 이름을 사용:
- 도메인: `example.com`
- 파일: `example.com.zone` 또는 `example.com`

## 자주 발생하는 오류

### "Zone file not found" 오류
**원인**: 
- 파일 경로가 잘못됨
- 파일이 존재하지 않음
- 권한 문제

**해결 방법**:
1. 파일 경로 확인
2. 파일 생성
3. 권한 설정

### "Permission denied" 오류
**원인**: BIND 사용자가 파일을 읽을 수 없음

**해결 방법**:
```bash
sudo chown named:named /var/named/example.com.zone
sudo chmod 640 /var/named/example.com.zone
```

### Zone 파일 문법 오류
**원인**: Zone 파일 형식이 잘못됨

**해결 방법**:
1. 문법 확인: `named-checkzone example.com /var/named/example.com.zone`
2. Zone 파일 형식 참고
3. 오타 확인

### 변경사항이 반영 안 됨
**확인 사항**:
1. Serial 번호 증가 확인
2. BIND 재시작 또는 Zone 리로드
3. 파일 저장 확인

