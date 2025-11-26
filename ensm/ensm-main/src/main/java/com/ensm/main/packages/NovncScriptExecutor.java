package com.ensm.main.packages;

import com.ensm.main.config.SystemConfigStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * noVNC 설정 스크립트 실행기
 */
@Component
@RequiredArgsConstructor
public class NovncScriptExecutor {
    private final SystemConfigStore configStore;
    
    private String getScriptPath() {
        String basePath = configStore.getConfig().getEnsmScriptsBasePath();
        if (basePath == null || basePath.isEmpty()) {
            basePath = "/usr/local/bin/ensm-scripts";
        }
        return basePath + "/novnc/configure_novnc.sh";
    }
    
    public String execute(String[] args) {
        List<String> cmd = new ArrayList<>();
        cmd.add("/usr/local/bin/ensm-scripts/system/run_script");
        cmd.add(getScriptPath());
        
        for (String arg : args) {
            if (arg != null) {
                cmd.add(arg);
            }
        }
        
        try {
            ProcessBuilder pb = new ProcessBuilder(cmd);
            pb.redirectErrorStream(true);
            Process process = pb.start();
            
            int exitCode = process.waitFor();
            String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            
            if (exitCode != 0 && output.isEmpty()) {
                return "[오류] 명령 실행 실패 (exit code: " + exitCode + ")";
            }
            
            return output;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return "[오류] 명령 실행 중단: " + e.getMessage();
        } catch (IOException e) {
            return "[오류] 명령 실행 실패: " + e.getMessage();
        }
    }
}

