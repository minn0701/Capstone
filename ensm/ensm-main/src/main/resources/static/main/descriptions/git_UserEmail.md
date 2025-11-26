# 이메일 주소 (User Email)

## 이 옵션이 하는 일

Git 커밋에 표시될 이메일 주소를 설정합니다. 사용자 이름과 함께 커밋 작성자를 식별하는 데 사용됩니다.

## 설정 예시

### 일반적인 이메일
```
user@example.com
developer@company.com
hong@example.org
```

### GitHub/GitLab 이메일
```
username@users.noreply.github.com
username@users.noreply.gitlab.com
```
→ 공개 저장소에서 이메일 노출 방지

## 알아야 할 것들

### 전역 vs 로컬 설정

**전역 설정** (이 옵션):
- 모든 Git 저장소에 적용
- `~/.gitconfig`에 저장

**로컬 설정**:
- 특정 저장소에만 적용
- `git config user.email "email@example.com"` (저장소 내에서)

### 공개 저장소 주의

공개 저장소(GitHub, GitLab 등)에 푸시하면:
- 이메일 주소가 공개됨
- 스팸 수신 가능
- GitHub/GitLab의 no-reply 이메일 사용 권장

### 이메일 확인

설정한 이메일 확인:

```bash
# 전역 설정 확인
git config --global user.email

# 로컬 설정 확인 (저장소 내)
git config user.email
```

## 자주 발생하는 오류

### 커밋 시 "Please tell me who you are" 오류
**원인**: 이메일 주소가 설정되지 않음

**해결 방법**:
1. 이메일 주소 설정
2. 사용자 이름도 함께 설정

### 이메일 형식 오류
**올바른 형식**:
- `user@example.com` ✅
- `user.name@example.com` ✅

**잘못된 형식**:
- `user@` ❌
- `@example.com` ❌
- `user example.com` ❌ (공백)

### 공개 저장소에서 이메일 노출
**해결 방법**:
- GitHub: `username@users.noreply.github.com` 사용
- GitLab: `username@users.noreply.gitlab.com` 사용
- 또는 별도 이메일 사용

