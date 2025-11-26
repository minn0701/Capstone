package com.ensm.main.system;

import com.ensm.main.util.ScriptExecutor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 디스크 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class DiskService {
    
    private final ScriptExecutor scriptExecutor;
    
    /**
     * 디스크 목록 조회
     */
    public List<Map<String, Object>> getDiskList() {
        return scriptExecutor.executeScriptJsonArray("system/manage_disks.sh", "list");
    }
    
    /**
     * 사용 가능한 디스크 목록 조회 (파티션/LVM/RAID에 사용되지 않은 디스크)
     */
    public List<Map<String, Object>> getAvailableDisks() {
        List<Map<String, Object>> allDisks = getDiskList();
        List<Map<String, Object>> usedDisks = getUsedDisks();
        
        // 사용 중인 디스크 제외
        return allDisks.stream()
                .filter(disk -> {
                    String device = (String) disk.get("device");
                    return usedDisks.stream()
                            .noneMatch(used -> device.equals(used.get("device")));
                })
                .toList();
    }
    
    /**
     * 사용 중인 디스크 목록 조회 (파티션, LVM, RAID에서 사용 중)
     */
    private List<Map<String, Object>> getUsedDisks() {
        List<Map<String, Object>> usedDisks = new java.util.ArrayList<>();
        
        // 파티션에서 사용 중인 디스크
        List<Map<String, Object>> partitions = scriptExecutor.executeScriptJsonArray("system/manage_partitions.sh", "list");
        for (Map<String, Object> partition : partitions) {
            String disk = (String) partition.get("disk");
            if (disk != null && !usedDisks.stream().anyMatch(d -> disk.equals(d.get("device")))) {
                usedDisks.add(Map.of("device", disk));
            }
        }
        
        // LVM PV에서 사용 중인 디스크
        List<Map<String, Object>> pvs = scriptExecutor.executeScriptJsonArray("system/manage_lvm.sh", "pv_list");
        for (Map<String, Object> pv : pvs) {
            String device = (String) pv.get("device");
            if (device != null && !usedDisks.stream().anyMatch(d -> device.equals(d.get("device")))) {
                usedDisks.add(Map.of("device", device));
            }
        }
        
        // RAID에서 사용 중인 디스크
        List<Map<String, Object>> raids = scriptExecutor.executeScriptJsonArray("system/manage_raid.sh", "list");
        for (Map<String, Object> raid : raids) {
            @SuppressWarnings("unchecked")
            List<String> devices = (List<String>) raid.get("devices");
            if (devices != null) {
                for (String device : devices) {
                    if (!usedDisks.stream().anyMatch(d -> device.equals(d.get("device")))) {
                        usedDisks.add(Map.of("device", device));
                    }
                }
            }
        }
        
        return usedDisks;
    }
}

