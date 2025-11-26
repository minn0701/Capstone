package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Plex 설정 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/plex-config")
@RequiredArgsConstructor
public class PlexConfigController {
    private final PlexConfigService plexConfigService;
    
    @PostMapping
    @PutMapping
    public ResponseEntity<Map<String, String>> applyPlexConfiguration(@RequestBody PlexConfigRequest request) {
        String result = plexConfigService.applyPlexConfiguration(request);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    @GetMapping("/installed")
    public ResponseEntity<Map<String, Boolean>> checkInstalled() {
        boolean installed = plexConfigService.isInstalled();
        return ResponseEntity.ok(Map.of("installed", installed));
    }
    
    @GetMapping("/current")
    public ResponseEntity<PlexConfigRequest> getCurrentConfig() {
        PlexConfigRequest config = plexConfigService.getCurrentConfig();
        return ResponseEntity.ok(config);
    }
    
    @PostMapping("/restart")
    public ResponseEntity<Map<String, String>> restart() {
        String result = plexConfigService.restart();
        return ResponseEntity.ok(Map.of("message", result));
    }
}

