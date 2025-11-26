package com.ensm.main.packages;

import lombok.Data;

@Data
public class DockerConfigRequest {
    private String dataRoot;
    private String logDriver;
    private String maxLogSize;
    private String logOptMaxFile;
    private String storageDriver;
    private String dns;
    private String defaultAddressPool;
    private Boolean liveRestore;
    private Boolean userlandProxy;
    private Boolean ipv6;
    private Boolean apply;
}

