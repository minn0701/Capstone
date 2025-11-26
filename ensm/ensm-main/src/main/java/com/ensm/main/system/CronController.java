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
        try {
            String schedule = request.get("schedule");
            String command = request.get("command");
            
            if (schedule == null || schedule.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "스케줄이 지정되지 않았습니다."));
            }
            if (command == null || command.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "명령어가 지정되지 않았습니다."));
            }
            
            String result = cronService.addCronJob(user, schedule, command);
            
            // 오류 메시지 확인
            if (result.contains("❌") || result.contains("오류:") || result.contains("error")) {
                return ResponseEntity.status(500)
                    .body(Map.of("error", result));
            }
            
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            System.err.println("CRON 작업 추가 중 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(Map.of("error", "CRON 작업 추가 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{user}/{index}")
    public ResponseEntity<Map<String, String>> deleteCronJob(
            @PathVariable String user,
            @PathVariable int index) {
        try {
            String result = cronService.deleteCronJob(user, index);
            
            // 오류 메시지 확인
            if (result.contains("❌") || result.contains("오류:") || result.contains("error")) {
                return ResponseEntity.status(500)
                    .body(Map.of("error", result));
            }
            
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            System.err.println("CRON 작업 삭제 중 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(Map.of("error", "CRON 작업 삭제 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}

