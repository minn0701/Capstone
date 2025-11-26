# BIND Zone Type 설정

## 개요

Zone의 타입을 지정하는 설정입니다. Master, Slave, Hint 등 Zone의 역할을 정의합니다.

## 설정 방법

```named
zone "example.com" IN {
    type master;
    file "example.com.zone";
};
```

## Zone 타입

### master

Zone 데이터를 직접 관리하는 주 서버:

```named
zone "example.com" IN {
    type master;
    file "example.com.zone";
};
```

### slave

Master 서버에서 Zone 데이터를 복사받는 보조 서버:

```named
zone "example.com" IN {
    type slave;
    masters { 192.168.1.5; };
    file "slaves/example.com.zone";
};
```

### hint

루트 DNS 서버 목록을 제공하는 힌트 Zone:

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
    file "example.com.zone";
};

# Slave Zone
zone "example.com" IN {
    type slave;
    masters { 192.168.1.5; };
    file "slaves/example.com.zone";
};
```

## 주의사항

- **Master**: Zone 파일이 존재해야 합니다
- **Slave**: `masters` 지시어가 필요합니다
- **Hint**: 루트 Zone에만 사용됩니다

