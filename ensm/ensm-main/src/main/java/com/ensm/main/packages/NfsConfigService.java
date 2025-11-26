package com.ensm.main.packages;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * NFS 서버 설정 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class NfsConfigService {
    private final NfsScriptExecutor scriptExecutor;
    private final ObjectMapper objectMapper;
    
    public String applyNfsConfiguration(NfsConfigRequest req) {
        List<String[]> commands = new ArrayList<>();
        
        if (req.getPort() != null) {
            commands.add(new String[]{"set_port", req.getPort().toString()});
        }
        if (req.getExports() != null) {
            commands.add(new String[]{"set_exports", req.getExports()});
        }
        if (req.getRpcbindPort() != null) {
            commands.add(new String[]{"set_rpcbind_port", req.getRpcbindPort().toString()});
        }
        if (req.getMountdPort() != null) {
            commands.add(new String[]{"set_mountd_port", req.getMountdPort().toString()});
        }
        if (req.getStatdPort() != null) {
            commands.add(new String[]{"set_statd_port", req.getStatdPort().toString()});
        }
        if (req.getLockdPort() != null) {
            commands.add(new String[]{"set_lockd_port", req.getLockdPort().toString()});
        }
        if (Boolean.TRUE.equals(req.getApply())) {
            commands.add(new String[]{"apply"});
        }
        
        StringBuilder log = new StringBuilder();
        for (String[] cmd : commands) {
            log.append(String.join(" ", cmd)).append("\n")
                    .append(scriptExecutor.execute(cmd)).append("\n\n");
        }
        
        return log.toString();
    }
    
    public boolean isInstalled() {
        try {
            ProcessBuilder pb = new ProcessBuilder("rpm", "-q", "nfs-utils");
            pb.redirectErrorStream(true);
            Process process = pb.start();
            int exitCode = process.waitFor();
            return exitCode == 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    public NfsConfigRequest getCurrentConfig() {
        NfsConfigRequest config = new NfsConfigRequest();
        
        try {
            String result = scriptExecutor.execute(new String[]{"get_all"});
            
            if (result != null && !result.trim().isEmpty() && result.trim().startsWith("{")) {
                Map<String, Object> jsonMap = objectMapper.readValue(result, Map.class);
                
                config.setPort(jsonMap.get("port") != null ? Integer.parseInt(jsonMap.get("port").toString()) : null);
                config.setExports((String) jsonMap.get("exports"));
                config.setRpcbindPort(jsonMap.get("rpcbindPort") != null ? Integer.parseInt(jsonMap.get("rpcbindPort").toString()) : null);
                config.setMountdPort(jsonMap.get("mountdPort") != null ? Integer.parseInt(jsonMap.get("mountdPort").toString()) : null);
                config.setStatdPort(jsonMap.get("statdPort") != null ? Integer.parseInt(jsonMap.get("statdPort").toString()) : null);
                config.setLockdPort(jsonMap.get("lockdPort") != null ? Integer.parseInt(jsonMap.get("lockdPort").toString()) : null);
            }
        } catch (Exception e) {
            System.err.println("NFS 설정 조회 실패: " + e.getMessage());
            e.printStackTrace();
        }
        
        return config;
    }
    
    public String restart() {
        try {
            String result = scriptExecutor.execute(new String[]{"apply"});
            return "NFS 서비스 재시작: " + result;
        } catch (Exception e) {
            return "NFS 서비스 재시작 실패: " + e.getMessage();
        }
    }
}

