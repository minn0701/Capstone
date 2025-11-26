package com.ensm.main.packages;

import lombok.Data;

@Data
public class HomeAssistantConfigRequest {
    private Integer port;
    private String configDir;
    private String timezone;
    private Double latitude;
    private Double longitude;
    private Integer elevation;
    private String unitSystem;
    private Boolean firewallEnabled;
    private Boolean apply;
}

