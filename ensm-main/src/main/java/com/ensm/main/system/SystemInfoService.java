package com.ensm.main.system;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 시스템 정보 조회 서비스
 */
@Service
public class SystemInfoService {
    
    public String executeCommand(String[] command) {
        try {
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
    
    public List<Map<String, String>> getDiskInfo() {
        String output = executeCommand(new String[]{"df", "-h"});
        List<Map<String, String>> disks = new ArrayList<>();
        
        String[] lines = output.split("\n");
        for (int i = 1; i < lines.length; i++) {
            String[] parts = lines[i].trim().split("\\s+");
            if (parts.length >= 6) {
                Map<String, String> disk = new HashMap<>();
                disk.put("filesystem", parts[0]);
                disk.put("size", parts[1]);
                disk.put("used", parts[2]);
                disk.put("avail", parts[3]);
                disk.put("usePercent", parts[4]);
                disk.put("mounted", parts[5]);
                disks.add(disk);
            }
        }
        return disks;
    }
    
    public String getRaidStatus() {
        return executeCommand(new String[]{"cat", "/proc/mdstat"});
    }
    
    public List<Map<String, String>> getNetworkInterfaces() {
        String output = executeCommand(new String[]{"ip", "addr", "show"});
        List<Map<String, String>> interfaces = new ArrayList<>();
        
        // 간단한 파싱 (실제로는 더 정교한 파싱 필요)
        String[] lines = output.split("\n");
        Map<String, String> current = null;
        for (String line : lines) {
            if (line.contains(":") && line.contains("<")) {
                if (current != null) {
                    interfaces.add(current);
                }
                current = new HashMap<>();
                String[] parts = line.split(":");
                if (parts.length > 1) {
                    current.put("name", parts[1].trim().split("\\s+")[0]);
                }
            } else if (line.contains("inet ") && current != null) {
                String[] parts = line.trim().split("\\s+");
                if (parts.length > 1) {
                    current.put("ip", parts[1].split("/")[0]);
                }
            }
        }
        if (current != null) {
            interfaces.add(current);
        }
        return interfaces;
    }
    
    public List<Map<String, String>> getOpenPorts() {
        String output = executeCommand(new String[]{"ss", "-tulpn"});
        List<Map<String, String>> ports = new ArrayList<>();
        
        String[] lines = output.split("\n");
        for (int i = 1; i < lines.length; i++) {
            String[] parts = lines[i].trim().split("\\s+");
            if (parts.length >= 5) {
                Map<String, String> port = new HashMap<>();
                port.put("netid", parts[0]);
                port.put("state", parts[1]);
                port.put("local", parts[4]);
                if (parts.length > 5) {
                    port.put("process", parts[parts.length - 1]);
                }
                ports.add(port);
            }
        }
        return ports;
    }
    
    public List<Map<String, String>> getRunningServices() {
        String output = executeCommand(new String[]{"systemctl", "list-units", "--type=service", "--state=running", "--no-pager"});
        List<Map<String, String>> services = new ArrayList<>();
        
        String[] lines = output.split("\n");
        for (int i = 1; i < lines.length - 2; i++) {
            String[] parts = lines[i].trim().split("\\s+");
            if (parts.length >= 4) {
                Map<String, String> service = new HashMap<>();
                service.put("name", parts[0]);
                service.put("loaded", parts[1]);
                service.put("active", parts[2]);
                service.put("sub", parts[3]);
                services.add(service);
            }
        }
        return services;
    }
}

