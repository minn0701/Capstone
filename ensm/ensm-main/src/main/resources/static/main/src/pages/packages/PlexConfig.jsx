// PlexConfig.jsx - 리팩토링된 설정 페이지
import React from "react";
import PackageConfigLayout from "../../components/PackageConfigLayout";
import SettingItem from "../../components/SettingItem";
import ValidatedInput from "../../components/ValidatedInput";
import { validatePort, validatePath } from "../../utils/validation";
import { commonStyles } from "../../utils/theme";

export default function PlexConfig() {
  const defaultFormData = {
    port: 32400,
    dataDir: "/var/lib/plexmediaserver",
    allowedNetworks: "192.168.0.0/16",
    enableRemoteAccess: true
  };

  const defaultToggles = {
    firewallEnabled: false
  };

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
      packageId="plex"
      title="Plex 미디어 서버 설정"
      defaultFormData={defaultFormData}
      defaultToggles={defaultToggles}
    >
      {({ formData, toggles, updateFormData, updateToggles, loading, restarting }) => (
        <>
          {/* 포트 및 방화벽 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🌐 네트워크 설정</h3>
            <SettingItem
              label="미디어 서버 포트"
              docKey="plex_Port"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.port}
                  onChange={(e) => updateFormData({ port: parseInt(e.target.value) || 32400 })}
                  validator={(val) => validatePort(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="plex-port"
                />
              }
              hint="Plex 미디어 서버가 수신할 포트 번호입니다."
              description="Plex Media Server Port"
            />
            <SettingItem
              label="방화벽 포트 허용"
              docKey="plex_Firewall"
              input={renderToggle("firewallEnabled", toggles, updateToggles)}
              hint="방화벽에서 해당 포트를 자동으로 허용합니다."
              description="방화벽 규칙 (ufw/firewalld)"
            />
            <SettingItem
              label="원격 접근 허용"
              docKey="plex_RemoteAccess"
              input={renderFormToggle("enableRemoteAccess", formData, updateFormData)}
              hint="인터넷을 통한 원격 접근을 허용합니다."
              description="Enable Remote Access"
            />
          </div>

          {/* 기본 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>⚙️ 기본 설정</h3>
            <SettingItem
              label="데이터 디렉토리"
              docKey="plex_DataDir"
              input={
                <ValidatedInput
                  type="text"
                  value={formData.dataDir}
                  onChange={(e) => updateFormData({ dataDir: e.target.value })}
                  validator={(val) => validatePath(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="plex-data-dir"
                />
              }
              hint="Plex 미디어 서버 데이터가 저장되는 경로입니다."
              description="PLEX_MEDIA_SERVER_DATA_DIR"
            />
            <SettingItem
              label="허용된 네트워크"
              docKey="plex_AllowedNetworks"
              input={
                <input
                  type="text"
                  value={formData.allowedNetworks}
                  onChange={(e) => updateFormData({ allowedNetworks: e.target.value })}
                  placeholder="192.168.0.0/16"
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="plex-allowed-networks"
                />
              }
              hint="접근을 허용할 네트워크 범위입니다. (CIDR 형식)"
              description="Allowed Networks"
            />
          </div>
        </>
      )}
    </PackageConfigLayout>
  );
}
