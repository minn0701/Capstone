# BIND Zone 방향 설정

## 개요

Zone의 방향을 지정하는 설정입니다. 정방향 Zone(Forward Zone)과 역방향 Zone(Reverse Zone)을 구분합니다.

## 정방향 Zone (Forward Zone)

도메인 이름을 IP 주소로 변환:

```named
zone "example.com" IN {
    type master;
    file "example.com.zone";
};
```

## 역방향 Zone (Reverse Zone)

IP 주소를 도메인 이름으로 변환:

```named
# IPv4 역방향 Zone
zone "1.168.192.in-addr.arpa" IN {
    type master;
    file "192.168.1.zone";
};

# IPv6 역방향 Zone
zone "0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa" IN {
    type master;
    file "2001.db8.zone";
};
```

## 주요 특징

- **정방향**: 도메인 → IP 주소 (A, AAAA 레코드)
- **역방향**: IP 주소 → 도메인 (PTR 레코드)
- **in-addr.arpa**: IPv4 역방향 Zone 도메인
- **ip6.arpa**: IPv6 역방향 Zone 도메인

## 일반적인 사용 예시

```named
# 정방향 Zone
zone "example.com" IN {
    type master;
    file "example.com.zone";
};

# IPv4 역방향 Zone (192.168.1.0/24)
zone "1.168.192.in-addr.arpa" IN {
    type master;
    file "192.168.1.zone";
};

# IPv6 역방향 Zone (2001:db8::/32)
zone "0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa" IN {
    type master;
    file "2001.db8.zone";
};
```

## 역방향 Zone 도메인 변환

### IPv4

IP 주소를 역순으로 변환:
- `192.168.1.0/24` → `1.168.192.in-addr.arpa`

### IPv6

IPv6 주소를 역순으로 변환:
- `2001:db8::/32` → `0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa`

## 주의사항

- **PTR 레코드**: 역방향 Zone에는 PTR 레코드가 필요합니다
- **도메인 형식**: 역방향 Zone 도메인은 특별한 형식을 따릅니다
- **필수 아님**: 역방향 Zone은 선택사항이지만 권장됩니다

