#!/usr/bin/env bash

# Cloudflare DDNS 자동 업데이트 스크립트
# ENSM 시스템에서 사용하는 DDNS 자동화 스크립트
# 
# 필수 패키지: curl, jq
# 설치: yum install -y curl jq (Rocky Linux 9.6)

set -euo pipefail

# ==== 설정 파일 경로 ====
CONFIG_FILE="${DDNS_CONFIG_FILE:-/root/config/ddns-config.yml}"

# ==== 로그 파일 ====
LOG_FILE="${DDNS_LOG_FILE:-/var/log/ddns_cloudflare.log}"

# ==== 상태 파일 ====
STATE_FILE="${DDNS_STATE_FILE:-/var/lib/ddns_last_ip}"

# ==== 설정 파일 읽기 ====
if [[ ! -f "$CONFIG_FILE" ]]; then
  echo "[$(date '+%F %T')] error: 설정 파일을 찾을 수 없습니다: $CONFIG_FILE" >> "$LOG_FILE"
  exit 1
fi

# YAML 파일에서 설정 읽기 (간단한 파싱)
CF_API_TOKEN=$(grep -E "^apiToken:" "$CONFIG_FILE" | sed 's/^apiToken:[[:space:]]*//' | tr -d '"' | tr -d "'")
CF_ZONE_NAME=$(grep -E "^zoneName:" "$CONFIG_FILE" | sed 's/^zoneName:[[:space:]]*//' | tr -d '"' | tr -d "'")
CF_RECORD_NAME=$(grep -E "^recordName:" "$CONFIG_FILE" | sed 's/^recordName:[[:space:]]*//' | tr -d '"' | tr -d "'")
TTL=$(grep -E "^ttl:" "$CONFIG_FILE" | sed 's/^ttl:[[:space:]]*//' | tr -d '"' | tr -d "'" || echo "120")

# 설정 검증
if [[ -z "$CF_API_TOKEN" ]] || [[ -z "$CF_ZONE_NAME" ]] || [[ -z "$CF_RECORD_NAME" ]]; then
  echo "[$(date '+%F %T')] error: 필수 설정이 누락되었습니다 (apiToken, zoneName, recordName)" >> "$LOG_FILE"
  exit 1
fi

# ==== 공인 IP 감지 ====
CURRENT_IP=$(curl -fsS https://api.ipify.org 2>/dev/null || curl -fsS https://ifconfig.me 2>/dev/null || echo "")

if [[ -z "$CURRENT_IP" ]]; then
  echo "[$(date '+%F %T')] error: 공인 IP를 감지할 수 없습니다" >> "$LOG_FILE"
  exit 1
fi

# ==== 이전 IP 확인 ====
PREV_IP=$(cat "$STATE_FILE" 2>/dev/null || echo "")

if [[ "$CURRENT_IP" == "$PREV_IP" ]]; then
  # IP가 변경되지 않았으면 종료 (로그는 남기지 않음)
  exit 0
fi

# ==== Cloudflare API 업데이트 ====
CF_API="https://api.cloudflare.com/client/v4"
HDR=(-H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json")

# Zone ID 조회
ZONE_ID=$(curl -s "$CF_API/zones?name=$CF_ZONE_NAME" "${HDR[@]}" | jq -r '.result[0].id // empty' 2>/dev/null || echo "")

if [[ -z "$ZONE_ID" ]]; then
  echo "[$(date '+%F %T')] error: Zone을 찾을 수 없습니다: $CF_ZONE_NAME" >> "$LOG_FILE"
  exit 1
fi

# 레코드 ID 조회
REC_ID=$(curl -s "$CF_API/zones/$ZONE_ID/dns_records?type=A&name=$CF_RECORD_NAME" "${HDR[@]}" | jq -r '.result[0].id // empty' 2>/dev/null || echo "")

# 레코드 생성 또는 업데이트
if [[ -z "$REC_ID" ]]; then
  # 레코드가 없으면 생성
  RESP=$(curl -s -X POST "$CF_API/zones/$ZONE_ID/dns_records" "${HDR[@]}" \
    --data "{\"type\":\"A\",\"name\":\"$CF_RECORD_NAME\",\"content\":\"$CURRENT_IP\",\"ttl\":$TTL,\"proxied\":false}" 2>/dev/null || echo '{"success":false}')
else
  # 레코드가 있으면 업데이트
  RESP=$(curl -s -X PUT "$CF_API/zones/$ZONE_ID/dns_records/$REC_ID" "${HDR[@]}" \
    --data "{\"type\":\"A\",\"name\":\"$CF_RECORD_NAME\",\"content\":\"$CURRENT_IP\",\"ttl\":$TTL,\"proxied\":false}" 2>/dev/null || echo '{"success":false}')
fi

SUCCESS=$(echo "$RESP" | jq -r '.success' 2>/dev/null || echo "false")

# ==== 결과 처리 ====
if [[ "$SUCCESS" == "true" ]]; then
  # 상태 파일 업데이트
  echo "$CURRENT_IP" > "$STATE_FILE"
  
  if [[ -n "$PREV_IP" ]]; then
    echo "[$(date '+%F %T')] success: Cloudflare DDNS 업데이트 완료 ($CF_RECORD_NAME: $PREV_IP → $CURRENT_IP)" >> "$LOG_FILE"
  else
    echo "[$(date '+%F %T')] success: Cloudflare DDNS 레코드 생성 완료 ($CF_RECORD_NAME: $CURRENT_IP)" >> "$LOG_FILE"
  fi
  exit 0
else
  ERR_MSG=$(echo "$RESP" | jq -r '.errors[]?.message' 2>/dev/null | head -1 || echo "알 수 없는 오류")
  echo "[$(date '+%F %T')] error: Cloudflare DDNS 업데이트 실패 ($CF_RECORD_NAME: $ERR_MSG)" >> "$LOG_FILE"
  exit 1
fi

