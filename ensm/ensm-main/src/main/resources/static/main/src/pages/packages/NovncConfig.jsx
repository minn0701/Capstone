// NovncConfig.jsx - 리팩토링된 설정 페이지
import React from "react";
import PackageConfigLayout from "../../components/PackageConfigLayout";
import SettingItem from "../../components/SettingItem";
import ValidatedInput from "../../components/ValidatedInput";
import { validatePort } from "../../utils/validation";
import { commonStyles } from "../../utils/theme";

export default function NovncConfig() {
  const defaultFormData = {
    port: 6080,
    websocketPort: 6081,
    vncHost: "localhost",
    vncPort: 5900,
    password: "",
    enableSSL: false
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
      packageId="novnc"
      title="noVNC 웹 VNC 클라이언트 설정"
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
              docKey="novnc_WebPort"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.port}
                  onChange={(e) => updateFormData({ port: parseInt(e.target.value) || 6080 })}
                  validator={(val) => validatePort(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="novnc-port"
                />
              }
              hint="noVNC 웹 인터페이스가 수신할 포트 번호입니다."
              description="HTTP Port"
            />
            <SettingItem
              label="WebSocket 포트"
              docKey="novnc_WebSocketPort"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.websocketPort}
                  onChange={(e) => updateFormData({ websocketPort: parseInt(e.target.value) || 6081 })}
                  validator={(val) => validatePort(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="novnc-websocket-port"
                />
              }
              hint="WebSocket 연결에 사용할 포트 번호입니다."
              description="WebSocket Port"
            />
            <SettingItem
              label="방화벽 포트 허용"
              docKey="novnc_Firewall"
              input={renderToggle("firewallEnabled", toggles, updateToggles)}
              hint="방화벽에서 해당 포트를 자동으로 허용합니다."
              description="방화벽 규칙 (ufw/firewalld)"
            />
          </div>

          {/* VNC 연결 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔌 VNC 연결 설정</h3>
            <SettingItem
              label="VNC 서버 호스트"
              docKey="novnc_VncHost"
              input={
                <input
                  type="text"
                  value={formData.vncHost}
                  onChange={(e) => updateFormData({ vncHost: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="novnc-vnc-host"
                />
              }
              hint="연결할 VNC 서버의 호스트 주소입니다."
              description="VNC Host"
            />
            <SettingItem
              label="VNC 서버 포트"
              docKey="novnc_VncPort"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.vncPort}
                  onChange={(e) => updateFormData({ vncPort: parseInt(e.target.value) || 5900 })}
                  validator={(val) => validatePort(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="novnc-vnc-port"
                />
              }
              hint="연결할 VNC 서버의 포트 번호입니다."
              description="VNC Port"
            />
            <SettingItem
              label="VNC 비밀번호"
              docKey="novnc_Password"
              input={
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData({ password: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="novnc-password"
                />
              }
              hint="VNC 서버 접속에 사용할 비밀번호입니다."
              description="VNC Password"
            />
            <SettingItem
              label="SSL 사용"
              docKey="novnc_SSL"
              input={renderFormToggle("enableSSL", formData, updateFormData)}
              hint="SSL/TLS 암호화 연결을 사용합니다."
              description="Enable SSL"
            />
          </div>
        </>
      )}
    </PackageConfigLayout>
  );
}
