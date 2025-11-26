#!/bin/bash
# Caddy와 Grafana 바이너리 다운로드 스크립트

DEPENDENCIES_DIR="SOURCES/dependencies"

echo "=========================================="
echo "Caddy 및 Grafana 바이너리 다운로드"
echo "=========================================="

mkdir -p "$DEPENDENCIES_DIR"
cd "$DEPENDENCIES_DIR"

# Caddy 다운로드
echo ""
echo "Caddy 다운로드 중..."
CADDY_VERSION="2.7.6"
CADDY_URL="https://github.com/caddyserver/caddy/releases/download/v${CADDY_VERSION}/caddy_${CADDY_VERSION}_linux_amd64.tar.gz"

if [ ! -f "caddy-${CADDY_VERSION}-linux-amd64.tar.gz" ]; then
    wget -O "caddy-${CADDY_VERSION}-linux-amd64.tar.gz" "$CADDY_URL" || \
    curl -L -o "caddy-${CADDY_VERSION}-linux-amd64.tar.gz" "$CADDY_URL"
    
    if [ $? -eq 0 ]; then
        echo "✅ Caddy 다운로드 완료"
    else
        echo "❌ Caddy 다운로드 실패"
        exit 1
    fi
else
    echo "✅ Caddy 파일이 이미 존재합니다"
fi

# Grafana 다운로드
echo ""
echo "Grafana 다운로드 중..."
GRAFANA_VERSION="10.2.2"
GRAFANA_URL="https://dl.grafana.com/oss/release/grafana-${GRAFANA_VERSION}.linux-amd64.tar.gz"

if [ ! -f "grafana-${GRAFANA_VERSION}.linux-amd64.tar.gz" ]; then
    wget -O "grafana-${GRAFANA_VERSION}.linux-amd64.tar.gz" "$GRAFANA_URL" || \
    curl -L -o "grafana-${GRAFANA_VERSION}.linux-amd64.tar.gz" "$GRAFANA_URL"
    
    if [ $? -eq 0 ]; then
        echo "✅ Grafana 다운로드 완료"
    else
        echo "❌ Grafana 다운로드 실패"
        exit 1
    fi
else
    echo "✅ Grafana 파일이 이미 존재합니다"
fi

echo ""
echo "=========================================="
echo "다운로드 완료!"
echo "=========================================="
echo ""
echo "다운로드된 파일:"
ls -lh caddy-*.tar.gz grafana-*.tar.gz 2>/dev/null
echo ""

