import React, { useState } from "react";

export default function SSHAutomation() {
  const [keyType, setKeyType] = useState("rsa");
  const [keySize, setKeySize] = useState("2048");
  const [comment, setComment] = useState("");
  const [publicKeyPath, setPublicKeyPath] = useState("");
  const [sshUser, setSshUser] = useState("");
  const [sshHost, setSshHost] = useState("");
  const [sshPort, setSshPort] = useState("22");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateKey = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/main/api/ssh/generate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          keyType,
          keySize: parseInt(keySize),
          comment
        })
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("키 생성 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = async () => {
    if (!publicKeyPath || !sshUser || !sshHost) {
      setMessage("모든 필드를 입력해주세요.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/main/api/ssh/copy-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          publicKeyPath,
          user: sshUser,
          host: sshHost,
          port: parseInt(sshPort)
        })
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("키 복사 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>🔐 SSH 자동화</h2>

      {message && (
        <div style={{
          padding: "0.75rem",
          marginBottom: "1.5rem",
          borderRadius: "4px",
          backgroundColor: message.includes("실패") ? "#3a1a1a" : "#1a3a1a",
          color: message.includes("실패") ? "#ff6666" : "#66ff66"
        }}>
          {message}
        </div>
      )}

      <div style={{ backgroundColor: "#2b2d31", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>SSH 키 생성</h3>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>키 타입</label>
          <select
            value={keyType}
            onChange={(e) => setKeyType(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#1e1e1e",
              border: "1px solid #444",
              borderRadius: "4px",
              color: "white"
            }}
          >
            <option value="rsa">RSA</option>
            <option value="ed25519">ED25519</option>
            <option value="ecdsa">ECDSA</option>
          </select>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>키 크기</label>
          <input
            type="number"
            value={keySize}
            onChange={(e) => setKeySize(e.target.value)}
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
          <label style={{ display: "block", marginBottom: "0.5rem" }}>주석</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="user@hostname"
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
          onClick={handleGenerateKey}
          disabled={loading}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: loading ? "#555" : "#5865f2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "생성 중..." : "키 생성"}
        </button>
      </div>

      <div style={{ backgroundColor: "#2b2d31", padding: "1.5rem", borderRadius: "8px" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>SSH 키 복사</h3>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>공개키 경로</label>
          <input
            type="text"
            value={publicKeyPath}
            onChange={(e) => setPublicKeyPath(e.target.value)}
            placeholder="/tmp/id_rsa.pub"
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
          <label style={{ display: "block", marginBottom: "0.5rem" }}>사용자</label>
          <input
            type="text"
            value={sshUser}
            onChange={(e) => setSshUser(e.target.value)}
            placeholder="root"
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
          <label style={{ display: "block", marginBottom: "0.5rem" }}>호스트</label>
          <input
            type="text"
            value={sshHost}
            onChange={(e) => setSshHost(e.target.value)}
            placeholder="192.168.1.100"
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
          <label style={{ display: "block", marginBottom: "0.5rem" }}>포트</label>
          <input
            type="number"
            value={sshPort}
            onChange={(e) => setSshPort(e.target.value)}
            placeholder="22"
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
          onClick={handleCopyKey}
          disabled={loading}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: loading ? "#555" : "#5865f2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "복사 중..." : "키 복사"}
        </button>
      </div>
    </div>
  );
}
