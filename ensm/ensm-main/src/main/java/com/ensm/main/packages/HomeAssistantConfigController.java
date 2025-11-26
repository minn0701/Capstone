package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Home Assistant 설정 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/home-assistant-config")
@RequiredArgsConstructor
public class HomeAssistantConfigController {
    private final HomeAssistantConfigService homeAssistantConfigService;
    
    @PostMapping
    @PutMapping
    public ResponseEntity<Map<String, String>> applyHomeAssistantConfiguration(@RequestBody HomeAssistantConfigRequest request) {
        String result = homeAssistantConfigService.applyHomeAssistantConfiguration(request);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    @GetMapping("/installed")
    public ResponseEntity<Map<String, Boolean>> checkInstalled() {
        boolean installed = homeAssistantConfigService.isInstalled();
        return ResponseEntity.ok(Map.of("installed", installed));
    }
    
    @GetMapping("/current")
    public ResponseEntity<HomeAssistantConfigRequest> getCurrentConfig() {
        HomeAssistantConfigRequest config = homeAssistantConfigService.getCurrentConfig();
        return ResponseEntity.ok(config);
    }
    
    @PostMapping("/restart")
    public ResponseEntity<Map<String, String>> restart() {
        String result = homeAssistantConfigService.restart();
        return ResponseEntity.ok(Map.of("message", result));
    }
}

