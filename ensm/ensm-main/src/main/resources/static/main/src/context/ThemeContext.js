import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 초기값: 로컬 스토리지 확인 또는 시스템 설정 확인
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("ensm_settings");
    if (saved) {
      return JSON.parse(saved).darkMode;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // 1. HTML 태그에 속성 부여 (CSS가 이걸 보고 색을 바꿈)
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // 2. 로컬 스토리지에 상태 저장 (기존 ensm_settings 유지하면서 업데이트)
    const saved = localStorage.getItem("ensm_settings");
    const parsed = saved ? JSON.parse(saved) : {};
    localStorage.setItem("ensm_settings", JSON.stringify({ ...parsed, darkMode: isDarkMode }));

  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 커스텀 훅 (다른 컴포넌트에서 쉽게 쓰기 위해)
export const useTheme = () => useContext(ThemeContext);