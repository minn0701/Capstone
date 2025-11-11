package com.ensm.main.config;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.DumperOptions;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.representer.Representer;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

/**
 * 시스템 설정 저장소
 * YAML 파일에서 시스템 설정을 로드하고 저장합니다.
 */
@Component
public class SystemConfigStore {
    private static final String CONFIG_FILE = "config/ensm-config.yml";
    private SystemConfig config;
    
    @PostConstruct
    public void loadConfig() {
        Path configPath = Paths.get(CONFIG_FILE);
        
        // 설정 파일이 없으면 기본 설정으로 생성
        if (!Files.exists(configPath)) {
            this.config = new SystemConfig();
            try {
                saveConfig();
            } catch (Exception e) {
                System.err.println("설정 파일 생성 실패 (기본 설정 사용): " + e.getMessage());
                // 설정 파일 생성 실패해도 기본 설정으로 계속 진행
            }
            return;
        }
        
        try (InputStream input = Files.newInputStream(configPath)) {
            Yaml yaml = new Yaml();
            // YAML 파일에 태그가 있어도 파싱 가능하도록 처리
            Object loaded = yaml.load(input);
            if (loaded instanceof SystemConfig) {
                this.config = (SystemConfig) loaded;
            } else if (loaded instanceof Map) {
                // Map으로 로드된 경우 SystemConfig로 변환
                this.config = convertMapToSystemConfig((Map<?, ?>) loaded);
            } else {
                // 타입이 맞지 않으면 기본 설정 사용
                this.config = new SystemConfig();
            }
            if (this.config == null) {
                this.config = new SystemConfig();
            }
        } catch (org.yaml.snakeyaml.composer.ComposerException e) {
            // 태그가 포함된 YAML 파일인 경우 기존 파일을 백업하고 재생성
            System.err.println("설정 파일에 태그가 포함되어 있어 재생성합니다: " + e.getMessage());
            try {
                // 기존 파일 백업
                Path backupPath = Paths.get(CONFIG_FILE + ".backup");
                if (Files.exists(configPath)) {
                    Files.move(configPath, backupPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                    System.out.println("기존 설정 파일을 백업했습니다: " + backupPath);
                }
            } catch (IOException backupException) {
                System.err.println("백업 실패: " + backupException.getMessage());
            }
            // 기본 설정으로 재생성
            this.config = new SystemConfig();
            try {
                saveConfig();
                System.out.println("새로운 설정 파일을 생성했습니다.");
            } catch (Exception saveException) {
                System.err.println("설정 파일 재생성 실패: " + saveException.getMessage());
            }
        } catch (Exception e) {
            System.err.println("설정 파일 로드 실패, 기본 설정 사용: " + e.getMessage());
            e.printStackTrace();
            this.config = new SystemConfig();
        }
    }
    
    public SystemConfig getConfig() {
        return config;
    }
    
    /**
     * Map을 SystemConfig로 변환합니다.
     * YAML 파일에 태그가 없거나 다른 형식으로 저장된 경우를 처리합니다.
     */
    private SystemConfig convertMapToSystemConfig(Map<?, ?> map) {
        SystemConfig config = new SystemConfig();
        if (map == null) {
            return config;
        }
        
        // 각 필드를 Map에서 읽어서 설정
        if (map.get("authLogPath") != null) {
            config.setAuthLogPath(map.get("authLogPath").toString());
        }
        if (map.get("mainLogPath") != null) {
            config.setMainLogPath(map.get("mainLogPath").toString());
        }
        if (map.get("apacheScriptPath") != null) {
            config.setApacheScriptPath(map.get("apacheScriptPath").toString());
        }
        if (map.get("apacheSshEnabled") != null) {
            config.setApacheSshEnabled(Boolean.parseBoolean(map.get("apacheSshEnabled").toString()));
        }
        if (map.get("apacheSshHost") != null) {
            config.setApacheSshHost(map.get("apacheSshHost").toString());
        }
        if (map.get("apacheSshUser") != null) {
            config.setApacheSshUser(map.get("apacheSshUser").toString());
        }
        if (map.get("apacheSshPassword") != null) {
            config.setApacheSshPassword(map.get("apacheSshPassword").toString());
        }
        if (map.get("ensmScriptsBasePath") != null) {
            config.setEnsmScriptsBasePath(map.get("ensmScriptsBasePath").toString());
        }
        if (map.get("bindScriptPath") != null) {
            config.setBindScriptPath(map.get("bindScriptPath").toString());
        }
        if (map.get("systemName") != null) {
            config.setSystemName(map.get("systemName").toString());
        }
        if (map.get("accessRange") != null) {
            config.setAccessRange(map.get("accessRange").toString());
        }
        if (map.get("kibanaBaseUrl") != null) {
            config.setKibanaBaseUrl(map.get("kibanaBaseUrl").toString());
        }
        if (map.get("ddnsEnabled") != null) {
            config.setDdnsEnabled(Boolean.parseBoolean(map.get("ddnsEnabled").toString()));
        }
        if (map.get("ddnsApiToken") != null) {
            config.setDdnsApiToken(map.get("ddnsApiToken").toString());
        }
        if (map.get("ddnsZoneName") != null) {
            config.setDdnsZoneName(map.get("ddnsZoneName").toString());
        }
        if (map.get("ddnsRecordName") != null) {
            config.setDdnsRecordName(map.get("ddnsRecordName").toString());
        }
        if (map.get("ddnsTtl") != null) {
            config.setDdnsTtl(Integer.parseInt(map.get("ddnsTtl").toString()));
        }
        if (map.get("ddnsSchedule") != null) {
            config.setDdnsSchedule(map.get("ddnsSchedule").toString());
        }
        if (map.get("ddnsConfigFile") != null) {
            config.setDdnsConfigFile(map.get("ddnsConfigFile").toString());
        }
        if (map.get("ddnsLogFile") != null) {
            config.setDdnsLogFile(map.get("ddnsLogFile").toString());
        }
        if (map.get("customSettings") instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, String> customSettings = (Map<String, String>) map.get("customSettings");
            config.setCustomSettings(customSettings);
        }
        
        return config;
    }
    
    public void saveConfig() {
        try {
            Path configPath = Paths.get(CONFIG_FILE);
            Path configDir = configPath.getParent();
            
            // 디렉토리가 없으면 생성
            if (configDir != null && !Files.exists(configDir)) {
                Files.createDirectories(configDir);
            }
            
            // YAML 저장 시 태그를 제거하기 위한 옵션 설정
            DumperOptions options = new DumperOptions();
            options.setDefaultFlowStyle(DumperOptions.FlowStyle.BLOCK);
            options.setPrettyFlow(true);
            options.setCanonical(false);
            
            // Representer를 사용하여 태그 제거
            Representer representer = new Representer(options);
            representer.getPropertyUtils().setSkipMissingProperties(true);
            
            Yaml yaml = new Yaml(representer, options);
            try (Writer writer = Files.newBufferedWriter(configPath)) {
                yaml.dump(config, writer);
            }
        } catch (IOException e) {
            throw new RuntimeException("설정 파일 저장 실패: " + e.getMessage(), e);
        }
    }
}

