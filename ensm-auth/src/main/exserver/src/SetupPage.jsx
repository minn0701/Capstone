import React, { useState, useEffect } from "react";
import "./LoginPage.css";

export default function SetupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 최초 설치 여부 확인
    fetch("/auth/setup/check")
      .then(res => res.json())
      .then(data => {
        if (!data.needsSetup) {
          // 이미 설정이 완료되었으면 로그인 페이지로
          window.location.href = "/";
        }
      })
      .catch(err => {
        console.error("설정 확인 실패:", err);
      });
  }, []);

  const handleSetup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || username.trim().length === 0) {
      setError("사용자명을 입력해주세요.");
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/auth/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "설정 실패");
      }

      // 설정 완료 후 로그인 페이지로
      alert("관리자 계정이 생성되었습니다. 로그인해주세요.");
      window.location.href = "/";
    } catch (error) {
      setError(error.message || "설정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>ENSM 초기 설정</h2>
        <p style={{ color: "#ccc", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          최초 관리자 계정을 생성해주세요.
        </p>
        
        {error && (
          <div style={{ 
            color: "#ff4444", 
            marginBottom: "1rem", 
            padding: "0.5rem",
            backgroundColor: "#2a1a1a",
            borderRadius: "4px",
            fontSize: "0.9rem"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSetup}>
          <input
            type="text"
            placeholder="관리자 사용자명"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
            minLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? "설정 중..." : "계정 생성"}
          </button>
        </form>
      </div>
    </div>
  );
}

