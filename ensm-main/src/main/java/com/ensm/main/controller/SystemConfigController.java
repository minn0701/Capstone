package com.ensm.main.controller;

import com.ensm.main.config.SystemConfig;
import com.ensm.main.config.SystemConfigStore;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 시스템 설정 API 컨트롤러
 */
@RestController
@RequestMapping("/main/api/system-config")
@RequiredArgsConstructor
public class SystemConfigController {
    private final SystemConfigStore configStore;
    
    /**
     * 현재 시스템 설정을 조회합니다.
     */
    @GetMapping
    public ResponseEntity<SystemConfig> getConfig() {
        return ResponseEntity.ok(configStore.getConfig());
    }
    
    /**
     * 시스템 설정을 업데이트합니다.
     */
    @PutMapping
    public ResponseEntity<Map<String, String>> updateConfig(@RequestBody SystemConfig newConfig) {
        SystemConfig currentConfig = configStore.getConfig();
        
        // 설정 업데이트
        if (newConfig.getAuthLogPath() != null) {
            currentConfig.setAuthLogPath(newConfig.getAuthLogPath());
        }
        if (newConfig.getMainLogPath() != null) {
            currentConfig.setMainLogPath(newConfig.getMainLogPath());
        }
        if (newConfig.getApacheScriptPath() != null) {
            currentConfig.setApacheScriptPath(newConfig.getApacheScriptPath());
        }
        currentConfig.setApacheSshEnabled(newConfig.isApacheSshEnabled());
        if (newConfig.getApacheSshHost() != null) {
            currentConfig.setApacheSshHost(newConfig.getApacheSshHost());
        }
        if (newConfig.getApacheSshUser() != null) {
            currentConfig.setApacheSshUser(newConfig.getApacheSshUser());
        }
        if (newConfig.getApacheSshPassword() != null) {
            currentConfig.setApacheSshPassword(newConfig.getApacheSshPassword());
        }
        if (newConfig.getEnsmScriptsBasePath() != null) {
            currentConfig.setEnsmScriptsBasePath(newConfig.getEnsmScriptsBasePath());
        }
        if (newConfig.getBindScriptPath() != null) {
            currentConfig.setBindScriptPath(newConfig.getBindScriptPath());
        }
        if (newConfig.getSystemName() != null) {
            currentConfig.setSystemName(newConfig.getSystemName());
        }
        if (newConfig.getAccessRange() != null) {
            currentConfig.setAccessRange(newConfig.getAccessRange());
        }
        if (newConfig.getKibanaBaseUrl() != null) {
            currentConfig.setKibanaBaseUrl(newConfig.getKibanaBaseUrl());
        }
        if (newConfig.getCustomSettings() != null) {
            currentConfig.setCustomSettings(newConfig.getCustomSettings());
        }
        
        configStore.saveConfig();
        
        return ResponseEntity.ok(Map.of("message", "설정이 저장되었습니다."));
    }
}

