import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ChangePasswordPage.css";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForceMode, setIsForceMode] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // force 파라미터 확인 및 디버깅
    const force = searchParams.get("force");
    console.log("ChangePasswordPage 렌더링됨");
    console.log("현재 URL:", window.location.href);
    console.log("쿼리 파라미터:", window.location.search);
    console.log("force 파라미터:", force);
    
    if (force === "true") {
      setIsForceMode(true);
    } else {
      // force 파라미터가 없으면 추가 (root 계정인 경우)
      if (window.location.pathname === "/change-password" && !force) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("force", "true");
        window.history.replaceState({}, "", newUrl.toString());
        setIsForceMode(true);
      } else {
        setIsForceMode(false);
      }
    }
  }, [searchParams]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 강제 변경 모드 (root 계정 초기 설정)
    if (isForceMode) {
      if (!newUsername || newUsername.trim().length === 0) {
        setError("새 계정명을 입력해주세요.");
        setLoading(false);
        return;
      }
      
      // root 계정명 사용 불가
      if (newUsername.trim().toLowerCase() === "root") {
        setError("root는 예약된 계정명입니다. 다른 계정명을 사용해주세요.");
        setLoading(false);
        return;
      }
      
      if (!newPassword || !confirmPassword) {
        setError("새 비밀번호와 확인 비밀번호를 입력해주세요.");
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
    } else {
      // 일반 비밀번호 변경 모드
      if (!oldPassword) {
        setError("현재 비밀번호를 입력해주세요.");
        setLoading(false);
        return;
      }

      if (!newPassword || !confirmPassword) {
        setError("새 비밀번호와 확인 비밀번호를 입력해주세요.");
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
    }

    try {
      const requestBody = {
        newPassword: newPassword
      };

      // 강제 변경 모드 (root 계정 초기 설정)
      if (isForceMode) {
        requestBody.newUsername = newUsername.trim();
        requestBody.force = true;
      } else {
        // 일반 비밀번호 변경 모드
        requestBody.currentPassword = oldPassword;
      }

      const response = await fetch("/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(requestBody)
      });

      // 응답이 JSON이 아닐 수 있으므로 확인
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || "비밀번호 변경 실패");
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || "비밀번호 변경 실패");
      }

      // 비밀번호 변경 성공 시 쿠키 삭제하고 로그인 페이지로
      // 쿠키 삭제를 위해 로그아웃 API 호출 또는 직접 삭제
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // 강제 변경 모드면 계정명도 변경된 것
      if (isForceMode && data.newUsername) {
        alert(`계정이 성공적으로 생성되었습니다.\n새 계정명: ${data.newUsername}\n새 계정으로 로그인해주세요.`);
      } else {
        alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");
      }
      
      // 리다이렉트 정보가 있으면 사용
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.message || "비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="change-password-container">
      <div className="change-password-box">
        {isForceMode ? (
          <>
            <h2>⚠️ 비밀번호 변경 필수</h2>
            <div style={{
              backgroundColor: "#3a2a1a",
              border: "1px solid #ffaa00",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1.5rem",
              color: "#ffcc88"
            }}>
              <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: "1.6" }}>
                <strong>보안을 위해 초기 계정을 설정해야 합니다.</strong><br />
                기본 계정(root/root)은 보안상 위험하므로 삭제됩니다.<br />
                새로운 계정명과 비밀번호를 설정해주세요.
              </p>
            </div>
          </>
        ) : (
          <h2>🔑 비밀번호 변경</h2>
        )}
        
        {error && (
          <div style={{ 
            color: "#ff4444", 
            marginBottom: "1rem", 
            padding: "0.75rem",
            backgroundColor: "#2a1a1a",
            borderRadius: "4px",
            fontSize: "0.9rem",
            border: "1px solid #ff4444"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleChangePassword}>
          {isForceMode ? (
            <>
              <input
                type="text"
                placeholder="새 계정명 (root는 사용 불가)"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                disabled={loading}
                required
                autoFocus
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
            </>
          ) : (
            <>
              <input
                type="password"
                placeholder="현재 비밀번호"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={loading}
                required
                autoFocus
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
            </>
          )}
          <button type="submit" disabled={loading} style={{
            backgroundColor: isForceMode ? "#ffaa00" : "#5865f2",
            color: "white",
            fontWeight: "bold"
          }}>
            {loading ? "변경 중..." : isForceMode ? "계정 생성 (필수)" : "비밀번호 변경"}
          </button>
        </form>
        
        {isForceMode && (
          <p style={{
            marginTop: "1rem",
            fontSize: "0.85rem",
            color: "#aaa",
            textAlign: "center"
          }}>
            초기 계정을 설정하지 않으면 시스템에 접근할 수 없습니다.<br />
            root 계정은 보안상 위험하므로 삭제됩니다.
          </p>
        )}
      </div>
    </div>
  );
}
