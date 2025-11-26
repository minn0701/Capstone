# BIND allow-query 설정

## 개요

BIND DNS 서버가 DNS 쿼리를 허용할 클라이언트를 지정하는 설정입니다. 보안을 위해 특정 IP 주소나 네트워크만 허용할 수 있습니다.

## 설정 방법

```named
options {
    allow-query { localhost; };
};
```

또는:

```named
options {
    allow-query { 192.168.1.0/24; };
};
```

## 주요 특징

- **보안 강화**: 허가된 클라이언트만 DNS 쿼리 가능
- **네트워크 단위**: 서브넷 단위로 허용 가능
- **ACL 활용**: 미리 정의한 ACL 사용 가능

## 일반적인 사용 예시

```named
# 로컬호스트만 허용
allow-query { localhost; };

# 특정 서브넷 허용
allow-query { 192.168.1.0/24; 10.0.0.0/8; };

# 모든 클라이언트 허용 (기본값, 보안 위험)
allow-query { any; };

# ACL 사용
acl trusted {
    192.168.1.0/24;
    10.0.0.0/8;
};
options {
    allow-query { trusted; };
};
```

## 보안 권장사항

1. **최소 권한**: 필요한 네트워크만 허용
2. **내부 네트워크**: 가능하면 내부 네트워크만 허용
3. **ACL 활용**: 복잡한 규칙은 ACL로 정의하여 재사용

## ACL 정의 예시

```named
# ACL 정의
acl internal {
    192.168.1.0/24;
    10.0.0.0/8;
    127.0.0.1;
};

# ACL 사용
options {
    allow-query { internal; };
};
```

## 주의사항

- **기본값**: 설정하지 않으면 `any`로 동작 (모든 클라이언트 허용)
- **재귀 쿼리**: `allow-recursion`과는 별개로 설정
- **Zone별 설정**: 특정 Zone에만 적용하려면 Zone 블록 내에 설정

## Zone별 설정

특정 Zone에만 적용:

```named
zone "example.com" IN {
    type master;
    file "example.com.zone";
    allow-query { 192.168.1.0/24; };
};
```

## 오류 해결

### 쿼리 거부 오류

클라이언트에서 DNS 쿼리가 거부되는 경우:

1. `allow-query`에 클라이언트 IP가 포함되어 있는지 확인
2. 방화벽에서 포트 53이 열려있는지 확인
3. BIND 로그 확인: `tail -f /var/log/messages | grep named`

