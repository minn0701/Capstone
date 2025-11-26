# BIND allow-update 설정

## 개요

BIND DNS 서버에서 Zone 데이터의 동적 업데이트를 허용할 클라이언트를 지정하는 설정입니다. 일반적으로 보안상 `none`으로 설정하여 비활성화합니다.

## 설정 방법

```named
zone "example.com" IN {
    type master;
    file "example.com.zone";
    allow-update { none; };
};
```

또는 특정 클라이언트만 허용:

```named
zone "example.com" IN {
    type master;
    file "example.com.zone";
    allow-update { 192.168.1.100; };
};
```

## 주요 특징

- **동적 업데이트**: DNS 레코드를 동적으로 추가/수정/삭제
- **보안 위험**: 무단 업데이트로 인한 보안 위험
- **기본값**: 설정하지 않으면 모든 클라이언트 허용 (위험)

## 일반적인 사용 예시

```named
# 동적 업데이트 완전 차단 (권장)
zone "example.com" IN {
    type master;
    file "example.com.zone";
    allow-update { none; };
};

# 특정 IP만 허용
zone "example.com" IN {
    type master;
    file "example.com.zone";
    allow-update { 192.168.1.100; };
};

# ACL 사용
acl updaters {
    192.168.1.100;
    192.168.1.101;
};
zone "example.com" IN {
    type master;
    file "example.com.zone";
    allow-update { updaters; };
};
```

## 보안 권장사항

1. **기본 차단**: `allow-update { none; }`로 설정 (권장)
2. **TSIG 키**: 동적 업데이트가 필요한 경우 TSIG 키 사용
3. **제한된 접근**: 신뢰할 수 있는 클라이언트에만 허용

## TSIG 키를 사용한 동적 업데이트

더 안전한 방법:

```named
key "update-key" {
    algorithm hmac-sha256;
    secret "base64-encoded-key";
};

zone "example.com" IN {
    type master;
    file "example.com.zone";
    allow-update { key "update-key"; };
};
```

## 주의사항

- **보안 위험**: 무단 업데이트로 인한 DNS 스푸핑 공격 가능
- **파일 손상**: 잘못된 업데이트로 Zone 파일 손상 가능
- **기본값 위험**: 설정하지 않으면 모든 클라이언트 허용

## 오류 해결

### 동적 업데이트 실패

- `allow-update`에 클라이언트 IP가 포함되어 있는지 확인
- TSIG 키를 사용하는 경우 키가 올바른지 확인
- BIND 로그 확인: `tail -f /var/log/messages | grep named`

