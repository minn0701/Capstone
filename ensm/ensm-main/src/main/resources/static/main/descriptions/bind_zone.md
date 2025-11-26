# BIND Zone 설정

## 개요

BIND DNS 서버에서 관리할 DNS Zone을 정의하는 설정입니다. Zone은 특정 도메인에 대한 DNS 레코드를 관리하는 단위입니다.

## 설정 방법

```named
zone "example.com" IN {
    type master;
    file "example.com.zone";
};
```

## Zone 타입

### master (주 서버)

Zone 데이터를 직접 관리하는 서버:

```named
zone "example.com" IN {
    type master;
    file "example.com.zone";
    allow-transfer { 192.168.1.10; };
};
```

### slave (보조 서버)

Master 서버에서 Zone 데이터를 복사받는 서버:

```named
zone "example.com" IN {
    type slave;
    masters { 192.168.1.5; };
    file "slaves/example.com.zone";
};
```

### hint (루트 힌트)

루트 DNS 서버 목록을 제공:

```named
zone "." IN {
    type hint;
    file "named.ca";
};
```

## 일반적인 사용 예시

```named
# Master Zone
zone "example.com" IN {
    type master;
    file "/var/named/example.com.zone";
    allow-transfer { 192.168.1.10; };
    allow-update { none; };
};

# Slave Zone
zone "example.com" IN {
    type slave;
    masters { 192.168.1.5; };
    file "slaves/example.com.zone";
};

# 역방향 Zone (IPv4)
zone "1.168.192.in-addr.arpa" IN {
    type master;
    file "192.168.1.zone";
};

# 역방향 Zone (IPv6)
zone "0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa" IN {
    type master;
    file "2001.db8.zone";
};
```

## Zone 파일 경로

- **절대 경로**: `/var/named/example.com.zone`
- **상대 경로**: `example.com.zone` (기본적으로 `/var/named/` 기준)
- **Slave Zone**: `slaves/` 디렉토리에 저장 (BIND가 자동 생성)

## 주요 옵션

- `type`: Zone 타입 (master, slave, hint)
- `file`: Zone 파일 경로
- `allow-transfer`: Zone 전송 허용 서버
- `allow-update`: 동적 업데이트 허용 (일반적으로 `none`)

## 보안 권장사항

1. **allow-transfer**: 신뢰할 수 있는 Slave 서버에만 허용
2. **allow-update**: 동적 업데이트는 보안 위험이 있으므로 신중하게 설정
3. **파일 권한**: Zone 파일은 적절한 권한으로 보호

## 주의사항

- **Zone 파일**: Zone 파일이 존재하고 올바른 형식이어야 합니다
- **파일 권한**: BIND 사용자가 Zone 파일을 읽을 수 있어야 합니다
- **Slave Zone**: `slaves/` 디렉토리에 쓰기 권한이 필요합니다

## 오류 해결

### Zone 파일을 찾을 수 없는 경우

```bash
# Zone 파일 경로 확인
ls -l /var/named/example.com.zone

# 파일 권한 확인 및 수정
chmod 644 /var/named/example.com.zone
chown named:named /var/named/example.com.zone
```

### Zone 파일 형식 오류

```bash
# Zone 파일 검증
named-checkzone example.com /var/named/example.com.zone
```

