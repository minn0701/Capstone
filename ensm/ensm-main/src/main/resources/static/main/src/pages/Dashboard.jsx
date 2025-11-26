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

  // 다크모드에 따른 스타일
  const backgroundColor = isDarkMode ? "#0e0e0e" : "#f0f2f5";
  const textColor = isDarkMode ? "#fff" : "#333";
  const cardBg = isDarkMode ? "#1e1e1e" : "#fff";
  const cardBorder = isDarkMode ? "#444" : "#ddd";
  const cardShadow = isDarkMode ? "0 0 10px rgba(0,0,0,0.5)" : "0 2px 4px rgba(0,0,0,0.1)";
  const headingColor = isDarkMode ? "#fff" : "#333";

  // Grafana 패널 URL 생성 함수
  const getGrafanaPanelUrl = (panelId, width = 1000, height = 500) => {
    const theme = isDarkMode ? "dark" : "light";
    // d-solo 모드: 패널만 표시 (대시보드 UI 없음)
    return `/grafana/d-solo/sysmon-gauges/system-monitor-gauge-logs?orgId=1&panelId=${panelId}&theme=${theme}&refresh=10s&width=${width}&height=${height}`;
  };

  // 공통 iframe 스타일 (자연스럽게 보이도록)
  const iframeStyle = {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block",
    backgroundColor: "transparent",
    overflow: "hidden",
    margin: 0,
    padding: 0,
    outline: "none"
  };

  // 패널 컨테이너 스타일
  const panelContainerStyle = {
    backgroundColor: cardBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: "12px",
    boxShadow: cardShadow,
    padding: "16px",
    overflow: "hidden",
    position: "relative",
    transition: "box-shadow 0.3s ease, border-color 0.3s ease"
  };

  // iframe 래퍼 스타일 (Grafana 패널이 자연스럽게 보이도록)
  const iframeWrapperStyle = {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: "8px",
    backgroundColor: cardBg,
    // Grafana 패널의 배경과 자연스럽게 블렌딩
    isolation: "isolate"
  };

  return (
    <div style={{ padding: "24px", background: backgroundColor, minHeight: "100vh", color: textColor }}>
      {/* 시스템 리소스 모니터링 */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ 
          fontSize: "1.75rem", 
          marginBottom: "1.5rem", 
          fontWeight: 600, 
          color: headingColor,
          letterSpacing: "-0.02em"
        }}>
          시스템 리소스 모니터링
        </h2>
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))"
          }}
        >
          {/* CPU Usage 패널 */}
          <div style={panelContainerStyle}>
            <div style={{ 
              ...iframeWrapperStyle,
              height: "280px"
            }}>
              <iframe
                src={getGrafanaPanelUrl(1, 1000, 500)}
                style={iframeStyle}
                title="CPU Usage"
                allow="fullscreen"
                scrolling="no"
                loading="lazy"
              />
            </div>
          </div>

          {/* Memory Usage 패널 */}
          <div style={panelContainerStyle}>
            <div style={{ 
              ...iframeWrapperStyle,
              height: "280px"
            }}>
              <iframe
                src={getGrafanaPanelUrl(2, 1000, 500)}
                style={iframeStyle}
                title="Memory Usage"
                allow="fullscreen"
                scrolling="no"
                loading="lazy"
              />
            </div>
          </div>

          {/* Disk Usage 패널 */}
          <div style={panelContainerStyle}>
            <div style={{ 
              ...iframeWrapperStyle,
              height: "280px"
            }}>
              <iframe
                src={getGrafanaPanelUrl(3, 1000, 500)}
                style={iframeStyle}
                title="Disk Usage"
                allow="fullscreen"
                scrolling="no"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 시스템 로그 모니터링 */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ 
          fontSize: "1.75rem", 
          marginBottom: "1.5rem", 
          fontWeight: 600, 
          color: headingColor,
          letterSpacing: "-0.02em"
        }}>
          시스템 로그 모니터링
        </h2>
        <div style={{
          ...panelContainerStyle,
          padding: "0",
          height: "600px"
        }}>
          <div style={{
            ...iframeWrapperStyle,
            height: "100%",
            borderRadius: "12px"
          }}>
            <iframe
              src={getGrafanaPanelUrl(4, 2000, 1200)}
              style={iframeStyle}
              title="System Logs"
              allow="fullscreen"
              scrolling="no"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
