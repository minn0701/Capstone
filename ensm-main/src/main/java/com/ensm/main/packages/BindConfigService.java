package com.ensm.main.packages;

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
}

