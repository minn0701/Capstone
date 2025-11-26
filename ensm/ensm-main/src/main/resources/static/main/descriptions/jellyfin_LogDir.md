# 로그 디렉토리 (Log Directory)

## 이 옵션이 하는 일

Jellyfin의 로그 파일이 저장될 디렉토리 경로를 지정합니다. 서버 문제를 진단하고 해결하는 데 필수적인 정보를 제공합니다.

## 기본값

- **기본값**: `/var/log/jellyfin`
- **일반적인 경로**: `/var/log/jellyfin`

## 경로 설정 예시

### 표준 경로
```
/var/log/jellyfin              → 기본 경로 (권장)
```

### 사용자 정의 경로
```
/home/jellyfin/logs            → 사용자 홈 디렉토리
/opt/jellyfin/logs             → 대체 경로
```

## 알아야 할 것들

### 저장되는 로그

이 디렉토리에 다음이 저장됩니다:
- **서버 로그**: Jellyfin 서버 로그
- **오류 로그**: 오류 및 경고 메시지
- **접근 로그**: 사용자 접근 기록

### 로그 파일 크기

로그 파일은 시간이 지나면서 커질 수 있습니다:
- **일반적인 사용**: 수십 MB ~ 수백 MB
- **대량 사용**: 수 GB

로그 로테이션이 필요합니다.

### 로그 로테이션

로그 파일이 계속 커지면 디스크 공간을 차지하므로 로그 로테이션을 설정해야 합니다:

```bash
# logrotate 설정 예시
/var/log/jellyfin/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
}
```

### 권한 설정

디렉토리에 적절한 권한이 필요합니다:

```bash
# 디렉토리 생성 및 권한 설정
sudo mkdir -p /var/log/jellyfin
sudo chown jellyfin:jellyfin /var/log/jellyfin
sudo chmod 755 /var/log/jellyfin
```

## 자주 발생하는 오류

### "Permission denied" 오류
**원인**: Jellyfin 사용자가 디렉토리에 쓰기 권한이 없음

**해결 방법**:
```bash
sudo chown -R jellyfin:jellyfin /var/log/jellyfin
sudo chmod 755 /var/log/jellyfin
```

### 로그 파일이 너무 커짐
**원인**: 로그 로테이션이 설정되지 않음

**해결 방법**:
1. 로그 로테이션 설정
2. 오래된 로그 파일 삭제
3. 로그 레벨 조정

### 디스크 공간 부족
**원인**: 로그 파일이 계속 커짐

**해결 방법**:
1. 로그 로테이션 설정
2. 오래된 로그 파일 삭제
3. 더 큰 디스크로 이동

