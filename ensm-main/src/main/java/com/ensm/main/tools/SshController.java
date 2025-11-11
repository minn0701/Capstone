package com.ensm.main.tools;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * SSH 자동화 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/ssh")
@RequiredArgsConstructor
public class SshController {
    private final SshService sshService;
    
    @PostMapping("/generate-key")
    public ResponseEntity<Map<String, String>> generateKeyPair(@RequestBody Map<String, String> request) {
        String keyType = request.getOrDefault("keyType", "rsa");
        int keySize = Integer.parseInt(request.getOrDefault("keySize", "2048"));
        String comment = request.getOrDefault("comment", "");
        String result = sshService.generateKeyPair(keyType, keySize, comment);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    @PostMapping("/copy-key")
    public ResponseEntity<Map<String, String>> copyKey(@RequestBody Map<String, String> request) {
        String publicKeyPath = request.get("publicKeyPath");
        String user = request.get("user");
        String host = request.get("host");
        int port = Integer.parseInt(request.getOrDefault("port", "22"));
        String result = sshService.copyKey(publicKeyPath, user, host, port);
        return ResponseEntity.ok(Map.of("message", result));
    }
}

