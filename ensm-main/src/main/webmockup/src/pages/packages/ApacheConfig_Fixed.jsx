// ApacheConfig.jsx - API 연동 추가
import React, { useState, useRef } from "react";
import { HelpCircle } from "lucide-react";
import { useOutletContext } from "react-router-dom";

export default function ApacheConfig() {
  const [showHint, setShowHint] = useState(null);
  const [toggles, setToggles] = useState({});
  const [formData, setFormData] = useState({
    port: 80,
    serverName: "",
    documentRoot: "/var/www/html",
    user: "apache",
    group: "apache"
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const hintRefs = useRef({});
  const { setSelectedDocKey, setDocContent } = useOutletContext();

  const toggleSwitch = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/main/api/apache-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          apply: true
        })
      });

      const result = await response.text();

      if (response.ok) {
        setMessage("설정이 적용되었습니다.");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("설정 적용 실패: " + result);
      }
    } catch (error) {
      console.error("설정 저장 실패:", error);
      setMessage("설정 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const loadMarkdown = async (label) => {
    try {
      const response = await fetch(`/main/descriptions/${label}.md`);
      const text = await response.text();
      setDocContent(text);
      setSelectedDocKey(label);
      setShowHint(null);
    } catch (err) {
      console.error(`❌ 설명서 로드 실패: ${label}`, err);
      setDocContent("설명을 불러오는 데 실패했습니다.");
      setSelectedDocKey(label);
      setShowHint(null);
    }
  };

  const renderSetting = (label, input, hint, description) => (
    <div style={{ marginBottom: "1.5rem", position: "relative", zIndex: 1000 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: "40%", position: "relative" }}>
          <label style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
            {label}
            <span style={{ display: "flex", alignItems: "center", marginLeft: "8px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint(label);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ccc",
                  padding: 0,
                  display: "flex",
                  alignItems: "center"
                }}
                title="간단 설명 보기"
                ref={(el) => (hintRefs.current[label] = el)}
              >
                <HelpCircle size={16} />
              </button>
            </span>
          </label>
          <div style={{ fontSize: "0.85rem", color: "#aaa", marginTop: "0.25rem" }}>{description}</div>
        </div>
        <div style={{ width: "55%", textAlign: "right" }}>{input}</div>
      </div>
      {showHint === label && (
        <div
          style={{
            position: "absolute",
            left: "0px",
            top: "-90px",
            backgroundColor: "#fff",
            color: "black",
            padding: "10px 12px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            minWidth: "240px",
            zIndex: 100001
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
            <strong>{label}</strong>
            <span style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => loadMarkdown(label)}
                title="설명서 보기"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  color: "#555",
                  fontSize: "1.1rem",
                  cursor: "pointer"
                }}
              >
                📄
              </button>
              <button
                onClick={() => setShowHint(null)}
                title="닫기"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  color: "#555",
                  fontSize: "1.1rem",
                  cursor: "pointer"
                }}
              >
                ❌
              </button>
            </span>
          </div>
          <div style={{ fontSize: "0.9rem" }}>{hint}</div>
        </div>
      )}
    </div>
  );

  const renderToggle = (key) => (
    <div
      onClick={() => toggleSwitch(key)}
      style={{
        display: "inline-block",
        width: "46px",
        height: "24px",
        backgroundColor: toggles[key] ? "#4ade80" : "#888",
        borderRadius: "24px",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.3s"
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

  const inputStyle = {
    padding: "6px 10px",
    width: "240px",
    backgroundColor: "#1e1f22",
    color: "white",
    border: "1px solid #555",
    borderRadius: "4px",
    textAlign: "right"
  };

  return (
    <div style={{ padding: "1rem", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Apache httpd.conf 설정</h2>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: loading ? "#555" : "#5865f2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "500"
          }}
        >
          {loading ? "적용 중..." : "설정 적용"}
        </button>
      </div>

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

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📂 Server Settings</h3>
        {renderSetting(
          "Port",
          <input
            type="number"
            value={formData.port}
            onChange={(e) => handleInputChange("port", parseInt(e.target.value))}
            placeholder="80"
            style={inputStyle}
          />,
          "Apache가 수신할 포트 번호입니다.",
          "서버 포트"
        )}
        {renderSetting(
          "ServerName",
          <input
            type="text"
            value={formData.serverName}
            onChange={(e) => handleInputChange("serverName", e.target.value)}
            placeholder="localhost"
            style={inputStyle}
          />,
          "도메인 또는 IP를 지정하여 요청을 처리합니다.",
          "서버 도메인명"
        )}
        {renderSetting(
          "DocumentRoot",
          <input
            type="text"
            value={formData.documentRoot}
            onChange={(e) => handleInputChange("documentRoot", e.target.value)}
            placeholder="/var/www/html"
            style={inputStyle}
          />,
          "웹 문서의 기본 경로를 지정합니다.",
          "웹 문서 루트 경로"
        )}
        {renderSetting(
          "User",
          <input
            type="text"
            value={formData.user}
            onChange={(e) => handleInputChange("user", e.target.value)}
            placeholder="apache"
            style={inputStyle}
          />,
          "Apache 프로세스가 실행될 사용자입니다.",
          "실행 사용자"
        )}
        {renderSetting(
          "Group",
          <input
            type="text"
            value={formData.group}
            onChange={(e) => handleInputChange("group", e.target.value)}
            placeholder="apache"
            style={inputStyle}
          />,
          "Apache 프로세스가 실행될 그룹입니다.",
          "실행 그룹"
        )}
      </div>

      {/* 기타 설정들은 UI만 표시 (향후 확장 가능) */}
      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📝 Logging</h3>
        {renderSetting("LogLevel", <select style={inputStyle} defaultValue="warn">
          <option value="debug">debug</option>
          <option value="info">info</option>
          <option value="notice">notice</option>
          <option value="warn">warn</option>
          <option value="error">error</option>
          <option value="crit">crit</option>
          <option value="alert">alert</option>
          <option value="emerg">emerg</option>
        </select>, "기록할 로그의 상세 수준을 지정합니다.", "로그 레벨 설정")}
        {renderSetting("ErrorLog", <input type="text" placeholder="logs/error_log" style={inputStyle} />, "에러 로그가 저장될 파일 경로입니다.", "에러 로그 경로")}
        {renderSetting("CustomLog", <input type="text" placeholder="logs/access_log common" style={inputStyle} />, "접속 로그의 파일 경로와 형식을 지정합니다.", "접속 로그 설정")}
      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔐 Access Control</h3>
        {renderSetting("Require", <input type="text" placeholder="all granted" style={inputStyle} />, "접근을 허용할 조건을 지정합니다. 예: all granted", "접근 제어 규칙")}
        {renderSetting("AllowOverride", <select style={inputStyle} defaultValue="All">
          <option value="None">None</option>
          <option value="All">All</option>
        </select>, ".htaccess 파일의 적용 여부를 지정합니다.", "디렉터리 별 설정 허용")}
      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📁 Directory Options</h3>
        {renderSetting("Indexes", renderToggle("Indexes"), "디렉토리 목록을 보여줄지 여부입니다.", "디렉터리 목록 표시")}
        {renderSetting("FollowSymLinks", renderToggle("FollowSymLinks"), "심볼릭 링크를 따라가도록 허용합니다.", "링크 추적 허용 여부")}
        {renderSetting("SymLinksIfOwnerMatch", renderToggle("SymLinksIfOwnerMatch"), "소유자가 같을 경우 심볼릭 링크를 허용합니다.", "소유자 일치 시 링크 허용")}
        {renderSetting("ExecCGI", renderToggle("ExecCGI"), "CGI 프로그램 실행을 허용합니다.", "CGI 실행 허용")}
      </div>
    </div>
  );
}

