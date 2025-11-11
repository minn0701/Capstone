package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> applyApacheConfiguration(@RequestBody ApacheConfigRequest request) {
        String result = apacheConfigService.applyApacheConfiguration(request);
        return ResponseEntity.ok(result);
    }
}