package ensm.server2.packages;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "ensm.apache")
public class ApacheConfigProperties {
    private String scriptPath;
    private boolean sshEnabled;
    private String sshHost;
    private String sshUser;
    private String sshPassword;
}