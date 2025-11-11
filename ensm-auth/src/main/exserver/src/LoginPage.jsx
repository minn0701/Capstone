
import React, { useState, useEffect } from "react";
import "./LoginPage.css";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [redirectPath, setRedirectPath] = useState("/main/dashboard");

  useEffect(() => {
    // URL 쿼리 파라미터에서 redirect 경로 확인
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, []);

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
      if (data.message === "로그인 성공") {
        // 쿠키가 설정될 시간을 주기 위해 약간의 지연 후 리다이렉트
        // redirect 파라미터가 있으면 해당 경로로, 없으면 기본값 사용
        const targetPath = data.redirect || redirectPath;
        setTimeout(() => {
          window.location.href = targetPath;
        }, 100);
        return;
      }


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
