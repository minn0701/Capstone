import React from "react";

export default function Dashboard() {
  return (
    <div style={{ padding: "2rem", backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>🛡️ ENSM 시스템 대시보드</h2>

      {/* 🌐 호스트 오버뷰 */}
      <div style={{ 
        backgroundColor: "#1e1e1e",  // iframe wrapper 색상
        padding: "0.5rem",
        borderRadius: "8px",
        border: "1px solid #444",
        marginBottom: "2rem",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)"
      }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>🌐 호스트 오버뷰</h3>
        <iframe
          src="https://ensm.duckdns.org:55555/kibana/app/dashboards#/view/79ffd6e0-faa0-11e6-947f-177f697178b8-ecs?embed=true&_g=(refreshInterval:(pause:!f,value:60000),time:(from:now-15m,to:now))&show-time-filter=false"
          style={{ width: "100%", height: "600px", border: "1px solid #444", borderRadius: "4px", backgroundColor: "#1e1e1e" }}
          title="호스트 오버뷰"
        ></iframe>
      </div>

      {/* 📋 실행 중인 주요 프로세스 */}
      <div style={{ 
        backgroundColor: "#1e1e1e",
        padding: "0.5rem",
        borderRadius: "8px",
        border: "1px solid #444",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)"
      }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>📋 실행 중인 주요 프로세스</h3>
        <iframe
          src="https://ensm.duckdns.org:55555/kibana/app/dashboards#/view/68a562fd-dccd-4f29-9ab0-6e84586e33ec?embed=true&_g=(refreshInterval:(pause:!f,value:60000),time:(from:now-15m,to:now))&show-time-filter=false"
          style={{ width: "100%", height: "600px", border: "1px solid #444", borderRadius: "4px", backgroundColor: "#1e1e1e" }}
          title="실행 중인 주요 프로세스"
        ></iframe>
      </div>
    </div>
  );
}
