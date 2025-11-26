# 로그 드라이버 (Log Driver)

## 이 옵션이 하는 일

Docker 컨테이너의 로그를 저장하는 방식을 지정합니다. 각 드라이버는 다른 특성과 기능을 제공합니다.

## 선택지 설명

### json-file (기본)
- **의미**: JSON 형식으로 파일에 저장
- **장점**: 간단하고 표준적
- **단점**: 로그 파일 크기 관리 필요
- **사용 시기**: **대부분의 경우 권장**

### syslog
- **의미**: 시스템 syslog로 전송
- **장점**: 중앙 집중식 로그 관리
- **단점**: syslog 설정 필요
- **사용 시기**: 로그 중앙 관리가 필요한 경우

### journald
- **의미**: systemd journal로 전송
- **장점**: systemd 통합
- **단점**: systemd 필요
- **사용 시기**: systemd 사용 환경

### none (로그 비활성화)
- **의미**: 로그 저장 안 함
- **장점**: 디스크 공간 절약
- **단점**: 로그 확인 불가
- **사용 시기**: 로그가 불필요한 경우

## 알아야 할 것들

### 로그 파일 위치

**json-file 사용 시**:
- 로그 위치: `/var/lib/docker/containers/<container-id>/<container-id>-json.log`
- `docker logs` 명령어로 확인 가능

### 로그 크기 관리

json-file 사용 시 로그 파일이 커질 수 있습니다:
- `max_log_size` 설정으로 크기 제한
- `log_opt_max_file` 설정으로 파일 개수 제한
- 자동 로테이션

### 로그 확인

```bash
# 컨테이너 로그 확인
docker logs <container-name>

# 실시간 로그 확인
docker logs -f <container-name>

# 최근 로그만
docker logs --tail 100 <container-name>
```

## 자주 발생하는 오류

### 로그 파일이 너무 커짐
**원인**: json-file 사용 시 로그 파일이 계속 커짐

**해결 방법**:
1. `max_log_size` 설정
2. `log_opt_max_file` 설정
3. 또는 syslog/journald 사용

### 로그가 보이지 않음
**원인**: `none` 드라이버 사용 또는 로그 드라이버 오류

**해결 방법**:
1. 로그 드라이버 설정 확인
2. `json-file` 사용 권장
3. 컨테이너 재시작

