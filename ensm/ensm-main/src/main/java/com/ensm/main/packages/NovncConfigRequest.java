package com.ensm.main.packages;

import lombok.Data;

@Data
public class NovncConfigRequest {
    private Integer port;
    private Integer websocketPort;
    private String vncHost;
    private Integer vncPort;
    private String password;
    private Boolean enableSSL;
    private Boolean firewallEnabled;
    private Boolean apply;
}

