import React from "react";

export default function Dashboard() {
  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>🛡️ ENSM 시스템 대시보드</h2>

      {/* 상단 상태 요약 */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "2rem" }}>
        {["CPU", "RAM", "네트워크"].map((label, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <svg width="100" height="100">
              <circle cx="50" cy="50" r="40" stroke="#555" strokeWidth="10" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#4ade80"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${70 - i * 15} 100`}
                transform="rotate(-90 50 50)"
              />
              <text x="50%" y="55%" textAnchor="middle" fill="white" fontSize="18px" fontWeight="bold">
                {`${70 - i * 15}%`}
              </text>
            </svg>
            <div style={{ marginTop: "0.5rem" }}>{label} 사용률</div>
          </div>
        ))}
      </div>

      {/* 프로세스 테이블 */}
      <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>📋 실행 중인 주요 프로세스</h3>
      <table style={{ width: "100%", backgroundColor: "#2b2d31", borderCollapse: "collapse", borderRadius: "8px", overflow: "hidden" }}>
        <thead>
          <tr>
            {["PID", "프로세스 이름", "CPU 사용률 (%)", "메모리 사용률 (%)", "상태"].map((col, idx) => (
              <th key={idx} style={{ borderBottom: "1px solid #444", padding: "0.75rem", textAlign: "left", color: "#ccc" }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            [1012, "nginx", 3.5, 1.2, "실행 중"],
            [2034, "sshd", 0.4, 0.3, "대기 중"],
            [3021, "mysqld", 12.8, 8.7, "실행 중"],
            [4055, "httpd", 5.2, 4.1, "실행 중"],
            [5023, "node", 9.1, 5.6, "실행 중"],
          ].map((row, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid #333" }}>
              {row.map((cell, i) => (
                <td key={i} style={{ padding: "0.75rem", color: "white" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
