package com.ensm.main.system;

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
public class CronService {
    
    public List<Map<String, String>> getCronJobs(String user) {
        try {
            ProcessBuilder pb = new ProcessBuilder("crontab", "-l", "-u", user);
            pb.redirectErrorStream(true);
            Process process = pb.start();
            
            List<Map<String, String>> jobs = new ArrayList<>();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                int index = 0;
                while ((line = reader.readLine()) != null) {
                    if (!line.trim().startsWith("#") && !line.trim().isEmpty()) {
                        Map<String, String> job = new HashMap<>();
                        job.put("id", String.valueOf(index++));
                        job.put("schedule", line);
                        jobs.add(job);
                    }
                }
            }
            
            process.waitFor();
            return jobs;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
    
    public String addCronJob(String user, String schedule, String command) {
        try {
            // 기존 crontab 가져오기
            ProcessBuilder getPb = new ProcessBuilder("crontab", "-l", "-u", user);
            Process getProcess = getPb.start();
            
            StringBuilder existing = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(getProcess.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    existing.append(line).append("\n");
                }
            }
            getProcess.waitFor();
            
            // 새 작업 추가
            String newJob = schedule + " " + command + "\n";
            String updated = existing.toString() + newJob;
            
            // 임시 파일에 쓰기
            ProcessBuilder writePb = new ProcessBuilder("sh", "-c", 
                "echo '" + updated.replace("'", "'\"'\"'") + "' | crontab -u " + user + " -");
            Process writeProcess = writePb.start();
            writeProcess.waitFor();
            
            return "CRON 작업이 추가되었습니다.";
        } catch (Exception e) {
            return "오류: " + e.getMessage();
        }
    }
    
    public String deleteCronJob(String user, int index) {
        try {
            List<Map<String, String>> jobs = getCronJobs(user);
            if (index < 0 || index >= jobs.size()) {
                return "유효하지 않은 인덱스입니다.";
            }
            
            jobs.remove(index);
            
            // 모든 작업 다시 쓰기
            StringBuilder updated = new StringBuilder();
            for (Map<String, String> job : jobs) {
                updated.append(job.get("schedule")).append("\n");
            }
            
            ProcessBuilder pb = new ProcessBuilder("sh", "-c", 
                "echo '" + updated.toString().replace("'", "'\"'\"'") + "' | crontab -u " + user + " -");
            Process process = pb.start();
            process.waitFor();
            
            return "CRON 작업이 삭제되었습니다.";
        } catch (Exception e) {
            return "오류: " + e.getMessage();
        }
    }
}

