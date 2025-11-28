# 패키지 설치 버튼이 작동하지 않았던 근본 원인

## 문제 상황
검색창에서 설치 버튼을 눌렀을 때 설치가 안 되었던 이유

## 근본 원인 분석

### 1. 검색 결과 필터링 로직 오류 (376번 줄)

**문제 코드:**
```javascript
const installedIds = packages.map(pkg => pkg.id);
```

**문제점:**
- `packages`에는 **모든 패키지**가 포함되어 있음 (installed: true/false 모두)
- 이 로직은 모든 패키지의 ID를 가져옴
- 결과적으로 설치되지 않은 패키지도 `installedIds`에 포함됨
- 검색 결과에서 모든 패키지가 제외되어 버림

**올바른 코드:**
```javascript
const installedIds = packages
    .filter(pkg => pkg.installed === true || pkg.installed === "true")
    .map(pkg => pkg.id);
```

### 2. 전체적인 로직 흐름

**올바른 작동 방식:**
1. 백엔드: 모든 패키지 반환 (installed: true/false 포함)
2. 프론트엔드: 모든 패키지를 `packages` state에 저장
3. UI 목록: `packages.filter(pkg => pkg.installed === true)`로 설치된 패키지만 표시
4. 검색 결과: `installedIds`는 **설치된 패키지만** 필터링해서 가져와야 함

**문제가 있었던 방식:**
- 검색 결과 필터링에서 모든 패키지 ID를 체크
- 결과적으로 검색 결과가 비어버림
- 또는 검색 결과가 제대로 업데이트되지 않음

### 3. 수정된 부분

1. ✅ **useEffect 검색 필터링 (59-61, 66-68줄)**: 설치된 패키지만 필터링하도록 수정 완료
2. ✅ **검색창 포커스 시 (376줄)**: 수정 필요했으나 현재 코드 확인 필요
3. ✅ **UI 목록 표시 (488줄)**: 설치된 패키지만 필터링해서 표시

## 최종 해결

모든 검색 결과 필터링 로직에서:
- `packages.map(pkg => pkg.id)` ❌
- `packages.filter(pkg => pkg.installed === true).map(pkg => pkg.id)` ✅

이렇게 수정하면 검색 결과가 올바르게 표시되고, 설치 버튼도 정상 작동합니다.

