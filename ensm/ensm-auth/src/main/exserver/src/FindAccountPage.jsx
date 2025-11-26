import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./FindAccountPage.css";

export default function FindAccountPage() {
  const [email, setEmail] = useState("");
  const [isPassword, setIsPassword] = useState(false);  // 비밀번호 찾기 or 아이디 찾기
  const navigate = useNavigate();

  const handleFindAccount = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.id === email || u.email === email);

    if (!user) {
      Swal.fire({
        icon: 'error',
        title: '찾을 수 없음',
        text: '입력하신 아이디 또는 이메일에 해당하는 계정이 없습니다',
      });
      return;
    }

    if (isPassword) {
      // 비밀번호 찾기 로직 (예: 이메일로 비밀번호 리셋 링크 발송)
      Swal.fire({
        icon: 'success',
        title: '비밀번호 찾기 성공',
        text: '이메일로 비밀번호 재설정 링크를 보내드렸습니다',
      });
    } else {
      // 아이디 찾기 로직 (예: 이메일로 아이디 보내기)
      Swal.fire({
        icon: 'success',
        title: '아이디 찾기 성공',
        text: '등록된 아이디는: ${user.id}',
      });
    }

    navigate("/login");  // 아이디/비밀번호 찾기 후 로그인 페이지로 이동
  };

  return (
    <div className="find-account-container">
      <div className="find-account-box">
        <h2>{isPassword ? "비밀번호 찾기" : "아이디 찾기"}</h2>
        <input
          type="email"
          placeholder="이메일 또는 아이디"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="find-account-options">
          <label>
            <input
              type="radio"
              name="findType"
              checked={isPassword}
              onChange={() => setIsPassword(true)}
            />
            비밀번호 찾기
          </label>
          <label>
            <input
              type="radio"
              name="findType"
              checked={!isPassword}
              onChange={() => setIsPassword(false)}
            />
            아이디 찾기
          </label>
        </div>
        <button onClick={handleFindAccount}>{isPassword ? "비밀번호 찾기" : "아이디 찾기"}</button>
      </div>
    </div>
  );
}
