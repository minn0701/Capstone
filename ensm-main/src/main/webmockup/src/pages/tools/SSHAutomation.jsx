import React, { useState } from "react";
import SettingItem from "../../components/SettingItem";

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
        <SettingItem
          label="키 타입"
          input={
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
          }
          hint="SSH 키의 암호화 알고리즘 타입을 선택합니다. RSA는 호환성이 좋고, ED25519는 보안성이 높습니다."
          description="암호화 알고리즘"
        />
        <SettingItem
          label="키 크기"
          input={
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
          }
          hint="키의 비트 크기를 지정합니다. RSA는 2048 이상, ED25519는 크기 지정 불필요합니다."
          description="키 비트 크기"
        />
        <SettingItem
          label="주석"
          input={
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
          }
          hint="키에 포함될 주석을 지정합니다. 일반적으로 user@hostname 형식을 사용합니다."
          description="키 주석"
        />
        <button
          onClick={handleGenerateKey}
          disabled={loading}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: loading ? "#555" : "#5865f2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "1rem"
          }}
        >
          {loading ? "생성 중..." : "키 생성"}
        </button>
      </div>

      <div style={{ backgroundColor: "#2b2d31", padding: "1.5rem", borderRadius: "8px" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>SSH 키 복사</h3>
        <SettingItem
          label="공개키 경로"
          input={
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
          }
          hint="복사할 공개키 파일의 경로를 지정합니다. 일반적으로 ~/.ssh/id_rsa.pub 또는 ~/.ssh/id_ed25519.pub입니다."
          description="공개키 파일 경로"
        />
        <SettingItem
          label="사용자"
          input={
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
          }
          hint="원격 서버의 사용자명을 지정합니다."
          description="원격 사용자명"
        />
        <SettingItem
          label="호스트"
          input={
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
          }
          hint="원격 서버의 IP 주소 또는 호스트명을 지정합니다."
          description="원격 호스트"
        />
        <SettingItem
          label="포트"
          input={
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
          }
          hint="SSH 서비스 포트 번호를 지정합니다. 기본값은 22입니다."
          description="SSH 포트"
        />
        <button
          onClick={handleCopyKey}
          disabled={loading}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: loading ? "#555" : "#5865f2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "1rem"
          }}
        >
          {loading ? "복사 중..." : "키 복사"}
        </button>
      </div>
    </div>
  );
}
