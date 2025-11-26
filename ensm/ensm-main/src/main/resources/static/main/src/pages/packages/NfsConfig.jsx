// NfsConfig.jsx - 리팩토링된 설정 페이지
import React from "react";
import PackageConfigLayout from "../../components/PackageConfigLayout";
import SettingItem from "../../components/SettingItem";
import ValidatedInput from "../../components/ValidatedInput";
import { validatePort } from "../../utils/validation";
import { commonStyles } from "../../utils/theme";

export default function NfsConfig() {
  const defaultFormData = {
    port: 2049,
    exports: "/var/nfs * (rw,sync,no_subtree_check)",
    rpcbindPort: 111,
    mountdPort: 20048,
    statdPort: 32765,
    lockdPort: 32768
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

  return (
    <PackageConfigLayout
      packageId="nfs"
      title="NFS (Network File System) 설정"
      defaultFormData={defaultFormData}
      defaultToggles={defaultToggles}
    >
      {({ formData, toggles, updateFormData, updateToggles, loading, restarting }) => (
        <>
          {/* 포트 및 방화벽 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🌐 네트워크 설정</h3>
            <SettingItem
              label="NFS 서버 포트"
              docKey="nfs_Port"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.port}
                  onChange={(e) => updateFormData({ port: parseInt(e.target.value) || 2049 })}
                  validator={(val) => validatePort(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="nfs-port"
                />
              }
              hint="NFS 서버가 사용할 포트 번호입니다."
              description="port"
            />
            <SettingItem
              label="방화벽 포트 허용"
              docKey="nfs_Firewall"
              input={renderToggle("firewallEnabled", toggles, updateToggles)}
              hint="방화벽에서 NFS 관련 포트를 자동으로 허용합니다."
              description="방화벽 규칙 (ufw/firewalld)"
            />
          </div>

          {/* 공유 디렉토리 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📁 공유 디렉토리 설정</h3>
            <SettingItem
              label="NFS 공유 설정"
              docKey="nfs_Exports"
              input={
                <textarea
                  value={formData.exports}
                  onChange={(e) => updateFormData({ exports: e.target.value })}
                  disabled={loading || restarting}
                  rows={5}
                  style={{
                    ...commonStyles.input,
                    width: "100%",
                    fontFamily: "monospace",
                    resize: "vertical"
                  }}
                  id="nfs-exports"
                />
              }
              hint="/etc/exports 형식으로 공유 디렉토리를 설정합니다. 예: /var/nfs * (rw,sync,no_subtree_check)"
              description="exports"
            />
          </div>

          {/* 고급 포트 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔧 고급 포트 설정</h3>
            <SettingItem
              label="RPC 포트"
              docKey="nfs_RpcbindPort"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.rpcbindPort}
                  onChange={(e) => updateFormData({ rpcbindPort: parseInt(e.target.value) || 111 })}
                  validator={(val) => validatePort(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="nfs-rpcbind-port"
                />
              }
              hint="RPC 바인더가 사용할 포트 번호입니다."
              description="rpcbind_port"
            />
            <SettingItem
              label="Mount 데몬 포트"
              docKey="nfs_MountdPort"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.mountdPort}
                  onChange={(e) => updateFormData({ mountdPort: parseInt(e.target.value) || 20048 })}
                  validator={(val) => validatePort(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="nfs-mountd-port"
                />
              }
              hint="Mount 데몬이 사용할 포트 번호입니다."
              description="mountd_port"
            />
            <SettingItem
              label="Status 데몬 포트"
              docKey="nfs_StatdPort"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.statdPort}
                  onChange={(e) => updateFormData({ statdPort: parseInt(e.target.value) || 32765 })}
                  validator={(val) => validatePort(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="nfs-statd-port"
                />
              }
              hint="Status 데몬이 사용할 포트 번호입니다."
              description="statd_port"
            />
            <SettingItem
              label="Lock 데몬 포트"
              docKey="nfs_LockdPort"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.lockdPort}
                  onChange={(e) => updateFormData({ lockdPort: parseInt(e.target.value) || 32768 })}
                  validator={(val) => validatePort(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="nfs-lockd-port"
                />
              }
              hint="Lock 데몬이 사용할 포트 번호입니다."
              description="lockd_port"
            />
          </div>
        </>
      )}
    </PackageConfigLayout>
  );
}
