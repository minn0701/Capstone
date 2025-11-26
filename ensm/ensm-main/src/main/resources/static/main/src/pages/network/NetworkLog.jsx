import React, { useState, useEffect } from "react";
import { apiFetch, safeJsonParse } from '../../utils/api';
// commonStyles가 있다면 import 하셔도 좋지만, 
// 이 컴포넌트 내에서 완결되도록 스타일을 모두 포함시켰습니다.

export default function NetworkLog() {
  // ==========================================
  // Logic Section (기존 로직 유지)
  // ==========================================
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
        console.error("네트워크 인터페이스 API 응답 실패");
        setInterfaces([]);
      }

      if (statsRes.ok) {
        const stats = await safeJsonParse(statsRes, null);
        setNetworkStats(stats);
      } else {
        console.error("네트워크 통계 API 응답 실패");
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
        setLogContent("로그를 불러올 수 없습니다.");
      }
    } catch (error) {
      console.error("로그 로드 실패:", error);
      setLogContent("로그를 불러올 수 없습니다.");
    } finally {
      setLogLoading(false);
    }
  };

  // ==========================================
  // Render Section (디자인 개선)
  // ==========================================

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>네트워크 정보를 분석 중...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>네트워크 모니터링</h2>
        <p style={styles.pageSubtitle}>시스템의 네트워크 인터페이스 상태와 실시간 로그를 확인합니다.</p>
      </header>

      <div style={styles.gridContainer}>
        
        {/* 1. 네트워크 인터페이스 (왼쪽 상단 배치 가정, 혹은 전체 너비) */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>인터페이스 목록</h3>
          {interfaces.length === 0 ? (
            <p style={styles.emptyText}>인터페이스 정보를 불러올 수 없습니다.</p>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>인터페이스</th>
                    <th style={styles.th}>IP 주소</th>
                  </tr>
                </thead>
                <tbody>
                  {interfaces.map((iface, index) => (
                    <tr key={index} style={styles.tr}>
                      <td style={styles.td}>
                        <span style={styles.badge}>{iface.name || "-"}</span>
                      </td>
                      <td style={styles.td}>{iface.ip || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* 2. 네트워크 로그 (가장 중요한 부분이므로 크게) */}
        <section style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <div style={styles.cardHeaderRow}>
            <h3 style={{...styles.cardTitle, marginBottom: 0, borderBottom: 'none'}}>시스템/네트워크 로그</h3>
            
            {/* 로그 컨트롤 바 */}
            <div style={styles.controlBar}>
              <select
                value={logType}
                onChange={(e) => setLogType(e.target.value)}
                style={styles.select}
              >
                <option value="messages">시스템 로그 (messages)</option>
                <option value="secure">보안 로그 (secure)</option>
                <option value="network">NetworkManager</option>
                <option value="dmesg">커널 (dmesg)</option>
              </select>
              
              <div style={styles.inputGroup}>
                <input
                  type="number"
                  value={logLines}
                  onChange={(e) => setLogLines(parseInt(e.target.value) || 100)}
                  min="10"
                  max="1000"
                  style={styles.inputSmall}
                />
                <span style={styles.suffix}>Lines</span>
              </div>

              <button
                onClick={loadNetworkLog}
                disabled={logLoading}
                style={{
                  ...styles.button,
                  opacity: logLoading ? 0.7 : 1,
                  cursor: logLoading ? "wait" : "pointer"
                }}
              >
                {logLoading ? "갱신 중..." : "새로고침"}
              </button>
            </div>
          </div>

          <div style={styles.terminalWindow}>
            <pre style={styles.terminalContent}>
              {logLoading ? "로그를 불러오는 중입니다..." : (logContent || "표시할 로그가 없습니다.")}
            </pre>
          </div>
        </section>

        {/* 3. 네트워크 통계 (하단 배치) */}
        {networkStats && (
          <section style={{ ...styles.card, gridColumn: "1 / -1" }}>
            <h3 style={styles.cardTitle}>상세 네트워크 통계</h3>
            
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <h4 style={styles.statTitle}>인터페이스 통계</h4>
                <pre style={styles.statContent}>{networkStats.interfaces || "데이터 없음"}</pre>
              </div>
              
              <div style={styles.statBox}>
                <h4 style={styles.statTitle}>연결(Connections) 통계</h4>
                <pre style={styles.statContent}>{networkStats.connections || "데이터 없음"}</pre>
              </div>
              
              <div style={styles.statBox}>
                <h4 style={styles.statTitle}>라우팅 테이블</h4>
                <pre style={styles.statContent}>{networkStats.routes || "데이터 없음"}</pre>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

// ==========================================
// Styles Object
// ==========================================
const styles = {
  pageContainer: {
    padding: "2rem max(2rem, 5vw)",
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    minHeight: "100vh",
    color: "var(--text-primary, #ffffff)",
    fontFamily: "'Pretendard', -apple-system, system-ui, Roboto, sans-serif",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    color: "#ccc",
    backgroundColor: "#1e1e1e"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(255,255,255,0.1)",
    borderLeftColor: "#5865f2",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem"
  },
  header: {
    marginBottom: "2.5rem",
    borderBottom: "1px solid var(--border-color, #444)",
    paddingBottom: "1.5rem"
  },
  pageTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    color: "var(--text-primary, #ffffff)"
  },
  pageSubtitle: {
    color: "var(--text-secondary, #aaaaaa)",
    fontSize: "0.95rem"
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem"
  },
  card: {
    backgroundColor: "var(--bg-secondary, #2b2d31)",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid var(--border-color, #444)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#5a9fd1",
    marginBottom: "1.5rem",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid var(--border-color, #444)"
  },
  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid var(--border-color, #444)",
    flexWrap: "wrap",
    gap: "1rem"
  },
  
  // Table Styles
  tableContainer: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.95rem"
  },
  th: {
    textAlign: "left",
    padding: "1rem",
    color: "#aaa",
    borderBottom: "1px solid #444",
    fontWeight: "600"
  },
  tr: {
    borderBottom: "1px solid #3a3a3a"
  },
  td: {
    padding: "1rem",
    color: "#eee"
  },
  badge: {
    backgroundColor: "rgba(88, 101, 242, 0.15)",
    color: "#8ea1e1",
    padding: "0.2rem 0.6rem",
    borderRadius: "4px",
    fontSize: "0.85rem",
    fontWeight: "500"
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    padding: "2rem"
  },

  // Control Bar Styles
  controlBar: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center"
  },
  select: {
    padding: "0.5rem 0.75rem",
    backgroundColor: "#1e1e1e",
    border: "1px solid #555",
    borderRadius: "6px",
    color: "white",
    fontSize: "0.9rem",
    outline: "none"
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    border: "1px solid #555",
    borderRadius: "6px",
    paddingRight: "0.5rem"
  },
  inputSmall: {
    width: "60px",
    padding: "0.5rem",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    textAlign: "center",
    outline: "none"
  },
  suffix: {
    color: "#888",
    fontSize: "0.8rem",
    userSelect: "none"
  },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#5865f2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "background-color 0.2s"
  },

  // Terminal/Log Styles
  terminalWindow: {
    backgroundColor: "#151515",
    borderRadius: "8px",
    border: "1px solid #333",
    padding: "1rem",
    overflow: "hidden" // 내부 스크롤을 위해
  },
  terminalContent: {
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "0.85rem",
    lineHeight: "1.5",
    color: "#e0e0e0",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
    maxHeight: "500px",
    overflowY: "auto",
    margin: 0
  },

  // Stats Grid Styles
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem"
  },
  statBox: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #3a3a3a"
  },
  statTitle: {
    fontSize: "0.9rem",
    color: "#aaa",
    marginBottom: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  statContent: {
    fontFamily: "monospace",
    fontSize: "0.8rem",
    color: "#cfcfcf",
    whiteSpace: "pre-wrap",
    overflowX: "auto",
    maxHeight: "250px"
  }
};