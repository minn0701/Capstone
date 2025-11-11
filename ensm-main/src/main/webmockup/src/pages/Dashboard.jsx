import React from "react";


export default function Dashboard() {
  // 공통 설정
  const host = "http://main.minn.my:3000";          // Grafana 외부 주소
  const uid  = "sysmon-gauges";                     // 대시보드 UID
  const slug = "system-monitor-gauge-2b-logs";      // 슬러그(Share → 링크에서 확인)
  const orgId = 1;                                  // 기본 1

  // 패널 ID (Grafana에서 각 패널 … → Inspect → Panel JSON 또는 Share panel 링크로 확인)
  const PANEL_CPU    = 1;  // CPU 게이지
  const PANEL_MEM    = 2;  // 메모리 게이지
  const PANEL_DISK   = 3;  // 디스크 게이지
  const PANEL_LOGS   = 4;  // journald 로그 패널 (Loki)

  // 공통 쿼리 파라미터 (원하면 from/to를 now-6h~now로 통일)
  const common = `orgId=${orgId}&refresh=10s&theme=dark`;

  // 수동 임베드(d-solo) URL들
  const urlCPU  = `${host}/d-solo/${uid}/${slug}?${common}&panelId=${PANEL_CPU}`;
  const urlMEM  = `${host}/d-solo/${uid}/${slug}?${common}&panelId=${PANEL_MEM}`;
  const urlDISK = `${host}/d-solo/${uid}/${slug}?${common}&panelId=${PANEL_DISK}`;
  const urlLOGS = `${host}/d-solo/${uid}/${slug}?${common}&panelId=${PANEL_LOGS}`;

  const card = {
    backgroundColor: "#1e1e1e",
    border: "1px solid #333",
    borderRadius: "12px",
    boxShadow: "0 0 16px rgba(0,0,0,0.45)",
  };

  return (
    <div style={{ padding: "24px", background: "#0e0e0e", minHeight: "100vh", color: "#fff" }}>
      <h2 style={{ fontSize: 24, marginBottom: 16, fontWeight: 700 }}>🧠 시스템 개요 + 로그 뷰어</h2>

      {/* 상단: 시스템 개요 (게이지 3개) */}
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, marginBottom: 12, fontWeight: 600 }}>📈 시스템 개요</h3>
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          }}
        >
          <div style={{ ...card, padding: 8 }}>
            <iframe
              src={urlCPU}
              title="CPU Usage (%)"
              style={{ width: "100%", height: 300, border: 0, borderRadius: 10, background: "#1e1e1e" }}
              loading="lazy"
            />
          </div>
          <div style={{ ...card, padding: 8 }}>
            <iframe
              src={urlMEM}
              title="Memory Usage (%)"
              style={{ width: "100%", height: 300, border: 0, borderRadius: 10, background: "#1e1e1e" }}
              loading="lazy"
            />
          </div>
          <div style={{ ...card, padding: 8 }}>
            <iframe
              src={urlDISK}
              title="Disk Usage (%)"
              style={{ width: "100%", height: 300, border: 0, borderRadius: 10, background: "#1e1e1e" }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 하단: 로그 뷰어 */}
      <section>
        <h3 style={{ fontSize: 18, marginBottom: 12, fontWeight: 600 }}>📝 로그 뷰어 (Loki)</h3>
        <div style={{ ...card, padding: 8 }}>
          <iframe
            src={urlLOGS}
            title="System Logs"
            style={{ width: "100%", height: 520, border: 0, borderRadius: 10, background: "#1e1e1e" }}
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}
