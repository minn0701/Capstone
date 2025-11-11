package com.ensm.main.config;

import lombok.Data;
import java.util.Map;
import java.util.HashMap;

/**
 * ENSM 시스템 설정 정보
 * 파일 기반으로 저장되는 시스템 설정을 관리합니다.
 */
@Data
public class SystemConfig {
    // 로그 파일 경로
    private String authLogPath = "/var/log/auth/auth-app.log";
    private String mainLogPath = "/var/log/main/main-app.log";
    
    // Apache 설정
    private String apacheScriptPath = "/usr/local/bin/ensm/configure_apache.sh";
    private boolean apacheSshEnabled = false;
    private String apacheSshHost = "";
    private String apacheSshUser = "";
    private String apacheSshPassword = "";
    
    // 시스템 설정
    private String systemName = "ENSM";
    private String accessRange = "0.0.0.0/0";
    
    // Kibana 설정 (나중에 Prometheus + Grafana로 변경 예정)
    private String kibanaBaseUrl = "";
    
    // 기타 설정
    private Map<String, String> customSettings = new HashMap<>();
}

