import React, { useState } from "react";

export default function WebFTP() {
  const [currentPath, setCurrentPath] = useState("/");
  const [message, setMessage] = useState("");

  return (
    <div style={{ padding: "2rem", backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>📁 웹 FTP</h2>
      
      <div style={{ backgroundColor: "#2b2d31", padding: "1.5rem", borderRadius: "8px" }}>
        <p style={{ color: "#aaa" }}>
          웹 FTP 기능은 현재 개발 중입니다.
          <br />
          파일 목록 조회, 업로드, 다운로드 기능이 곧 추가될 예정입니다.
        </p>
        <p style={{ color: "#888", marginTop: "1rem", fontSize: "0.9rem" }}>
          현재 경로: {currentPath}
        </p>
      </div>
    </div>
  );
}
