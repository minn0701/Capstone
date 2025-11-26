package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * NFS 서버 설정 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/nfs-config")
@RequiredArgsConstructor
public class NfsConfigController {
    private final NfsConfigService nfsConfigService;
    
    @PostMapping
    @PutMapping
    public ResponseEntity<Map<String, String>> applyNfsConfiguration(@RequestBody NfsConfigRequest request) {
        String result = nfsConfigService.applyNfsConfiguration(request);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    @GetMapping("/installed")
    public ResponseEntity<Map<String, Boolean>> checkInstalled() {
        boolean installed = nfsConfigService.isInstalled();
        return ResponseEntity.ok(Map.of("installed", installed));
    }
    
    @GetMapping("/current")
    public ResponseEntity<NfsConfigRequest> getCurrentConfig() {
        NfsConfigRequest config = nfsConfigService.getCurrentConfig();
        return ResponseEntity.ok(config);
    }
    
    @PostMapping("/restart")
    public ResponseEntity<Map<String, String>> restart() {
        String result = nfsConfigService.restart();
        return ResponseEntity.ok(Map.of("message", result));
    }
}

