package com.ensm.main.system;

import com.ensm.main.util.ScriptExecutor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 시스템 정보 조회 서비스
 */
@Service
@RequiredArgsConstructor
public class SystemInfoService {
    
    private final ScriptExecutor scriptExecutor;
    
    /**
     * 디스크 사용량 정보 조회
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getDiskInfo() {
        return scriptExecutor.executeScriptJsonArray("system/system_info.sh", "get_disk_info");
    }
    
    /**
     * RAID 상태 정보 조회
     */
    public Map<String, Object> getRaidStatus() {
        return scriptExecutor.executeScriptJsonObject("system/system_info.sh", "get_raid_status");
    }
    
    /**
     * 네트워크 인터페이스 정보 조회
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getNetworkInterfaces() {
        return scriptExecutor.executeScriptJsonArray("system/system_info.sh", "get_network_interfaces");
    }
    
    /**
     * 열린 포트 정보 조회
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getOpenPorts() {
        return scriptExecutor.executeScriptJsonArray("network/port_daemon_status.sh", "get_ports");
    }
    
    /**
     * 실행 중인 서비스 목록 조회
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getRunningServices() {
        return scriptExecutor.executeScriptJsonArray("network/port_daemon_status.sh", "get_services");
    }
    
    /**
     * 네트워크 관련 로그 조회
     * @param logType 로그 타입 (messages, secure, network, dmesg)
     * @param lines 조회할 라인 수 (기본값: 100)
     * @return 로그 내용
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getNetworkLog(String logType, int lines) {
        return scriptExecutor.executeScriptJsonObject("network/network_log.sh", "get_log", logType, String.valueOf(lines));
    }
    
    /**
     * 네트워크 통계 정보 조회
     * @return 네트워크 통계 정보
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getNetworkStats() {
        return scriptExecutor.executeScriptJsonObject("network/network_log.sh", "get_stats");
    }
}

