package com.ensm.main.system;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 시스템 정보 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/system-info")
@RequiredArgsConstructor
public class SystemInfoController {
    private final SystemInfoService systemInfoService;
    
    @GetMapping("/disk")
    public ResponseEntity<List<Map<String, Object>>> getDiskInfo() {
        try {
            List<Map<String, Object>> disks = systemInfoService.getDiskInfo();
            return ResponseEntity.ok(disks != null ? disks : List.of());
        } catch (Exception e) {
            System.err.println("디스크 정보 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of()); // 오류 시 빈 리스트 반환
        }
    }
    
    @GetMapping("/raid")
    public ResponseEntity<Map<String, Object>> getRaidStatus() {
        try {
            Map<String, Object> raid = systemInfoService.getRaidStatus();
            return ResponseEntity.ok(raid != null ? raid : Map.of());
        } catch (Exception e) {
            System.err.println("RAID 상태 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(Map.of()); // 오류 시 빈 맵 반환
        }
    }
    
    @GetMapping("/network")
    public ResponseEntity<List<Map<String, Object>>> getNetworkInterfaces() {
        try {
            List<Map<String, Object>> interfaces = systemInfoService.getNetworkInterfaces();
            return ResponseEntity.ok(interfaces != null ? interfaces : List.of());
        } catch (Exception e) {
            System.err.println("네트워크 인터페이스 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of()); // 오류 시 빈 리스트 반환
        }
    }
    
    @GetMapping("/ports")
    public ResponseEntity<List<Map<String, Object>>> getOpenPorts() {
        try {
            List<Map<String, Object>> ports = systemInfoService.getOpenPorts();
            return ResponseEntity.ok(ports != null ? ports : List.of());
        } catch (Exception e) {
            System.err.println("열린 포트 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of()); // 오류 시 빈 리스트 반환
        }
    }
    
    @GetMapping("/services")
    public ResponseEntity<List<Map<String, Object>>> getRunningServices() {
        try {
            List<Map<String, Object>> services = systemInfoService.getRunningServices();
            return ResponseEntity.ok(services != null ? services : List.of());
        } catch (Exception e) {
            System.err.println("실행 중인 서비스 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of()); // 오류 시 빈 리스트 반환
        }
    }
    
    @GetMapping("/network-log")
    public ResponseEntity<Map<String, Object>> getNetworkLog(
            @RequestParam(defaultValue = "messages") String type,
            @RequestParam(defaultValue = "100") int lines) {
        try {
            Map<String, Object> log = systemInfoService.getNetworkLog(type, lines);
            return ResponseEntity.ok(log != null ? log : Map.of());
        } catch (Exception e) {
            System.err.println("네트워크 로그 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(Map.of()); // 오류 시 빈 맵 반환
        }
    }
    
    @GetMapping("/network-stats")
    public ResponseEntity<Map<String, Object>> getNetworkStats() {
        try {
            Map<String, Object> stats = systemInfoService.getNetworkStats();
            return ResponseEntity.ok(stats != null ? stats : Map.of());
        } catch (Exception e) {
            System.err.println("네트워크 통계 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(Map.of()); // 오류 시 빈 맵 반환
        }
    }
}

