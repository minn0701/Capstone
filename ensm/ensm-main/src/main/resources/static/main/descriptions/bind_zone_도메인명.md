# BIND Zone 도메인명

## 개요

Zone을 정의할 때 관리할 도메인 이름을 지정하는 설정입니다. Zone 블록의 첫 번째 매개변수로 사용됩니다.

## 설정 방법

```named
zone "example.com" IN {
    type master;
    file "example.com.zone";
};
```

## 주요 특징

- **도메인 지정**: 관리할 도메인 이름을 명시
- **FQDN 형식**: 정규화된 도메인 이름(FQDN) 사용
- **Zone 식별**: 여러 Zone을 구분하는 식별자

## 일반적인 사용 예시

```named
# 최상위 도메인
zone "example.com" IN {
    type master;
    file "example.com.zone";
};

# 서브도메인
zone "sub.example.com" IN {
    type master;
    file "sub.example.com.zone";
};

# 역방향 Zone (IPv4)
zone "1.168.192.in-addr.arpa" IN {
    type master;
    file "192.168.1.zone";
};
```

## 주의사항

- **따옴표**: 도메인명은 따옴표로 감싸야 합니다
- **대소문자**: 도메인명은 대소문자를 구분하지 않지만, 일관성 있게 작성 권장
- **Zone 파일**: Zone 파일명과 일치시키는 것이 좋습니다

