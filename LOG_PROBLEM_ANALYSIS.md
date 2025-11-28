# 로그 문제 분석 결과

## ✅ 정상 작동 중인 부분

1. **서비스 상태**: 모두 정상 실행 중
   - Promtail: `active (running)`
   - Loki: `active (running)`
   - Grafana: `active (running)`

2. **Promtail 로그 수집**: 정상 작동
   - ENSM 로그 파일을 읽고 있음: `/var/log/ensm/auth/auth-app.log`, `/var/log/ensm/main/main-app.log`
   - positions.yaml 파일에 위치 기록됨
   - 메트릭상 117줄 (auth), 21줄 (main) 읽음

3. **Promtail → Loki 전송**: 정상 작동
   - `promtail_sent_entries_total: 10431` (10,431개 로그 엔트리 전송됨)
   - `promtail_sent_bytes_total: 341220` (341KB 전송됨)
   - 드롭된 로그 없음 (`promtail_dropped_entries_total: 0`)

4. **Loki 저장**: 부분적으로 작동
   - Loki가 로그를 받고 있음
   - `job` 라벨이 존재함
   - **하지만**: `job=journald`만 보이고 `job=ensm`, `job=varlogs`는 보이지 않음

5. **Grafana 설정**: 정상
   - Loki 데이터소스 연결됨
   - 대시보드 쿼리: `{job=~"varlogs|ensm|journald"}` ✅

---

## ❌ 발견된 문제

### 핵심 문제: 파일 기반 로그가 Loki에 저장되지 않음

**증상:**
- Promtail이 파일 로그를 읽고 전송하고 있음
- 하지만 Loki 쿼리 결과에는 `job=journald`만 보이고 `job=ensm`, `job=varlogs`는 없음
- 대시보드에서는 journald 로그만 표시되고 ENSM 로그는 표시되지 않음

**쿼리 결과 분석:**
```json
{
  "stream": {
    "job": "journald",  // ← journald만 보임
    "unit": "ensm-main.service"
  }
}
```

**Promtail 메트릭:**
- `promtail_read_lines_total{path="/var/log/ensm/auth/auth-app.log"} 117`
- `promtail_read_lines_total{path="/var/log/ensm/main/main-app.log"} 21`
- 하지만 이 로그들이 Loki에 저장되지 않음

---

## 🔍 원인 추정

### 가능성 1: 파일 기반 로그의 job 라벨 설정 문제

Promtail 설정을 확인해보니:
- `varlogs` job: `/var/log/*.log` (글로브 패턴)
- `ensm` job: `/var/log/ensm/**/*.log` (글로브 패턴)

**문제 가능성:**
1. Promtail 3.0에서 글로브 패턴 지원 방식이 변경되었을 수 있음
2. `__path__` 라벨이 `filename`으로 변경되어 job 라벨과 충돌할 수 있음
3. 파일 기반 로그가 전송되지만 job 라벨이 제대로 설정되지 않았을 수 있음

### 가능성 2: 시간 범위 문제

- 쿼리가 `now-1h` ~ `now` 범위
- 로그 파일이 오래 전에 생성되고 새로운 로그가 없으면 쿼리 결과에 없을 수 있음
- 하지만 positions.yaml을 보면 최근에도 읽고 있음

### 가능성 3: 로그 보관 정책

- Loki 설정에서 `retention_period: 24h`
- 하지만 방금 전송된 로그라면 보관되어야 함

---

## 🔧 해결 방안

### 1단계: job 라벨 값 확인

```bash
# job 라벨의 실제 값들 확인
curl -G -s "http://localhost:3100/loki/api/v1/label/job/values" | jq
```

### 2단계: 파일 기반 로그 직접 쿼리

```bash
# ensm job으로 직접 쿼리
curl -G -s "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"ensm\"}" \
  --data-urlencode "start=$(date -d '24 hours ago' +%s)000000000" \
  --data-urlencode "end=$(date +%s)000000000" \
  --data-urlencode "limit=100" | jq

# varlogs job으로 직접 쿼리
curl -G -s "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=\"varlogs\"}" \
  --data-urlencode "start=$(date -d '24 hours ago' +%s)000000000" \
  --data-urlencode "end=$(date +%s)000000000" \
  --data-urlencode "limit=100" | jq
```

### 3단계: Promtail 설정 확인 및 수정

현재 설정:
```yaml
- job_name: varlogs
  static_configs:
    - targets: [localhost]
      labels:
        job: varlogs
        __path__: /var/log/*.log

- job_name: ensm
  static_configs:
    - targets: [localhost]
      labels:
        job: ensm
        __path__: /var/log/ensm/**/*.log
```

**수정 방안:**
1. `filename` 라벨 추가로 파일별 구분
2. `relabel_configs`로 job 라벨 명시적으로 설정
3. 글로브 패턴 대신 개별 파일 경로 지정

---

## 📋 다음 확인 사항

1. **job 라벨 값 확인** (가장 중요)
   ```bash
   curl -G -s "http://localhost:3100/loki/api/v1/label/job/values" | jq
   ```

2. **파일 기반 로그 스트림 확인**
   ```bash
   # 모든 로그 스트림 확인 (job 필터 없이)
   curl -G -s "http://localhost:3100/loki/api/v1/query_range" \
     --data-urlencode "query={}" \
     --data-urlencode "start=$(date -d '24 hours ago' +%s)000000000" \
     --data-urlencode "end=$(date +%s)000000000" \
     --data-urlencode "limit=50" | jq '.data.result[].stream'
   ```

3. **Promtail 로그에서 오류 확인**
   ```bash
   journalctl -u promtail.service -n 200 | grep -i "error\|warn\|fail"
   ```

4. **실시간 로그 전송 확인**
   - ENSM 애플리케이션에 새 로그 생성
   - Promtail이 즉시 읽는지 확인
   - Loki에 즉시 저장되는지 확인

---

## 🎯 예상 원인 (가장 가능성 높음)

**Promtail 3.0 버전의 설정 변경** 또는 **job 라벨이 실제로는 다르게 설정되어 있을 가능성**

- Promtail이 로그를 전송하고 있음
- Loki가 로그를 받고 있음
- 하지만 job 라벨이 예상과 다르게 설정되어 있을 수 있음

**해결책:**
1. 먼저 `job` 라벨의 실제 값 확인
2. 필요시 Promtail 설정 수정 (relabel_configs 사용)
