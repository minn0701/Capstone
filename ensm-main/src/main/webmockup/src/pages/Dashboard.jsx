import React from "react";

export default function Dashboard() {
  // Grafana 설정 (Caddy를 통해 접근)
  // 현재 접속 중인 호스트를 자동으로 사용 (포트포워딩 불필요)
  const host = window.location.origin;              // 현재 도메인/포트 자동 사용
  const grafanaPath = "/grafana";                   // Caddy 라우팅 경로
  const uid = "sysmon-gauges";                      // 대시보드 UID
  const slug = "system-monitor-gauge-2b-logs";      // 슬러그(Share → 링크에서 확인)
  const orgId = 1;                                  // 기본 1

  // 패널 ID (Grafana에서 각 패널 … → Inspect → Panel JSON 또는 Share panel 링크로 확인)
  const PANEL_CPU = 1;   // CPU 게이지
  const PANEL_MEM = 2;   // 메모리 게이지
  const PANEL_DISK = 3;  // 디스크 게이지
  const PANEL_LOGS = 4;  // journald 로그 패널 (Loki)

  // 공통 쿼리 파라미터
  const common = `orgId=${orgId}&refresh=10s&theme=dark`;

  // 수동 임베드(d-solo) URL들 (Caddy를 통해 접근)
  const urlCPU = `${host}${grafanaPath}/d-solo/${uid}/${slug}?${common}&panelId=${PANEL_CPU}`;
  const urlMEM = `${host}${grafanaPath}/d-solo/${uid}/${slug}?${common}&panelId=${PANEL_MEM}`;
  const urlDISK = `${host}${grafanaPath}/d-solo/${uid}/${slug}?${common}&panelId=${PANEL_DISK}`;
  const urlLOGS = `${host}${grafanaPath}/d-solo/${uid}/${slug}?${common}&panelId=${PANEL_LOGS}`;

  // 공통 카드 스타일
  const cardStyle = {
    backgroundColor: "#1e1e1e",
    border: "1px solid #444",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
    padding: "0.5rem"
  };

  return (
    <div style={{ padding: "24px", background: "#0e0e0e", minHeight: "100vh", color: "#fff" }}>
      <h2 style={{ fontSize: 24, marginBottom: 16, fontWeight: 700 }}>🧠 시스템 개요 + 로그 뷰어</h2>

      {/* 📈 시스템 개요 (게이지 3개) */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>📈 시스템 개요</h3>
        <div
          style={{
            display: "grid",
            gap: "12px",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))"
          }}
        >
          {/* CPU 게이지 */}
          <div style={cardStyle}>
            <iframe
              src={urlCPU}
              title="CPU Usage (%)"
              style={{
                width: "100%",
                height: "300px",
                border: 0,
                borderRadius: "4px",
                backgroundColor: "#1e1e1e"
              }}
              loading="lazy"
            />
          </div>

          {/* 메모리 게이지 */}
          <div style={cardStyle}>
            <iframe
              src={urlMEM}
              title="Memory Usage (%)"
              style={{
                width: "100%",
                height: "300px",
                border: 0,
                borderRadius: "4px",
                backgroundColor: "#1e1e1e"
              }}
              loading="lazy"
            />
          </div>

          {/* 디스크 게이지 */}
          <div style={cardStyle}>
            <iframe
              src={urlDISK}
              title="Disk Usage (%)"
              style={{
                width: "100%",
                height: "300px",
                border: 0,
                borderRadius: "4px",
                backgroundColor: "#1e1e1e"
              }}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* 📝 로그 뷰어 (Loki) */}
      <div>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>📝 로그 뷰어 (Loki)</h3>
        <div style={cardStyle}>
          <iframe
            src={urlLOGS}
            title="System Logs"
            style={{
              width: "100%",
              height: "520px",
              border: 0,
              borderRadius: "4px",
              backgroundColor: "#1e1e1e"
            }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
