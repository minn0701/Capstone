// JellyfinConfig.jsx - 리팩토링된 설정 페이지
import React, { useState, useEffect } from "react";
import PackageConfigLayout from "../../components/PackageConfigLayout";
import SettingItem from "../../components/SettingItem";
import ValidatedInput from "../../components/ValidatedInput";
import { validatePort, validatePath } from "../../utils/validation";
import { commonStyles } from "../../utils/theme";
import { apiFetch } from "../../utils/api";

export default function JellyfinConfig() {
  const defaultFormData = {
    port: 8096,
    dataDir: "/var/lib/jellyfin",
    cacheDir: "/var/cache/jellyfin",
    logDir: "/var/log/jellyfin",
    enableHttps: false,
    httpsPort: 8920
  };

  const defaultToggles = {
    firewallEnabled: false
  };

  const [ddnsConfig, setDdnsConfig] = useState(null);

  useEffect(() => {
    const loadDdnsConfig = async () => {
      try {
        const response = await apiFetch("/main/api/ddns");
        if (response.ok) {
          const data = await response.json();
          if (data.enabled && data.recordName) {
            setDdnsConfig({
              enabled: data.enabled,
              recordName: data.recordName
            });
          }
        }
      } catch (error) {
        console.error("DDNS 설정 로드 실패:", error);
      }
    };
    loadDdnsConfig();
  }, []);

  const renderToggle = (key, toggles, updateToggles) => (
    <div
      onClick={() => updateToggles({ [key]: !toggles[key] })}
      role="switch"
      aria-checked={toggles[key]}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          updateToggles({ [key]: !toggles[key] });
        }
      }}
      style={{
        display: "inline-block",
        width: "46px",
        height: "24px",
        backgroundColor: toggles[key] ? "#4ade80" : "#888",
        borderRadius: "24px",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: toggles[key] ? "24px" : "3px",
          width: "18px",
          height: "18px",
          backgroundColor: "white",
          borderRadius: "50%",
          transition: "left 0.3s"
        }}
      />
    </div>
  );

  const renderFormToggle = (key, formData, updateFormData) => (
    <div
      onClick={() => updateFormData({ [key]: !formData[key] })}
      role="switch"
      aria-checked={formData[key]}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          updateFormData({ [key]: !formData[key] });
        }
      }}
      style={{
        display: "inline-block",
        width: "46px",
        height: "24px",
        backgroundColor: formData[key] ? "#4ade80" : "#888",
        borderRadius: "24px",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: formData[key] ? "24px" : "3px",
          width: "18px",
          height: "18px",
          backgroundColor: "white",
          borderRadius: "50%",
          transition: "left 0.3s"
        }}
      />
    </div>
  );

  return (
    <PackageConfigLayout
      packageId="jellyfin"
      title="Jellyfin 미디어 서버 설정"
      defaultFormData={defaultFormData}
      defaultToggles={defaultToggles}
    >
      {({ formData, toggles, updateFormData, updateToggles, loading, restarting }) => (
        <>
          {/* 포트 및 방화벽 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🌐 네트워크 설정</h3>
            <SettingItem
              label="웹 인터페이스 포트"
              docKey="jellyfin_Port"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.port}
                  onChange={(e) => updateFormData({ port: parseInt(e.target.value) || 8096 })}
                  validator={(val) => validatePort(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="jellyfin-port"
                />
              }
              hint="Jellyfin 웹 인터페이스가 수신할 포트 번호입니다."
              description="HTTP Port"
            />
            <SettingItem
              label="방화벽 포트 허용"
              docKey="jellyfin_Firewall"
              input={renderToggle("firewallEnabled", toggles, updateToggles)}
              hint="방화벽에서 해당 포트를 자동으로 허용합니다."
              description="방화벽 규칙 (ufw/firewalld)"
            />
            <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#2b2d31", borderRadius: "4px", border: "1px solid #444" }}>
              <div style={{ fontSize: "0.9rem", color: "#aaa", marginBottom: "0.5rem" }}>🔗 웹 인터페이스 접속</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <a
                  href={`${formData.enableHttps ? 'https' : 'http'}://localhost:${formData.enableHttps ? formData.httpsPort : formData.port}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#5865f2",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    display: "inline-block"
                  }}
                >
                  🌐 로컬 주소: {formData.enableHttps ? 'https' : 'http'}://localhost:{formData.enableHttps ? formData.httpsPort : formData.port}
                </a>
                {ddnsConfig && ddnsConfig.enabled && ddnsConfig.recordName && (
                  <a
                    href={`${formData.enableHttps ? 'https' : 'http'}://${ddnsConfig.recordName}:${formData.enableHttps ? formData.httpsPort : formData.port}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#5865f2",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      display: "inline-block"
                    }}
                  >
                    🌍 외부 주소: {formData.enableHttps ? 'https' : 'http'}://{ddnsConfig.recordName}:{formData.enableHttps ? formData.httpsPort : formData.port}
                  </a>
                )}
              </div>
            </div>
            <SettingItem
              label="HTTPS 사용"
              docKey="jellyfin_HTTPS"
              input={renderFormToggle("enableHttps", formData, updateFormData)}
              hint="HTTPS 암호화 연결을 활성화합니다."
              description="Enable HTTPS"
            />
            {formData.enableHttps && (
              <SettingItem
                label="HTTPS 포트"
                docKey="jellyfin_HTTPSPort"
                input={
                  <ValidatedInput
                    type="number"
                    value={formData.httpsPort}
                    onChange={(e) => updateFormData({ httpsPort: parseInt(e.target.value) || 8920 })}
                    validator={(val) => validatePort(val)}
                    disabled={loading || restarting}
                    style={{ ...commonStyles.input, width: "240px" }}
                    id="jellyfin-https-port"
                  />
                }
                hint="HTTPS 연결에 사용할 포트 번호입니다."
                description="HTTPS Port"
              />
            )}
          </div>

          {/* 기본 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>⚙️ 기본 설정</h3>
            <SettingItem
              label="데이터 디렉토리"
              docKey="jellyfin_DataDir"
              input={
                <ValidatedInput
                  type="text"
                  value={formData.dataDir}
                  onChange={(e) => updateFormData({ dataDir: e.target.value })}
                  validator={(val) => validatePath(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="jellyfin-data-dir"
                />
              }
              hint="Jellyfin 데이터베이스와 설정 파일이 저장되는 경로입니다."
              description="Data Directory"
            />
            <SettingItem
              label="캐시 디렉토리"
              docKey="jellyfin_CacheDir"
              input={
                <ValidatedInput
                  type="text"
                  value={formData.cacheDir}
                  onChange={(e) => updateFormData({ cacheDir: e.target.value })}
                  validator={(val) => validatePath(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="jellyfin-cache-dir"
                />
              }
              hint="Jellyfin 캐시 파일이 저장되는 경로입니다."
              description="Cache Directory"
            />
            <SettingItem
              label="로그 디렉토리"
              docKey="jellyfin_LogDir"
              input={
                <ValidatedInput
                  type="text"
                  value={formData.logDir}
                  onChange={(e) => updateFormData({ logDir: e.target.value })}
                  validator={(val) => validatePath(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="jellyfin-log-dir"
                />
              }
              hint="Jellyfin 로그 파일이 저장되는 경로입니다."
              description="Log Directory"
            />
          </div>
        </>
      )}
    </PackageConfigLayout>
  );
}
