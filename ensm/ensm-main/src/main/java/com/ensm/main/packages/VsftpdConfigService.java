package com.ensm.main.packages;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * VSFTPD 서버 설정 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class VsftpdConfigService {
    private final VsftpdScriptExecutor scriptExecutor;
    private final ObjectMapper objectMapper;
    
    public String applyVsftpdConfiguration(VsftpdConfigRequest req) {
        List<String[]> commands = new ArrayList<>();
        
        if (req.getPort() != null) {
            commands.add(new String[]{"set_port", req.getPort().toString()});
        }
        if (req.getLocalRoot() != null) {
            commands.add(new String[]{"set_local_root", req.getLocalRoot()});
        }
        if (req.getPasvMinPort() != null) {
            commands.add(new String[]{"set_pasv_min_port", req.getPasvMinPort().toString()});
        }
        if (req.getPasvMaxPort() != null) {
            commands.add(new String[]{"set_pasv_max_port", req.getPasvMaxPort().toString()});
        }
        if (req.getMaxClients() != null) {
            commands.add(new String[]{"set_max_clients", req.getMaxClients().toString()});
        }
        if (req.getMaxPerIp() != null) {
            commands.add(new String[]{"set_max_per_ip", req.getMaxPerIp().toString()});
        }
        if (req.getIdleSessionTimeout() != null) {
            commands.add(new String[]{"set_idle_session_timeout", req.getIdleSessionTimeout().toString()});
        }
        if (req.getDataConnectionTimeout() != null) {
            commands.add(new String[]{"set_data_connection_timeout", req.getDataConnectionTimeout().toString()});
        }
        if (req.getAnonymousEnable() != null) {
            commands.add(new String[]{"set_anonymous_enable", req.getAnonymousEnable() ? "YES" : "NO"});
        }
        if (req.getLocalEnable() != null) {
            commands.add(new String[]{"set_local_enable", req.getLocalEnable() ? "YES" : "NO"});
        }
        if (req.getWriteEnable() != null) {
            commands.add(new String[]{"set_write_enable", req.getWriteEnable() ? "YES" : "NO"});
        }
        if (req.getChrootLocalUser() != null) {
            commands.add(new String[]{"set_chroot_local_user", req.getChrootLocalUser() ? "YES" : "NO"});
        }
        if (req.getAllowWriteableChroot() != null) {
            commands.add(new String[]{"set_allow_writeable_chroot", req.getAllowWriteableChroot() ? "YES" : "NO"});
        }
        if (req.getUserlistEnable() != null) {
            commands.add(new String[]{"set_userlist_enable", req.getUserlistEnable() ? "YES" : "NO"});
        }
        if (req.getSslEnable() != null) {
            commands.add(new String[]{"set_ssl_enable", req.getSslEnable() ? "YES" : "NO"});
        }
        if (req.getPasvEnable() != null) {
            commands.add(new String[]{"set_pasv_enable", req.getPasvEnable() ? "YES" : "NO"});
        }
        if (req.getTcpWrappers() != null) {
            commands.add(new String[]{"set_tcp_wrappers", req.getTcpWrappers() ? "YES" : "NO"});
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
            ProcessBuilder pb = new ProcessBuilder("rpm", "-q", "vsftpd");
            pb.redirectErrorStream(true);
            Process process = pb.start();
            int exitCode = process.waitFor();
            return exitCode == 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    public VsftpdConfigRequest getCurrentConfig() {
        VsftpdConfigRequest config = new VsftpdConfigRequest();
        
        try {
            String result = scriptExecutor.execute(new String[]{"get_all"});
            
            if (result != null && !result.trim().isEmpty() && result.trim().startsWith("{")) {
                Map<String, Object> jsonMap = objectMapper.readValue(result, Map.class);
                
                config.setPort(jsonMap.get("port") != null ? Integer.parseInt(jsonMap.get("port").toString()) : null);
                config.setLocalRoot((String) jsonMap.get("local_root"));
                config.setPasvMinPort(jsonMap.get("pasv_min_port") != null ? Integer.parseInt(jsonMap.get("pasv_min_port").toString()) : null);
                config.setPasvMaxPort(jsonMap.get("pasv_max_port") != null ? Integer.parseInt(jsonMap.get("pasv_max_port").toString()) : null);
                config.setMaxClients(jsonMap.get("max_clients") != null ? Integer.parseInt(jsonMap.get("max_clients").toString()) : null);
                config.setMaxPerIp(jsonMap.get("max_per_ip") != null ? Integer.parseInt(jsonMap.get("max_per_ip").toString()) : null);
                config.setIdleSessionTimeout(jsonMap.get("idle_session_timeout") != null ? Integer.parseInt(jsonMap.get("idle_session_timeout").toString()) : null);
                config.setDataConnectionTimeout(jsonMap.get("data_connection_timeout") != null ? Integer.parseInt(jsonMap.get("data_connection_timeout").toString()) : null);
                config.setAnonymousEnable((Boolean) jsonMap.get("anonymous_enable"));
                config.setLocalEnable((Boolean) jsonMap.get("local_enable"));
                config.setWriteEnable((Boolean) jsonMap.get("write_enable"));
                config.setChrootLocalUser((Boolean) jsonMap.get("chroot_local_user"));
                config.setAllowWriteableChroot((Boolean) jsonMap.get("allow_writeable_chroot"));
                config.setUserlistEnable((Boolean) jsonMap.get("userlist_enable"));
                config.setSslEnable((Boolean) jsonMap.get("ssl_enable"));
                config.setPasvEnable((Boolean) jsonMap.get("pasv_enable"));
                config.setTcpWrappers((Boolean) jsonMap.get("tcp_wrappers"));
            }
        } catch (Exception e) {
            System.err.println("VSFTPD 설정 조회 실패: " + e.getMessage());
            e.printStackTrace();
        }
        
        return config;
    }
    
    public String restart() {
        try {
            String result = scriptExecutor.execute(new String[]{"apply"});
            return "VSFTPD 서비스 재시작: " + result;
        } catch (Exception e) {
            return "VSFTPD 서비스 재시작 실패: " + e.getMessage();
        }
    }
}

