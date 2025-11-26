# BIND allow-transfer 설정

## 개요

BIND DNS 서버가 Zone 전송(Zone Transfer)을 허용할 서버를 지정하는 설정입니다. Zone 전송은 Master 서버에서 Slave 서버로 Zone 데이터를 복사하는 과정입니다.

## 설정 방법

```named
options {
    allow-transfer { none; };
};
```

또는 특정 서버만 허용:

```named
options {
    allow-transfer { 192.168.1.10; };
};
```

## 주요 특징

- **보안**: Zone 전송은 DNS 정보를 노출할 수 있으므로 제한 필요
- **Master-Slave**: Master 서버에서 Slave 서버로만 전송 허용
- **기본값**: 설정하지 않으면 모든 서버에서 전송 가능 (보안 위험)

## 일반적인 사용 예시

```named
# Zone 전송 완전 차단 (권장)
allow-transfer { none; };

# 특정 Slave 서버만 허용
allow-transfer { 192.168.1.10; 192.168.1.11; };

# ACL 사용
acl slaves {
    192.168.1.10;
    192.168.1.11;
};
options {
    allow-transfer { slaves; };
};

# Zone별 설정
zone "example.com" IN {
    type master;
    file "example.com.zone";
    allow-transfer { 192.168.1.10; };
};
```

## 보안 권장사항

1. **기본 차단**: `allow-transfer { none; }`로 설정하고 필요한 경우만 허용
2. **Slave 서버만**: Master 서버는 신뢰할 수 있는 Slave 서버에만 전송 허용
3. **네트워크 제한**: 내부 네트워크의 Slave 서버만 허용

## Master-Slave 구성

Master 서버 설정:

```named
zone "example.com" IN {
    type master;
    file "example.com.zone";
    allow-transfer { 192.168.1.10; };  # Slave 서버 IP
};
```

Slave 서버 설정:

```named
zone "example.com" IN {
    type slave;
    masters { 192.168.1.5; };  # Master 서버 IP
    file "slaves/example.com.zone";
};
```

## 주의사항

- **정보 노출**: Zone 전송을 통해 전체 DNS 구조가 노출될 수 있습니다
- **DDoS 공격**: 무제한 Zone 전송은 DDoS 공격에 악용될 수 있습니다
- **Zone별 설정**: `options` 블록과 Zone 블록 모두에서 설정 가능 (Zone 설정이 우선)

## 오류 해결

### Zone 전송 실패

Slave 서버에서 Zone 전송이 실패하는 경우:

1. Master 서버의 `allow-transfer`에 Slave 서버 IP가 포함되어 있는지 확인
2. 방화벽에서 포트 53이 열려있는지 확인
3. BIND 로그 확인: `tail -f /var/log/messages | grep named`

### 보안 테스트

```bash
# Zone 전송 시도 (거부되어야 함)
dig @dns-server example.com AXFR

# 정상적인 쿼리는 작동해야 함
dig @dns-server example.com
```

