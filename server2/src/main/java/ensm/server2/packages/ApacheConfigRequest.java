package ensm.server2.packages;

import lombok.Data;

@Data
public class ApacheConfigRequest {
    private Integer port;
    private String serverName;
    private String documentRoot;
    private String user;
    private String group;
    private Boolean apply;
}