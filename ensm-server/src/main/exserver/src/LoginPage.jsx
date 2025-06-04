import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("minn0701@naver.com");
  const navigate = useNavigate();

  const emailOptions = [
    "minn0701@naver.com",
    "admin@example.com",
    "ensm@test.org"
  ];

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: userId,
          password: password
        })
      });

      if (!response.ok) {
        throw new Error("로그인 실패");
      }

      const data = await response.json();
      const token = data.token;

      // JWT를 localStorage에 저장
      localStorage.setItem("token", token);

      // 이메일 인증 단계로 이동
      setStep(2);
    } catch (error) {
      alert("아이디 또는 비밀번호가 잘못되었습니다.");
      console.error(error);
    }
  };

  const goToDashboard = () => {
    navigate("/DashBoard");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {step === 1 ? (
          <>
            <h2>🔐 ENSM 로그인</h2>
            <input
              type="text"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>로그인</button>
          </>
        ) : (
          <>
            <h2>📧 이메일 인증</h2>
            <label style={{ color: "white", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              이메일 주소 선택
            </label>
            <select
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              style={{
                padding: "8px",
                marginBottom: "1rem",
                backgroundColor: "#1e1f22",
                color: "white",
                border: "1px solid #555",
                borderRadius: "4px"
              }}
            >
              {emailOptions.map((email, idx) => (
                <option key={idx} value={email}>{email}</option>
              ))}
            </select>
            <button onClick={goToDashboard}>이메일 인증하기</button>
            <button className="skip" onClick={goToDashboard}>건너뛰기</button>
          </>
        )}
      </div>
    </div>
  );
}
