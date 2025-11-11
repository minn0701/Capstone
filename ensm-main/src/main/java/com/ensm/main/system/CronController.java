package com.ensm.main.system;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * CRON 작업 관리 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/cron")
@RequiredArgsConstructor
public class CronController {
    private final CronService cronService;
    
    @GetMapping("/{user}")
    public ResponseEntity<List<Map<String, String>>> getCronJobs(@PathVariable String user) {
        return ResponseEntity.ok(cronService.getCronJobs(user));
    }
    
    @PostMapping("/{user}")
    public ResponseEntity<Map<String, String>> addCronJob(
            @PathVariable String user,
            @RequestBody Map<String, String> request) {
        String schedule = request.get("schedule");
        String command = request.get("command");
        String result = cronService.addCronJob(user, schedule, command);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    @DeleteMapping("/{user}/{index}")
    public ResponseEntity<Map<String, String>> deleteCronJob(
            @PathVariable String user,
            @PathVariable int index) {
        String result = cronService.deleteCronJob(user, index);
        return ResponseEntity.ok(Map.of("message", result));
    }
}

