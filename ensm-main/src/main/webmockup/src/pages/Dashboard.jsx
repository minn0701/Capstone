import React from "react";

export default function Dashboard() {
  // 🔹 1) Grafana 베이스 URL 고정
  // - 어디서 패키지를 설치하든, 대시보드는 항상 main.minn.my:55555에 있는 Grafana를 봄
  // - 나중에 바꾸고 싶으면 이 한 줄만 수정하면 됨
  const GRAFANA_BASE =
    (window as any).__GRAFANA_BASE__ || "http://main.minn.my:55555/grafana";

  // 🔹 2) 대시보드 UID 고정
  const uid = "sysmon-gauges"; // 우리가 JSON에서 명시적으로 박아둔 UID
  const orgId = 1;

  // 🔹 3) 슬러그는 의미 없음 → `_`로 고정
  const slug = "_";

  // 🔹 4) 패널 ID (Grafana에서 고정)
  const PANEL_CPU = 1;   // CPU 게이지
  const PANEL_MEM = 2;   // 메모리 게이지
  const PANEL_DISK = 3;  // 디스크 게이지
  const PANEL_LOGS = 4;  // journald 로그 패널 (Loki)

  // 공통 쿼리 파라미터 (시간범위 from/to 같은 거 절대 넣지 말기)
  const common = `orgId=${orgId}&refresh=10s&theme=dark`;

  // 🔹 5) d-solo + UID 기반으로만 임베드 (절대 안 바뀜)
  const urlCPU  = `${GRAFANA_BASE}/d-solo/${uid}/${slug}?${common}&panelId=${PANEL_CPU}`;
  const urlMEM  = `${GRAFANA_BASE}/d-solo/${uid}/${slug}?${common}&panelId=${PANEL_MEM}`;
  const urlDISK = `${GRAFANA_BASE}/d-solo/${uid}/${slug}?${common}&panelId=${PANEL_DISK}`;
  const urlLOGS = `${GRAFANA_BASE}/d-solo/${uid}/${slug}?${common}&panelId=${PANEL_LOGS}`;

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#1e1e1e",
    border: "1px solid #444",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
    padding: "0.5rem",
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#0e0e0e",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h2 style={{ fontSize: 24, marginBottom: 16, fontWeight: 700 }}>
        🧠 시스템 개요 + 로그 뷰어
      </h2>

      {/* 📈 시스템 개요 (게이지 3개) */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
          📈 시스템 개요
        </h3>
        <div
          style={{
            display: "grid",
            gap: "12px",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
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
                backgroundColor: "#1e1e1e",
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
                backgroundColor: "#1e1e1e",
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
                backgroundColor: "#1e1e1e",
              }}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* 📝 로그 뷰어 (Loki) */}
      <div>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
          📝 로그 뷰어 (Loki)
        </h3>
        <div style={cardStyle}>
          <iframe
            src={urlLOGS}
            title="System Logs"
            style={{
              width: "100%",
              height: "520px",
              border: 0,
              borderRadius: "4px",
              backgroundColor: "#1e1e1e",
            }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
