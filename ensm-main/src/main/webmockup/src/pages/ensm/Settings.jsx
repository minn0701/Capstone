import React, { useState, useEffect } from "react";
import SettingItem from "../../components/SettingItem";

export default function Settings() {
  const [config, setConfig] = useState({
    authLogPath: "",
    mainLogPath: "",
    ensmScriptsBasePath: "",
    apacheScriptPath: "",
    apacheSshEnabled: false,
    apacheSshHost: "",
    apacheSshUser: "",
    apacheSshPassword: "",
    bindScriptPath: "",
    systemName: "",
    accessRange: "",
    kibanaBaseUrl: ""
  });
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadConfig();
    loadUsers();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch("/main/api/system-config");
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error("설정 로드 실패:", error);
      setMessage("설정을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch("/auth/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("사용자 목록 로드 실패:", error);
    }
  };

  const handleAddUser = async () => {
    if (!newUsername || !newPassword) {
      setMessage("사용자명과 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    try {
      const response = await fetch("/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          username: newUsername,
          password: newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("사용자가 추가되었습니다.");
        setNewUsername("");
        setNewPassword("");
        loadUsers();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "사용자 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("사용자 추가 실패:", error);
      setMessage("사용자 추가 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteUser = async (username) => {
    if (!window.confirm(`정말로 사용자 "${username}"을(를) 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`/auth/users/${username}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("사용자가 삭제되었습니다.");
        loadUsers();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "사용자 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("사용자 삭제 실패:", error);
      setMessage("사용자 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/main/api/system-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(config)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("설정이 저장되었습니다.");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "설정 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("설정 저장 실패:", error);
      setMessage("설정 저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#2b2d31",
    border: "1px solid #444",
    borderRadius: "4px",
    color: "white",
    fontSize: "0.9rem",
    marginBottom: "1rem"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    color: "#ccc",
    fontSize: "0.9rem",
    fontWeight: "500"
  };

  const sectionStyle = {
    backgroundColor: "#2b2d31",
    padding: "1.5rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    border: "1px solid #444"
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: "white" }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>⚙️ ENSM 기본 설정</h2>

      {message && (
        <div style={{
          padding: "0.75rem",
          marginBottom: "1rem",
          borderRadius: "4px",
          backgroundColor: message.includes("실패") ? "#3a1a1a" : "#1a3a1a",
          color: message.includes("실패") ? "#ff6666" : "#66ff66",
          border: `1px solid ${message.includes("실패") ? "#ff4444" : "#44ff44"}`
        }}>
          {message}
        </div>
      )}

      {/* 로그 파일 경로 설정 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>📝 로그 파일 경로</h3>
        
        <SettingItem
          label="인증 서버 로그 경로"
          input={
            <input
              type="text"
              style={{ ...inputStyle, width: "100%" }}
              value={config.authLogPath}
              onChange={(e) => setConfig({ ...config, authLogPath: e.target.value })}
              placeholder="/var/log/auth/auth-app.log"
            />
          }
          hint="인증 서버(ensm-auth)의 로그 파일이 저장될 경로를 지정합니다."
          description="로그 파일 경로"
        />

        <SettingItem
          label="메인 서버 로그 경로"
          input={
            <input
              type="text"
              style={{ ...inputStyle, width: "100%" }}
              value={config.mainLogPath}
              onChange={(e) => setConfig({ ...config, mainLogPath: e.target.value })}
              placeholder="/var/log/main/main-app.log"
            />
          }
          hint="메인 서버(ensm-main)의 로그 파일이 저장될 경로를 지정합니다."
          description="로그 파일 경로"
        />
      </div>

      {/* 스크립트 경로 설정 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>📜 스크립트 경로 설정</h3>
        
        <SettingItem
          label="ENSM 스크립트 기본 경로"
          input={
            <input
              type="text"
              style={{ ...inputStyle, width: "100%" }}
              value={config.ensmScriptsBasePath}
              onChange={(e) => setConfig({ ...config, ensmScriptsBasePath: e.target.value })}
              placeholder="/usr/local/bin/ensm-scripts"
            />
          }
          hint="ENSM 스크립트들이 위치한 기본 디렉토리 경로를 지정합니다. 서버에 배포된 스크립트 폴더의 경로입니다."
          description="스크립트 기본 경로"
        />
      </div>

      {/* Apache 설정 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>🌐 Apache 설정</h3>
        
        <SettingItem
          label="Apache 스크립트 경로"
          input={
            <input
              type="text"
              style={{ ...inputStyle, width: "100%" }}
              value={config.apacheScriptPath}
              onChange={(e) => setConfig({ ...config, apacheScriptPath: e.target.value })}
              placeholder="/usr/local/bin/ensm-scripts/apache/configure_apache.sh"
            />
          }
          hint="Apache 설정을 변경하는 쉘 스크립트의 전체 경로를 지정합니다. 기본값: /usr/local/bin/ensm-scripts/apache/configure_apache.sh"
          description="스크립트 경로"
        />

        <SettingItem
          label="SSH를 통한 원격 실행 사용"
          input={
            <input
              type="checkbox"
              checked={config.apacheSshEnabled}
              onChange={(e) => setConfig({ ...config, apacheSshEnabled: e.target.checked })}
              style={{ width: "auto" }}
            />
          }
          hint="원격 서버에서 Apache 설정을 변경할 때 SSH를 통해 실행할지 여부를 지정합니다."
          description="원격 실행 여부"
        />

        {config.apacheSshEnabled && (
          <>
            <SettingItem
              label="SSH 호스트"
              input={
                <input
                  type="text"
                  style={{ ...inputStyle, width: "100%" }}
                  value={config.apacheSshHost}
                  onChange={(e) => setConfig({ ...config, apacheSshHost: e.target.value })}
                  placeholder="192.168.1.100"
                />
              }
              hint="원격 서버의 IP 주소 또는 호스트명을 지정합니다."
              description="호스트 주소"
            />

            <SettingItem
              label="SSH 사용자"
              input={
                <input
                  type="text"
                  style={{ ...inputStyle, width: "100%" }}
                  value={config.apacheSshUser}
                  onChange={(e) => setConfig({ ...config, apacheSshUser: e.target.value })}
                  placeholder="root"
                />
              }
              hint="SSH 접속에 사용할 사용자명을 지정합니다."
              description="사용자명"
            />

            <SettingItem
              label="SSH 비밀번호"
              input={
                <input
                  type="password"
                  style={{ ...inputStyle, width: "100%" }}
                  value={config.apacheSshPassword}
                  onChange={(e) => setConfig({ ...config, apacheSshPassword: e.target.value })}
                  placeholder="비밀번호"
                />
              }
              hint="SSH 접속에 사용할 비밀번호를 지정합니다. (보안상 주의 필요)"
              description="비밀번호"
            />
          </>
        )}
      </div>

      {/* BIND 설정 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>🌐 BIND DNS 설정</h3>
        
        <SettingItem
          label="BIND 스크립트 경로"
          input={
            <input
              type="text"
              style={{ ...inputStyle, width: "100%" }}
              value={config.bindScriptPath}
              onChange={(e) => setConfig({ ...config, bindScriptPath: e.target.value })}
              placeholder="/usr/local/bin/ensm-scripts/bind/configure_bind.sh"
            />
          }
          hint="BIND DNS 설정을 변경하는 쉘 스크립트의 전체 경로를 지정합니다. 기본값: /usr/local/bin/ensm-scripts/bind/configure_bind.sh"
          description="스크립트 경로"
        />
      </div>

      {/* 시스템 설정 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>🖥️ 시스템 설정</h3>
        
        <SettingItem
          label="시스템 이름"
          input={
            <input
              type="text"
              style={{ ...inputStyle, width: "100%" }}
              value={config.systemName}
              onChange={(e) => setConfig({ ...config, systemName: e.target.value })}
              placeholder="ENSM"
            />
          }
          hint="ENSM 시스템의 이름을 지정합니다. 대시보드 및 UI에 표시됩니다."
          description="시스템 식별명"
        />

        <SettingItem
          label="접속 가능 범위 (CIDR)"
          input={
            <input
              type="text"
              style={{ ...inputStyle, width: "100%" }}
              value={config.accessRange}
              onChange={(e) => setConfig({ ...config, accessRange: e.target.value })}
              placeholder="0.0.0.0/0"
            />
          }
          hint="시스템에 접속할 수 있는 IP 주소 범위를 CIDR 형식으로 지정합니다. 예: 192.168.1.0/24"
          description="접속 허용 범위"
        />
      </div>

      {/* 모니터링 설정 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>📊 모니터링 설정</h3>
        
        <SettingItem
          label="Kibana 기본 URL (나중에 Prometheus + Grafana로 변경 예정)"
          input={
            <input
              type="text"
              style={{ ...inputStyle, width: "100%" }}
              value={config.kibanaBaseUrl}
              onChange={(e) => setConfig({ ...config, kibanaBaseUrl: e.target.value })}
              placeholder="/kibana"
            />
          }
          hint="모니터링 대시보드의 기본 URL을 지정합니다. 향후 Prometheus + Grafana로 변경 예정입니다."
          description="모니터링 URL"
        />
      </div>

      {/* 사용자 관리 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>👥 사용자 관리</h3>
        
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "#ccc" }}>등록된 사용자</h4>
          {users.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.9rem" }}>등록된 사용자가 없습니다.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {users.map((user, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    backgroundColor: "#1e1e1e",
                    borderRadius: "4px",
                    border: "1px solid #444"
                  }}
                >
                  <span style={{ color: "#fff" }}>{user.username}</span>
                  <button
                    onClick={() => handleDeleteUser(user.username)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.85rem"
                    }}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid #444", paddingTop: "1rem" }}>
          <h4 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "#ccc" }}>새 사용자 추가</h4>
          <input
            type="text"
            style={inputStyle}
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="사용자명"
          />
          <input
            type="password"
            style={inputStyle}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="비밀번호 (6자 이상)"
          />
          <button
            onClick={handleAddUser}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#5865f2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem"
            }}
          >
            사용자 추가
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: "0.75rem 2rem",
          backgroundColor: saving ? "#555" : "#5865f2",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontSize: "1rem",
          cursor: saving ? "not-allowed" : "pointer",
          fontWeight: "500"
        }}
      >
        {saving ? "저장 중..." : "설정 저장"}
      </button>
    </div>
  );
}

