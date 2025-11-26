import React, { useState, useEffect } from "react";
import { apiFetch, safeJsonParse } from '../../utils/api';

export default function NetworkLog() {
  const [interfaces, setInterfaces] = useState([]);
  const [logType, setLogType] = useState("messages");
  const [logLines, setLogLines] = useState(100);
  const [logContent, setLogContent] = useState("");
  const [networkStats, setNetworkStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadNetworkLog();
  }, [logType, logLines]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [interfacesRes, statsRes] = await Promise.all([
        apiFetch("/main/api/system-info/network"),
        apiFetch("/main/api/system-info/network-stats")
      ]);

      if (interfacesRes.ok) {
        const data = await safeJsonParse(interfacesRes, []);
        setInterfaces(Array.isArray(data) ? data : []);
      } else {
        console.error("네트워크 인터페이스 API 응답 실패:", interfacesRes.status, interfacesRes.statusText);
        setInterfaces([]);
      }

      if (statsRes.ok) {
        const stats = await safeJsonParse(statsRes, null);
        setNetworkStats(stats);
      } else {
        console.error("네트워크 통계 API 응답 실패:", statsRes.status, statsRes.statusText);
        setNetworkStats(null);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNetworkLog = async () => {
    setLogLoading(true);
    try {
      const response = await apiFetch(`/main/api/system-info/network-log?type=${logType}&lines=${logLines}`);
      if (response.ok) {
        const data = await safeJsonParse(response, {});
        setLogContent(data.log || "로그를 불러올 수 없습니다.");
      } else {
        console.error("네트워크 로그 API 응답 실패:", response.status, response.statusText);
        setLogContent("로그를 불러올 수 없습니다.");
      }
    } catch (error) {
      console.error("로그 로드 실패:", error);
      setLogContent("로그를 불러올 수 없습니다.");
    } finally {
      setLogLoading(false);
    }
  };

  const sectionStyle = {
    backgroundColor: "#2b2d31",
    padding: "1.5rem",
    borderRadius: "8px",
    marginBottom: "2rem",
    border: "1px solid #444"
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>🌐 네트워크 상태 및 로그</h2>

      {/* 네트워크 인터페이스 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>네트워크 인터페이스</h3>
        {loading ? (
          <p>로딩 중...</p>
        ) : interfaces.length === 0 ? (
          <p>네트워크 인터페이스 정보를 불러올 수 없습니다.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #444" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>인터페이스명</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>IP 주소</th>
              </tr>
            </thead>
            <tbody>
              {interfaces.map((iface, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #333" }}>
                  <td style={{ padding: "0.75rem" }}>{iface.name || "-"}</td>
                  <td style={{ padding: "0.75rem" }}>{iface.ip || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 네트워크 로그 */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.2rem" }}>네트워크 로그</h3>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <select
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              style={{
                padding: "0.5rem",
                backgroundColor: "#1e1e1e",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "white"
              }}
            >
              <option value="messages">시스템 로그 (/var/log/messages)</option>
              <option value="secure">보안 로그 (/var/log/secure)</option>
              <option value="network">NetworkManager 로그</option>
              <option value="dmesg">커널 네트워크 로그 (dmesg)</option>
            </select>
            <input
              type="number"
              value={logLines}
              onChange={(e) => setLogLines(parseInt(e.target.value) || 100)}
              min="10"
              max="1000"
              style={{
                padding: "0.5rem",
                width: "100px",
                backgroundColor: "#1e1e1e",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "white"
              }}
            />
            <span>줄</span>
            <button
              onClick={loadNetworkLog}
              disabled={logLoading}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: logLoading ? "#555" : "#5865f2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: logLoading ? "not-allowed" : "pointer"
              }}
            >
              {logLoading ? "로딩 중..." : "새로고침"}
            </button>
          </div>
        </div>
        <pre style={{
          backgroundColor: "#1e1e1e",
          padding: "1rem",
          borderRadius: "4px",
          overflow: "auto",
          maxHeight: "500px",
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
          fontSize: "0.9rem",
          border: "1px solid #444"
        }}>
          {logLoading ? "로딩 중..." : (logContent || "로그가 없습니다.")}
        </pre>
      </div>

      {/* 네트워크 통계 */}
      {networkStats && (
        <div style={sectionStyle}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>네트워크 통계</h3>
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "#aaa" }}>인터페이스 통계</h4>
            <pre style={{
              backgroundColor: "#1e1e1e",
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto",
              maxHeight: "200px",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              border: "1px solid #444"
            }}>
              {networkStats.interfaces || "통계 정보 없음"}
            </pre>
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "#aaa" }}>연결 통계</h4>
            <pre style={{
              backgroundColor: "#1e1e1e",
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              border: "1px solid #444"
            }}>
              {networkStats.connections || "통계 정보 없음"}
            </pre>
          </div>
          <div>
            <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "#aaa" }}>라우팅 테이블</h4>
            <pre style={{
              backgroundColor: "#1e1e1e",
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto",
              maxHeight: "200px",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              border: "1px solid #444"
            }}>
              {networkStats.routes || "라우팅 정보 없음"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
