package com.ensm.main.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Apache 서버 설정 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class ApacheConfigService {

    private final ApacheScriptExecutor scriptExecutor;
    private final PackageManagementService packageManagementService;

    /**
     * Apache 서버 설정을 적용합니다.
     * 
     * @param req Apache 설정 요청 정보
     * @return 설정 적용 결과 로그
     */
    public String applyApacheConfiguration(ApacheConfigRequest req) {

        List<String[]> commands = new ArrayList<>();

        if (req.getPort() != null) {
            String[] cmd = new String[]{"set_port", req.getPort().toString()};
            System.out.println("명령어: " + java.util.Arrays.toString(cmd));
            commands.add(cmd);
        }
        if (req.getServerName() != null) {
            String[] cmd = new String[]{"set_servername", req.getServerName()};
            System.out.println("명령어: " + java.util.Arrays.toString(cmd));
            commands.add(cmd);
        }
        if (req.getDocumentRoot() != null) {
            String[] cmd = new String[]{"set_docroot", req.getDocumentRoot()};
            System.out.println("명령어: " + java.util.Arrays.toString(cmd));
            commands.add(cmd);
        }
        if (req.getUser() != null) {
            String[] cmd = new String[]{"set_user", req.getUser()};
            System.out.println("명령어: " + java.util.Arrays.toString(cmd));
            commands.add(cmd);
        }
        if (req.getGroup() != null) {
            String[] cmd = new String[]{"set_group", req.getGroup()};
            System.out.println("명령어: " + java.util.Arrays.toString(cmd));
            commands.add(cmd);
        }
        if (Boolean.TRUE.equals(req.getApply())) {
            String[] cmd = new String[]{"apply"};
            System.out.println("명령어: " + java.util.Arrays.toString(cmd));
            commands.add(cmd);
        }

        StringBuilder log = new StringBuilder();
        for (String[] cmd : commands) {
            // 이미 위에서 로그 출력했으니 중복 출력 방지, 필요하다면 여기도 남겨둘 수 있음!
            log.append(String.join(" ", cmd)).append("\n")
                    .append(scriptExecutor.execute(cmd)).append("\n\n");
        }

        return log.toString();
    }
    
    /**
     * Apache 패키지가 설치되어 있는지 확인합니다.
     *
     * @return 설치 여부
     */
    public boolean isInstalled() {
        try {
            ProcessBuilder pb = new ProcessBuilder("rpm", "-q", "httpd");
            pb.redirectErrorStream(true);
            Process process = pb.start();
            int exitCode = process.waitFor();
            return exitCode == 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * 현재 Apache 설정을 조회합니다.
     *
     * @return 현재 Apache 설정
     */
    public ApacheConfigRequest getCurrentConfig() {
        ApacheConfigRequest config = new ApacheConfigRequest();
        
        try {
            // get_all 명령으로 모든 설정을 JSON으로 받기
            String result = scriptExecutor.execute(new String[]{"get_all"});
            
            // JSON 파싱
            if (result != null && !result.trim().isEmpty() && result.trim().startsWith("{")) {
                // 간단한 JSON 파싱 (실제로는 Jackson 등을 사용하는 것이 좋지만, 여기서는 간단하게)
                String json = result.trim();
                
                // port 추출
                int portIndex = json.indexOf("\"port\"");
                if (portIndex >= 0) {
                    int colonIndex = json.indexOf(":", portIndex);
                    int startIndex = json.indexOf("\"", colonIndex) + 1;
                    int endIndex = json.indexOf("\"", startIndex);
                    if (startIndex > 0 && endIndex > startIndex) {
                        String portStr = json.substring(startIndex, endIndex);
                        if (!portStr.isEmpty()) {
                            try {
                                config.setPort(Integer.parseInt(portStr));
                            } catch (NumberFormatException e) {
                                // 무시
                            }
                        }
                    }
                }
                
                // serverName 추출
                int serverNameIndex = json.indexOf("\"serverName\"");
                if (serverNameIndex >= 0) {
                    int colonIndex = json.indexOf(":", serverNameIndex);
                    int startIndex = json.indexOf("\"", colonIndex) + 1;
                    int endIndex = json.indexOf("\"", startIndex);
                    if (startIndex > 0 && endIndex > startIndex) {
                        String serverName = json.substring(startIndex, endIndex);
                        if (!serverName.isEmpty()) {
                            config.setServerName(serverName);
                        }
                    }
                }
                
                // documentRoot 추출
                int docRootIndex = json.indexOf("\"documentRoot\"");
                if (docRootIndex >= 0) {
                    int colonIndex = json.indexOf(":", docRootIndex);
                    int startIndex = json.indexOf("\"", colonIndex) + 1;
                    int endIndex = json.indexOf("\"", startIndex);
                    if (startIndex > 0 && endIndex > startIndex) {
                        String docRoot = json.substring(startIndex, endIndex);
                        if (!docRoot.isEmpty()) {
                            config.setDocumentRoot(docRoot);
                        }
                    }
                }
                
                // user 추출
                int userIndex = json.indexOf("\"user\"");
                if (userIndex >= 0) {
                    int colonIndex = json.indexOf(":", userIndex);
                    int startIndex = json.indexOf("\"", colonIndex) + 1;
                    int endIndex = json.indexOf("\"", startIndex);
                    if (startIndex > 0 && endIndex > startIndex) {
                        String user = json.substring(startIndex, endIndex);
                        if (!user.isEmpty()) {
                            config.setUser(user);
                        }
                    }
                }
                
                // group 추출
                int groupIndex = json.indexOf("\"group\"");
                if (groupIndex >= 0) {
                    int colonIndex = json.indexOf(":", groupIndex);
                    int startIndex = json.indexOf("\"", colonIndex) + 1;
                    int endIndex = json.indexOf("\"", startIndex);
                    if (startIndex > 0 && endIndex > startIndex) {
                        String group = json.substring(startIndex, endIndex);
                        if (!group.isEmpty()) {
                            config.setGroup(group);
                        }
                    }
                }
            }
        } catch (Exception e) {
            // 오류 발생 시 빈 설정 반환
            System.err.println("Apache 설정 조회 실패: " + e.getMessage());
            e.printStackTrace();
        }
        
        return config;
    }
    
    /**
     * Apache 패키지를 설치합니다.
     * 
     * @return 설치 결과 메시지
     */
    public String install() {
        try {
            // PackageManagementService를 통해 패키지 설치 (run_script.c 사용)
            String result = packageManagementService.installPackage("apache");
            
            // 설치 확인
            if (!isInstalled()) {
                return "Apache 설치 후 확인 실패. 패키지가 설치되지 않았습니다.\n" + result;
            }
            
            // 서비스 자동 시작 활성화
            String autostartResult = packageManagementService.toggleAutostart("apache", true);
            
            return "Apache가 성공적으로 설치되고 서비스가 시작되었습니다.\n" + result + "\n" + autostartResult;
        } catch (Exception e) {
            return "Apache 설치 중 오류 발생: " + e.getMessage();
        }
    }
    
    /**
     * Apache 서비스를 재시작합니다.
     * 
     * @return 재시작 결과 메시지
     */
    public String restart() {
        try {
            ProcessBuilder pb = new ProcessBuilder("systemctl", "restart", "httpd");
            pb.redirectErrorStream(true);
            Process process = pb.start();
            
            StringBuilder output = new StringBuilder();
            try (java.io.BufferedReader reader = new java.io.BufferedReader(
                    new java.io.InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                return "Apache 재시작 실패 (exit code: " + exitCode + "): " + output.toString();
            }
            
            return "Apache 서비스가 재시작되었습니다.";
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return "Apache 재시작 중 중단되었습니다: " + e.getMessage();
        } catch (Exception e) {
            return "Apache 재시작 중 오류 발생: " + e.getMessage();
        }
    }
}