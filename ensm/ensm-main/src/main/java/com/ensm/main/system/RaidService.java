package com.ensm.main.system;

import com.ensm.main.util.ScriptExecutor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * RAID 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class RaidService {
    
    private final ScriptExecutor scriptExecutor;
    
    /**
     * RAID 목록 조회
     */
    public List<Map<String, Object>> getRaidList() {
        return scriptExecutor.executeScriptJsonArray("system/manage_raid.sh", "list");
    }
    
    /**
     * RAID 생성
     */
    public String createRaid(String name, String level, List<String> devices, Integer spare, Integer chunkSize) {
        StringBuilder devicesStr = new StringBuilder();
        for (int i = 0; i < devices.size(); i++) {
            if (i > 0) devicesStr.append(" ");
            devicesStr.append(devices.get(i));
        }
        
        List<String> args = new java.util.ArrayList<>();
        args.add("create");
        args.add(name);
        args.add(level);
        args.add(devicesStr.toString());
        if (spare != null) {
            args.add(String.valueOf(spare));
        }
        if (chunkSize != null) {
            args.add(String.valueOf(chunkSize));
        }
        
        return scriptExecutor.executeScript("system/manage_raid.sh", args.toArray(new String[0]));
    }
    
    /**
     * RAID 삭제
     */
    public String deleteRaid(String name) {
        return scriptExecutor.executeScript("system/manage_raid.sh", "delete", name);
    }
}

