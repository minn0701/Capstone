package com.ensm.main.system;

import com.ensm.main.config.SystemConfig;
import com.ensm.main.config.SystemConfigStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CRON 작업 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class CronService {
    
    private final SystemConfigStore configStore;
    
    private String getScriptPath() {
        SystemConfig config = configStore.getConfig();
        String basePath = config.getEnsmScriptsBasePath();
        if (basePath == null || basePath.isEmpty()) {
            basePath = "/usr/local/bin/ensm-scripts";
        }
        return basePath + "/system/manage_cron.sh";
    }
    
    private String executeScript(String... args) {
        try {
            String scriptPath = getScriptPath();
            java.io.File scriptFile = new java.io.File(scriptPath);
            
            // 스크립트 파일 존재 확인
            if (!scriptFile.exists()) {
                return "❌ 스크립트 파일을 찾을 수 없습니다: " + scriptPath;
            }
            
            // run_script wrapper 존재 확인
            java.io.File runScript = new java.io.File("/usr/local/bin/ensm-scripts/system/run_script");
            if (!runScript.exists()) {
                return "❌ run_script wrapper를 찾을 수 없습니다. RPM 설치 후 postinstall 스크립트가 실행되었는지 확인하세요.";
            }
            
            List<String> command = new ArrayList<>();
            // setuid wrapper를 통해 실행
            command.add("/usr/local/bin/ensm-scripts/system/run_script");
            command.add(scriptPath);
            for (String arg : args) {
                command.add(arg);
            }
            
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process process = pb.start();
            
            StringBuilder output = new StringBuilder();
            StringBuilder errorOutput = new StringBuilder();
            
            // 표준 출력 읽기
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            
            // 표준 오류 읽기 (별도 스레드로)
            try (BufferedReader errorReader = new BufferedReader(
                    new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = errorReader.readLine()) != null) {
                    errorOutput.append(line).append("\n");
                }
            }
            
            int exitCode = process.waitFor();
            
            // 오류 출력이 있으면 추가
            if (errorOutput.length() > 0) {
                output.append("오류 출력: ").append(errorOutput.toString());
            }
            
            // 종료 코드 확인
            if (exitCode != 0) {
                return "❌ 스크립트 실행 실패 (종료 코드: " + exitCode + ")\n" + output.toString();
            }
            
            String result = output.toString().trim();
            if (result.isEmpty()) {
                return "❌ 스크립트가 출력을 반환하지 않았습니다.";
            }
            
            return result;
        } catch (Exception e) {
            System.err.println("스크립트 실행 중 예외 발생: " + e.getMessage());
            e.printStackTrace();
            return "❌ 스크립트 실행 중 오류: " + e.getMessage();
        }
    }
    
    public List<Map<String, String>> getCronJobs(String user) {
        try {
            String output = executeScript("list_jobs", user);
            List<Map<String, String>> jobs = new ArrayList<>();
            
            String[] lines = output.split("\n");
            int index = 0;
            for (String line : lines) {
                if (!line.trim().startsWith("#") && !line.trim().isEmpty() && !line.contains("❌")) {
                    Map<String, String> job = new HashMap<>();
                    job.put("id", String.valueOf(index++));
                    job.put("schedule", line);
                    jobs.add(job);
                }
            }
            
            return jobs;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
    
    public String addCronJob(String user, String schedule, String command) {
        try {
            String result = executeScript("add_job", user, schedule, command);
            if (result.contains("✅")) {
                return "CRON 작업이 추가되었습니다.";
            } else {
                return result;
            }
        } catch (Exception e) {
            return "오류: " + e.getMessage();
        }
    }
    
    public String deleteCronJob(String user, int index) {
        try {
            String result = executeScript("delete_job", user, String.valueOf(index));
            if (result.contains("✅")) {
                return "CRON 작업이 삭제되었습니다.";
            } else {
                return result;
            }
        } catch (Exception e) {
            return "오류: " + e.getMessage();
        }
    }
}

