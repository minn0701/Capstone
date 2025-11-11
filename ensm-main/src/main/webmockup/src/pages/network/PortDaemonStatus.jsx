import React, { useState, useEffect } from "react";

export default function PortDaemonStatus() {
  const [ports, setPorts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [portsRes, servicesRes] = await Promise.all([
        fetch("/main/api/system-info/ports"),
        fetch("/main/api/system-info/services")
      ]);

      if (portsRes.ok) {
        const portsData = await portsRes.json();
        setPorts(portsData);
      }

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>🔌 개방 포트 및 데몬 상태</h2>

      <div style={{ backgroundColor: "#2b2d31", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>개방 포트</h3>
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #444" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>프로토콜</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>상태</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>로컬 주소</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>프로세스</th>
              </tr>
            </thead>
            <tbody>
              {ports.map((port, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #333" }}>
                  <td style={{ padding: "0.75rem" }}>{port.netid}</td>
                  <td style={{ padding: "0.75rem" }}>{port.state}</td>
                  <td style={{ padding: "0.75rem" }}>{port.local}</td>
                  <td style={{ padding: "0.75rem" }}>{port.process || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ backgroundColor: "#2b2d31", padding: "1.5rem", borderRadius: "8px" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>실행 중인 서비스</h3>
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #444" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>서비스명</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>로드 상태</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>활성 상태</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>하위 상태</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #333" }}>
                  <td style={{ padding: "0.75rem" }}>{service.name}</td>
                  <td style={{ padding: "0.75rem" }}>{service.loaded}</td>
                  <td style={{ padding: "0.75rem" }}>{service.active}</td>
                  <td style={{ padding: "0.75rem" }}>{service.sub}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
