package com.ensm.main.packages;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * noVNC 설정 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class NovncConfigService {
    private final NovncScriptExecutor scriptExecutor;
    private final ObjectMapper objectMapper;
    
    public String applyNovncConfiguration(NovncConfigRequest req) {
        if (Boolean.TRUE.equals(req.getApply())) {
            return scriptExecutor.execute(new String[]{"apply"});
        }
        return "noVNC 설정이 저장되었습니다. (적용하려면 apply=true로 설정하세요)";
    }
    
    public boolean isInstalled() {
        try {
            ProcessBuilder pb = new ProcessBuilder("systemctl", "is-active", "--quiet", "novnc");
            pb.redirectErrorStream(true);
            Process process = pb.start();
            int exitCode = process.waitFor();
            return exitCode == 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    public NovncConfigRequest getCurrentConfig() {
        NovncConfigRequest config = new NovncConfigRequest();
        
        try {
            String result = scriptExecutor.execute(new String[]{"get_all"});
            
            if (result != null && !result.trim().isEmpty() && result.trim().startsWith("{")) {
                Map<String, Object> jsonMap = objectMapper.readValue(result, Map.class);
                
                config.setPort(jsonMap.get("port") != null ? Integer.parseInt(jsonMap.get("port").toString()) : null);
                config.setWebsocketPort(jsonMap.get("websocketPort") != null ? Integer.parseInt(jsonMap.get("websocketPort").toString()) : null);
                config.setVncHost((String) jsonMap.get("vncHost"));
                config.setVncPort(jsonMap.get("vncPort") != null ? Integer.parseInt(jsonMap.get("vncPort").toString()) : null);
                config.setPassword((String) jsonMap.get("password"));
                config.setEnableSSL((Boolean) jsonMap.get("enableSSL"));
            }
        } catch (Exception e) {
            System.err.println("noVNC 설정 조회 실패: " + e.getMessage());
            e.printStackTrace();
        }
        
        return config;
    }
    
    public String restart() {
        try {
            String result = scriptExecutor.execute(new String[]{"apply"});
            return "noVNC 서비스 재시작: " + result;
        } catch (Exception e) {
            return "noVNC 서비스 재시작 실패: " + e.getMessage();
        }
    }
}

