# DDNS Zone 이름

## 개요

Cloudflare에 등록된 도메인(Zone) 이름을 지정하는 설정입니다. DNS 레코드를 업데이트할 Zone을 식별합니다.

## 설정 방법

Cloudflare에 등록된 도메인 이름을 입력합니다:

```
example.com
```

## 주요 특징

- **도메인 이름**: Cloudflare에 등록된 도메인
- **Zone 식별**: DNS 레코드를 업데이트할 Zone을 식별
- **FQDN 형식**: 정규화된 도메인 이름 형식 사용

## 일반적인 사용 예시

```
example.com
subdomain.example.com
mydomain.net
```

## 주의사항

- **Cloudflare 등록**: 도메인이 Cloudflare에 등록되어 있어야 합니다
- **API 토큰 권한**: API 토큰에 해당 Zone에 대한 편집 권한이 있어야 합니다
- **도메인 형식**: 서브도메인이 아닌 루트 도메인을 입력합니다

## 확인 방법

Cloudflare 대시보드에서 등록된 Zone 목록을 확인할 수 있습니다:

1. Cloudflare 대시보드 로그인
2. **Websites** 메뉴에서 등록된 도메인 확인
3. Zone 이름은 루트 도메인입니다 (예: `example.com`)

## 예시

- ✅ 올바른 예: `example.com`
- ❌ 잘못된 예: `www.example.com` (서브도메인)
- ❌ 잘못된 예: `http://example.com` (프로토콜 포함)

