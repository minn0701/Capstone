# ENSM Kibana 기본 URL

## 개요

모니터링 대시보드의 기본 URL을 지정하는 설정입니다. 현재는 Kibana를 사용하지만, 향후 Prometheus + Grafana로 변경 예정입니다.

## 설정 방법

모니터링 대시보드의 기본 URL 경로를 지정합니다:

```
/kibana
```

## 주요 특징

- **URL 경로**: 상대 경로로 지정합니다
- **리버스 프록시**: Caddy 리버스 프록시를 통해 접근합니다
- **향후 변경**: Prometheus + Grafana로 변경 예정

## 일반적인 사용 예시

```
/kibana
/grafana
/monitoring
```

## 주의사항

- **Caddy 설정**: Caddyfile에서 해당 경로가 리버스 프록시로 설정되어 있어야 합니다
- **서비스 실행**: 모니터링 서비스가 실행 중이어야 합니다
- **포트**: 모니터링 서비스의 포트가 올바르게 설정되어 있어야 합니다

## 향후 변경 사항

현재는 Kibana를 사용하지만, 향후 다음과 같이 변경될 예정입니다:

- **Prometheus**: 메트릭 수집
- **Grafana**: 메트릭 시각화
- **Loki**: 로그 수집
- **Promtail**: 로그 전송

## 기본값

기본값은 `/kibana`입니다. Prometheus + Grafana로 변경 시 `/grafana`로 변경될 예정입니다.

