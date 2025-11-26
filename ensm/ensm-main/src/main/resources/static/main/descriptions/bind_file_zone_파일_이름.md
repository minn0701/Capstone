# BIND Zone 파일 이름 설정

## 개요

Zone 데이터가 저장된 파일의 이름을 지정하는 설정입니다. `file` 지시어를 사용하여 Zone 파일 경로를 지정합니다.

## 설정 방법

```named
zone "example.com" IN {
    type master;
    file "example.com.zone";
};
```

또는 절대 경로:

```named
zone "example.com" IN {
    type master;
    file "/var/named/example.com.zone";
};
```

## 주요 특징

- **파일 경로**: Zone 데이터 파일의 경로 지정
- **절대/상대 경로**: 절대 경로 또는 상대 경로 사용 가능
- **Slave Zone**: `slaves/` 디렉토리에 저장

## 일반적인 사용 예시

```named
# 상대 경로 (기본: /var/named/)
zone "example.com" IN {
    type master;
    file "example.com.zone";
};

# 절대 경로
zone "example.com" IN {
    type master;
    file "/var/named/example.com.zone";
};

# Slave Zone (slaves/ 디렉토리)
zone "example.com" IN {
    type slave;
    masters { 192.168.1.5; };
    file "slaves/example.com.zone";
};
```

## 파일 명명 규칙

일반적인 명명 규칙:

- **정방향 Zone**: `example.com.zone`
- **역방향 Zone**: `192.168.1.zone` 또는 `1.168.192.in-addr.arpa.zone`
- **일관성**: Zone 이름과 파일명을 일치시키는 것이 좋습니다

## 주의사항

- **파일 존재**: Master Zone의 경우 파일이 존재해야 합니다
- **읽기 권한**: BIND 사용자가 파일을 읽을 수 있어야 합니다
- **Slave 디렉토리**: Slave Zone은 `slaves/` 디렉토리에 쓰기 권한 필요

## 오류 해결

### 파일을 찾을 수 없는 경우

```bash
# 파일 경로 확인
ls -l /var/named/example.com.zone

# 파일 생성 또는 경로 수정
```

### 권한 오류

```bash
# 파일 권한 확인 및 수정
chmod 644 /var/named/example.com.zone
chown named:named /var/named/example.com.zone
```

