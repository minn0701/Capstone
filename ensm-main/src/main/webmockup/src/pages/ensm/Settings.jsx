import React, { useState, useEffect } from "react";

export default function Settings() {
  const [config, setConfig] = useState({
    authLogPath: "",
    mainLogPath: "",
    apacheScriptPath: "",
    apacheSshEnabled: false,
    apacheSshHost: "",
    apacheSshUser: "",
    apacheSshPassword: "",
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
    width: "50%",
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
    backgroundColor: "#313338",
    padding: "1rem 1.5rem",
    borderRadius: "8px",
    marginBottom: "2rem"
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
        <h3 style={{ fontSize: "1.3rem", borderBottom: "1.5px solid #666666", fontWeight: "bold", marginBottom: "2rem", color: "#f2f2d3", paddingBottom: "0.4rem" }}>로그 파일 경로</h3>
        
        <label style={labelStyle}>인증 서버 로그 경로</label>
        <input
          type="text"
          style={inputStyle}
          value={config.authLogPath}
          onChange={(e) => setConfig({ ...config, authLogPath: e.target.value })}
          placeholder="/var/log/auth/auth-app.log"
        />

        <label style={labelStyle}>메인 서버 로그 경로</label>
        <input
          type="text"
          style={inputStyle}
          value={config.mainLogPath}
          onChange={(e) => setConfig({ ...config, mainLogPath: e.target.value })}
          placeholder="/var/log/main/main-app.log"
        />
      </div>

      {/* Apache 설정 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.3rem", borderBottom: "1.5px solid #666666", fontWeight: "bold", marginBottom: "2rem", color: "#f2f2d3", paddingBottom: "0.4rem" }}>Apache 설정</h3>
        
        <label style={labelStyle}>Apache 스크립트 경로</label>
        <input
          type="text"
          style={inputStyle}
          value={config.apacheScriptPath}
          onChange={(e) => setConfig({ ...config, apacheScriptPath: e.target.value })}
          placeholder="/usr/local/bin/ensm/configure_apache.sh"
        />

        <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={config.apacheSshEnabled}
            onChange={(e) => setConfig({ ...config, apacheSshEnabled: e.target.checked })}
            style={{ width: "auto" }}
          />
          SSH를 통한 원격 실행 사용
        </label>

        {config.apacheSshEnabled && (
          <>
            <label style={labelStyle}>SSH 호스트</label>
            <input
              type="text"
              style={inputStyle}
              value={config.apacheSshHost}
              onChange={(e) => setConfig({ ...config, apacheSshHost: e.target.value })}
              placeholder="192.168.1.100"
            />

            <label style={labelStyle}>SSH 사용자</label>
            <input
              type="text"
              style={inputStyle}
              value={config.apacheSshUser}
              onChange={(e) => setConfig({ ...config, apacheSshUser: e.target.value })}
              placeholder="root"
            />

            <label style={labelStyle}>SSH 비밀번호</label>
            <input
              type="password"
              style={inputStyle}
              value={config.apacheSshPassword}
              onChange={(e) => setConfig({ ...config, apacheSshPassword: e.target.value })}
              placeholder="비밀번호"
            />
          </>
        )}
      </div>

      {/* 시스템 설정 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.3rem", borderBottom: "1.5px solid #666666", fontWeight: "bold", marginBottom: "2rem", color: "#f2f2d3", paddingBottom: "0.4rem" }}>시스템 설정</h3>
        
        <label style={labelStyle}>시스템 이름</label>
        <input
          type="text"
          style={inputStyle}
          value={config.systemName}
          onChange={(e) => setConfig({ ...config, systemName: e.target.value })}
          placeholder="ENSM"
        />

        <label style={labelStyle}>접속 가능 범위 (CIDR)</label>
        <input
          type="text"
          style={inputStyle}
          value={config.accessRange}
          onChange={(e) => setConfig({ ...config, accessRange: e.target.value })}
          placeholder="0.0.0.0/0"
        />
      </div>

      {/* 모니터링 설정 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.3rem", borderBottom: "1.5px solid #666666", fontWeight: "bold", marginBottom: "2rem", color: "#f2f2d3", paddingBottom: "0.4rem" }}>모니터링 설정</h3>
        
        <label style={labelStyle}>Kibana 기본 URL (나중에 Prometheus + Grafana로 변경 예정)</label>
        <input
          type="text"
          style={inputStyle}
          value={config.kibanaBaseUrl}
          onChange={(e) => setConfig({ ...config, kibanaBaseUrl: e.target.value })}
          placeholder="/kibana"
        />
      </div>

      {/* 사용자 관리 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.3rem", borderBottom: "1.5px solid #666666", fontWeight: "bold", marginBottom: "2rem", color: "#f2f2d3", paddingBottom: "0.4rem" }}>사용자 관리</h3>
        
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
              fontSize: "0.9rem",
              marginLeft: "0.75rem"
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

