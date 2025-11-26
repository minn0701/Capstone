package com.ensm.main.util;

import com.ensm.main.config.SystemConfigStore;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 공통 스크립트 실행 유틸리티
 * 모든 스크립트 실행을 통합 관리합니다.
 */
@Component
@RequiredArgsConstructor
public class ScriptExecutor {
    
    private final SystemConfigStore configStore;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * 스크립트 기본 경로를 가져옵니다.
     */
    private String getBasePath() {
        String basePath = configStore.getConfig().getEnsmScriptsBasePath();
        if (basePath == null || basePath.isEmpty()) {
            basePath = "/usr/local/bin/ensm-scripts";
        }
        return basePath;
    }
    
    /**
     * run_script 경로를 가져옵니다.
     */
    private String getRunScriptPath() {
        String basePath = getBasePath();
        return basePath + "/system/run_script";
    }
    
    /**
     * 스크립트를 실행하고 결과를 문자열로 반환합니다.
     * 
     * @param scriptPath 스크립트 경로 (basePath 기준 상대 경로)
     * @param args 스크립트 인자
     * @return 스크립트 실행 결과
     */
    public String executeScript(String scriptPath, String... args) {
        try {
            String fullScriptPath = getBasePath() + "/" + scriptPath;
            java.io.File scriptFile = new java.io.File(fullScriptPath);
            
            // 스크립트 파일 존재 확인
            if (!scriptFile.exists()) {
                System.err.println("스크립트 파일을 찾을 수 없습니다: " + fullScriptPath);
                return "오류: 스크립트 파일을 찾을 수 없습니다: " + fullScriptPath;
            }
            
            // run_script wrapper 존재 확인
            String runScriptPath = getRunScriptPath();
            java.io.File runScript = new java.io.File(runScriptPath);
            if (!runScript.exists()) {
                System.err.println("run_script wrapper를 찾을 수 없습니다: " + runScriptPath);
                return "오류: run_script wrapper를 찾을 수 없습니다. RPM 설치 후 postinstall 스크립트가 실행되었는지 확인하세요.";
            }
            
            List<String> command = new ArrayList<>();
            command.add(runScriptPath);
            command.add(fullScriptPath);
            for (String arg : args) {
                if (arg != null && !arg.isEmpty()) {
                    command.add(arg);
                }
            }
            
            ProcessBuilder pb = new ProcessBuilder(command);
            // redirectErrorStream을 false로 설정하여 stdout과 stderr를 분리
            pb.redirectErrorStream(false);
            
            // 실행 명령어 로깅
            System.out.println("스크립트 실행: " + String.join(" ", command));
            
            Process process = pb.start();
            
            StringBuilder output = new StringBuilder();
            StringBuilder errorOutput = new StringBuilder();
            
            // 표준 출력과 표준 오류를 병렬로 읽기
            Thread stdoutThread = new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        output.append(line).append("\n");
                    }
                } catch (Exception e) {
                    System.err.println("표준 출력 읽기 오류: " + e.getMessage());
                }
            });
            
            Thread stderrThread = new Thread(() -> {
                try (BufferedReader errorReader = new BufferedReader(
                        new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = errorReader.readLine()) != null) {
                        errorOutput.append(line).append("\n");
                    }
                } catch (Exception e) {
                    System.err.println("표준 오류 읽기 오류: " + e.getMessage());
                }
            });
            
            stdoutThread.start();
            stderrThread.start();
            
            int exitCode = process.waitFor();
            
            // 스레드가 완료될 때까지 대기
            stdoutThread.join(5000); // 최대 5초 대기
            stderrThread.join(5000);
            
            String outputStr = output.toString().trim();
            String errorStr = errorOutput.toString().trim();
            
            // 디버깅을 위한 로깅
            System.out.println("스크립트 실행 완료 (" + scriptPath + "):");
            System.out.println("  종료 코드: " + exitCode);
            System.out.println("  표준 출력 길이: " + outputStr.length());
            if (!errorStr.isEmpty()) {
                System.out.println("  표준 오류: " + errorStr);
            }
            // 출력 내용 로깅 (오류가 있거나 출력이 짧은 경우)
            if (exitCode != 0 || (outputStr.length() > 0 && outputStr.length() < 1000)) {
                if (outputStr.length() > 0) {
                    System.out.println("  출력 내용: " + outputStr);
                }
            }
            
            // 오류 출력이 있으면 로그에 기록
            if (!errorStr.isEmpty()) {
                System.err.println("스크립트 오류 출력 (" + scriptPath + "): " + errorStr);
            }
            
            // 종료 코드 확인
            if (exitCode != 0) {
                String errorMsg = "스크립트 실행 실패 (종료 코드: " + exitCode + "): " + scriptPath;
                if (!errorStr.isEmpty()) {
                    errorMsg += "\n표준 오류 출력:\n" + errorStr;
                }
                if (!outputStr.isEmpty()) {
                    errorMsg += "\n표준 출력:\n" + outputStr;
                }
                if (outputStr.isEmpty() && errorStr.isEmpty()) {
                    errorMsg += "\n출력이 없습니다. 스크립트가 실행되지 않았거나 권한 문제일 수 있습니다.";
                }
                System.err.println(errorMsg);
                // 오류 메시지에 stderr 내용 포함
                String fullError = errorStr.isEmpty() ? outputStr : errorStr;
                if (!fullError.isEmpty()) {
                    return "오류: " + fullError;
                }
                return "오류: " + errorMsg;
            }
            
            // 출력이 비어있으면 경고
            if (outputStr.isEmpty()) {
                System.err.println("경고: 스크립트 출력이 비어있습니다 (" + scriptPath + ")");
                // 빈 출력도 반환 (스크립트가 정상적으로 빈 결과를 반환한 경우일 수 있음)
            }
            
            return outputStr;
        } catch (Exception e) {
            System.err.println("스크립트 실행 중 예외 발생 (" + scriptPath + "): " + e.getMessage());
            e.printStackTrace();
            return "오류: 스크립트 실행 중 예외 발생: " + e.getMessage();
        }
    }
    
    /**
     * 스크립트를 실행하고 JSON 결과를 파싱하여 반환합니다.
     * 
     * @param scriptPath 스크립트 경로
     * @param args 스크립트 인자
     * @return 파싱된 JSON 객체 (List 또는 Map)
     */
    public Object executeScriptJson(String scriptPath, String... args) {
        String output = executeScript(scriptPath, args);
        try {
            // JSON 배열인지 객체인지 확인
            output = output.trim();
            
            // 오류 메시지인 경우 빈 리스트 반환
            if (output.startsWith("오류:") || output.startsWith("error:") || output.startsWith("Error:")) {
                System.err.println("스크립트 실행 오류 (" + scriptPath + "): " + output);
                return new ArrayList<>();
            }
            
            if (output.isEmpty()) {
                return new ArrayList<>();
            }
            
            if (output.startsWith("[")) {
                return objectMapper.readValue(output, new TypeReference<List<Map<String, Object>>>() {});
            } else if (output.startsWith("{")) {
                return objectMapper.readValue(output, new TypeReference<Map<String, Object>>() {});
            } else {
                // JSON이 아닌 경우 빈 리스트 반환
                System.err.println("JSON 형식이 아닌 출력 (" + scriptPath + "): " + output);
                return new ArrayList<>();
            }
        } catch (Exception e) {
            // JSON 파싱 실패 시 빈 리스트 반환
            System.err.println("JSON 파싱 실패 (" + scriptPath + "): " + e.getMessage());
            System.err.println("출력: " + output);
            return new ArrayList<>();
        }
    }
    
    /**
     * 스크립트를 실행하고 JSON 배열을 반환합니다.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> executeScriptJsonArray(String scriptPath, String... args) {
        Object result = executeScriptJson(scriptPath, args);
        if (result instanceof List) {
            return (List<Map<String, Object>>) result;
        }
        return new ArrayList<>();
    }
    
    /**
     * 스크립트를 실행하고 JSON 객체를 반환합니다.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> executeScriptJsonObject(String scriptPath, String... args) {
        Object result = executeScriptJson(scriptPath, args);
        if (result instanceof Map) {
            return (Map<String, Object>) result;
        }
        return Map.of();
    }
}

