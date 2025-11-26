package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Docker 설정 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/docker-config")
@RequiredArgsConstructor
public class DockerConfigController {
    private final DockerConfigService dockerConfigService;
    
    @PostMapping
    @PutMapping
    public ResponseEntity<Map<String, String>> applyDockerConfiguration(@RequestBody DockerConfigRequest request) {
        String result = dockerConfigService.applyDockerConfiguration(request);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    @GetMapping("/installed")
    public ResponseEntity<Map<String, Boolean>> checkInstalled() {
        boolean installed = dockerConfigService.isInstalled();
        return ResponseEntity.ok(Map.of("installed", installed));
    }
    
    @GetMapping("/current")
    public ResponseEntity<DockerConfigRequest> getCurrentConfig() {
        DockerConfigRequest config = dockerConfigService.getCurrentConfig();
        return ResponseEntity.ok(config);
    }
    
    @PostMapping("/restart")
    public ResponseEntity<Map<String, String>> restart() {
        String result = dockerConfigService.restart();
        return ResponseEntity.ok(Map.of("message", result));
    }
}

