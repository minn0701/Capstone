package com.ensm.main.packages;

import lombok.Data;

@Data
public class NfsConfigRequest {
    private Integer port;
    private String exports;
    private Integer rpcbindPort;
    private Integer mountdPort;
    private Integer statdPort;
    private Integer lockdPort;
    private Boolean firewallEnabled;
    private Boolean apply;
}

