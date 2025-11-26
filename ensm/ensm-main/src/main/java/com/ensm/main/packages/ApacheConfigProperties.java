package com.ensm.main.packages;

import com.ensm.main.config.SystemConfig;
import com.ensm.main.config.SystemConfigStore;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Apache 설정 속성
 * SystemConfigStore에서 설정을 읽어옵니다.
 */
@Data
@Component
@RequiredArgsConstructor
public class ApacheConfigProperties {
    private final SystemConfigStore configStore;
    
    public String getScriptPath() {
        return configStore.getConfig().getApacheScriptPath();
    }
    
    public boolean isSshEnabled() {
        return configStore.getConfig().isApacheSshEnabled();
    }
    
    public String getSshHost() {
        return configStore.getConfig().getApacheSshHost();
    }
    
    public String getSshUser() {
        return configStore.getConfig().getApacheSshUser();
    }
    
    public String getSshPassword() {
        return configStore.getConfig().getApacheSshPassword();
    }
}