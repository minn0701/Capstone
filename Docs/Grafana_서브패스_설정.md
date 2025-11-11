# Grafana 서브패스 설정 가이드

## 핵심 원리

**Caddy는 단순히 프록시만 하면 됩니다!**  
문제는 Grafana 서버 설정에 있습니다.

## Grafana 설정 파일 수정

### 1. 설정 파일 위치 확인

```bash
# 일반적인 위치
/etc/grafana/grafana.ini

# 또는
/usr/share/grafana/conf/defaults.ini
```

### 2. 필수 설정 추가/수정

```bash
sudo nano /etc/grafana/grafana.ini
```

다음 섹션을 찾아서 수정:

```ini
[server]
# ⚠️ 필수: 서브패스 URL (마지막 슬래시 포함!)
root_url = http://main.minn.my:55555/grafana/

# ⚠️ 필수: 서브패스에서 서빙 허용
serve_from_sub_path = true

# HTTP 포트 (기본값: 3000)
http_port = 3000

# 모든 인터페이스에서 접근 가능하도록
http_addr = 0.0.0.0
```

### 3. Grafana 재시작

```bash
sudo systemctl restart grafana-server

# 상태 확인
sudo systemctl status grafana-server

# 로그 확인 (오류가 있는지 확인)
sudo journalctl -u grafana-server -n 50
```

## Caddyfile 설정

Caddyfile은 단순히 프록시만 하면 됩니다:

```caddyfile
handle /grafana/* {
    reverse_proxy localhost:3000 {
        header_up X-Forwarded-Proto {scheme}
        header_up X-Forwarded-Host {host}
        header_up X-Forwarded-Port {port}
    }
}
```

**중요**: Caddy는 `/grafana`를 제거하지 않고 그대로 Grafana로 전달합니다.  
Grafana가 `root_url` 설정을 보고 자동으로 서브패스를 처리합니다.

## 확인 방법

### 1. Grafana 직접 접속 테스트

```bash
# 로컬에서 테스트
curl http://localhost:3000

# 브라우저에서
http://서버IP:3000
```

### 2. Caddy를 통한 접속 테스트

```bash
# Caddy를 통한 접속
curl http://main.minn.my:55555/grafana/

# 브라우저에서
http://main.minn.my:55555/grafana/
```

정상 작동 시 Grafana 로그인 페이지가 표시되어야 합니다.

## 문제 해결

### 설정이 적용되지 않는 경우

1. **설정 파일 위치 확인**
   ```bash
   # Grafana가 실제로 사용하는 설정 파일 찾기
   sudo systemctl status grafana-server | grep -i config
   ```

2. **설정 파일 문법 확인**
   ```bash
   # 주석 처리 확인 (; 또는 # 사용)
   sudo grep -E "^root_url|^serve_from_sub_path" /etc/grafana/grafana.ini
   ```

3. **Grafana 재시작 확인**
   ```bash
   # 재시작 후 로그 확인
   sudo journalctl -u grafana-server -f
   ```

### 여전히 404 오류가 발생하는 경우

1. **root_url 확인**
   - 마지막에 슬래시(`/`)가 있는지 확인
   - 도메인이 실제 접속 도메인과 일치하는지 확인

2. **serve_from_sub_path 확인**
   - `true`로 설정되어 있는지 확인 (대소문자 구분)

3. **Grafana 로그 확인**
   ```bash
   sudo journalctl -u grafana-server -n 100 | grep -i error
   ```

## 요약

✅ **Caddyfile**: 단순 프록시만 (복잡한 설정 불필요)  
✅ **Grafana 설정**: `root_url`과 `serve_from_sub_path`만 설정하면 끝!

