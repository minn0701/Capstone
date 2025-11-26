# 설정 디렉토리 (Config Directory)

## 이 옵션이 하는 일

Home Assistant의 설정 파일, 통합 구성 요소, 자동화 스크립트 등이 저장되는 디렉토리 경로를 지정합니다.

## 기본값

- **기본값**: `/config`
- **일반적인 경로**: `/config` 또는 `/home/homeassistant/.homeassistant`

## 경로 설정 예시

### 표준 경로
```
/config                      → 기본 경로
/home/homeassistant/.homeassistant
```

### 사용자 정의 경로
```
/home/user/homeassistant     → 사용자 홈 디렉토리
/opt/homeassistant           → 대체 경로
```

## 알아야 할 것들

### 저장되는 데이터

이 디렉토리에 다음이 저장됩니다:
- **configuration.yaml**: 메인 설정 파일
- **통합 구성 요소**: 각 통합의 설정
- **자동화**: 자동화 스크립트
- **스크립트**: 사용자 정의 스크립트
- **테마**: 커스텀 테마

### 백업 중요

설정 디렉토리는 정기적으로 백업해야 합니다:
- 모든 설정과 자동화 포함
- 복원 시 전체 시스템 복구 가능

## 자주 발생하는 오류

### "Permission denied" 오류
**원인**: Home Assistant 사용자가 디렉토리에 접근 불가

**해결 방법**:
```bash
sudo chown -R homeassistant:homeassistant /config
sudo chmod 755 /config
```

