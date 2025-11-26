package com.ensm.main.system;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * LVM 관리 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/lvm")
@RequiredArgsConstructor
public class LvmController {
    
    private final LvmService lvmService;
    
    // PV (Physical Volume) 엔드포인트
    
    @GetMapping("/pv")
    public ResponseEntity<List<Map<String, Object>>> getPvList() {
        try {
            List<Map<String, Object>> pvs = lvmService.getPvList();
            return ResponseEntity.ok(pvs != null ? pvs : List.of());
        } catch (Exception e) {
            System.err.println("PV 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of()); // 오류 시 빈 리스트 반환
        }
    }
    
    @PostMapping("/pv/create")
    public ResponseEntity<Map<String, String>> createPv(@RequestBody Map<String, String> request) {
        String device = request.get("device");
        String result = lvmService.createPv(device);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    // VG (Volume Group) 엔드포인트
    
    @GetMapping("/vg")
    public ResponseEntity<List<Map<String, Object>>> getVgList() {
        try {
            List<Map<String, Object>> vgs = lvmService.getVgList();
            return ResponseEntity.ok(vgs != null ? vgs : List.of());
        } catch (Exception e) {
            System.err.println("VG 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of()); // 오류 시 빈 리스트 반환
        }
    }
    
    @PostMapping("/vg/create")
    public ResponseEntity<Map<String, String>> createVg(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        @SuppressWarnings("unchecked")
        List<String> physicalVolumes = (List<String>) request.get("physicalVolumes");
        String result = lvmService.createVg(name, physicalVolumes);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    @PostMapping("/vg/expand")
    public ResponseEntity<Map<String, String>> expandVg(@RequestBody Map<String, Object> request) {
        String volumeGroup = (String) request.get("volumeGroup");
        @SuppressWarnings("unchecked")
        List<String> physicalVolumes = (List<String>) request.get("physicalVolumes");
        String result = lvmService.expandVg(volumeGroup, physicalVolumes);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    // LV (Logical Volume) 엔드포인트
    
    @GetMapping("/lv")
    public ResponseEntity<List<Map<String, Object>>> getLvList() {
        try {
            List<Map<String, Object>> lvs = lvmService.getLvList();
            return ResponseEntity.ok(lvs != null ? lvs : List.of());
        } catch (Exception e) {
            System.err.println("LV 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of()); // 오류 시 빈 리스트 반환
        }
    }
    
    @PostMapping("/lv/create")
    public ResponseEntity<Map<String, String>> createLv(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String volumeGroup = request.get("volumeGroup");
        String size = request.get("size");
        String sizeUnit = request.get("sizeUnit");
        String mountPoint = request.get("mountPoint");
        
        String result = lvmService.createLv(name, volumeGroup, size, sizeUnit, mountPoint);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    @PostMapping("/lv/expand")
    public ResponseEntity<Map<String, String>> expandLv(@RequestBody Map<String, String> request) {
        String logicalVolume = request.get("logicalVolume");
        String size = request.get("size");
        String sizeUnit = request.get("sizeUnit");
        
        String result = lvmService.expandLv(logicalVolume, size, sizeUnit);
        return ResponseEntity.ok(Map.of("message", result));
    }
    
    @PostMapping("/lv/shrink")
    public ResponseEntity<Map<String, String>> shrinkLv(@RequestBody Map<String, String> request) {
        String logicalVolume = request.get("logicalVolume");
        String size = request.get("size");
        String sizeUnit = request.get("sizeUnit");
        
        String result = lvmService.shrinkLv(logicalVolume, size, sizeUnit);
        return ResponseEntity.ok(Map.of("message", result));
    }
}

