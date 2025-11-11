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
    public ResponseEntity<List<Map<String, String>>> getDiskInfo() {
        return ResponseEntity.ok(systemInfoService.getDiskInfo());
    }
    
    @GetMapping("/raid")
    public ResponseEntity<Map<String, String>> getRaidStatus() {
        return ResponseEntity.ok(Map.of("status", systemInfoService.getRaidStatus()));
    }
    
    @GetMapping("/network")
    public ResponseEntity<List<Map<String, String>>> getNetworkInterfaces() {
        return ResponseEntity.ok(systemInfoService.getNetworkInterfaces());
    }
    
    @GetMapping("/ports")
    public ResponseEntity<List<Map<String, String>>> getOpenPorts() {
        return ResponseEntity.ok(systemInfoService.getOpenPorts());
    }
    
    @GetMapping("/services")
    public ResponseEntity<List<Map<String, String>>> getRunningServices() {
        return ResponseEntity.ok(systemInfoService.getRunningServices());
    }
}

