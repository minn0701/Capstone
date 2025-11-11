import React, { useState, useEffect } from "react";

export default function NetworkLog() {
  const [interfaces, setInterfaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/main/api/system-info/network");
      if (response.ok) {
        const data = await response.json();
        setInterfaces(data);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>🌐 네트워크 상태 및 로그</h2>

      <div style={{ backgroundColor: "#2b2d31", padding: "1.5rem", borderRadius: "8px" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>네트워크 인터페이스</h3>
        {loading ? (
          <p>로딩 중...</p>
        ) : interfaces.length === 0 ? (
          <p>네트워크 인터페이스 정보를 불러올 수 없습니다.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #444" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>인터페이스명</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>IP 주소</th>
              </tr>
            </thead>
            <tbody>
              {interfaces.map((iface, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #333" }}>
                  <td style={{ padding: "0.75rem" }}>{iface.name || "-"}</td>
                  <td style={{ padding: "0.75rem" }}>{iface.ip || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
