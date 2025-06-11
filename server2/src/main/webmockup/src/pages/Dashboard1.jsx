import React from "react";

export default function Dashboard() {
  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>🛡️ ENSM 시스템 대시보드</h2>

      {/* Kibana Dashboard Iframes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div>
          <h3 style={{ marginBottom: "0.5rem" }}>📊 시스템 오버뷰</h3>
          <iframe
            src="http://minn0701.iptime.org:5601/app/dashboards#/view/Metricbeat-system-overview-ecs?embed=true&_g=(refreshInterval:(pause:!t,value:60000),time:(from:now-15m,to:now))&show-time-filter=true"
            width="100%"
            height="600"
            style={{ border: "1px solid #555", borderRadius: "8px" }}
            title="시스템 오버뷰"
          />
        </div>

        <div>
          <h3 style={{ marginBottom: "0.5rem" }}>🖥️ 호스트 오버뷰</h3>
          <iframe
            src="http://minn0701.iptime.org:5601/app/dashboards#/view/79ffd6e0-faa0-11e6-947f-177f697178b8-ecs?embed=true&_g=(refreshInterval:(pause:!t,value:60000),time:(from:now-15m,to:now))&show-time-filter=true"
            width="100%"
            height="600"
            style={{ border: "1px solid #555", borderRadius: "8px" }}
            title="호스트 오버뷰"
          />
        </div>
      </div>
    </div>
  );
}
