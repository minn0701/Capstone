
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("/auth/login", {
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

      // authFetch: 인증 토큰을 자동으로 포함하는 fetch 래퍼 (401/403 처리)
      window.authFetch = async (url, options = {}) => {
        const token = localStorage.getItem("token");
        const headers = {
          ...options.headers,
          Authorization:`Bearer ${token}`,
        };

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401 || response.status === 403) {
          alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
          localStorage.removeItem("token");
          window.location.href = "/";
          return;
        }

        return response;
      };

      // 로그인 성공 시 메인 페이지로 이동
      // ✅ 올바른 리다이렉션 방식
      window.location.href = 'https://ensm.duckdns.org:55555/main';


    } catch (error) {
      alert("아이디 또는 비밀번호가 잘못되었습니다.");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <>
          <h2>ENSM 로그인</h2>
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

          <div className="login-links">
            <a href="/find-account">계정을 잃어버리셨나요?</a>
          </div>
        </>
      </div>
    </div>
  );
}
