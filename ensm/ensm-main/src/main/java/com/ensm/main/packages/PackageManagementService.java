package com.ensm.main.packages;

import com.ensm.main.util.ScriptExecutor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 패키지 관리 서비스
 * 패키지 설치/제거 및 서비스 제어를 담당합니다.
 */
@Service
@RequiredArgsConstructor
public class PackageManagementService {
    
    private final ScriptExecutor scriptExecutor;
    
    /**
     * 지원하는 패키지 목록을 조회합니다.
     * 모든 패키지 목록을 반환합니다 (installed: true/false 포함).
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getPackageList() {
        List<Map<String, Object>> packages = scriptExecutor.executeScriptJsonArray("system/manage_packages.sh", "list");
        
        // installed를 boolean으로 변환하고, serviceStatus와 autoStart 추가
        // 모든 패키지 반환 (설치/미설치 포함)
        return packages.stream()
                .map(pkg -> {
                    Map<String, Object> result = new java.util.HashMap<>(pkg);
                    // installed가 문자열 "true"/"false"인 경우 boolean으로 변환
                    Object installed = pkg.get("installed");
                    if (installed instanceof String) {
                        result.put("installed", "true".equals(installed));
                    }
                    // autoStart가 문자열인 경우 boolean으로 변환
                    Object autoStart = pkg.get("autoStart");
                    if (autoStart instanceof String) {
                        result.put("autoStart", "true".equals(autoStart));
                    }
                    return result;
                })
                .toList();
    }
    
    /**
     * 패키지 설치 여부를 확인합니다.
     */
    public boolean isInstalled(String packageId) {
        String result = scriptExecutor.executeScript("system/manage_packages.sh", "is_installed", packageId);
        return "installed".equals(result.trim());
    }
    
    /**
     * 패키지를 설치합니다.
     */
    public String installPackage(String packageId) {
        return scriptExecutor.executeScript("system/manage_packages.sh", "install", packageId);
    }
    
    /**
     * 패키지를 제거합니다.
     */
    public String removePackage(String packageId) {
        return scriptExecutor.executeScript("system/manage_packages.sh", "remove", packageId);
    }
    
    /**
     * 서비스 상태를 조회합니다.
     */
    public String getServiceStatus(String packageId) {
        return scriptExecutor.executeScript("system/manage_packages.sh", "service", packageId, "status");
    }
    
    /**
     * 서비스를 제어합니다.
     */
    public String controlService(String packageId, String action) {
        return scriptExecutor.executeScript("system/manage_packages.sh", "service", packageId, action);
    }
    
    /**
     * 자동 시작을 토글합니다.
     */
    public String toggleAutostart(String packageId, boolean enable) {
        return scriptExecutor.executeScript("system/manage_packages.sh", "autostart", packageId, String.valueOf(enable));
    }
}

