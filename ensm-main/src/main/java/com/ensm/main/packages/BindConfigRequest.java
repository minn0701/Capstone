package com.ensm.main.packages;

import lombok.Data;

@Data
public class BindConfigRequest {
    private String listenOn;
    private String listenOnV6;
    private String forward;
    private String forwarders;
    private String allowQuery;
    private String allowTransfer;
    private String acl;
    private String zoneDomain;
    private String zoneType;
    private String zoneFile;
    private Boolean apply;
}

