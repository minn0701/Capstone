package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Apache 설정 스크립트 실행기
 * 로컬 또는 SSH를 통해 Apache 설정 스크립트를 실행합니다.
 */
@Component
@RequiredArgsConstructor
public class ApacheScriptExecutor {

    private final ApacheConfigProperties configProperties;

    /**
     * Apache 설정 스크립트를 실행합니다.
     * 
     * @param args 스크립트 실행 인자
     * @return 스크립트 실행 결과
     */
    public String execute(String[] args) {
        System.out.println("SSH enabled: " + configProperties.isSshEnabled());
        System.out.println("Script path: " + configProperties.getScriptPath());
        System.out.println("SSH host: " + configProperties.getSshHost());
        System.out.println("실행 명령어 배열: " + java.util.Arrays.toString(args));
        
        // 인자 유효성 검사
        for (String arg : args) {
            if (arg == null) {
                throw new IllegalArgumentException("명령어 배열에 null이 포함되어 있습니다.");
            }
        }
        
        // 명령어 구성
        List<String> cmd = new ArrayList<>();
        if (configProperties.isSshEnabled()) {
            // SSH를 통한 원격 실행
            cmd.add("sshpass");
            cmd.add("-p");
            cmd.add(configProperties.getSshPassword());
            cmd.add("ssh");
            cmd.add(configProperties.getSshUser() + "@" + configProperties.getSshHost());
            cmd.add("sudo");
            cmd.add(configProperties.getScriptPath());
        } else {
            // 로컬 실행
            cmd.add(configProperties.getScriptPath());
        }

        for (String arg : args) {
            cmd.add(arg);
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