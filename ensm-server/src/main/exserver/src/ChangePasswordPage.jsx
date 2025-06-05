import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./ChangePasswordPage.css";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: '비밀번호 변경 실패',
        text: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다',
      });
      return;
    }

    // 비밀번호 변경 로직 (예: 로컬스토리지에 저장된 비밀번호 변경)
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map(user => {
      if (user.pw === oldPassword) {
        return { ...user, pw: newPassword };
      }
      return user;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    Swal.fire({
      icon: 'success',
      title: '비밀번호 변경 성공',
      text: '비밀번호가 성공적으로 변경되었습니다',
    });

    navigate("/login");  // 비밀번호 변경 후 로그인 페이지로 이동
  };

  return (
    <div className="change-password-container">
      <div className="change-password-box">
        <h2>🔑 비밀번호 변경</h2>
        <input
          type="password"
          placeholder="현재 비밀번호"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="새 비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleChangePassword}>비밀번호 변경</button>
      </div>
    </div>
  );
}
