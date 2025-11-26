package com.ensm.main.packages;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Plex 설정 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class PlexConfigService {
    private final PlexScriptExecutor scriptExecutor;
    private final ObjectMapper objectMapper;
    
    public String applyPlexConfiguration(PlexConfigRequest req) {
        if (Boolean.TRUE.equals(req.getApply())) {
            return scriptExecutor.execute(new String[]{"apply"});
        }
        return "Plex 설정이 저장되었습니다. (적용하려면 apply=true로 설정하세요)";
    }
    
    public boolean isInstalled() {
        try {
            ProcessBuilder pb = new ProcessBuilder("rpm", "-q", "plexmediaserver");
            pb.redirectErrorStream(true);
            Process process = pb.start();
            int exitCode = process.waitFor();
            return exitCode == 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    public PlexConfigRequest getCurrentConfig() {
        PlexConfigRequest config = new PlexConfigRequest();
        
        try {
            String result = scriptExecutor.execute(new String[]{"get_all"});
            
            if (result != null && !result.trim().isEmpty() && result.trim().startsWith("{")) {
                Map<String, Object> jsonMap = objectMapper.readValue(result, Map.class);
                
                config.setPort(jsonMap.get("port") != null ? Integer.parseInt(jsonMap.get("port").toString()) : null);
                config.setDataDir((String) jsonMap.get("dataDir"));
                config.setAllowedNetworks((String) jsonMap.get("allowedNetworks"));
                config.setEnableRemoteAccess((Boolean) jsonMap.get("enableRemoteAccess"));
            }
        } catch (Exception e) {
            System.err.println("Plex 설정 조회 실패: " + e.getMessage());
            e.printStackTrace();
        }
        
        return config;
    }
    
    public String restart() {
        try {
            String result = scriptExecutor.execute(new String[]{"apply"});
            return "Plex Media Server 서비스 재시작: " + result;
        } catch (Exception e) {
            return "Plex Media Server 서비스 재시작 실패: " + e.getMessage();
        }
    }
}

