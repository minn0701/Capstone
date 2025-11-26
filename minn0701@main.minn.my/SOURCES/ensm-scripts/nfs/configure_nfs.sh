#!/bin/bash
# NFS 설정 스크립트
# ENSM에서 NFS /etc/exports 파일을 수정하는 스크립트

EXPORTS_FILE="/etc/exports"
NFS_CONFIG_FILE="/etc/sysconfig/nfs"
BACKUP_DIR="/etc/nfs/backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 백업 디렉토리 생성
mkdir -p "$BACKUP_DIR"

# 설정 파일 백업
backup_config() {
    if [ ! -f "${EXPORTS_FILE}.backup.${TIMESTAMP}" ]; then
        cp "$EXPORTS_FILE" "${EXPORTS_FILE}.backup.${TIMESTAMP}" 2>/dev/null || true
        echo "✅ 설정 파일이 백업되었습니다: ${EXPORTS_FILE}.backup.${TIMESTAMP}"
    fi
}

# Exports 설정
set_exports() {
    local exports="$1"
    if [ -z "$exports" ]; then
        echo "❌ exports 설정이 지정되지 않았습니다."
        exit 1
    fi
    
    backup_config
    
    # 기존 내용을 새 내용으로 교체
    echo "$exports" > "$EXPORTS_FILE"
    echo "✅ exports 설정이 업데이트되었습니다."
}

# 포트 설정 (NFS 설정 파일)
set_port() {
    local port="$1"
    if [ -z "$port" ]; then
        echo "❌ 포트 번호가 지정되지 않았습니다."
        exit 1
    fi
    
    if [ ! -f "$NFS_CONFIG_FILE" ]; then
        touch "$NFS_CONFIG_FILE"
    fi
    
    # RPCNFSDARGS 설정
    if grep -q "^RPCNFSDARGS=" "$NFS_CONFIG_FILE"; then
        sed -i "s|^RPCNFSDARGS=.*|RPCNFSDARGS=\"-p ${port}\"|" "$NFS_CONFIG_FILE"
    else
        echo "RPCNFSDARGS=\"-p ${port}\"" >> "$NFS_CONFIG_FILE"
    fi
    echo "✅ NFS 포트가 ${port}로 설정되었습니다."
}

# RPC 포트 설정
set_rpcbind_port() {
    local port="$1"
    if [ -z "$port" ]; then
        echo "❌ RPC 포트 번호가 지정되지 않았습니다."
        exit 1
    fi
    
    if [ ! -f "$NFS_CONFIG_FILE" ]; then
        touch "$NFS_CONFIG_FILE"
    fi
    
    if grep -q "^RPCRQUOTADPORT=" "$NFS_CONFIG_FILE"; then
        sed -i "s|^RPCRQUOTADPORT=.*|RPCRQUOTADPORT=${port}|" "$NFS_CONFIG_FILE"
    else
        echo "RPCRQUOTADPORT=${port}" >> "$NFS_CONFIG_FILE"
    fi
    echo "✅ RPC 포트가 ${port}로 설정되었습니다."
}

# Mount 데몬 포트 설정
set_mountd_port() {
    local port="$1"
    if [ -z "$port" ]; then
        echo "❌ Mount 데몬 포트 번호가 지정되지 않았습니다."
        exit 1
    fi
    
    if [ ! -f "$NFS_CONFIG_FILE" ]; then
        touch "$NFS_CONFIG_FILE"
    fi
    
    if grep -q "^RPCMOUNTDOPTS=" "$NFS_CONFIG_FILE"; then
        sed -i "s|^RPCMOUNTDOPTS=.*|RPCMOUNTDOPTS=\"-p ${port}\"|" "$NFS_CONFIG_FILE"
    else
        echo "RPCMOUNTDOPTS=\"-p ${port}\"" >> "$NFS_CONFIG_FILE"
    fi
    echo "✅ Mount 데몬 포트가 ${port}로 설정되었습니다."
}

# Status 데몬 포트 설정
set_statd_port() {
    local port="$1"
    if [ -z "$port" ]; then
        echo "❌ Status 데몬 포트 번호가 지정되지 않았습니다."
        exit 1
    fi
    
    if [ ! -f "$NFS_CONFIG_FILE" ]; then
        touch "$NFS_CONFIG_FILE"
    fi
    
    if grep -q "^STATDARG=" "$NFS_CONFIG_FILE"; then
        sed -i "s|^STATDARG=.*|STATDARG=\"-p ${port}\"|" "$NFS_CONFIG_FILE"
    else
        echo "STATDARG=\"-p ${port}\"" >> "$NFS_CONFIG_FILE"
    fi
    echo "✅ Status 데몬 포트가 ${port}로 설정되었습니다."
}

# Lock 데몬 포트 설정
set_lockd_port() {
    local port="$1"
    if [ -z "$port" ]; then
        echo "❌ Lock 데몬 포트 번호가 지정되지 않았습니다."
        exit 1
    fi
    
    if [ ! -f "$NFS_CONFIG_FILE" ]; then
        touch "$NFS_CONFIG_FILE"
    fi
    
    if grep -q "^LOCKDARG=" "$NFS_CONFIG_FILE"; then
        sed -i "s|^LOCKDARG=.*|LOCKDARG=\"-p ${port}\"|" "$NFS_CONFIG_FILE"
    else
        echo "LOCKDARG=\"-p ${port}\"" >> "$NFS_CONFIG_FILE"
    fi
    echo "✅ Lock 데몬 포트가 ${port}로 설정되었습니다."
}

# 설정 적용 (NFS 서비스 재시작)
apply() {
    echo "🔄 NFS 서비스 재시작 중..."
    if systemctl restart nfs-server 2>&1; then
        echo "✅ NFS 서비스가 성공적으로 재시작되었습니다."
        # exports 재내보내기
        exportfs -ra 2>&1
        echo "✅ NFS 공유가 재내보내졌습니다."
    else
        echo "❌ NFS 서비스 재시작 실패"
        exit 1
    fi
}

# 모든 설정 읽기 (JSON 형식)
get_all() {
    local exports_content=""
    if [ -f "$EXPORTS_FILE" ]; then
        exports_content=$(cat "$EXPORTS_FILE" | tr '\n' '|' | sed 's/|$//')
    else
        exports_content="/var/nfs * (rw,sync,no_subtree_check)"
    fi
    
    local port="2049"
    if [ -f "$NFS_CONFIG_FILE" ] && grep -q "^RPCNFSDARGS=" "$NFS_CONFIG_FILE"; then
        port=$(grep "^RPCNFSDARGS=" "$NFS_CONFIG_FILE" | sed 's/.*-p \([0-9]*\).*/\1/')
    fi
    
    local rpcbind_port="111"
    if [ -f "$NFS_CONFIG_FILE" ] && grep -q "^RPCRQUOTADPORT=" "$NFS_CONFIG_FILE"; then
        rpcbind_port=$(grep "^RPCRQUOTADPORT=" "$NFS_CONFIG_FILE" | sed 's/.*=\([0-9]*\).*/\1/')
    fi
    
    local mountd_port="20048"
    if [ -f "$NFS_CONFIG_FILE" ] && grep -q "^RPCMOUNTDOPTS=" "$NFS_CONFIG_FILE"; then
        mountd_port=$(grep "^RPCMOUNTDOPTS=" "$NFS_CONFIG_FILE" | sed 's/.*-p \([0-9]*\).*/\1/')
    fi
    
    local statd_port="32765"
    if [ -f "$NFS_CONFIG_FILE" ] && grep -q "^STATDARG=" "$NFS_CONFIG_FILE"; then
        statd_port=$(grep "^STATDARG=" "$NFS_CONFIG_FILE" | sed 's/.*-p \([0-9]*\).*/\1/')
    fi
    
    local lockd_port="32768"
    if [ -f "$NFS_CONFIG_FILE" ] && grep -q "^LOCKDARG=" "$NFS_CONFIG_FILE"; then
        lockd_port=$(grep "^LOCKDARG=" "$NFS_CONFIG_FILE" | sed 's/.*-p \([0-9]*\).*/\1/')
    fi
    
    echo "{"
    echo "  \"port\": \"${port}\","
    echo "  \"exports\": \"${exports_content}\","
    echo "  \"rpcbindPort\": \"${rpcbind_port}\","
    echo "  \"mountdPort\": \"${mountd_port}\","
    echo "  \"statdPort\": \"${statd_port}\","
    echo "  \"lockdPort\": \"${lockd_port}\""
    echo "}"
}

# 메인 로직
case "$1" in
    set_port)
        set_port "$2"
        ;;
    set_exports)
        set_exports "$2"
        ;;
    set_rpcbind_port)
        set_rpcbind_port "$2"
        ;;
    set_mountd_port)
        set_mountd_port "$2"
        ;;
    set_statd_port)
        set_statd_port "$2"
        ;;
    set_lockd_port)
        set_lockd_port "$2"
        ;;
    apply)
        apply
        ;;
    get_all)
        get_all
        ;;
    *)
        echo "사용법: $0 {set_port|set_exports|set_rpcbind_port|set_mountd_port|set_statd_port|set_lockd_port|apply|get_all} [값]"
        exit 1
        ;;
esac

