package com.ensm.main.system;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * RAID 관리 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/raid")
@RequiredArgsConstructor
public class RaidController {
    
    private final RaidService raidService;
    
    /**
     * RAID 목록 조회
     */
    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getRaidList() {
        try {
            List<Map<String, Object>> raids = raidService.getRaidList();
            return ResponseEntity.ok(raids != null ? raids : List.of());
        } catch (Exception e) {
            System.err.println("RAID 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of()); // 오류 시 빈 리스트 반환
        }
    }
    
    /**
     * RAID 생성
     */
    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createRaid(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String level = (String) request.get("level");
        @SuppressWarnings("unchecked")
        List<String> devices = (List<String>) request.get("devices");
        Integer spare = request.get("spare") != null ? ((Number) request.get("spare")).intValue() : null;
        Integer chunkSize = request.get("chunkSize") != null ? ((Number) request.get("chunkSize")).intValue() : null;
        
        String result = raidService.createRaid(name, level, devices, spare, chunkSize);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    /**
     * RAID 삭제
     */
    @DeleteMapping("/{raidName}")
    public ResponseEntity<Map<String, String>> deleteRaid(@PathVariable String raidName) {
        String result = raidService.deleteRaid(raidName);
        return ResponseEntity.ok(Map.of("message", result));
    }
}

