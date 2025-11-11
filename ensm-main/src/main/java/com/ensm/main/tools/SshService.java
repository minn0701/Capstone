package com.ensm.main.tools;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

/**
 * SSH 자동화 서비스
 */
@Service
public class SshService {
    
    public String generateKeyPair(String keyType, int keySize, String comment) {
        try {
            String keyName = "id_" + keyType + "_" + System.currentTimeMillis();
            ProcessBuilder pb = new ProcessBuilder("ssh-keygen", 
                "-t", keyType,
                "-b", String.valueOf(keySize),
                "-f", "/tmp/" + keyName,
                "-N", "",
                "-C", comment);
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
            return "SSH 키가 생성되었습니다: /tmp/" + keyName;
        } catch (Exception e) {
            return "오류: " + e.getMessage();
        }
    }
    
    public String copyKey(String publicKeyPath, String user, String host, int port) {
        try {
            ProcessBuilder pb = new ProcessBuilder("ssh-copy-id",
                "-p", String.valueOf(port),
                user + "@" + host);
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
            return "SSH 키가 복사되었습니다.";
        } catch (Exception e) {
            return "오류: " + e.getMessage();
        }
    }
}

