package ensm.server2.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/main/api/apache-config")
@RequiredArgsConstructor
public class ApacheConfigController {
    private final ApacheConfigService apacheConfigService;

    @PostMapping
    public ResponseEntity<String> applyConfig(@RequestBody ApacheConfigRequest request) {
        String result = apacheConfigService.applyConfiguration(request);
        return ResponseEntity.ok(result);
    }
}