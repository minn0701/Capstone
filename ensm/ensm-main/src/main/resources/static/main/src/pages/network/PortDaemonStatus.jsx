import React, { useState, useEffect } from "react";
import { apiFetch, safeJsonParse } from '../../utils/api';

export default function PortDaemonStatus() {
  const [ports, setPorts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // 첫 로드 시에만 전체 로딩 표시, 새로고침 시에는 버튼만 로딩 표시
    if (!refreshing) setLoading(true);
    
    try {
      const [portsRes, servicesRes] = await Promise.all([
        apiFetch("/main/api/system-info/ports"),
        apiFetch("/main/api/system-info/services")
      ]);

      if (portsRes.ok) {
        const portsData = await safeJsonParse(portsRes, []);
        setPorts(Array.isArray(portsData) ? portsData : []);
      }

      if (servicesRes.ok) {
        const servicesData = await safeJsonParse(servicesRes, []);
        setServices(Array.isArray(servicesData) ? servicesData : []);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // 상태에 따른 배지 스타일 반환 헬퍼 함수
  const getStatusStyle = (status) => {
    const s = String(status).toLowerCase();
    if (s.includes('listen') || s.includes('running') || s === 'active') {
      return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }; // Green
    }
    if (s.includes('estab')) {
      return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }; // Blue
    }
    if (s.includes('close') || s.includes('time_wait')) {
      return { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }; // Amber
    }
    if (s.includes('fail') || s.includes('dead') || s.includes('stop')) {
      return { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }; // Red
    }
    return { bg: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af' }; // Gray
  };

  if (loading && !refreshing && ports.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>시스템 포트 및 서비스 스캔 중...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.pageTitle}>시스템 포트 & 데몬</h2>
          <p style={styles.pageSubtitle}>현재 개방된 네트워크 포트와 실행 중인 시스템 서비스를 모니터링합니다.</p>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          style={{
            ...styles.refreshButton,
            opacity: refreshing ? 0.7 : 1,
            cursor: refreshing ? 'wait' : 'pointer'
          }}
        >
          {refreshing ? "스캔 중..." : "상태 새로고침"}
        </button>
      </header>

      <div style={styles.gridContainer}>
        
        {/* 1. 개방 포트 섹션 */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>개방 포트 (Open Ports)</h3>
            <span style={styles.countBadge}>{ports.length}개 활성</span>
          </div>
          
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Proto</th>
                  <th style={styles.th}>Local Address</th>
                  <th style={styles.th}>State</th>
                  <th style={styles.th}>Process/PID</th>
                </tr>
              </thead>
              <tbody>
                {ports.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={styles.emptyText}>개방된 포트가 없거나 정보를 가져올 수 없습니다.</td>
                  </tr>
                ) : (
                  ports.map((port, index) => {
                    const statusStyle = getStatusStyle(port.state);
                    return (
                      <tr key={index} style={styles.tr}>
                        <td style={styles.td}>
                          <span style={styles.protoBadge}>{port.netid}</span>
                        </td>
                        <td style={styles.td}>{port.local}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color
                          }}>
                            {port.state}
                          </span>
                        </td>
                        <td style={{...styles.td, color: "#e0e0e0", fontFamily: 'monospace'}}>
                          {port.process || "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. 실행 중인 서비스 섹션 */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>시스템 서비스 (Daemons)</h3>
            <span style={styles.countBadge}>{services.length}개 서비스</span>
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Service Name</th>
                  <th style={styles.th}>Active State</th>
                  <th style={styles.th}>Sub State</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={styles.emptyText}>서비스 정보를 가져올 수 없습니다.</td>
                  </tr>
                ) : (
                  services.map((service, index) => {
                    const statusStyle = getStatusStyle(service.active);
                    return (
                      <tr key={index} style={styles.tr}>
                        <td style={{...styles.td, fontWeight: '500'}}>{service.name}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color
                          }}>
                            {service.active}
                          </span>
                        </td>
                        <td style={styles.td}>
                           <span style={styles.subState}>{service.sub}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

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
    paddingBottom: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: "1rem"
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
  refreshButton: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#5865f2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "all 0.2s",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem"
  },
  card: {
    backgroundColor: "var(--bg-secondary, #2b2d31)",
    padding: "0", // 패딩 제거하고 내부 컨테이너로 관리
    borderRadius: "12px",
    border: "1px solid var(--border-color, #444)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "hidden", // 테이블 넘침 방지
    display: "flex",
    flexDirection: "column",
    maxHeight: "800px" // 너무 길어지지 않게
  },
  cardHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid var(--border-color, #444)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.02)"
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#5a9fd1",
    margin: 0
  },
  countBadge: {
    backgroundColor: "#1e1e1e",
    border: "1px solid #444",
    padding: "0.3rem 0.8rem",
    borderRadius: "20px",
    fontSize: "0.85rem",
    color: "#ccc"
  },
  
  // Table Styles
  tableContainer: {
    overflowX: "auto",
    overflowY: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.95rem",
    whiteSpace: "nowrap" // 줄바꿈 방지
  },
  th: {
    textAlign: "left",
    padding: "1rem",
    color: "#888",
    borderBottom: "1px solid #444",
    fontWeight: "600",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    backgroundColor: "rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0
  },
  tr: {
    borderBottom: "1px solid #3a3a3a",
    transition: "background-color 0.15s"
  },
  td: {
    padding: "0.9rem 1rem",
    color: "#eee"
  },
  emptyText: {
    padding: "3rem",
    textAlign: "center",
    color: "#666"
  },

  // Badge Styles
  protoBadge: {
    textTransform: "uppercase",
    fontWeight: "700",
    fontSize: "0.8rem",
    color: "#a78bfa"
  },
  statusBadge: {
    padding: "0.25rem 0.6rem",
    borderRadius: "4px",
    fontSize: "0.8rem",
    fontWeight: "600",
    textTransform: "uppercase"
  },
  subState: {
    color: "#9ca3af",
    fontSize: "0.9rem"
  }
};