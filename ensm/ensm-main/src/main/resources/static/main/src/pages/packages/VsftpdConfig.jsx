// VsftpdConfig.jsx - 리팩토링된 설정 페이지
import React from "react";
import PackageConfigLayout from "../../components/PackageConfigLayout";
import SettingItem from "../../components/SettingItem";
import ValidatedInput from "../../components/ValidatedInput";
import { validatePort, validatePath } from "../../utils/validation";
import { commonStyles } from "../../utils/theme";

export default function VsftpdConfig() {
  const defaultFormData = {
    port: 21,
    local_root: "/var/ftp",
    pasv_min_port: 21100,
    pasv_max_port: 21110,
    max_clients: 0,
    max_per_ip: 0,
    idle_session_timeout: 600,
    data_connection_timeout: 300
  };

  const defaultToggles = {
    firewallEnabled: false,
    anonymous_enable: false,
    local_enable: true,
    write_enable: true,
    chroot_local_user: true,
    allow_writeable_chroot: false,
    userlist_enable: false,
    ssl_enable: false,
    pasv_enable: true,
    tcp_wrappers: true
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
      packageId="vsftpd"
      title="vsftpd FTP 서버 설정"
      defaultFormData={defaultFormData}
      defaultToggles={defaultToggles}
    >
      {({ formData, toggles, updateFormData, updateToggles, loading, restarting }) => (
        <>
          {/* 포트 및 방화벽 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🌐 네트워크 설정</h3>
            <SettingItem
              label="FTP 서버 포트"
              docKey="vsftpd_Port"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.port}
                  onChange={(e) => updateFormData({ port: parseInt(e.target.value) || 21 })}
                  validator={(val) => validatePort(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="vsftpd-port"
                />
              }
              hint="FTP 서버가 수신할 포트 번호입니다."
              description="listen_port"
            />
            <SettingItem
              label="방화벽 포트 허용"
              docKey="vsftpd_Firewall"
              input={renderToggle("firewallEnabled", toggles, updateToggles)}
              hint="방화벽에서 해당 포트를 자동으로 허용합니다."
              description="방화벽 규칙 (ufw/firewalld)"
            />
          </div>

          {/* 기본 접근 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔐 접근 제어</h3>
            <SettingItem
              label="로컬 사용자 접근 허용"
              docKey="vsftpd_Local"
              input={renderToggle("local_enable", toggles, updateToggles)}
              hint="시스템 사용자 계정으로 FTP 접근을 허용합니다."
              description="local_enable"
            />
            <SettingItem
              label="익명 사용자 접근 허용"
              docKey="vsftpd_Anonymous"
              input={renderToggle("anonymous_enable", toggles, updateToggles)}
              hint="익명(anonymous) 사용자의 접근을 허용합니다. (보안상 권장하지 않음)"
              description="anonymous_enable"
            />
            <SettingItem
              label="파일 쓰기 권한"
              docKey="vsftpd_Write"
              input={renderToggle("write_enable", toggles, updateToggles)}
              hint="파일 업로드 및 수정을 허용합니다."
              description="write_enable"
            />
            <SettingItem
              label="사용자 홈 디렉토리 제한"
              docKey="vsftpd_Chroot"
              input={renderToggle("chroot_local_user", toggles, updateToggles)}
              hint="로컬 사용자를 자신의 홈 디렉토리로 제한합니다. (보안 강화)"
              description="chroot_local_user"
            />
            <SettingItem
              label="제한된 디렉토리 내 쓰기 허용"
              docKey="vsftpd_AllowWriteableChroot"
              input={renderToggle("allow_writeable_chroot", toggles, updateToggles)}
              hint="chroot 제한된 디렉토리 내에서도 쓰기를 허용합니다."
              description="allow_writeable_chroot"
            />
            <SettingItem
              label="사용자 목록 사용"
              docKey="vsftpd_Userlist"
              input={renderToggle("userlist_enable", toggles, updateToggles)}
              hint="사용자 목록 파일을 사용하여 접근을 제어합니다."
              description="userlist_enable"
            />
          </div>

          {/* 디렉토리 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📁 디렉토리 설정</h3>
            <SettingItem
              label="로컬 사용자 루트 디렉토리"
              docKey="vsftpd_LocalRoot"
              input={
                <ValidatedInput
                  type="text"
                  value={formData.local_root}
                  onChange={(e) => updateFormData({ local_root: e.target.value })}
                  validator={(val) => validatePath(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="vsftpd-local-root"
                />
              }
              hint="로컬 사용자의 기본 디렉토리 경로입니다."
              description="local_root"
            />
          </div>

          {/* 수동 모드 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔌 수동 모드 (PASV) 설정</h3>
            <SettingItem
              label="수동 모드 활성화"
              docKey="vsftpd_Pasv"
              input={renderToggle("pasv_enable", toggles, updateToggles)}
              hint="수동 모드(PASV) 연결을 허용합니다. 방화벽 환경에서 필요합니다."
              description="pasv_enable"
            />
            {toggles.pasv_enable && (
              <>
                <SettingItem
                  label="수동 모드 최소 포트"
                  docKey="vsftpd_PasvMinPort"
                  input={
                    <ValidatedInput
                      type="number"
                      value={formData.pasv_min_port}
                      onChange={(e) => updateFormData({ pasv_min_port: parseInt(e.target.value) || 21100 })}
                      validator={(val) => validatePort(val)}
                      disabled={loading || restarting}
                      style={{ ...commonStyles.input, width: "240px" }}
                      id="vsftpd-pasv-min-port"
                    />
                  }
                  hint="수동 모드 연결에 사용할 최소 포트 번호입니다."
                  description="pasv_min_port"
                />
                <SettingItem
                  label="수동 모드 최대 포트"
                  docKey="vsftpd_PasvMaxPort"
                  input={
                    <ValidatedInput
                      type="number"
                      value={formData.pasv_max_port}
                      onChange={(e) => updateFormData({ pasv_max_port: parseInt(e.target.value) || 21110 })}
                      validator={(val) => validatePort(val)}
                      disabled={loading || restarting}
                      style={{ ...commonStyles.input, width: "240px" }}
                      id="vsftpd-pasv-max-port"
                    />
                  }
                  hint="수동 모드 연결에 사용할 최대 포트 번호입니다."
                  description="pasv_max_port"
                />
              </>
            )}
          </div>

          {/* 고급 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔧 고급 설정</h3>
            <SettingItem
              label="SSL/TLS 암호화 사용"
              docKey="vsftpd_SSL"
              input={renderToggle("ssl_enable", toggles, updateToggles)}
              hint="FTPS(암호화된 FTP) 연결을 허용합니다."
              description="ssl_enable"
            />
            <SettingItem
              label="TCP 래퍼 사용"
              docKey="vsftpd_TcpWrappers"
              input={renderToggle("tcp_wrappers", toggles, updateToggles)}
              hint="TCP 래퍼를 사용하여 접근을 제어합니다."
              description="tcp_wrappers"
            />
            <SettingItem
              label="최대 동시 연결 수"
              docKey="vsftpd_MaxClients"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.max_clients}
                  onChange={(e) => updateFormData({ max_clients: parseInt(e.target.value) || 0 })}
                  validator={(val) => {
                    const num = parseInt(val);
                    if (isNaN(num) || num < 0) {
                      return { valid: false, error: "0 이상의 숫자여야 합니다." };
                    }
                    return { valid: true, error: null };
                  }}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="vsftpd-max-clients"
                />
              }
              hint="동시에 접속할 수 있는 최대 클라이언트 수입니다. (0 = 제한 없음)"
              description="max_clients"
            />
            <SettingItem
              label="IP당 최대 연결 수"
              docKey="vsftpd_MaxPerIp"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.max_per_ip}
                  onChange={(e) => updateFormData({ max_per_ip: parseInt(e.target.value) || 0 })}
                  validator={(val) => {
                    const num = parseInt(val);
                    if (isNaN(num) || num < 0) {
                      return { valid: false, error: "0 이상의 숫자여야 합니다." };
                    }
                    return { valid: true, error: null };
                  }}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="vsftpd-max-per-ip"
                />
              }
              hint="하나의 IP에서 동시에 접속할 수 있는 최대 연결 수입니다. (0 = 제한 없음)"
              description="max_per_ip"
            />
            <SettingItem
              label="유휴 세션 타임아웃 (초)"
              docKey="vsftpd_IdleTimeout"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.idle_session_timeout}
                  onChange={(e) => updateFormData({ idle_session_timeout: parseInt(e.target.value) || 600 })}
                  validator={(val) => {
                    const num = parseInt(val);
                    if (isNaN(num) || num < 1) {
                      return { valid: false, error: "1초 이상이어야 합니다." };
                    }
                    return { valid: true, error: null };
                  }}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="vsftpd-idle-timeout"
                />
              }
              hint="활동이 없을 때 세션을 종료할 시간입니다."
              description="idle_session_timeout"
            />
            <SettingItem
              label="데이터 연결 타임아웃 (초)"
              docKey="vsftpd_DataTimeout"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.data_connection_timeout}
                  onChange={(e) => updateFormData({ data_connection_timeout: parseInt(e.target.value) || 300 })}
                  validator={(val) => {
                    const num = parseInt(val);
                    if (isNaN(num) || num < 1) {
                      return { valid: false, error: "1초 이상이어야 합니다." };
                    }
                    return { valid: true, error: null };
                  }}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="vsftpd-data-timeout"
                />
              }
              hint="데이터 전송 연결의 최대 대기 시간입니다."
              description="data_connection_timeout"
            />
          </div>
        </>
      )}
    </PackageConfigLayout>
  );
}
