package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * BIND DNS 서버 설정 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/bind-config")
@RequiredArgsConstructor
public class BindConfigController {
    private final BindConfigService bindConfigService;
    
    @PostMapping
    public ResponseEntity<String> applyBindConfiguration(@RequestBody BindConfigRequest request) {
        String result = bindConfigService.applyBindConfiguration(request);
        return ResponseEntity.ok(result);
    }
}

