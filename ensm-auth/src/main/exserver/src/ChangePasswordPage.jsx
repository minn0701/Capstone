import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePasswordPage.css";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("새 비밀번호는 6자 이상이어야 합니다.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "비밀번호 변경 실패");
      }

      alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");
      navigate("/");
    } catch (error) {
      setError(error.message || "비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-box">
        <h2>🔑 비밀번호 변경</h2>
        
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

        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="현재 비밀번호"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="새 비밀번호 (6자 이상)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
            minLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>
      </div>
    </div>
  );
}
