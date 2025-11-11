package com.ensm.main.network;

import com.ensm.main.config.SystemConfig;
import com.ensm.main.config.SystemConfigStore;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * DDNS 관리 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/ddns")
@RequiredArgsConstructor
public class DdnsController {
    
    private final SystemConfigStore configStore;
    private final DdnsService ddnsService;
    
    /**
     * DDNS 설정 조회
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getDdnsConfig() {
        SystemConfig config = configStore.getConfig();
        
        Map<String, Object> response = Map.of(
            "enabled", config.isDdnsEnabled(),
            "apiToken", config.getDdnsApiToken() != null ? config.getDdnsApiToken() : "",
            "zoneName", config.getDdnsZoneName() != null ? config.getDdnsZoneName() : "",
            "recordName", config.getDdnsRecordName() != null ? config.getDdnsRecordName() : "",
            "ttl", config.getDdnsTtl(),
            "schedule", config.getDdnsSchedule() != null ? config.getDdnsSchedule() : "*/5 * * * *",
            "cronEnabled", ddnsService.isDdnsCronEnabled()
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * DDNS 설정 업데이트
     */
    @PutMapping
    public ResponseEntity<Map<String, String>> updateDdnsConfig(@RequestBody Map<String, Object> request) {
        try {
            SystemConfig config = configStore.getConfig();
            
            // 설정 업데이트
            if (request.containsKey("enabled")) {
                config.setDdnsEnabled(Boolean.parseBoolean(request.get("enabled").toString()));
            }
            if (request.containsKey("apiToken")) {
                config.setDdnsApiToken(request.get("apiToken").toString());
            }
            if (request.containsKey("zoneName")) {
                config.setDdnsZoneName(request.get("zoneName").toString());
            }
            if (request.containsKey("recordName")) {
                config.setDdnsRecordName(request.get("recordName").toString());
            }
            if (request.containsKey("ttl")) {
                config.setDdnsTtl(Integer.parseInt(request.get("ttl").toString()));
            }
            if (request.containsKey("schedule")) {
                config.setDdnsSchedule(request.get("schedule").toString());
            }
            
            // 설정 검증
            String validationError = ddnsService.validateDdnsConfig();
            if (validationError != null) {
                return ResponseEntity.badRequest().body(Map.of("error", validationError));
            }
            
            // 설정 파일 업데이트
            if (config.isDdnsEnabled()) {
                ddnsService.updateDdnsConfigFile();
            }
            
            // 설정 저장
            configStore.saveConfig();
            
            return ResponseEntity.ok(Map.of("message", "DDNS 설정이 저장되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "설정 저장 실패: " + e.getMessage()));
        }
    }
    
    /**
     * DDNS CRON 작업 활성화/비활성화
     */
    @PostMapping("/cron/toggle")
    public ResponseEntity<Map<String, String>> toggleDdnsCron(@RequestBody Map<String, Boolean> request) {
        try {
            boolean enable = request.getOrDefault("enable", false);
            
            // 설정 검증
            if (enable) {
                String validationError = ddnsService.validateDdnsConfig();
                if (validationError != null) {
                    return ResponseEntity.badRequest().body(Map.of("error", validationError));
                }
                
                // 설정 파일 업데이트
                ddnsService.updateDdnsConfigFile();
            }
            
            String message = ddnsService.toggleDdnsCron(enable);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "CRON 작업 변경 실패: " + e.getMessage()));
        }
    }
    
    /**
     * DDNS 수동 실행 (테스트용)
     */
    @PostMapping("/test")
    public ResponseEntity<Map<String, String>> testDdns() {
        try {
            String validationError = ddnsService.validateDdnsConfig();
            if (validationError != null) {
                return ResponseEntity.badRequest().body(Map.of("error", validationError));
            }
            
            // 설정 파일 업데이트
            ddnsService.updateDdnsConfigFile();
            
            // 스크립트 실행
            SystemConfig config = configStore.getConfig();
            String scriptPath = config.getEnsmScriptsBasePath() + "/network/ddns_cloudflare.sh";
            
            ProcessBuilder pb = new ProcessBuilder("bash", scriptPath);
            pb.environment().put("DDNS_CONFIG_FILE", config.getDdnsConfigFile());
            pb.environment().put("DDNS_LOG_FILE", config.getDdnsLogFile());
            pb.environment().put("DDNS_STATE_FILE", "/var/lib/ddns_last_ip");
            Process process = pb.start();
            int exitCode = process.waitFor();
            
            if (exitCode == 0) {
                return ResponseEntity.ok(Map.of("message", "DDNS 업데이트가 성공적으로 실행되었습니다."));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "DDNS 업데이트 실행 실패 (종료 코드: " + exitCode + ")"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "실행 실패: " + e.getMessage()));
        }
    }
}

