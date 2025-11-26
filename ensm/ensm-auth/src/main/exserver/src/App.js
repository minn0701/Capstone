import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './LoginPage.jsx';
import ChangePasswordPage from './ChangePasswordPage.jsx';
import FindAccountPage from './FindAccountPage.jsx';
import SetupPage from './SetupPage.jsx';

function App() {
  const [needsSetup, setNeedsSetup] = useState(null);

  useEffect(() => {
    // 최초 설치 여부 확인
    fetch("/auth/setup/check", {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setNeedsSetup(data.needsSetup);
      })
      .catch(err => {
        console.error("설정 확인 실패:", err);
        // 오류 발생 시 기본값으로 설정 (설정이 완료된 것으로 간주)
        setNeedsSetup(false);
      });
  }, []);

  // 로딩 중이면 대기
  if (needsSetup === null) {
    return (
      <div className="login-container">
        <div className="login-box">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <Router basename="/auth">
      <Routes>
        <Route 
          path="/" 
          element={needsSetup ? <Navigate to="/setup" replace /> : <LoginPage />} 
        />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/find-account" element={<FindAccountPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
