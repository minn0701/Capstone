# BIND Zone 파일 DNS 관리자 메일 주소

## 개요

Zone 파일의 SOA 레코드에서 DNS 관리자의 이메일 주소를 지정하는 설정입니다. Zone 관련 문제 발생 시 연락할 관리자 정보를 제공합니다.

## 설정 방법

SOA 레코드 내에서:

```
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101
                3600
                1800
                604800
                86400
        )
```

## 주요 특징

- **이메일 형식**: `@` 기호를 점(`.`)으로 대체
- **예시**: `admin@example.com` → `admin.example.com.`
- **도메인 끝 점**: 끝에 점(`.`) 필수

## 일반적인 사용 예시

```
; admin@example.com
@       IN SOA  ns1.example.com. admin.example.com. (
                2024010101
                3600
                1800
                604800
                86400
        )

; dns@example.com
@       IN SOA  ns1.example.com. dns.example.com. (
                2024010101
                3600
                1800
                604800
                86400
        )

; hostmaster@example.com (일반적인 관례)
@       IN SOA  ns1.example.com. hostmaster.example.com. (
                2024010101
                3600
                1800
                604800
                86400
        )
```

## 주의사항

- **@ → . 변환**: 이메일의 `@` 기호를 점(`.`)으로 변경
- **도메인 끝 점**: 끝에 점(`.`)을 반드시 붙여야 합니다
- **hostmaster**: 일반적으로 `hostmaster`를 사용하는 것이 관례입니다

## 변환 예시

| 이메일 주소 | SOA 레코드 형식 |
|------------|----------------|
| admin@example.com | admin.example.com. |
| dns@example.com | dns.example.com. |
| hostmaster@example.com | hostmaster.example.com. |

