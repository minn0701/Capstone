# Grafana 서브패스 설정 가이드

Grafana를 Caddy를 통해 `/grafana` 서브패스로 접근하려면 Grafana 서버 설정이 필요합니다.

## Grafana 설정 파일 수정

Grafana 설정 파일 위치:
- Linux: `/etc/grafana/grafana.ini`
- Docker: 환경 변수 또는 설정 파일

### 설정 방법

1. **grafana.ini 파일 수정**:

```ini
[server]
# 서브패스에서 접근할 수 있도록 root_url 설정
root_url = http://main.minn.my:55555/grafana/

# 서브패스에서 서빙 허용
serve_from_sub_path = true
```

2. **또는 환경 변수로 설정** (Docker 사용 시):

```bash
GF_SERVER_ROOT_URL=http://main.minn.my:55555/grafana/
GF_SERVER_SERVE_FROM_SUB_PATH=true
```

3. **Grafana 재시작**:

```bash
# systemd 사용 시
sudo systemctl restart grafana-server

# Docker 사용 시
docker restart grafana
```

## 확인 방법

1. Caddy 재시작:
```bash
sudo systemctl restart caddy
```

2. 브라우저에서 접속:
```
http://main.minn.my:55555/grafana/
```

3. 정상 작동 시 Grafana 로그인 페이지가 표시되어야 합니다.

## 문제 해결

### "Grafana has failed to load its application files" 오류

- `root_url`이 올바르게 설정되었는지 확인
- `serve_from_sub_path = true`가 설정되었는지 확인
- Grafana 서버가 재시작되었는지 확인
- Caddy 로그 확인: `sudo journalctl -u caddy -f`

### 정적 리소스가 로드되지 않는 경우

- Caddyfile에서 `uri strip_prefix /grafana`가 올바르게 설정되었는지 확인
- Grafana 서버 로그 확인: `sudo journalctl -u grafana-server -f`

