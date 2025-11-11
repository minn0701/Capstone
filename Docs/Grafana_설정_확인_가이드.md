# Grafana 설정 확인 및 해결 가이드

## 🔍 문제 진단

현재 발생하는 오류:
- **404 Not Found** - Grafana 대시보드 로드 실패
- "Grafana has failed to load its application files"

## 📋 확인해야 할 사항

### 1. Grafana 서버 설정 확인

Grafana 설정 파일 위치 확인:
```bash
# Linux (일반적인 위치)
/etc/grafana/grafana.ini

# 또는
/usr/share/grafana/conf/defaults.ini
```

### 2. 필수 설정 확인

Grafana 설정 파일에서 다음 항목을 확인/수정:

```ini
[server]
# ⚠️ 필수: 서브패스 URL 설정 (마지막에 슬래시 포함!)
root_url = http://main.minn.my:55555/grafana/

# ⚠️ 필수: 서브패스에서 서빙 허용
serve_from_sub_path = true

# HTTP 포트 (기본값: 3000)
http_port = 3000

# 바인딩 주소 (모든 인터페이스에서 접근 가능하도록)
http_addr = 0.0.0.0
```

### 3. 설정 확인 방법

```bash
# Grafana 설정 파일 확인
sudo cat /etc/grafana/grafana.ini | grep -A 5 "\[server\]"

# 또는
sudo grep -E "root_url|serve_from_sub_path" /etc/grafana/grafana.ini
```

### 4. Grafana 재시작

설정 변경 후 반드시 재시작:
```bash
# systemd 사용 시
sudo systemctl restart grafana-server

# 상태 확인
sudo systemctl status grafana-server

# 로그 확인
sudo journalctl -u grafana-server -f
```

### 5. Caddy 재시작

Caddyfile 변경 후 재시작:
```bash
# Caddy 설정 테스트
sudo caddy validate --config /etc/caddy/Caddyfile

# Caddy 재시작
sudo systemctl restart caddy

# Caddy 로그 확인
sudo journalctl -u caddy -f
```

## 🔧 단계별 해결 방법

### Step 1: Grafana 설정 파일 수정

```bash
# 설정 파일 백업
sudo cp /etc/grafana/grafana.ini /etc/grafana/grafana.ini.backup

# 설정 파일 편집
sudo nano /etc/grafana/grafana.ini
```

다음 내용 추가/수정:
```ini
[server]
root_url = http://main.minn.my:55555/grafana/
serve_from_sub_path = true
http_port = 3000
http_addr = 0.0.0.0
```

### Step 2: Grafana 재시작 및 확인

```bash
# 재시작
sudo systemctl restart grafana-server

# 로그에서 오류 확인
sudo journalctl -u grafana-server -n 50
```

로그에서 다음 메시지 확인:
- ✅ `HTTP Server Listen` - 정상
- ❌ `Failed to start server` - 오류 발생

### Step 3: 직접 접속 테스트

Grafana가 직접 접속되는지 확인:
```bash
# 로컬에서 테스트
curl http://localhost:3000

# 또는 브라우저에서
http://서버IP:3000
```

### Step 4: Caddy를 통한 접속 테스트

```bash
# Caddy를 통한 접속 테스트
curl http://main.minn.my:55555/grafana/

# 또는 브라우저에서
http://main.minn.my:55555/grafana/
```

## 🐛 문제 해결 체크리스트

- [ ] Grafana 설정 파일에 `root_url`이 올바르게 설정되었는가?
- [ ] `serve_from_sub_path = true`가 설정되었는가?
- [ ] Grafana 서버가 재시작되었는가?
- [ ] Grafana가 `localhost:3000`에서 직접 접속 가능한가?
- [ ] Caddyfile이 올바르게 설정되었는가?
- [ ] Caddy가 재시작되었는가?
- [ ] Caddy 로그에 오류가 없는가?

## 📝 추가 디버깅

### Grafana 로그 확인
```bash
# 실시간 로그 확인
sudo journalctl -u grafana-server -f

# 최근 100줄 확인
sudo journalctl -u grafana-server -n 100
```

### Caddy 로그 확인
```bash
# 실시간 로그 확인
sudo journalctl -u caddy -f

# 최근 100줄 확인
sudo journalctl -u caddy -n 100
```

### 네트워크 연결 확인
```bash
# Grafana 포트 확인
sudo netstat -tlnp | grep 3000

# Caddy 포트 확인
sudo netstat -tlnp | grep 55555
```

## ⚠️ 주의사항

1. **root_url 설정 시 마지막 슬래시 필수**: `http://main.minn.my:55555/grafana/` (슬래시 포함)
2. **도메인 일치**: `root_url`의 도메인이 실제 접속 도메인과 일치해야 함
3. **설정 변경 후 재시작 필수**: Grafana와 Caddy 모두 재시작 필요

