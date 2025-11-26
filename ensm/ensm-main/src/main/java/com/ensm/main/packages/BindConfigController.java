package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * BIND DNS 서버 설정 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/bind-config")
@RequiredArgsConstructor
public class BindConfigController {
    private final BindConfigService bindConfigService;
    
    @PostMapping
    @PutMapping
    public ResponseEntity<Map<String, String>> applyBindConfiguration(@RequestBody BindConfigRequest request) {
        String result = bindConfigService.applyBindConfiguration(request);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    /**
     * BIND 패키지 설치 여부를 확인합니다.
     *
     * @return 설치 여부
     */
    @GetMapping("/installed")
    public ResponseEntity<Map<String, Boolean>> checkInstalled() {
        boolean installed = bindConfigService.isInstalled();
        return ResponseEntity.ok(Map.of("installed", installed));
    }
    
    /**
     * 현재 BIND 설정을 조회합니다.
     *
     * @return 현재 BIND 설정
     */
    @GetMapping("/current")
    public ResponseEntity<BindConfigRequest> getCurrentConfig() {
        BindConfigRequest config = bindConfigService.getCurrentConfig();
        return ResponseEntity.ok(config);
    }
    
    /**
     * BIND 패키지를 설치합니다.
     * 
     * @return 설치 결과
     */
    @PostMapping("/install")
    public ResponseEntity<Map<String, String>> install() {
        String result = bindConfigService.install();
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    /**
     * BIND 서비스를 재시작합니다.
     * 
     * @return 재시작 결과
     */
    @PostMapping("/restart")
    public ResponseEntity<Map<String, String>> restart() {
        String result = bindConfigService.restart();
        return ResponseEntity.ok(Map.of("message", result));
    }
}

