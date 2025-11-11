import React, { useState } from "react";

export default function MailServerConfig() {
  const [message, setMessage] = useState("");

  return (
    <div style={{ padding: "2rem", backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>📧 메일 서버 설정</h2>
      
      <div style={{ backgroundColor: "#2b2d31", padding: "1.5rem", borderRadius: "8px" }}>
        <p style={{ color: "#aaa" }}>
          메일 서버 설정 기능은 현재 개발 중입니다.
          <br />
          Postfix 및 Dovecot 설정 기능이 곧 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
}
