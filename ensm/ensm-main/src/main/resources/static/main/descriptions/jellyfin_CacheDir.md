# 캐시 디렉토리 (Cache Directory)

## 이 옵션이 하는 일

Jellyfin이 미디어 메타데이터, 썸네일, 트랜스코딩 캐시 등을 저장할 디렉토리 경로를 지정합니다. 빠른 접근을 위해 캐시를 저장합니다.

## 기본값

- **기본값**: `/var/cache/jellyfin`
- **일반적인 경로**: `/var/cache/jellyfin`

## 경로 설정 예시

### 표준 경로
```
/var/cache/jellyfin              → 기본 경로 (권장)
```

### 고속 저장소
```
/mnt/ssd/jellyfin/cache          → SSD 저장소
/data/jellyfin/cache             → 빠른 디스크
```

### 사용자 정의 경로
```
/home/jellyfin/cache             → 사용자 홈 디렉토리
/opt/jellyfin/cache              → 대체 경로
```

## 알아야 할 것들

### 저장되는 데이터

이 디렉토리에 다음이 저장됩니다:
- **썸네일**: 미디어 썸네일 이미지
- **트랜스코딩 캐시**: 변환된 미디어 임시 파일
- **메타데이터 캐시**: 빠른 접근을 위한 캐시

### 디스크 공간

캐시 디렉토리는 시간이 지나면서 커질 수 있습니다:
- **썸네일**: 수 GB (미디어 양에 따라)
- **트랜스코딩 캐시**: 수십 GB (사용량에 따라)

충분한 디스크 공간이 필요합니다.

### 성능 고려사항

**SSD 사용 권장**:
- 빠른 읽기/쓰기
- 썸네일 로딩 속도 향상
- 트랜스코딩 성능 향상

### 권한 설정

디렉토리에 적절한 권한이 필요합니다:

```bash
# 디렉토리 생성 및 권한 설정
sudo mkdir -p /var/cache/jellyfin
sudo chown jellyfin:jellyfin /var/cache/jellyfin
sudo chmod 755 /var/cache/jellyfin
```

## 자주 발생하는 오류

### "Permission denied" 오류
**원인**: Jellyfin 사용자가 디렉토리에 접근 불가

**해결 방법**:
```bash
sudo chown -R jellyfin:jellyfin /var/cache/jellyfin
sudo chmod 755 /var/cache/jellyfin
```

### 디스크 공간 부족
**원인**: 캐시 파일이 많이 쌓임

**해결 방법**:
1. 오래된 캐시 삭제
2. 더 큰 디스크로 이동
3. 캐시 크기 제한 설정

### 캐시가 너무 느림
**원인**: 느린 디스크 사용

**해결 방법**:
1. SSD로 이동
2. 빠른 디스크 사용
3. 캐시 디렉토리 최적화

