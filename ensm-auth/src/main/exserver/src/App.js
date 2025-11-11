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
    fetch("/auth/setup/check")
      .then(res => res.json())
      .then(data => {
        setNeedsSetup(data.needsSetup);
      })
      .catch(err => {
        console.error("설정 확인 실패:", err);
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
    <Router>
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
