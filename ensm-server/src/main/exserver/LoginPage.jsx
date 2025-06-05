import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async () => {
  if (userId.trim() === "" || password.trim() === "") {
    Swal.fire({
      icon: 'error',
      title: '로그인 실패',
      text: '아이디 또는 비밀번호를 입력해주세요',
    });
    return;
  }

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: userId, password }),
    });

    if (!response.ok) {
      throw new Error("로그인 실패");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);  // JWT 저장

      // 로그인 성공 시 바로 대시보드로 이동
      navigate("/DashBoard");
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '로그인 실패',
      text: '아이디 또는 비밀번호가 일치하지 않습니다',
    });
  }
};

  return (
    <div className="login-container">
      <div className="login-box">
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
                  <div className="login-links">
          <a href="/find-id">아이디 찾기</a>
          <span> | </span>
          <a href="/find-password">비밀번호 찾기</a>
          <span> | </span>
          <a href="/signup">회원가입</a>
        </div>
        </>
      </div>
    </div>
  );
}
