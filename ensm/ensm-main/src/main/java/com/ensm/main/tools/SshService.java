package com.ensm.main.tools;

import com.ensm.main.config.SystemConfig;
import com.ensm.main.config.SystemConfigStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

/**
 * SSH 자동화 서비스
 */
@Service
@RequiredArgsConstructor
public class SshService {
    
    private final SystemConfigStore configStore;
    
    private String getScriptPath() {
        SystemConfig config = configStore.getConfig();
        String basePath = config.getEnsmScriptsBasePath();
        if (basePath == null || basePath.isEmpty()) {
            basePath = "/usr/local/bin/ensm-scripts";
        }
        return basePath + "/tools/ssh_automation.sh";
    }
    
    private String executeScript(String... args) {
        try {
            List<String> command = new ArrayList<>();
            // setuid wrapper를 통해 실행
            command.add("/usr/local/bin/ensm-scripts/system/run_script");
            command.add(getScriptPath());
            for (String arg : args) {
                if (arg != null) {
                    command.add(arg);
                }
            }
            
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process process = pb.start();
            
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            
            process.waitFor();
            return output.toString();
        } catch (Exception e) {
            return "오류: " + e.getMessage();
        }
    }
    
    public String generateKeyPair(String keyType, int keySize, String comment) {
        try {
            String result = executeScript("generate_key", keyType, String.valueOf(keySize), comment != null ? comment : "");
            if (result.contains("✅")) {
                // 결과에서 키 경로 추출
                String[] lines = result.split("\n");
                for (String line : lines) {
                    if (line.contains("SSH 키가 생성되었습니다:")) {
                        return line.replace("✅ ", "").trim();
                    }
                }
                return "SSH 키가 생성되었습니다.";
            } else {
                return result;
            }
        } catch (Exception e) {
            return "오류: " + e.getMessage();
        }
    }
    
    public String copyKey(String publicKeyPath, String user, String host, int port) {
        try {
            String result = executeScript("copy_key", publicKeyPath, user, host, String.valueOf(port));
            if (result.contains("✅")) {
                return "SSH 키가 복사되었습니다.";
            } else {
                return result;
            }
        } catch (Exception e) {
            return "오류: " + e.getMessage();
        }
    }
}

