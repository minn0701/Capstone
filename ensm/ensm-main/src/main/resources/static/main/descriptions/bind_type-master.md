# BIND Zone Type-Master 설정

## 개요

Zone의 타입을 Master(주 서버)로 지정하는 설정입니다. Zone 데이터를 직접 관리하는 서버에 사용됩니다.

## 설정 방법

```named
zone "example.com" IN {
    type master;
    file "example.com.zone";
};
```

## 주요 특징

- **Zone 데이터 관리**: Zone 파일을 직접 관리
- **Slave 동기화**: Slave 서버에 Zone 데이터 제공
- **권한**: Zone 데이터의 원본 소스

## 일반적인 사용 예시

```named
# Master Zone 기본 설정
zone "example.com" IN {
    type master;
    file "example.com.zone";
};

# Slave 서버에 전송 허용
zone "example.com" IN {
    type master;
    file "example.com.zone";
    allow-transfer { 192.168.1.10; };
};

# 동적 업데이트 차단
zone "example.com" IN {
    type master;
    file "example.com.zone";
    allow-update { none; };
};
```

## Master Zone 요구사항

1. **Zone 파일 존재**: Zone 파일이 존재해야 합니다
2. **파일 권한**: BIND 사용자가 읽을 수 있어야 합니다
3. **파일 형식**: 올바른 Zone 파일 형식이어야 합니다

## Slave 서버와의 관계

Master 서버 설정:

```named
zone "example.com" IN {
    type master;
    file "example.com.zone";
    allow-transfer { 192.168.1.10; };  # Slave 서버 IP
};
```

## 주의사항

- **Zone 파일**: Zone 파일이 반드시 존재해야 합니다
- **Serial 번호**: Zone 파일 수정 시 Serial 번호 증가 필요
- **보안**: `allow-transfer`로 신뢰할 수 있는 Slave에만 전송 허용

## 오류 해결

### Zone 파일을 찾을 수 없는 경우

```bash
# Zone 파일 경로 확인
ls -l /var/named/example.com.zone

# 파일 생성 또는 경로 수정
```

### Zone 파일 형식 오류

```bash
# Zone 파일 검증
named-checkzone example.com /var/named/example.com.zone
```

