package com.ensm.main.packages;

import com.ensm.main.config.SystemConfig;
import com.ensm.main.config.SystemConfigStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * BIND DNS 설정 스크립트 실행기
 */
@Component
@RequiredArgsConstructor
public class BindScriptExecutor {
    private final SystemConfigStore configStore;
    
    private String getScriptPath() {
        // 기본 스크립트 경로 (설정에서 가져올 수 있음)
        return "/usr/local/bin/ensm/configure_bind.sh";
    }
    
    public String execute(String[] args) {
        List<String> cmd = new ArrayList<>();
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
            return new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            return "[오류] 명령 실행 실패: " + e.getMessage();
        }
    }
}

