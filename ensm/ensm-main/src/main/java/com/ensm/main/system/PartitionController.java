package com.ensm.main.system;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 파티션 관리 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/partitions")
@RequiredArgsConstructor
public class PartitionController {
    
    private final PartitionService partitionService;
    
    /**
     * 파티션 목록 조회
     */
    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getPartitionList() {
        try {
            List<Map<String, Object>> partitions = partitionService.getPartitionList();
            return ResponseEntity.ok(partitions != null ? partitions : List.of());
        } catch (Exception e) {
            System.err.println("파티션 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of()); // 오류 시 빈 리스트 반환
        }
    }
    
    /**
     * 파티션 생성
     */
    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPartition(
            @RequestBody Map<String, String> request) {
        String disk = request.get("disk");
        String size = request.get("size");
        String sizeUnit = request.get("sizeUnit");
        String partitionType = request.get("partitionType");
        
        String result = partitionService.createPartition(disk, size, sizeUnit, partitionType);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    /**
     * 파티션 삭제
     */
    @DeleteMapping("/{device}")
    public ResponseEntity<Map<String, String>> deletePartition(@PathVariable String device) {
        String result = partitionService.deletePartition(device);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    /**
     * 파티션 포맷
     */
    @PostMapping("/format")
    public ResponseEntity<Map<String, String>> formatPartition(
            @RequestBody Map<String, String> request) {
        String partition = request.get("partition");
        String fileSystem = request.get("fileSystem");
        String label = request.get("label");
        
        String result = partitionService.formatPartition(partition, fileSystem, label);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    /**
     * 파티션 마운트
     */
    @PostMapping("/mount")
    public ResponseEntity<Map<String, String>> mountPartition(
            @RequestBody Map<String, String> request) {
        String partition = request.get("partition");
        String mountPoint = request.get("mountPoint");
        
        String result = partitionService.mountPartition(partition, mountPoint);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    /**
     * 파티션 언마운트
     */
    @PostMapping("/{device}/unmount")
    public ResponseEntity<Map<String, String>> unmountPartition(@PathVariable String device) {
        String result = partitionService.unmountPartition(device);
        return ResponseEntity.ok(Map.of("message", result));
    }
}

