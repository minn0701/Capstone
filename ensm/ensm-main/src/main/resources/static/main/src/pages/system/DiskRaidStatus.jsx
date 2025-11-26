import React, { useState, useEffect } from "react";
import { apiFetch, safeJsonParse } from '../../utils/api';

export default function DiskRaidStatus() {
  const [disks, setDisks] = useState([]);
  const [raidStatus, setRaidStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [diskRes, raidRes] = await Promise.all([
        apiFetch("/main/api/system-info/disk"),
        apiFetch("/main/api/system-info/raid")
      ]);

      if (diskRes.ok) {
        const diskData = await safeJsonParse(diskRes, []);
        setDisks(Array.isArray(diskData) ? diskData : []);
      } else {
        console.error("디스크 정보 API 응답 실패:", diskRes.status, diskRes.statusText);
        setDisks([]);
      }

      if (raidRes.ok) {
        const raidData = await safeJsonParse(raidRes, {});
        setRaidStatus(raidData.status || "RAID 정보를 불러올 수 없습니다.");
      } else {
        console.error("RAID 정보 API 응답 실패:", raidRes.status, raidRes.statusText);
        setRaidStatus("RAID 정보를 불러올 수 없습니다.");
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 사용량에 따른 색상 결정 헬퍼 함수
  const getUsageColor = (percentStr) => {
    const percent = parseInt(percentStr?.replace('%', '') || 0);
    if (percent >= 90) return "#ef4444"; // Red
    if (percent >= 70) return "#f59e0b"; // Orange
    return "#10b981"; // Green
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>시스템 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>디스크 및 RAID 상태</h2>
        <p style={styles.pageSubtitle}>서버의 저장소 사용량과 RAID 구성을 실시간으로 모니터링합니다.</p>
      </header>

      <div style={styles.gridContainer}>
        {/* 디스크 사용량 섹션 */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>디스크 사용량</h3>
          
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>파일시스템</th>
                  <th style={styles.thRight}>크기</th>
                  <th style={styles.thRight}>사용됨</th>
                  <th style={styles.thRight}>가용</th>
                  <th style={{...styles.th, width: '25%'}}>사용률</th>
                  <th style={styles.th}>마운트</th>
                </tr>
              </thead>
              <tbody>
                {disks.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{...styles.td, textAlign: 'center', padding: '2rem', color: '#666'}}>
                      디스크 정보가 없습니다.
                    </td>
                  </tr>
                ) : (
                  disks.map((disk, index) => {
                    const usageColor = getUsageColor(disk.usePercent);
                    const percentVal = disk.usePercent?.replace('%', '') || '0';
                    
                    return (
                      <tr key={index} style={styles.tr}>
                        <td style={{...styles.td, fontWeight: '500'}}>{disk.filesystem}</td>
                        <td style={styles.tdRight}>{disk.size}</td>
                        <td style={styles.tdRight}>{disk.used}</td>
                        <td style={styles.tdRight}>{disk.avail}</td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ flex: 1, height: '6px', backgroundColor: '#374151', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ 
                                width: `${percentVal}%`, 
                                height: '100%', 
                                backgroundColor: usageColor,
                                borderRadius: '3px',
                                transition: 'width 0.5s ease-out'
                              }} />
                            </div>
                            <span style={{ fontSize: '0.85rem', color: usageColor, minWidth: '35px', textAlign: 'right' }}>
                              {disk.usePercent}
                            </span>
                          </div>
                        </td>
                        <td style={{...styles.td, color: '#aaa'}}>{disk.mounted}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* RAID 상태 섹션 */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>RAID 상태</h3>
          <div style={styles.terminalWindow}>
            <div style={styles.terminalHeader}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>/proc/mdstat output</span>
            </div>
            <pre style={styles.terminalContent}>
              {raidStatus || "RAID 정보를 불러올 수 없습니다."}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}

// ==========================================
// Styles Object (CSS in JS) - Consistent Theme
// ==========================================
const styles = {
  pageContainer: {
    padding: "2rem max(2rem, 5vw)",
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    minHeight: "100vh",
    color: "var(--text-primary, #ffffff)",
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    color: "#ccc",
    gap: "1rem"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(255,255,255,0.1)",
    borderLeftColor: "#5a9fd1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
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
    color: "var(--text-primary, #ffffff)",
    margin: 0
  },
  pageSubtitle: {
    color: "var(--text-secondary, #aaaaaa)",
    fontSize: "0.95rem",
    marginTop: "0.5rem"
  },
  gridContainer: {
    display: "flex",
    flexDirection: "column",
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
  // Table Styles
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #444',
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: '0.9rem',
    minWidth: '600px', // Prevent breaking on small screens
  },
  th: {
    padding: "1rem",
    textAlign: "left",
    backgroundColor: "rgba(0,0,0,0.2)",
    color: "#aaa",
    fontWeight: "600",
    borderBottom: "1px solid #444",
    whiteSpace: 'nowrap'
  },
  thRight: {
    padding: "1rem",
    textAlign: "right",
    backgroundColor: "rgba(0,0,0,0.2)",
    color: "#aaa",
    fontWeight: "600",
    borderBottom: "1px solid #444",
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: "1px solid #374151",
    transition: 'background-color 0.2s'
  },
  td: {
    padding: "1rem",
    color: "#fff",
    verticalAlign: 'middle'
  },
  tdRight: {
    padding: "1rem",
    textAlign: "right",
    color: "#eee",
    fontFamily: "'Roboto Mono', monospace",
    verticalAlign: 'middle'
  },
  // Terminal Styles for RAID
  terminalWindow: {
    backgroundColor: "#111827",
    borderRadius: "8px",
    border: "1px solid #374151",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
  },
  terminalHeader: {
    backgroundColor: "#1f2937",
    padding: "0.5rem 1rem",
    borderBottom: "1px solid #374151",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  terminalContent: {
    padding: "1rem",
    margin: 0,
    fontFamily: "'Fira Code', 'Roboto Mono', monospace",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    color: "#10b981", // Matrix green styled text
    whiteSpace: "pre-wrap",
    overflowX: "auto"
  }
};