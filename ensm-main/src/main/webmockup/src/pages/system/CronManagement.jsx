import React, { useState, useEffect } from "react";

export default function CronManagement() {
  const [user, setUser] = useState("root");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSchedule, setNewSchedule] = useState("");
  const [newCommand, setNewCommand] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCronJobs();
  }, [user]);

  const loadCronJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/main/api/cron/${user}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error("CRON 작업 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newSchedule || !newCommand) {
      setMessage("스케줄과 명령어를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`/main/api/cron/${user}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          schedule: newSchedule,
          command: newCommand
        })
      });

      const data = await response.json();
      setMessage(data.message);
      setNewSchedule("");
      setNewCommand("");
      loadCronJobs();
    } catch (error) {
      setMessage("작업 추가 실패: " + error.message);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("정말로 이 CRON 작업을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/main/api/cron/${user}/${index}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await response.json();
      setMessage(data.message);
      loadCronJobs();
    } catch (error) {
      setMessage("작업 삭제 실패: " + error.message);
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>⏰ CRON 작업 관리</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ marginRight: "1rem" }}>사용자:</label>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={{
            padding: "0.5rem",
            backgroundColor: "#2b2d31",
            border: "1px solid #444",
            borderRadius: "4px",
            color: "white"
          }}
        />
        <button
          onClick={loadCronJobs}
          style={{
            marginLeft: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#5865f2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          새로고침
        </button>
      </div>

      {message && (
        <div style={{
          padding: "0.75rem",
          marginBottom: "1rem",
          borderRadius: "4px",
          backgroundColor: message.includes("실패") ? "#3a1a1a" : "#1a3a1a",
          color: message.includes("실패") ? "#ff6666" : "#66ff66"
        }}>
          {message}
        </div>
      )}

      <div style={{ backgroundColor: "#2b2d31", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>새 CRON 작업 추가</h3>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>스케줄 (예: 0 0 * * *)</label>
          <input
            type="text"
            value={newSchedule}
            onChange={(e) => setNewSchedule(e.target.value)}
            placeholder="0 0 * * *"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#1e1e1e",
              border: "1px solid #444",
              borderRadius: "4px",
              color: "white"
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>명령어</label>
          <input
            type="text"
            value={newCommand}
            onChange={(e) => setNewCommand(e.target.value)}
            placeholder="/usr/bin/command"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#1e1e1e",
              border: "1px solid #444",
              borderRadius: "4px",
              color: "white"
            }}
          />
        </div>
        <button
          onClick={handleAdd}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: "#5865f2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          추가
        </button>
      </div>

      <div style={{ backgroundColor: "#2b2d31", padding: "1.5rem", borderRadius: "8px" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>현재 CRON 작업 목록</h3>
        {loading ? (
          <p>로딩 중...</p>
        ) : jobs.length === 0 ? (
          <p>등록된 CRON 작업이 없습니다.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #444" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>스케줄</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>작업</th>
                <th style={{ padding: "0.75rem", textAlign: "right" }}>액션</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => {
                const parts = job.schedule ? job.schedule.split(/\s+/, 6) : [];
                const schedule = parts.length >= 5 ? parts.slice(0, 5).join(" ") : "";
                const command = parts.length >= 6 ? parts.slice(5).join(" ") : job.schedule || "";
                return (
                <tr key={index} style={{ borderBottom: "1px solid #333" }}>
                  <td style={{ padding: "0.75rem" }}>{schedule}</td>
                  <td style={{ padding: "0.75rem" }}>{command}</td>
                  <td style={{ padding: "0.75rem", textAlign: "right" }}>
                    <button
                      onClick={() => handleDelete(index)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
