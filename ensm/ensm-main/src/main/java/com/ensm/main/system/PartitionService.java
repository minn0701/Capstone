package com.ensm.main.system;

import com.ensm.main.util.ScriptExecutor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 파티션 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class PartitionService {
    
    private final ScriptExecutor scriptExecutor;
    
    /**
     * 파티션 목록 조회
     */
    public List<Map<String, Object>> getPartitionList() {
        return scriptExecutor.executeScriptJsonArray("system/manage_partitions.sh", "list");
    }
    
    /**
     * 파티션 생성
     */
    public String createPartition(String disk, String size, String sizeUnit, String partitionType) {
        return scriptExecutor.executeScript("system/manage_partitions.sh", 
                "create", disk, size, sizeUnit, partitionType);
    }
    
    /**
     * 파티션 삭제
     */
    public String deletePartition(String partition) {
        return scriptExecutor.executeScript("system/manage_partitions.sh", "delete", partition);
    }
    
    /**
     * 파티션 포맷
     */
    public String formatPartition(String partition, String fileSystem, String label) {
        if (label != null && !label.isEmpty()) {
            return scriptExecutor.executeScript("system/manage_partitions.sh", 
                    "format", partition, fileSystem, label);
        } else {
            return scriptExecutor.executeScript("system/manage_partitions.sh", 
                    "format", partition, fileSystem);
        }
    }
    
    /**
     * 파티션 마운트
     */
    public String mountPartition(String partition, String mountPoint) {
        return scriptExecutor.executeScript("system/manage_partitions.sh", 
                "mount", partition, mountPoint);
    }
    
    /**
     * 파티션 언마운트
     */
    public String unmountPartition(String partition) {
        return scriptExecutor.executeScript("system/manage_partitions.sh", "unmount", partition);
    }
}

