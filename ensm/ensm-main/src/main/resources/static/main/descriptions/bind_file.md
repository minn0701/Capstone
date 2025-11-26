# BIND Zone File 경로 설정

## 개요

Zone 데이터가 저장된 파일의 경로를 지정하는 설정입니다. Master Zone의 경우 Zone 파일 경로, Slave Zone의 경우 복사받은 Zone 파일을 저장할 경로를 지정합니다.

## 설정 방법

```named
zone "example.com" IN {
    type master;
    file "/var/named/example.com.zone";
};
```

또는 상대 경로:

```named
zone "example.com" IN {
    type master;
    file "example.com.zone";
};
```

## 주요 특징

- **절대 경로**: 전체 경로 지정 가능
- **상대 경로**: 기본적으로 `/var/named/` 기준
- **Slave Zone**: `slaves/` 디렉토리에 저장 (자동 생성)

## 일반적인 사용 예시

```named
# 절대 경로
zone "example.com" IN {
    type master;
    file "/var/named/example.com.zone";
};

# 상대 경로
zone "example.com" IN {
    type master;
    file "example.com.zone";
};

# Slave Zone
zone "example.com" IN {
    type slave;
    masters { 192.168.1.5; };
    file "slaves/example.com.zone";
};
```

## 파일 권한

Zone 파일은 BIND 사용자가 읽을 수 있어야 합니다:

```bash
chmod 644 /var/named/example.com.zone
chown named:named /var/named/example.com.zone
```

## 주의사항

- **파일 존재**: Master Zone의 경우 Zone 파일이 존재해야 합니다
- **읽기 권한**: BIND 사용자가 파일을 읽을 수 있어야 합니다
- **Slave 디렉토리**: Slave Zone은 `slaves/` 디렉토리에 쓰기 권한이 필요합니다

