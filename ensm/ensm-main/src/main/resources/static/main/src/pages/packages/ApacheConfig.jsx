// ApacheConfig.jsx - 리팩토링된 설정 페이지
import React from "react";
import PackageConfigLayout from "../../components/PackageConfigLayout";
import SettingItem from "../../components/SettingItem";
import ValidatedInput from "../../components/ValidatedInput";
import { validatePort, validatePath, validateEmail } from "../../utils/validation";
import { theme, commonStyles } from "../../utils/theme";

export default function ApacheConfig() {
  const defaultFormData = {
    port: 80,
    serverName: "localhost",
    documentRoot: "/var/www/html",
    user: "apache",
    group: "apache",
    logLevel: "warn",
    errorLog: "logs/error_log",
    customLog: "logs/access_log common",
    require: "all granted",
    allowOverride: "All",
    serverAdmin: "admin@localhost",
    serverTokens: "Prod",
    timeout: 60,
    hostnameLookups: false
  };

  const defaultToggles = {
    firewallEnabled: false,
    Indexes: false,
    FollowSymLinks: false,
    SymLinksIfOwnerMatch: false,
    ExecCGI: false
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
      packageId="apache"
      title="Apache HTTP Server 설정"
      defaultFormData={defaultFormData}
      defaultToggles={defaultToggles}
    >
      {({ formData, toggles, updateFormData, updateToggles, loading, restarting }) => (
        <>
          {/* 포트 및 방화벽 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🌐 네트워크 설정</h3>
            <SettingItem
              label="웹 서버 포트"
              docKey="apache_Port"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.port}
                  onChange={(e) => updateFormData({ port: parseInt(e.target.value) || 80 })}
                  validator={(val) => validatePort(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="apache-port"
                />
              }
              hint="Apache가 수신할 포트 번호입니다."
              description="포트 (Listen)"
            />
            <SettingItem
              label="방화벽 포트 허용"
              docKey="apache_Firewall"
              input={renderToggle("firewallEnabled", toggles, updateToggles)}
              hint="방화벽에서 해당 포트를 자동으로 허용합니다."
              description="방화벽 규칙 (ufw/firewalld)"
            />
          </div>

          {/* 기본 서버 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>⚙️ 기본 서버 설정</h3>
            <SettingItem
              label="서버 도메인명"
              docKey="apache_ServerName_global"
              input={
                <ValidatedInput
                  type="text"
                  value={formData.serverName}
                  onChange={(e) => updateFormData({ serverName: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="apache-server-name"
                />
              }
              hint="서버의 도메인 이름 또는 IP 주소입니다."
              description="ServerName"
            />
            <SettingItem
              label="웹 문서 루트 경로"
              docKey="apache_DocumentRoot"
              input={
                <ValidatedInput
                  type="text"
                  value={formData.documentRoot}
                  onChange={(e) => updateFormData({ documentRoot: e.target.value })}
                  validator={(val) => validatePath(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="apache-document-root"
                />
              }
              hint="웹사이트 파일이 저장된 디렉토리 경로입니다."
              description="DocumentRoot"
            />
            <SettingItem
              label="서버 관리자 이메일"
              docKey="apache_ServerAdmin"
              input={
                <ValidatedInput
                  type="email"
                  value={formData.serverAdmin}
                  onChange={(e) => updateFormData({ serverAdmin: e.target.value })}
                  validator={(val) => validateEmail(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="apache-server-admin"
                />
              }
              hint="서버 관리자의 이메일 주소입니다."
              description="ServerAdmin"
            />
          </div>

          {/* 접근 제어 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔐 접근 제어</h3>
            <SettingItem
              label="접근 허용 규칙"
              docKey="apache_Require"
              input={
                <input
                  type="text"
                  value={formData.require}
                  onChange={(e) => updateFormData({ require: e.target.value })}
                  placeholder="all granted"
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="apache-require"
                />
              }
              hint="접근을 허용할 조건을 지정합니다. 예: all granted, all denied"
              description="Require"
            />
            <SettingItem
              label="디렉터리별 설정 허용"
              docKey="apache_AllowOverride"
              input={
                <select
                  value={formData.allowOverride}
                  onChange={(e) => updateFormData({ allowOverride: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="apache-allow-override"
                >
                  <option value="None">None (허용 안 함)</option>
                  <option value="All">All (모두 허용)</option>
                  <option value="AuthConfig">AuthConfig (인증 설정만)</option>
                  <option value="FileInfo">FileInfo (파일 정보만)</option>
                  <option value="Indexes">Indexes (목록 표시만)</option>
                  <option value="Limit">Limit (접근 제한만)</option>
                </select>
              }
              hint=".htaccess 파일의 적용 여부를 지정합니다."
              description="AllowOverride"
            />
            <SettingItem
              label="디렉터리 목록 표시"
              docKey="apache_Indexes"
              input={renderToggle("Indexes", toggles, updateToggles)}
              hint="디렉터리에 index 파일이 없을 때 파일 목록을 표시합니다."
              description="Indexes"
            />
          </div>

          {/* 로깅 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📝 로깅 설정</h3>
            <SettingItem
              label="로그 레벨"
              docKey="apache_LogLevel"
              input={
                <select
                  value={formData.logLevel}
                  onChange={(e) => updateFormData({ logLevel: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="apache-log-level"
                >
                  <option value="debug">debug (가장 상세)</option>
                  <option value="info">info (정보)</option>
                  <option value="notice">notice (알림)</option>
                  <option value="warn">warn (경고, 권장)</option>
                  <option value="error">error (오류만)</option>
                  <option value="crit">crit (심각한 오류만)</option>
                  <option value="alert">alert (경고만)</option>
                  <option value="emerg">emerg (긴급만)</option>
                </select>
              }
              hint="기록할 로그의 상세 수준을 지정합니다."
              description="LogLevel"
            />
            <SettingItem
              label="에러 로그 경로"
              docKey="apache_ErrorLog"
              input={
                <input
                  type="text"
                  value={formData.errorLog}
                  onChange={(e) => updateFormData({ errorLog: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="apache-error-log"
                />
              }
              hint="에러 로그가 저장될 파일 경로입니다."
              description="ErrorLog"
            />
            <SettingItem
              label="접속 로그 설정"
              docKey="apache_CustomLog"
              input={
                <input
                  type="text"
                  value={formData.customLog}
                  onChange={(e) => updateFormData({ customLog: e.target.value })}
                  placeholder="logs/access_log common"
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="apache-custom-log"
                />
              }
              hint="접속 로그의 파일 경로와 형식을 지정합니다."
              description="CustomLog"
            />
          </div>

          {/* 고급 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔧 고급 설정</h3>
            <SettingItem
              label="실행 사용자"
              docKey="apache_User"
              input={
                <input
                  type="text"
                  value={formData.user}
                  onChange={(e) => updateFormData({ user: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="apache-user"
                />
              }
              hint="Apache 프로세스가 실행될 사용자입니다."
              description="User"
            />
            <SettingItem
              label="실행 그룹"
              docKey="apache_Group"
              input={
                <input
                  type="text"
                  value={formData.group}
                  onChange={(e) => updateFormData({ group: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="apache-group"
                />
              }
              hint="Apache 프로세스가 실행될 그룹입니다."
              description="Group"
            />
            <SettingItem
              label="서버 버전 정보 표시"
              docKey="apache_ServerTokens"
              input={
                <select
                  value={formData.serverTokens}
                  onChange={(e) => updateFormData({ serverTokens: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="apache-server-tokens"
                >
                  <option value="Full">Full (전체 정보)</option>
                  <option value="OS">OS (OS 정보만)</option>
                  <option value="Min">Min (최소 정보)</option>
                  <option value="Major">Major (주 버전만)</option>
                  <option value="Minor">Minor (부 버전만)</option>
                  <option value="Prod">Prod (정보 숨김, 권장)</option>
                </select>
              }
              hint="HTTP 응답 헤더에 표시할 서버 정보 수준입니다."
              description="ServerTokens"
            />
            <SettingItem
              label="요청 타임아웃 (초)"
              docKey="apache_Timeout"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.timeout}
                  onChange={(e) => updateFormData({ timeout: parseInt(e.target.value) || 60 })}
                  validator={(val) => {
                    const num = parseInt(val);
                    if (isNaN(num) || num < 1) {
                      return { valid: false, error: "타임아웃은 1초 이상이어야 합니다." };
                    }
                    return { valid: true, error: null };
                  }}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="apache-timeout"
                />
              }
              hint="요청 처리 최대 대기 시간입니다."
              description="Timeout"
            />
            <SettingItem
              label="호스트명 조회"
              docKey="apache_HostnameLookups"
              input={
                <div
                  onClick={() => updateFormData({ hostnameLookups: !formData.hostnameLookups })}
                  role="switch"
                  aria-checked={formData.hostnameLookups}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      updateFormData({ hostnameLookups: !formData.hostnameLookups });
                    }
                  }}
                  style={{
                    display: "inline-block",
                    width: "46px",
                    height: "24px",
                    backgroundColor: formData.hostnameLookups ? "#4ade80" : "#888",
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
                      left: formData.hostnameLookups ? "24px" : "3px",
                      width: "18px",
                      height: "18px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      transition: "left 0.3s"
                    }}
                  />
                </div>
              }
              hint="클라이언트 IP 주소를 호스트명으로 변환합니다. (성능 저하 가능)"
              description="HostnameLookups"
            />
            <SettingItem
              label="심볼릭 링크 추적"
              docKey="apache_FollowSymLinks"
              input={renderToggle("FollowSymLinks", toggles, updateToggles)}
              hint="심볼릭 링크를 따라가도록 허용합니다."
              description="FollowSymLinks"
            />
            <SettingItem
              label="소유자 일치 시 링크 허용"
              docKey="apache_SymLinksIfOwnerMatch"
              input={renderToggle("SymLinksIfOwnerMatch", toggles, updateToggles)}
              hint="소유자가 같을 경우 심볼릭 링크를 허용합니다."
              description="SymLinksIfOwnerMatch"
            />
            <SettingItem
              label="CGI 실행 허용"
              docKey="apache_ExecCGI"
              input={renderToggle("ExecCGI", toggles, updateToggles)}
              hint="CGI 프로그램 실행을 허용합니다."
              description="ExecCGI"
            />
          </div>
        </>
      )}
    </PackageConfigLayout>
  );
}
