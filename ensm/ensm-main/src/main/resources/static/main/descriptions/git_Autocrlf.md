# 줄바꿈 문자 처리 (Auto CRLF)

## 이 옵션이 하는 일

Windows와 Unix/Linux 간 줄바꿈 문자 차이를 자동으로 처리합니다. Windows는 CRLF(`\r\n`), Unix/Linux는 LF(`\n`)를 사용합니다.

## 선택지 설명

### true (Windows 스타일로 변환)
- **의미**: 체크아웃 시 LF → CRLF, 커밋 시 CRLF → LF
- **사용 시기**: **Windows에서 작업하는 경우**
- **효과**: Windows에서 파일이 정상적으로 표시됨

### false (변환 안 함)
- **의미**: 줄바꿈 문자를 그대로 유지
- **사용 시기**: **Linux/Mac에서 작업하는 경우**
- **효과**: 원본 그대로 유지

### input (커밋 시만 변환)
- **의미**: 커밋 시 CRLF → LF만 변환, 체크아웃 시 변환 안 함
- **사용 시기**: Linux/Mac에서 작업하지만 Windows 사용자와 협업
- **효과**: 저장소는 LF로 통일, 로컬은 그대로

## 알아야 할 것들

### 줄바꿈 문자 차이

- **Windows**: CRLF (`\r\n`) - 캐리지 리턴 + 라인 피드
- **Unix/Linux/Mac**: LF (`\n`) - 라인 피드만
- **구 Mac**: CR (`\r`) - 캐리지 리턴만 (현재는 거의 사용 안 함)

### 협업 시 주의

팀 프로젝트에서는:
- 모든 팀원이 같은 설정 사용 권장
- 또는 `.gitattributes` 파일로 프로젝트별 설정
- 일관성 유지 중요

### .gitattributes 파일

프로젝트별로 설정할 수 있습니다:

```
# 모든 파일을 LF로 통일
* text=auto eol=lf

# Windows 배치 파일은 CRLF 유지
*.bat text eol=crlf
```

## 자주 발생하는 오류

### Windows에서 파일이 한 줄로 표시됨
**원인**: `false` 또는 `input` 설정으로 CRLF 변환이 안 됨

**해결 방법**:
- `true`로 변경
- 또는 `.gitattributes` 파일 사용

### Linux에서 ^M 문자가 보임
**원인**: CRLF가 포함된 파일

**해결 방법**:
- `false` 또는 `input` 사용
- 또는 파일 변환: `dos2unix filename`

### Git에서 모든 줄이 변경으로 표시됨
**원인**: 줄바꿈 문자 차이

**해결 방법**:
1. `.gitattributes` 파일로 설정
2. 또는 팀 전체가 같은 설정 사용
3. `git config core.autocrlf` 확인

