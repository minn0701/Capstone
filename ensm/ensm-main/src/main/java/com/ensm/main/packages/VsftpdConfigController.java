package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * VSFTPD 서버 설정 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/vsftpd-config")
@RequiredArgsConstructor
public class VsftpdConfigController {
    private final VsftpdConfigService vsftpdConfigService;
    
    @PostMapping
    @PutMapping
    public ResponseEntity<Map<String, String>> applyVsftpdConfiguration(@RequestBody VsftpdConfigRequest request) {
        String result = vsftpdConfigService.applyVsftpdConfiguration(request);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    @GetMapping("/installed")
    public ResponseEntity<Map<String, Boolean>> checkInstalled() {
        boolean installed = vsftpdConfigService.isInstalled();
        return ResponseEntity.ok(Map.of("installed", installed));
    }
    
    @GetMapping("/current")
    public ResponseEntity<VsftpdConfigRequest> getCurrentConfig() {
        VsftpdConfigRequest config = vsftpdConfigService.getCurrentConfig();
        return ResponseEntity.ok(config);
    }
    
    @PostMapping("/restart")
    public ResponseEntity<Map<String, String>> restart() {
        String result = vsftpdConfigService.restart();
        return ResponseEntity.ok(Map.of("message", result));
    }
}

