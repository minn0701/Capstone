package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Apache 서버 설정 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/apache-config")
@RequiredArgsConstructor
public class ApacheConfigController {
    private final ApacheConfigService apacheConfigService;

    /**
     * Apache 서버 설정을 적용합니다.
     * 
     * @param request Apache 설정 요청 정보
     * @return 설정 적용 결과
     */
    @PostMapping
    @PutMapping
    public ResponseEntity<Map<String, String>> applyApacheConfiguration(@RequestBody ApacheConfigRequest request) {
        String result = apacheConfigService.applyApacheConfiguration(request);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    /**
     * Apache 패키지 설치 여부를 확인합니다.
     *
     * @return 설치 여부
     */
    @GetMapping("/installed")
    public ResponseEntity<Map<String, Boolean>> checkInstalled() {
        boolean installed = apacheConfigService.isInstalled();
        return ResponseEntity.ok(Map.of("installed", installed));
    }
    
    /**
     * 현재 Apache 설정을 조회합니다.
     *
     * @return 현재 Apache 설정
     */
    @GetMapping("/current")
    public ResponseEntity<ApacheConfigRequest> getCurrentConfig() {
        ApacheConfigRequest config = apacheConfigService.getCurrentConfig();
        return ResponseEntity.ok(config);
    }
    
    /**
     * Apache 패키지를 설치합니다.
     * 
     * @return 설치 결과
     */
    @PostMapping("/install")
    public ResponseEntity<Map<String, String>> install() {
        String result = apacheConfigService.install();
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    /**
     * Apache 서비스를 재시작합니다.
     * 
     * @return 재시작 결과
     */
    @PostMapping("/restart")
    public ResponseEntity<Map<String, String>> restart() {
        String result = apacheConfigService.restart();
        return ResponseEntity.ok(Map.of("message", result));
    }
}