package com.ensm.main.packages;

import lombok.Data;

@Data
public class JellyfinConfigRequest {
    private Integer port;
    private String dataDir;
    private String cacheDir;
    private String logDir;
    private Boolean enableHttps;
    private Integer httpsPort;
    private Boolean firewallEnabled;
    private Boolean apply;
}

