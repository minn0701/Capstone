package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Git 설정 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/git-config")
@RequiredArgsConstructor
public class GitConfigController {
    private final GitConfigService gitConfigService;
    
    @PostMapping
    @PutMapping
    public ResponseEntity<Map<String, String>> applyGitConfiguration(@RequestBody GitConfigRequest request) {
        String result = gitConfigService.applyGitConfiguration(request);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    @GetMapping("/installed")
    public ResponseEntity<Map<String, Boolean>> checkInstalled() {
        boolean installed = gitConfigService.isInstalled();
        return ResponseEntity.ok(Map.of("installed", installed));
    }
    
    @GetMapping("/current")
    public ResponseEntity<GitConfigRequest> getCurrentConfig() {
        GitConfigRequest config = gitConfigService.getCurrentConfig();
        return ResponseEntity.ok(config);
    }
    
    @PostMapping("/restart")
    public ResponseEntity<Map<String, String>> restart() {
        String result = gitConfigService.restart();
        return ResponseEntity.ok(Map.of("message", result));
    }
}

