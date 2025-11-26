package com.ensm.main.packages;

import lombok.Data;

@Data
public class PlexConfigRequest {
    private Integer port;
    private String dataDir;
    private String allowedNetworks;
    private Boolean enableRemoteAccess;
    private Boolean firewallEnabled;
    private Boolean apply;
}

