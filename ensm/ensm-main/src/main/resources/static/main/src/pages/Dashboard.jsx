import React, { useState, useEffect } from "react";

const STORAGE_KEY = "ensm_system_config";

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 다크모드 설정 로드
  useEffect(() => {
    const loadDarkMode = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const config = JSON.parse(saved);
          if (config.darkMode !== undefined) {
            setIsDarkMode(config.darkMode);
          }
        }
      } catch (error) {
        console.error("다크모드 설정 로드 실패:", error);
      }
    };

    loadDarkMode();

    // localStorage 변경 감지 (다른 탭에서 설정 변경 시)
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        loadDarkMode();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // 주기적으로 확인 (같은 탭에서 설정 변경 시)
    const interval = setInterval(loadDarkMode, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Grafana 패널 URL 생성 함수 (기존 로직 유지)
  const getGrafanaPanelUrl = (panelId, width = 1000, height = 500) => {
    const theme = isDarkMode ? "dark" : "light";
    // d-solo 모드: 패널만 표시 (대시보드 UI 없음)
    return `/grafana/d-solo/sysmon-gauges/system-monitor-gauge-logs?orgId=1&panelId=${panelId}&theme=${theme}&refresh=10s&width=${width}&height=${height}`;
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>시스템 통합 대시보드</h2>
        <p style={styles.pageSubtitle}>
          실시간 시스템 리소스 상태와 보안 로그를 중앙에서 모니터링합니다.
        </p>
      </header>

      {/* 시스템 리소스 모니터링 섹션 */}
      <section style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem" }}></span>
          <h3 style={styles.sectionTitle}>시스템 리소스 현황</h3>
        </div>
        
        <div style={styles.gridContainer}>
          {/* CPU Usage 패널 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>CPU 사용률</div>
            <div style={styles.iframeWrapper}>
              <iframe
                src={getGrafanaPanelUrl(1, 1000, 500)}
                style={styles.iframe}
                title="CPU Usage"
                allow="fullscreen"
                scrolling="no"
                loading="lazy"
              />
            </div>
          </div>

          {/* Memory Usage 패널 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>메모리 사용률</div>
            <div style={styles.iframeWrapper}>
              <iframe
                src={getGrafanaPanelUrl(2, 1000, 500)}
                style={styles.iframe}
                title="Memory Usage"
                allow="fullscreen"
                scrolling="no"
                loading="lazy"
              />
            </div>
          </div>

          {/* Disk Usage 패널 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>디스크 사용률</div>
            <div style={styles.iframeWrapper}>
              <iframe
                src={getGrafanaPanelUrl(3, 1000, 500)}
                style={styles.iframe}
                title="Disk Usage"
                allow="fullscreen"
                scrolling="no"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 시스템 로그 모니터링 섹션 */}
      <section>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem" }}></span>
          <h3 style={styles.sectionTitle}>실시간 시스템 로그</h3>
        </div>
        
        <div style={{ ...styles.card, height: "650px", padding: "0" }}>
          <div style={{ ...styles.iframeWrapper, borderRadius: "12px" }}>
            <iframe
              src={getGrafanaPanelUrl(4, 2000, 1200)}
              style={styles.iframe}
              title="System Logs"
              allow="fullscreen"
              scrolling="no"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// Styles Object (Consistent Theme)
// ==========================================
const styles = {
  pageContainer: {
    padding: "2rem max(2rem, 5vw)",
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    minHeight: "100vh",
    color: "var(--text-primary, #ffffff)",
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
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
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#5a9fd1",
    margin: 0
  },
  gridContainer: {
    display: "grid",
    // 화면이 좁아지면 자동으로 줄바꿈되도록 개선 (최소 너비 350px)
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "var(--bg-secondary, #2b2d31)",
    borderRadius: "12px",
    border: "1px solid var(--border-color, #444)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "320px", // 카드 높이 고정
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  cardHeader: {
    padding: "0.75rem 1rem",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderBottom: "1px solid #444",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#ddd"
  },
  iframeWrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "var(--bg-secondary, #2b2d31)",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block",
    backgroundColor: "transparent",
  }
};