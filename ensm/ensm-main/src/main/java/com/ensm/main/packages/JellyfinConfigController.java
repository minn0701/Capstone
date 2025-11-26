package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Jellyfin 설정 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/jellyfin-config")
@RequiredArgsConstructor
public class JellyfinConfigController {
    private final JellyfinConfigService jellyfinConfigService;
    
    @PostMapping
    @PutMapping
    public ResponseEntity<Map<String, String>> applyJellyfinConfiguration(@RequestBody JellyfinConfigRequest request) {
        String result = jellyfinConfigService.applyJellyfinConfiguration(request);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    @GetMapping("/installed")
    public ResponseEntity<Map<String, Boolean>> checkInstalled() {
        boolean installed = jellyfinConfigService.isInstalled();
        return ResponseEntity.ok(Map.of("installed", installed));
    }
    
    @GetMapping("/current")
    public ResponseEntity<JellyfinConfigRequest> getCurrentConfig() {
        JellyfinConfigRequest config = jellyfinConfigService.getCurrentConfig();
        return ResponseEntity.ok(config);
    }
    
    @PostMapping("/restart")
    public ResponseEntity<Map<String, String>> restart() {
        String result = jellyfinConfigService.restart();
        return ResponseEntity.ok(Map.of("message", result));
    }
}

