package com.ensm.main.network;

import com.ensm.main.config.SystemConfig;
import com.ensm.main.config.SystemConfigStore;
import com.ensm.main.system.CronService;
import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.DumperOptions;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.representer.Representer;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * DDNS 관리 서비스
 * Cloudflare DDNS 설정 및 CRON 작업을 관리합니다.
 */
@Service
public class DdnsService {
    
    private final SystemConfigStore configStore;
    private final CronService cronService;
    private static final String DDNS_CRON_COMMENT = "# ENSM DDNS Auto Update";
    private static final String DDNS_CRON_USER = "root";
    
    public DdnsService(SystemConfigStore configStore, CronService cronService) {
        this.configStore = configStore;
        this.cronService = cronService;
    }
    
    /**
     * DDNS 설정 파일을 생성/업데이트합니다.
     */
    public void updateDdnsConfigFile() throws IOException {
        SystemConfig config = configStore.getConfig();
        
        // 설정 파일 디렉토리 생성
        Path configPath = Paths.get(config.getDdnsConfigFile());
        Path configDir = configPath.getParent();
        if (configDir != null && !Files.exists(configDir)) {
            Files.createDirectories(configDir);
        }
        
        // YAML 설정 생성
        Map<String, Object> ddnsConfig = new HashMap<>();
        ddnsConfig.put("apiToken", config.getDdnsApiToken());
        ddnsConfig.put("zoneName", config.getDdnsZoneName());
        ddnsConfig.put("recordName", config.getDdnsRecordName());
        ddnsConfig.put("ttl", config.getDdnsTtl());
        
        // YAML 저장
        DumperOptions options = new DumperOptions();
        options.setDefaultFlowStyle(DumperOptions.FlowStyle.BLOCK);
        options.setPrettyFlow(true);
        Representer representer = new Representer(options);
        Yaml yaml = new Yaml(representer, options);
        
        try (FileWriter writer = new FileWriter(configPath.toFile())) {
            yaml.dump(ddnsConfig, writer);
        }
    }
    
    /**
     * DDNS CRON 작업을 추가/제거합니다.
     */
    public String toggleDdnsCron(boolean enable) {
        try {
            SystemConfig config = configStore.getConfig();
            
            // 기존 CRON 작업 목록 가져오기
            List<Map<String, String>> jobs = cronService.getCronJobs(DDNS_CRON_USER);
            
            // DDNS 관련 CRON 작업 찾기 및 제거
            int ddnsJobIndex = -1;
            for (int i = 0; i < jobs.size(); i++) {
                String schedule = jobs.get(i).get("schedule");
                if (schedule != null && schedule.contains(DDNS_CRON_COMMENT)) {
                    ddnsJobIndex = i;
                    break;
                }
            }
            
            if (ddnsJobIndex >= 0) {
                // 기존 DDNS CRON 작업 삭제
                cronService.deleteCronJob(DDNS_CRON_USER, ddnsJobIndex);
            }
            
            if (enable) {
                // DDNS CRON 작업 추가
                String scriptPath = config.getEnsmScriptsBasePath() + "/network/ddns_cloudflare.sh";
                // 환경 변수 설정
                String cronCommand = String.format(
                    "DDNS_CONFIG_FILE='%s' DDNS_LOG_FILE='%s' DDNS_STATE_FILE='/var/lib/ddns_last_ip' %s %s",
                    config.getDdnsConfigFile(),
                    config.getDdnsLogFile(),
                    scriptPath,
                    DDNS_CRON_COMMENT
                );
                String cronSchedule = config.getDdnsSchedule();
                
                cronService.addCronJob(DDNS_CRON_USER, cronSchedule, cronCommand);
            }
            
            if (enable) {
                return "DDNS 자동 업데이트가 활성화되었습니다.";
            } else {
                return "DDNS 자동 업데이트가 비활성화되었습니다.";
            }
        } catch (Exception e) {
            return "오류: " + e.getMessage();
        }
    }
    
    /**
     * DDNS CRON 작업이 활성화되어 있는지 확인합니다.
     */
    public boolean isDdnsCronEnabled() {
        try {
            List<Map<String, String>> jobs = cronService.getCronJobs(DDNS_CRON_USER);
            return jobs.stream()
                .anyMatch(job -> {
                    String schedule = job.get("schedule");
                    return schedule != null && schedule.contains(DDNS_CRON_COMMENT);
                });
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * DDNS 설정을 검증합니다.
     */
    public String validateDdnsConfig() {
        SystemConfig config = configStore.getConfig();
        
        if (config.getDdnsApiToken() == null || config.getDdnsApiToken().trim().isEmpty()) {
            return "Cloudflare API 토큰을 입력해주세요.";
        }
        if (config.getDdnsZoneName() == null || config.getDdnsZoneName().trim().isEmpty()) {
            return "Zone 이름을 입력해주세요.";
        }
        if (config.getDdnsRecordName() == null || config.getDdnsRecordName().trim().isEmpty()) {
            return "레코드 이름을 입력해주세요.";
        }
        if (config.getDdnsTtl() < 60) {
            return "TTL은 최소 60초 이상이어야 합니다.";
        }
        
        return null; // 검증 통과
    }
}

