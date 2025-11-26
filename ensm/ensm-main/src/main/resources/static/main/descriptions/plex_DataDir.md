# 데이터 디렉토리 (Data Directory)

## 이 옵션이 하는 일

Plex 미디어 서버의 데이터베이스, 설정 파일, 메타데이터 등이 저장되는 디렉토리 경로를 지정합니다. 미디어 파일 자체는 여기에 저장되지 않고, 미디어 정보와 설정만 저장됩니다.

## 기본값

- **기본값**: `/var/lib/plexmediaserver`
- **일반적인 경로**: `/var/lib/plexmediaserver`

## 경로 설정 예시

### 표준 경로
```
/var/lib/plexmediaserver        → 기본 경로 (권장)
```

### 대용량 저장소
```
/mnt/plex/data                  → 별도 디스크
/data/plex                       → 데이터 디스크
```

### 사용자 정의 경로
```
/home/plex/data                 → 사용자 홈 디렉토리
/opt/plex/data                  → 대체 경로
```

## 알아야 할 것들

### 저장되는 데이터

이 디렉토리에 다음이 저장됩니다:
- **데이터베이스**: 미디어 라이브러리 정보
- **설정 파일**: Plex 설정
- **메타데이터**: 영화/드라마 정보, 포스터 등
- **썸네일**: 미디어 썸네일 이미지
- **인덱스**: 미디어 검색 인덱스

### 디스크 공간

데이터 디렉토리는 시간이 지나면서 커질 수 있습니다:
- **메타데이터**: 수백 MB ~ 수 GB
- **썸네일**: 수 GB (미디어 양에 따라)
- **인덱스**: 수백 MB ~ 수 GB

충분한 디스크 공간이 필요합니다.

### 권한 설정

디렉토리에 적절한 권한이 필요합니다:

```bash
# 디렉토리 생성 및 권한 설정
sudo mkdir -p /var/lib/plexmediaserver
sudo chown plex:plex /var/lib/plexmediaserver
sudo chmod 755 /var/lib/plexmediaserver
```

## 자주 발생하는 오류

### "Permission denied" 오류
**원인**: Plex 사용자가 디렉토리에 접근 불가

**해결 방법**:
```bash
sudo chown -R plex:plex /var/lib/plexmediaserver
sudo chmod 755 /var/lib/plexmediaserver
```

### 디스크 공간 부족
**원인**: 메타데이터와 썸네일이 많이 쌓임

**해결 방법**:
1. 오래된 썸네일 삭제
2. 더 큰 디스크로 이동
3. 디스크 할당량 확인

### 경로 변경 후 데이터가 사라짐
**원인**: 기존 데이터를 이동하지 않음

**해결 방법**:
1. Plex 서비스 중지
2. 기존 데이터를 새 경로로 이동
3. 권한 설정
4. Plex 서비스 시작

