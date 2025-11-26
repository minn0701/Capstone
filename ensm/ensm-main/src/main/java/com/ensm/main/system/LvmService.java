package com.ensm.main.system;

import com.ensm.main.util.ScriptExecutor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * LVM 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class LvmService {
    
    private final ScriptExecutor scriptExecutor;
    
    // PV (Physical Volume) 관리
    
    public List<Map<String, Object>> getPvList() {
        return scriptExecutor.executeScriptJsonArray("system/manage_lvm.sh", "pv_list");
    }
    
    public String createPv(String device) {
        return scriptExecutor.executeScript("system/manage_lvm.sh", "pv_create", device);
    }
    
    // VG (Volume Group) 관리
    
    public List<Map<String, Object>> getVgList() {
        return scriptExecutor.executeScriptJsonArray("system/manage_lvm.sh", "vg_list");
    }
    
    public String createVg(String vgName, List<String> physicalVolumes) {
        StringBuilder pvsStr = new StringBuilder();
        for (int i = 0; i < physicalVolumes.size(); i++) {
            if (i > 0) pvsStr.append(" ");
            pvsStr.append(physicalVolumes.get(i));
        }
        return scriptExecutor.executeScript("system/manage_lvm.sh", "vg_create", vgName, pvsStr.toString());
    }
    
    public String expandVg(String vgName, List<String> physicalVolumes) {
        StringBuilder pvsStr = new StringBuilder();
        for (int i = 0; i < physicalVolumes.size(); i++) {
            if (i > 0) pvsStr.append(" ");
            pvsStr.append(physicalVolumes.get(i));
        }
        return scriptExecutor.executeScript("system/manage_lvm.sh", "vg_expand", vgName, pvsStr.toString());
    }
    
    // LV (Logical Volume) 관리
    
    public List<Map<String, Object>> getLvList() {
        return scriptExecutor.executeScriptJsonArray("system/manage_lvm.sh", "lv_list");
    }
    
    public String createLv(String lvName, String vgName, String size, String sizeUnit, String mountPoint) {
        if (mountPoint != null && !mountPoint.isEmpty()) {
            return scriptExecutor.executeScript("system/manage_lvm.sh", 
                    "lv_create", lvName, vgName, size, sizeUnit, mountPoint);
        } else {
            return scriptExecutor.executeScript("system/manage_lvm.sh", 
                    "lv_create", lvName, vgName, size, sizeUnit);
        }
    }
    
    public String expandLv(String lvPath, String size, String sizeUnit) {
        return scriptExecutor.executeScript("system/manage_lvm.sh", 
                "lv_expand", lvPath, size, sizeUnit);
    }
    
    public String shrinkLv(String lvPath, String size, String sizeUnit) {
        return scriptExecutor.executeScript("system/manage_lvm.sh", 
                "lv_shrink", lvPath, size, sizeUnit);
    }
}

