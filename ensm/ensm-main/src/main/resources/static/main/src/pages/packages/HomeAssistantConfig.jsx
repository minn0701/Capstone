// HomeAssistantConfig.jsx - 리팩토링된 설정 페이지
import React, { useState, useEffect } from "react";
import PackageConfigLayout from "../../components/PackageConfigLayout";
import SettingItem from "../../components/SettingItem";
import ValidatedInput from "../../components/ValidatedInput";
import { validatePort, validatePath } from "../../utils/validation";
import { commonStyles } from "../../utils/theme";
import { apiFetch } from "../../utils/api";

export default function HomeAssistantConfig() {
  const defaultFormData = {
    port: 8123,
    configDir: "/config",
    timezone: "Asia/Seoul",
    latitude: 37.5665,
    longitude: 126.9780,
    elevation: 0,
    unitSystem: "metric"
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

  return (
    <PackageConfigLayout
      packageId="home-assistant"
      title="Home Assistant 설정"
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
              docKey="homeassistant_Port"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.port}
                  onChange={(e) => updateFormData({ port: parseInt(e.target.value) || 8123 })}
                  validator={(val) => validatePort(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="homeassistant-port"
                />
              }
              hint="Home Assistant 웹 인터페이스가 수신할 포트 번호입니다."
              description="http.port"
            />
            <SettingItem
              label="방화벽 포트 허용"
              docKey="homeassistant_Firewall"
              input={renderToggle("firewallEnabled", toggles, updateToggles)}
              hint="방화벽에서 해당 포트를 자동으로 허용합니다."
              description="방화벽 규칙 (ufw/firewalld)"
            />
            <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#2b2d31", borderRadius: "4px", border: "1px solid #444" }}>
              <div style={{ fontSize: "0.9rem", color: "#aaa", marginBottom: "0.5rem" }}>🔗 웹 인터페이스 접속</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <a
                  href={`http://localhost:${formData.port}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#5865f2",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    display: "inline-block"
                  }}
                >
                  🌐 로컬 주소: http://localhost:{formData.port}
                </a>
                {ddnsConfig && ddnsConfig.enabled && ddnsConfig.recordName && (
                  <a
                    href={`http://${ddnsConfig.recordName}:${formData.port}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#5865f2",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      display: "inline-block"
                    }}
                  >
                    🌍 외부 주소: http://{ddnsConfig.recordName}:{formData.port}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 기본 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>⚙️ 기본 설정</h3>
            <SettingItem
              label="설정 디렉토리"
              docKey="homeassistant_ConfigDir"
              input={
                <ValidatedInput
                  type="text"
                  value={formData.configDir}
                  onChange={(e) => updateFormData({ configDir: e.target.value })}
                  validator={(val) => validatePath(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="homeassistant-config-dir"
                />
              }
              hint="Home Assistant 설정 파일이 저장되는 경로입니다."
              description="configuration.yaml 경로"
            />
            <SettingItem
              label="타임존"
              docKey="homeassistant_Timezone"
              input={
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => updateFormData({ timezone: e.target.value })}
                  placeholder="Asia/Seoul"
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="homeassistant-timezone"
                />
              }
              hint="시스템 타임존입니다. (예: Asia/Seoul, UTC, America/New_York)"
              description="time_zone"
            />
            <SettingItem
              label="위도"
              docKey="homeassistant_Latitude"
              input={
                <ValidatedInput
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => updateFormData({ latitude: parseFloat(e.target.value) || 37.5665 })}
                  validator={(val) => {
                    const num = parseFloat(val);
                    if (isNaN(num) || num < -90 || num > 90) {
                      return { valid: false, error: "-90과 90 사이의 숫자여야 합니다." };
                    }
                    return { valid: true, error: null };
                  }}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="homeassistant-latitude"
                />
              }
              hint="홈의 위도 좌표입니다. 날씨 및 위치 기반 기능에 사용됩니다."
              description="latitude"
            />
            <SettingItem
              label="경도"
              docKey="homeassistant_Longitude"
              input={
                <ValidatedInput
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => updateFormData({ longitude: parseFloat(e.target.value) || 126.9780 })}
                  validator={(val) => {
                    const num = parseFloat(val);
                    if (isNaN(num) || num < -180 || num > 180) {
                      return { valid: false, error: "-180과 180 사이의 숫자여야 합니다." };
                    }
                    return { valid: true, error: null };
                  }}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="homeassistant-longitude"
                />
              }
              hint="홈의 경도 좌표입니다. 날씨 및 위치 기반 기능에 사용됩니다."
              description="longitude"
            />
            <SettingItem
              label="고도 (미터)"
              docKey="homeassistant_Elevation"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.elevation}
                  onChange={(e) => updateFormData({ elevation: parseInt(e.target.value) || 0 })}
                  validator={(val) => {
                    const num = parseInt(val);
                    if (isNaN(num)) {
                      return { valid: false, error: "숫자여야 합니다." };
                    }
                    return { valid: true, error: null };
                  }}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="homeassistant-elevation"
                />
              }
              hint="홈의 해발 고도입니다. 날씨 정보에 사용됩니다."
              description="elevation"
            />
            <SettingItem
              label="단위 시스템"
              docKey="homeassistant_UnitSystem"
              input={
                <select
                  value={formData.unitSystem}
                  onChange={(e) => updateFormData({ unitSystem: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="homeassistant-unit-system"
                >
                  <option value="metric">metric (미터법)</option>
                  <option value="imperial">imperial (야드파운드법)</option>
                </select>
              }
              hint="사용할 단위 시스템입니다."
              description="unit_system"
            />
          </div>
        </>
      )}
    </PackageConfigLayout>
  );
}
