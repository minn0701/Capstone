package com.ensm.main.packages;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Home Assistant 설정 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class HomeAssistantConfigService {
    private final HomeAssistantScriptExecutor scriptExecutor;
    private final ObjectMapper objectMapper;
    
    public String applyHomeAssistantConfiguration(HomeAssistantConfigRequest req) {
        if (Boolean.TRUE.equals(req.getApply())) {
            return scriptExecutor.execute(new String[]{"apply"});
        }
        return "Home Assistant 설정이 저장되었습니다. (적용하려면 apply=true로 설정하세요)";
    }
    
    public boolean isInstalled() {
        try {
            ProcessBuilder pb = new ProcessBuilder("systemctl", "is-active", "--quiet", "home-assistant");
            pb.redirectErrorStream(true);
            Process process = pb.start();
            int exitCode = process.waitFor();
            return exitCode == 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    public HomeAssistantConfigRequest getCurrentConfig() {
        HomeAssistantConfigRequest config = new HomeAssistantConfigRequest();
        
        try {
            String result = scriptExecutor.execute(new String[]{"get_all"});
            
            if (result != null && !result.trim().isEmpty() && result.trim().startsWith("{")) {
                Map<String, Object> jsonMap = objectMapper.readValue(result, Map.class);
                
                config.setPort(jsonMap.get("port") != null ? Integer.parseInt(jsonMap.get("port").toString()) : null);
                config.setConfigDir((String) jsonMap.get("configDir"));
                config.setTimezone((String) jsonMap.get("timezone"));
                if (jsonMap.get("latitude") instanceof Number) {
                    config.setLatitude(((Number) jsonMap.get("latitude")).doubleValue());
                }
                if (jsonMap.get("longitude") instanceof Number) {
                    config.setLongitude(((Number) jsonMap.get("longitude")).doubleValue());
                }
                config.setElevation(jsonMap.get("elevation") != null ? Integer.parseInt(jsonMap.get("elevation").toString()) : null);
                config.setUnitSystem((String) jsonMap.get("unitSystem"));
            }
        } catch (Exception e) {
            System.err.println("Home Assistant 설정 조회 실패: " + e.getMessage());
            e.printStackTrace();
        }
        
        return config;
    }
    
    public String restart() {
        try {
            String result = scriptExecutor.execute(new String[]{"apply"});
            return "Home Assistant 서비스 재시작: " + result;
        } catch (Exception e) {
            return "Home Assistant 서비스 재시작 실패: " + e.getMessage();
        }
    }
}

