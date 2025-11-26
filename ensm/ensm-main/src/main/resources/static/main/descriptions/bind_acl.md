# 접근 제어 목록 (ACL)

## 이 옵션이 하는 일

IP 주소나 네트워크를 그룹으로 묶어서 이름을 붙이는 기능입니다. 이 이름을 다른 설정(AllowQuery, AllowTransfer 등)에서 재사용할 수 있어 관리가 편리합니다.

## 기본값

- **기본값**: 없음 (선택사항)

## 설정 예시

### 내부 네트워크 ACL
```
acl "internal" {
    192.168.0.0/16;
    10.0.0.0/8;
};
```
→ 내부 네트워크를 "internal"이라는 이름으로 정의

### 특정 서버 ACL
```
acl "trusted-servers" {
    192.168.1.10;
    192.168.1.11;
    203.0.113.50;
};
```
→ 신뢰할 수 있는 서버들을 그룹화

### 사용 예시
```
# ACL 정의
acl "internal" {
    192.168.0.0/16;
};

# ACL 사용
allow-query { internal; };
allow-transfer { internal; };
```

## 알아야 할 것들

### ACL의 장점

1. **재사용성**: 한 번 정의하고 여러 곳에서 사용
2. **가독성**: IP 주소 대신 의미 있는 이름 사용
3. **관리 편의성**: 변경 시 한 곳만 수정

### ACL 정의 위치

ACL은 BIND 설정 파일의 상단에 정의합니다:

```named.conf
acl "internal" {
    192.168.0.0/16;
};

options {
    allow-query { internal; };
};
```

### 미리 정의된 ACL

BIND에는 기본 ACL이 있습니다:
- `any`: 모든 IP
- `none`: 없음
- `localhost`: 로컬 호스트
- `localnets`: 로컬 네트워크

## 자주 발생하는 오류

### "ACL not defined" 오류
**원인**: ACL을 사용하기 전에 정의하지 않음

**해결 방법**:
1. ACL을 먼저 정의
2. 그 다음 사용

### ACL이 작동하지 않음
**확인 사항**:
1. ACL 정의 문법 확인
2. ACL 이름이 올바른지 확인
3. BIND 설정 파일 문법 확인
