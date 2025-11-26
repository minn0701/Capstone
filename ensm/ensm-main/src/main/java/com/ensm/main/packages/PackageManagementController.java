package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 패키지 관리 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/packages")
@RequiredArgsConstructor
public class PackageManagementController {
    
    private final PackageManagementService packageManagementService;
    
    /**
     * 패키지 목록 조회
     */
    @GetMapping({"", "/list"})
    public ResponseEntity<List<Map<String, Object>>> getPackageList() {
        try {
            List<Map<String, Object>> packages = packageManagementService.getPackageList();
            return ResponseEntity.ok(packages != null ? packages : List.of());
        } catch (Exception e) {
            System.err.println("패키지 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of()); // 오류 시 빈 리스트 반환
        }
    }
    
    /**
     * 패키지 설치 여부 확인
     */
    @GetMapping("/{packageId}/installed")
    public ResponseEntity<Map<String, Boolean>> isInstalled(@PathVariable String packageId) {
        boolean installed = packageManagementService.isInstalled(packageId);
        return ResponseEntity.ok(Map.of("installed", installed));
    }
    
    /**
     * 패키지 설치
     */
    @PostMapping({"/install", "/{packageId}/install"})
    public ResponseEntity<Map<String, String>> installPackage(
            @PathVariable(required = false) String packageId,
            @RequestBody(required = false) Map<String, String> request) {
        // URL 경로에서 packageId를 가져오거나, body에서 가져오기
        String pkgId = packageId;
        if (pkgId == null && request != null) {
            pkgId = request.get("packageId");
        }
        if (pkgId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "패키지 ID가 필요합니다."));
        }
        String result = packageManagementService.installPackage(pkgId);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    /**
     * 패키지 제거
     */
    @DeleteMapping("/{packageId}")
    public ResponseEntity<Map<String, String>> removePackage(@PathVariable String packageId) {
        String result = packageManagementService.removePackage(packageId);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    /**
     * 서비스 제어
     */
    @PostMapping("/{packageId}/service/{action}")
    public ResponseEntity<Map<String, String>> controlService(
            @PathVariable String packageId,
            @PathVariable String action) {
        String result = packageManagementService.controlService(packageId, action);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    /**
     * 자동 시작 토글
     */
    @PostMapping("/{packageId}/autostart/toggle")
    public ResponseEntity<Map<String, String>> toggleAutostart(
            @PathVariable String packageId,
            @RequestBody Map<String, Boolean> request) {
        boolean enable = request.getOrDefault("enable", false);
        String result = packageManagementService.toggleAutostart(packageId, enable);
        return ResponseEntity.ok(Map.of("message", result));
    }
}

