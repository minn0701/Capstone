package com.ensm.main.packages;

import lombok.Data;

@Data
public class VsftpdConfigRequest {
    private Integer port;
    private String localRoot;
    private Integer pasvMinPort;
    private Integer pasvMaxPort;
    private Integer maxClients;
    private Integer maxPerIp;
    private Integer idleSessionTimeout;
    private Integer dataConnectionTimeout;
    private Boolean anonymousEnable;
    private Boolean localEnable;
    private Boolean writeEnable;
    private Boolean chrootLocalUser;
    private Boolean allowWriteableChroot;
    private Boolean userlistEnable;
    private Boolean sslEnable;
    private Boolean pasvEnable;
    private Boolean tcpWrappers;
    private Boolean firewallEnabled;
    private Boolean apply;
}

