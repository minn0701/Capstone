import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './LoginPage.jsx';
import ChangePasswordPage from './ChangePasswordPage.jsx';
import FindAccountPage from './FindAccountPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/find-account" element={<FindAccountPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
