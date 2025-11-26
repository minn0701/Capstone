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
        // SystemConfig에서 스크립트 경로 가져오기
        String path = configStore.getConfig().getBindScriptPath();
        // 설정이 없으면 기본값 사용
        if (path == null || path.isEmpty()) {
            return "/usr/local/bin/ensm-scripts/bind/configure_bind.sh";
        }
        return path;
    }
    
    public String execute(String[] args) {
        List<String> cmd = new ArrayList<>();
        // setuid wrapper를 통해 실행
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
            
            // 프로세스 완료 대기
            int exitCode = process.waitFor();
            
            // 출력 읽기
            String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            
            // 에러가 있으면 표시
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

