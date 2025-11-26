package com.ensm.main.packages;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Docker 설정 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class DockerConfigService {
    private final DockerScriptExecutor scriptExecutor;
    private final ObjectMapper objectMapper;
    
    public String applyDockerConfiguration(DockerConfigRequest req) {
        List<String[]> commands = new ArrayList<>();
        
        if (req.getDataRoot() != null) {
            commands.add(new String[]{"set_data_root", req.getDataRoot()});
        }
        if (req.getLogDriver() != null) {
            commands.add(new String[]{"set_log_driver", req.getLogDriver()});
        }
        if (req.getMaxLogSize() != null && req.getLogOptMaxFile() != null) {
            commands.add(new String[]{"set_log_opts", req.getMaxLogSize(), req.getLogOptMaxFile()});
        }
        if (req.getStorageDriver() != null) {
            commands.add(new String[]{"set_storage_driver", req.getStorageDriver()});
        }
        if (req.getDns() != null) {
            commands.add(new String[]{"set_dns", req.getDns()});
        }
        if (req.getDefaultAddressPool() != null) {
            commands.add(new String[]{"set_default_address_pool", req.getDefaultAddressPool()});
        }
        if (req.getLiveRestore() != null) {
            commands.add(new String[]{"set_live_restore", req.getLiveRestore() ? "true" : "false"});
        }
        if (req.getUserlandProxy() != null) {
            commands.add(new String[]{"set_userland_proxy", req.getUserlandProxy() ? "true" : "false"});
        }
        if (req.getIpv6() != null) {
            commands.add(new String[]{"set_ipv6", req.getIpv6() ? "true" : "false"});
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
            ProcessBuilder pb = new ProcessBuilder("rpm", "-q", "docker");
            pb.redirectErrorStream(true);
            Process process = pb.start();
            int exitCode = process.waitFor();
            return exitCode == 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    public DockerConfigRequest getCurrentConfig() {
        DockerConfigRequest config = new DockerConfigRequest();
        
        try {
            String result = scriptExecutor.execute(new String[]{"get_all"});
            
            if (result != null && !result.trim().isEmpty() && result.trim().startsWith("{")) {
                Map<String, Object> jsonMap = objectMapper.readValue(result, Map.class);
                
                config.setDataRoot((String) jsonMap.get("data-root"));
                config.setLogDriver((String) jsonMap.get("log-driver"));
                if (jsonMap.get("log-opts") instanceof Map) {
                    Map<String, Object> logOpts = (Map<String, Object>) jsonMap.get("log-opts");
                    config.setMaxLogSize((String) logOpts.get("max-size"));
                    config.setLogOptMaxFile((String) logOpts.get("max-file"));
                }
                config.setStorageDriver((String) jsonMap.get("storage-driver"));
                if (jsonMap.get("dns") instanceof List) {
                    List<?> dnsList = (List<?>) jsonMap.get("dns");
                    if (!dnsList.isEmpty()) {
                        config.setDns(dnsList.get(0).toString());
                    }
                }
                config.setLiveRestore((Boolean) jsonMap.get("live-restore"));
                config.setUserlandProxy((Boolean) jsonMap.get("userland-proxy"));
                config.setIpv6((Boolean) jsonMap.get("ipv6"));
            }
        } catch (Exception e) {
            System.err.println("Docker 설정 조회 실패: " + e.getMessage());
            e.printStackTrace();
        }
        
        return config;
    }
    
    public String restart() {
        try {
            String result = scriptExecutor.execute(new String[]{"apply"});
            return "Docker 서비스 재시작: " + result;
        } catch (Exception e) {
            return "Docker 서비스 재시작 실패: " + e.getMessage();
        }
    }
}

