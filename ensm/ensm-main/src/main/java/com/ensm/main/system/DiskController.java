package com.ensm.main.system;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 디스크 관리 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/disks")
@RequiredArgsConstructor
public class DiskController {
    
    private final DiskService diskService;
    
    /**
     * 디스크 목록 조회
     */
    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getDiskList() {
        try {
            List<Map<String, Object>> disks = diskService.getDiskList();
            return ResponseEntity.ok(disks != null ? disks : List.of());
        } catch (Exception e) {
            System.err.println("디스크 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of()); // 오류 시 빈 리스트 반환
        }
    }
    
    /**
     * 사용 가능한 디스크 목록 조회
     */
    @GetMapping("/available")
    public ResponseEntity<List<Map<String, Object>>> getAvailableDisks() {
        try {
            List<Map<String, Object>> disks = diskService.getAvailableDisks();
            return ResponseEntity.ok(disks != null ? disks : List.of());
        } catch (Exception e) {
            System.err.println("사용 가능한 디스크 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of()); // 오류 시 빈 리스트 반환
        }
    }
}

