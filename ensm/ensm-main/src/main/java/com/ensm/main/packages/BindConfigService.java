package com.ensm.main.packages;

import com.ensm.main.util.ScriptExecutor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * BIND DNS 서버 설정 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class BindConfigService {
    private final BindScriptExecutor scriptExecutor;
    private final PackageManagementService packageManagementService;
    
    public String applyBindConfiguration(BindConfigRequest req) {
        List<String[]> commands = new ArrayList<>();
        
        if (req.getListenOn() != null) {
            commands.add(new String[]{"set_listen_on", req.getListenOn()});
        }
        if (req.getListenOnV6() != null) {
            commands.add(new String[]{"set_listen_on_v6", req.getListenOnV6()});
        }
        if (req.getForward() != null) {
            commands.add(new String[]{"set_forward", req.getForward()});
        }
        if (req.getForwarders() != null) {
            commands.add(new String[]{"set_forwarders", req.getForwarders()});
        }
        if (req.getAllowQuery() != null) {
            commands.add(new String[]{"set_allow_query", req.getAllowQuery()});
        }
        if (req.getAllowTransfer() != null) {
            commands.add(new String[]{"set_allow_transfer", req.getAllowTransfer()});
        }
        if (req.getAcl() != null) {
            commands.add(new String[]{"set_acl", req.getAcl()});
        }
        if (req.getZoneDomain() != null && req.getZoneType() != null && req.getZoneFile() != null) {
            commands.add(new String[]{"set_zone", req.getZoneDomain(), req.getZoneType(), req.getZoneFile()});
        }
        if (Boolean.TRUE.equals(req.getApply())) {
            commands.add(new String[]{"apply"});
        }
        
        StringBuilder log = new StringBuilder();
        for (String[] cmd : commands) {
            log.append(String.join(" ", cmd)).append("\n")
                    .append(scriptExecutor.execute(cmd)).append("\n\n");
        }
        
        return log.toString();
    }
    
    /**
     * BIND 패키지가 설치되어 있는지 확인합니다.
     *
     * @return 설치 여부
     */
    public boolean isInstalled() {
        try {
            ProcessBuilder pb = new ProcessBuilder("rpm", "-q", "bind");
            pb.redirectErrorStream(true);
            Process process = pb.start();
            int exitCode = process.waitFor();
            return exitCode == 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * 현재 BIND 설정을 조회합니다.
     *
     * @return 현재 BIND 설정
     */
    public BindConfigRequest getCurrentConfig() {
        BindConfigRequest config = new BindConfigRequest();
        
        try {
            // get_all 명령으로 모든 설정을 JSON으로 받기
            String result = scriptExecutor.execute(new String[]{"get_all"});
            
            // JSON 파싱
            if (result != null && !result.trim().isEmpty() && result.trim().startsWith("{")) {
                String json = result.trim();
                
                // listenOn 추출
                int listenOnIndex = json.indexOf("\"listenOn\"");
                if (listenOnIndex >= 0) {
                    int colonIndex = json.indexOf(":", listenOnIndex);
                    int startIndex = json.indexOf("\"", colonIndex) + 1;
                    int endIndex = json.indexOf("\"", startIndex);
                    if (startIndex > 0 && endIndex > startIndex) {
                        String listenOn = json.substring(startIndex, endIndex);
                        if (!listenOn.isEmpty()) {
                            config.setListenOn(listenOn);
                        }
                    }
                }
                
                // listenOnV6 추출
                int listenOnV6Index = json.indexOf("\"listenOnV6\"");
                if (listenOnV6Index >= 0) {
                    int colonIndex = json.indexOf(":", listenOnV6Index);
                    int startIndex = json.indexOf("\"", colonIndex) + 1;
                    int endIndex = json.indexOf("\"", startIndex);
                    if (startIndex > 0 && endIndex > startIndex) {
                        String listenOnV6 = json.substring(startIndex, endIndex);
                        if (!listenOnV6.isEmpty()) {
                            config.setListenOnV6(listenOnV6);
                        }
                    }
                }
                
                // forward 추출
                int forwardIndex = json.indexOf("\"forward\"");
                if (forwardIndex >= 0) {
                    int colonIndex = json.indexOf(":", forwardIndex);
                    int startIndex = json.indexOf("\"", colonIndex) + 1;
                    int endIndex = json.indexOf("\"", startIndex);
                    if (startIndex > 0 && endIndex > startIndex) {
                        String forward = json.substring(startIndex, endIndex);
                        if (!forward.isEmpty()) {
                            config.setForward(forward);
                        }
                    }
                }
                
                // forwarders 추출
                int forwardersIndex = json.indexOf("\"forwarders\"");
                if (forwardersIndex >= 0) {
                    int colonIndex = json.indexOf(":", forwardersIndex);
                    int startIndex = json.indexOf("\"", colonIndex) + 1;
                    int endIndex = json.indexOf("\"", startIndex);
                    if (startIndex > 0 && endIndex > startIndex) {
                        String forwarders = json.substring(startIndex, endIndex);
                        if (!forwarders.isEmpty()) {
                            config.setForwarders(forwarders);
                        }
                    }
                }
                
                // allowQuery 추출
                int allowQueryIndex = json.indexOf("\"allowQuery\"");
                if (allowQueryIndex >= 0) {
                    int colonIndex = json.indexOf(":", allowQueryIndex);
                    int startIndex = json.indexOf("\"", colonIndex) + 1;
                    int endIndex = json.indexOf("\"", startIndex);
                    if (startIndex > 0 && endIndex > startIndex) {
                        String allowQuery = json.substring(startIndex, endIndex);
                        if (!allowQuery.isEmpty()) {
                            config.setAllowQuery(allowQuery);
                        }
                    }
                }
                
                // allowTransfer 추출
                int allowTransferIndex = json.indexOf("\"allowTransfer\"");
                if (allowTransferIndex >= 0) {
                    int colonIndex = json.indexOf(":", allowTransferIndex);
                    int startIndex = json.indexOf("\"", colonIndex) + 1;
                    int endIndex = json.indexOf("\"", startIndex);
                    if (startIndex > 0 && endIndex > startIndex) {
                        String allowTransfer = json.substring(startIndex, endIndex);
                        if (!allowTransfer.isEmpty()) {
                            config.setAllowTransfer(allowTransfer);
                        }
                    }
                }
                
                // acl 추출
                int aclIndex = json.indexOf("\"acl\"");
                if (aclIndex >= 0) {
                    int colonIndex = json.indexOf(":", aclIndex);
                    int startIndex = json.indexOf("\"", colonIndex) + 1;
                    int endIndex = json.indexOf("\"", startIndex);
                    if (startIndex > 0 && endIndex > startIndex) {
                        String acl = json.substring(startIndex, endIndex);
                        if (!acl.isEmpty()) {
                            config.setAcl(acl);
                        }
                    }
                }
            }
        } catch (Exception e) {
            // 오류 발생 시 빈 설정 반환
            System.err.println("BIND 설정 조회 실패: " + e.getMessage());
            e.printStackTrace();
        }
        
        return config;
    }
    
    /**
     * BIND 패키지를 설치합니다.
     * 
     * @return 설치 결과 메시지
     */
    public String install() {
        try {
            // PackageManagementService를 통해 패키지 설치 (run_script.c 사용)
            String result = packageManagementService.installPackage("bind");
            
            // 설치 확인
            if (!isInstalled()) {
                return "BIND 설치 후 확인 실패. 패키지가 설치되지 않았습니다.\n" + result;
            }
            
            // 서비스 자동 시작 활성화
            String autostartResult = packageManagementService.toggleAutostart("bind", true);
            
            return "BIND가 성공적으로 설치되고 서비스가 시작되었습니다.\n" + result + "\n" + autostartResult;
        } catch (Exception e) {
            return "BIND 설치 중 오류 발생: " + e.getMessage();
        }
    }
    
    /**
     * BIND 서비스를 재시작합니다.
     * 
     * @return 재시작 결과 메시지
     */
    public String restart() {
        try {
            ProcessBuilder pb = new ProcessBuilder("systemctl", "restart", "named");
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
                return "BIND 재시작 실패 (exit code: " + exitCode + "): " + output.toString();
            }
            
            return "BIND 서비스가 재시작되었습니다.";
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return "BIND 재시작 중 중단되었습니다: " + e.getMessage();
        } catch (Exception e) {
            return "BIND 재시작 중 오류 발생: " + e.getMessage();
        }
    }
}

