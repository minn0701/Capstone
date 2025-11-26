# DDNS Cloudflare API 토큰

## 개요

Cloudflare API에 접근하기 위한 인증 토큰입니다. DDNS 기능이 Cloudflare DNS를 업데이트하기 위해 필요합니다.

## 설정 방법

Cloudflare 대시보드에서 생성한 API 토큰을 입력합니다. 비밀번호 필드이므로 입력 내용이 숨겨집니다.

## API 토큰 생성 방법

1. Cloudflare 대시보드에 로그인
2. **My Profile** > **API Tokens** 이동
3. **Create Token** 클릭
4. **Edit zone DNS** 템플릿 선택 또는 커스텀 토큰 생성
5. 필요한 권한 설정:
   - **Zone** > **DNS** > **Edit**
   - 특정 Zone 선택 또는 모든 Zone 허용
6. 토큰 생성 후 복사하여 입력

## 주요 특징

- **인증**: Cloudflare API 접근을 위한 인증 수단
- **권한 제어**: 특정 Zone과 권한만 부여 가능
- **보안**: 토큰은 비밀번호처럼 안전하게 보관해야 합니다

## 권한 설정

DDNS 기능을 위해 필요한 최소 권한:

- **Zone** > **DNS** > **Edit**: DNS 레코드 편집 권한
- **Zone** > **Zone** > **Read**: Zone 정보 읽기 권한

## 보안 주의사항

⚠️ **중요**: API 토큰은 비밀번호처럼 안전하게 보관하세요:

1. **토큰 노출 금지**: 토큰을 공개하거나 공유하지 마세요
2. **최소 권한**: 필요한 최소 권한만 부여하세요
3. **정기 갱신**: 정기적으로 토큰을 갱신하세요
4. **토큰 삭제**: 사용하지 않는 토큰은 삭제하세요

## 토큰 확인

토큰이 올바른지 확인하려면:

```bash
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

