// BindConfig.jsx - 리팩토링된 설정 페이지
import React from "react";
import PackageConfigLayout from "../../components/PackageConfigLayout";
import SettingItem from "../../components/SettingItem";
import ValidatedInput from "../../components/ValidatedInput";
import { validatePort, validateIP, validateIPv6 } from "../../utils/validation";
import { commonStyles } from "../../utils/theme";

export default function BindConfig() {
  const defaultFormData = {
    port: 53,
    listenOn: "127.0.0.1",
    listenOnV6: "::1",
    forward: "first",
    forwarders: "8.8.8.8; 8.8.4.4;",
    allowQuery: "any",
    allowTransfer: "none",
    acl: "",
    zoneDomain: "",
    zoneType: "master",
    zoneFile: ""
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
      packageId="bind"
      title="BIND DNS 서버 설정"
      defaultFormData={defaultFormData}
      defaultToggles={defaultToggles}
    >
      {({ formData, toggles, updateFormData, updateToggles, loading, restarting }) => (
        <>
          {/* 네트워크 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🌐 네트워크 설정</h3>
            <SettingItem
              label="DNS 서버 포트"
              docKey="bind_Port"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.port}
                  onChange={(e) => updateFormData({ port: parseInt(e.target.value) || 53 })}
                  validator={(val) => validatePort(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="bind-port"
                />
              }
              hint="BIND가 수신할 포트 번호입니다."
              description="포트"
            />
            <SettingItem
              label="방화벽 포트 허용"
              docKey="bind_Firewall"
              input={renderToggle("firewallEnabled", toggles, updateToggles)}
              hint="방화벽에서 해당 포트를 자동으로 허용합니다."
              description="방화벽 규칙"
            />
            <SettingItem
              label="IPv4 수신 주소"
              docKey="bind_ListenOn"
              input={
                <ValidatedInput
                  type="text"
                  value={formData.listenOn}
                  onChange={(e) => updateFormData({ listenOn: e.target.value })}
                  validator={(val) => validateIP(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="bind-listen-on"
                />
              }
              hint="IPv4 주소에서 수신할 인터페이스를 지정합니다."
              description="Listen-on"
            />
            <SettingItem
              label="IPv6 수신 주소"
              docKey="bind_ListenOnV6"
              input={
                <ValidatedInput
                  type="text"
                  value={formData.listenOnV6}
                  onChange={(e) => updateFormData({ listenOnV6: e.target.value })}
                  validator={(val) => validateIPv6(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="bind-listen-on-v6"
                />
              }
              hint="IPv6 주소에서 수신할 인터페이스를 지정합니다."
              description="Listen-on-v6"
            />
          </div>

          {/* DNS 전달 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔄 DNS 전달 설정</h3>
            <SettingItem
              label="전달 모드"
              docKey="bind_Forward"
              input={
                <select
                  value={formData.forward}
                  onChange={(e) => updateFormData({ forward: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="bind-forward"
                >
                  <option value="first">first (먼저 전달, 실패 시 자체 해석)</option>
                  <option value="only">only (전달만, 자체 해석 안 함)</option>
                </select>
              }
              hint="DNS 쿼리를 상위 서버로 전달하는 방식을 지정합니다."
              description="Forward"
            />
            <SettingItem
              label="전달 서버 목록"
              docKey="bind_Forwarders"
              input={
                <input
                  type="text"
                  value={formData.forwarders}
                  onChange={(e) => updateFormData({ forwarders: e.target.value })}
                  placeholder="8.8.8.8; 8.8.4.4;"
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="bind-forwarders"
                />
              }
              hint="DNS 쿼리를 전달할 상위 DNS 서버 목록입니다. 세미콜론으로 구분합니다."
              description="Forwarders"
            />
          </div>

          {/* 접근 제어 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔐 접근 제어</h3>
            <SettingItem
              label="쿼리 허용 범위"
              docKey="bind_AllowQuery"
              input={
                <select
                  value={formData.allowQuery}
                  onChange={(e) => updateFormData({ allowQuery: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="bind-allow-query"
                >
                  <option value="any">any (모든 클라이언트)</option>
                  <option value="localhost">localhost (로컬만)</option>
                  <option value="localnets">localnets (로컬 네트워크만)</option>
                </select>
              }
              hint="DNS 쿼리를 허용할 클라이언트 범위를 지정합니다."
              description="Allow-query"
            />
            <SettingItem
              label="영역 전송 허용"
              docKey="bind_AllowTransfer"
              input={
                <select
                  value={formData.allowTransfer}
                  onChange={(e) => updateFormData({ allowTransfer: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="bind-allow-transfer"
                >
                  <option value="none">none (허용 안 함)</option>
                  <option value="any">any (모두 허용)</option>
                  <option value="localhost">localhost (로컬만)</option>
                </select>
              }
              hint="영역(Zone) 전송을 허용할 클라이언트를 지정합니다."
              description="Allow-transfer"
            />
            <SettingItem
              label="ACL 정의"
              docKey="bind_ACL"
              input={
                <textarea
                  value={formData.acl}
                  onChange={(e) => updateFormData({ acl: e.target.value })}
                  placeholder="acl trusted { 192.168.1.0/24; };"
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "100%", minHeight: "80px", resize: "vertical" }}
                  id="bind-acl"
                />
              }
              hint="접근 제어 목록(ACL)을 정의합니다."
              description="ACL"
            />
          </div>

          {/* 영역 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🌍 영역 설정</h3>
            <SettingItem
              label="영역 도메인"
              docKey="bind_ZoneDomain"
              input={
                <input
                  type="text"
                  value={formData.zoneDomain}
                  onChange={(e) => updateFormData({ zoneDomain: e.target.value })}
                  placeholder="example.com"
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="bind-zone-domain"
                />
              }
              hint="관리할 DNS 영역의 도메인 이름입니다."
              description="Zone Domain"
            />
            <SettingItem
              label="영역 타입"
              docKey="bind_ZoneType"
              input={
                <select
                  value={formData.zoneType}
                  onChange={(e) => updateFormData({ zoneType: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="bind-zone-type"
                >
                  <option value="master">master (주 서버)</option>
                  <option value="slave">slave (보조 서버)</option>
                  <option value="hint">hint (루트 힌트)</option>
                  <option value="forward">forward (전달)</option>
                </select>
              }
              hint="영역의 타입을 지정합니다."
              description="Zone Type"
            />
            <SettingItem
              label="영역 파일 경로"
              docKey="bind_ZoneFile"
              input={
                <input
                  type="text"
                  value={formData.zoneFile}
                  onChange={(e) => updateFormData({ zoneFile: e.target.value })}
                  placeholder="/etc/bind/db.example.com"
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="bind-zone-file"
                />
              }
              hint="영역 데이터가 저장된 파일 경로입니다."
              description="Zone File"
            />
          </div>
        </>
      )}
    </PackageConfigLayout>
  );
}
