import React, { useState, useEffect } from "react";

export default function DiskRaidStatus() {
  const [disks, setDisks] = useState([]);
  const [raidStatus, setRaidStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [diskRes, raidRes] = await Promise.all([
        fetch("/main/api/system-info/disk"),
        fetch("/main/api/system-info/raid")
      ]);

      if (diskRes.ok) {
        const diskData = await diskRes.json();
        setDisks(diskData);
      }

      if (raidRes.ok) {
        const raidData = await raidRes.json();
        setRaidStatus(raidData.status);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>💾 디스크 및 RAID 상태</h2>

      <div style={{ backgroundColor: "#2b2d31", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>디스크 사용량</h3>
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #444" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>파일시스템</th>
                <th style={{ padding: "0.75rem", textAlign: "right" }}>크기</th>
                <th style={{ padding: "0.75rem", textAlign: "right" }}>사용</th>
                <th style={{ padding: "0.75rem", textAlign: "right" }}>가용</th>
                <th style={{ padding: "0.75rem", textAlign: "right" }}>사용률</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>마운트</th>
              </tr>
            </thead>
            <tbody>
              {disks.map((disk, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #333" }}>
                  <td style={{ padding: "0.75rem" }}>{disk.filesystem}</td>
                  <td style={{ padding: "0.75rem", textAlign: "right" }}>{disk.size}</td>
                  <td style={{ padding: "0.75rem", textAlign: "right" }}>{disk.used}</td>
                  <td style={{ padding: "0.75rem", textAlign: "right" }}>{disk.avail}</td>
                  <td style={{ padding: "0.75rem", textAlign: "right" }}>{disk.usePercent}</td>
                  <td style={{ padding: "0.75rem" }}>{disk.mounted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ backgroundColor: "#2b2d31", padding: "1.5rem", borderRadius: "8px" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>RAID 상태</h3>
        <pre style={{
          backgroundColor: "#1e1e1e",
          padding: "1rem",
          borderRadius: "4px",
          overflow: "auto",
          whiteSpace: "pre-wrap",
          fontFamily: "monospace"
        }}>
          {raidStatus || "RAID 정보를 불러올 수 없습니다."}
        </pre>
      </div>
    </div>
  );
}
