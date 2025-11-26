package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * noVNC 설정 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/novnc-config")
@RequiredArgsConstructor
public class NovncConfigController {
    private final NovncConfigService novncConfigService;
    
    @PostMapping
    @PutMapping
    public ResponseEntity<Map<String, String>> applyNovncConfiguration(@RequestBody NovncConfigRequest request) {
        String result = novncConfigService.applyNovncConfiguration(request);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    @GetMapping("/installed")
    public ResponseEntity<Map<String, Boolean>> checkInstalled() {
        boolean installed = novncConfigService.isInstalled();
        return ResponseEntity.ok(Map.of("installed", installed));
    }
    
    @GetMapping("/current")
    public ResponseEntity<NovncConfigRequest> getCurrentConfig() {
        NovncConfigRequest config = novncConfigService.getCurrentConfig();
        return ResponseEntity.ok(config);
    }
    
    @PostMapping("/restart")
    public ResponseEntity<Map<String, String>> restart() {
        String result = novncConfigService.restart();
        return ResponseEntity.ok(Map.of("message", result));
    }
}

