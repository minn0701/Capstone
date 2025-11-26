import React, { useState } from "react";
import SettingItem from "../../components/SettingItem";
import { apiFetch } from '../../utils/api';

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
      const response = await apiFetch("/main/api/ssh/generate-key", {
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
      const response = await apiFetch("/main/api/ssh/copy-key", {
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
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>SSH 자동화</h2>
        <p style={styles.pageSubtitle}>
          SSH 키 쌍을 생성하고 원격 서버에 공개키를 배포하여 비밀번호 없는 안전한 접속을 설정합니다.
        </p>
      </header>

      {message && (
        <div style={{
          ...styles.messageBox,
          backgroundColor: message.includes("실패") ? "rgba(220, 38, 38, 0.2)" : "rgba(16, 185, 129, 0.2)",
          borderColor: message.includes("실패") ? "#ef4444" : "#10b981",
          color: message.includes("실패") ? "#fca5a5" : "#6ee7b7",
        }}>
          {message}
        </div>
      )}

      <div style={styles.gridContainer}>
        {/* 섹션 1: SSH 키 생성 */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>SSH 키 생성</h3>
          
          <SettingItem
            label="키 알고리즘"
            menu="ssh"
            input={
              <select
                value={keyType}
                onChange={(e) => setKeyType(e.target.value)}
                style={styles.select}
              >
                <option value="rsa">RSA (호환성 우수)</option>
                <option value="ed25519">ED25519 (보안/속도 우수)</option>
                <option value="ecdsa">ECDSA</option>
              </select>
            }
            hint="암호화 알고리즘을 선택합니다. 최신 시스템은 ED25519를 권장합니다."
          />

          <SettingItem
            label="키 크기 (Bits)"
            menu="ssh"
            input={
              <input
                type="number"
                value={keySize}
                onChange={(e) => setKeySize(e.target.value)}
                style={styles.input}
                placeholder="2048"
                disabled={keyType === 'ed25519'} // ED25519는 고정 크기
              />
            }
            hint={keyType === 'ed25519' ? "ED25519는 고정 크기를 사용합니다." : "RSA의 경우 2048 또는 4096을 권장합니다."}
          />

          <SettingItem
            label="주석 (Comment)"
            menu="ssh"
            input={
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="user@hostname"
                style={styles.input}
              />
            }
            hint="키 식별을 위한 주석입니다. (예: email@example.com)"
          />

          <button
            onClick={handleGenerateKey}
            disabled={loading}
            style={{
              ...styles.primaryButton,
              opacity: loading ? 0.7 : 1,
              marginTop: "1.5rem",
              width: "100%"
            }}
          >
            {loading ? "키 생성 중..." : "SSH 키 생성하기"}
          </button>
        </section>

        {/* 섹션 2: SSH 키 복사 */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>SSH 키 배포 (Copy ID)</h3>
          
          <SettingItem
            label="공개키 경로"
            menu="ssh"
            input={
              <input
                type="text"
                value={publicKeyPath}
                onChange={(e) => setPublicKeyPath(e.target.value)}
                placeholder="/root/.ssh/id_rsa.pub"
                style={styles.input}
              />
            }
            hint="배포할 공개키(.pub) 파일의 절대 경로를 입력하세요."
          />

          {/* 수정된 부분: 가로 배치를 제거하고 세로로 배치하여 겹침 방지 */}
          <SettingItem
            label="원격 사용자"
            menu="ssh"
            input={
                <input
                type="text"
                value={sshUser}
                onChange={(e) => setSshUser(e.target.value)}
                placeholder="root"
                style={styles.input}
                />
            }
            hint="접속할 원격 서버의 계정명입니다."
          />
        
          <SettingItem
            label="원격 호스트 IP"
            menu="ssh"
            input={
                <input
                type="text"
                value={sshHost}
                onChange={(e) => setSshHost(e.target.value)}
                placeholder="192.168.1.100"
                style={styles.input}
                />
            }
            hint="접속할 원격 서버의 IP 주소 또는 도메인입니다."
          />

          <SettingItem
            label="SSH 포트"
            menu="ssh"
            input={
              <input
                type="number"
                value={sshPort}
                onChange={(e) => setSshPort(e.target.value)}
                placeholder="22"
                style={styles.input}
              />
            }
            hint="기본값: 22"
          />

          <button
            onClick={handleCopyKey}
            disabled={loading}
            style={{
              ...styles.successButton, // 구분감을 위해 다른 색상 사용
              opacity: loading ? 0.7 : 1,
              marginTop: "1.5rem",
              width: "100%"
            }}
          >
            {loading ? "배포 중..." : "원격 서버에 키 복사"}
          </button>
        </section>
      </div>
    </div>
  );
}

// ==========================================
// Styles Object (CSS in JS) - Consistent Theme
// ==========================================
const styles = {
  pageContainer: {
    padding: "2rem max(2rem, 5vw)",
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    minHeight: "100vh",
    color: "var(--text-primary, #ffffff)",
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
  },
  header: {
    marginBottom: "2.5rem",
    borderBottom: "1px solid var(--border-color, #444)",
    paddingBottom: "1.5rem"
  },
  pageTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    color: "var(--text-primary, #ffffff)",
    margin: 0
  },
  pageSubtitle: {
    color: "var(--text-secondary, #aaaaaa)",
    fontSize: "0.95rem",
    marginTop: "0.5rem"
  },
  messageBox: {
    padding: "1rem",
    marginBottom: "2rem",
    borderRadius: "8px",
    border: "1px solid",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "slideDown 0.3s ease-out"
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem"
  },
  card: {
    backgroundColor: "var(--bg-secondary, #2b2d31)",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid var(--border-color, #444)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#5a9fd1",
    marginBottom: "1.5rem",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid var(--border-color, #444)"
  },
  input: {
    width: "95%",
    padding: "0.75rem",
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    border: "1px solid #555",
    borderRadius: "6px",
    color: "var(--text-primary, #fff)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    border: "1px solid #555",
    borderRadius: "6px",
    color: "var(--text-primary, #fff)",
    fontSize: "0.9rem",
    outline: "none",
    cursor: "pointer"
  },
  primaryButton: {
    padding: "0.85rem",
    backgroundColor: "#5865f2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  successButton: {
    padding: "0.85rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s",
  }
};