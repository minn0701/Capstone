package com.ensm.main.packages;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Git 설정 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class GitConfigService {
    private final GitScriptExecutor scriptExecutor;
    private final ObjectMapper objectMapper;
    
    public String applyGitConfiguration(GitConfigRequest req) {
        List<String[]> commands = new ArrayList<>();
        
        if (req.getUserName() != null) {
            commands.add(new String[]{"set_user_name", req.getUserName()});
        }
        if (req.getUserEmail() != null) {
            commands.add(new String[]{"set_user_email", req.getUserEmail()});
        }
        if (req.getDefaultBranch() != null) {
            commands.add(new String[]{"set_default_branch", req.getDefaultBranch()});
        }
        if (req.getEditor() != null) {
            commands.add(new String[]{"set_editor", req.getEditor()});
        }
        if (req.getCoreAutocrlf() != null) {
            commands.add(new String[]{"set_core_autocrlf", req.getCoreAutocrlf()});
        }
        if (req.getPullRebase() != null) {
            commands.add(new String[]{"set_pull_rebase", req.getPullRebase() ? "true" : "false"});
        }
        if (req.getCredentialHelper() != null) {
            commands.add(new String[]{"set_credential_helper", req.getCredentialHelper()});
        }
        if (req.getHttpSslVerify() != null) {
            commands.add(new String[]{"set_http_ssl_verify", req.getHttpSslVerify() ? "true" : "false"});
        }
        if (req.getPushDefault() != null) {
            commands.add(new String[]{"set_push_default", req.getPushDefault()});
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
            ProcessBuilder pb = new ProcessBuilder("rpm", "-q", "git");
            pb.redirectErrorStream(true);
            Process process = pb.start();
            int exitCode = process.waitFor();
            return exitCode == 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    public GitConfigRequest getCurrentConfig() {
        GitConfigRequest config = new GitConfigRequest();
        
        try {
            String result = scriptExecutor.execute(new String[]{"get_all"});
            
            if (result != null && !result.trim().isEmpty() && result.trim().startsWith("{")) {
                Map<String, Object> jsonMap = objectMapper.readValue(result, Map.class);
                
                config.setUserName((String) jsonMap.get("userName"));
                config.setUserEmail((String) jsonMap.get("userEmail"));
                config.setDefaultBranch((String) jsonMap.get("defaultBranch"));
                config.setInitDefaultBranch((String) jsonMap.get("initDefaultBranch"));
                config.setEditor((String) jsonMap.get("editor"));
                config.setCoreAutocrlf((String) jsonMap.get("coreAutocrlf"));
                config.setPullRebase((Boolean) jsonMap.get("pullRebase"));
                config.setCredentialHelper((String) jsonMap.get("credentialHelper"));
                config.setHttpSslVerify((Boolean) jsonMap.get("httpSslVerify"));
                config.setPushDefault((String) jsonMap.get("pushDefault"));
            }
        } catch (Exception e) {
            System.err.println("Git 설정 조회 실패: " + e.getMessage());
            e.printStackTrace();
        }
        
        return config;
    }
    
    public String restart() {
        // Git은 재시작이 필요 없지만 일관성을 위해 제공
        return "Git 설정이 적용되었습니다. (재시작 불필요)";
    }
}

