// 커스텀 체크박스 컴포넌트

import React from 'react';

/**
 * 커스텀 체크박스 컴포넌트
 * @param {boolean} checked - 체크 상태
 * @param {function} onChange - 변경 핸들러
 * @param {boolean} disabled - 비활성화 여부
 * @param {string} label - 라벨 텍스트
 */
const Checkbox = ({ checked, onChange, disabled = false, label, ...props }) => {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        userSelect: "none"
      }}
    >
      <div
        style={{
          position: "relative",
          width: "20px",
          height: "20px",
          border: `2px solid ${checked ? "#5865f2" : "#666"}`,
          borderRadius: "4px",
          backgroundColor: checked ? "#5865f2" : "transparent",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}
      >
        {checked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 6L5 9L10 2"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {label && (
        <span style={{ color: disabled ? "#666" : "#fff", fontSize: "0.9rem" }}>
          {label}
        </span>
      )}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
        style={{ display: "none" }}
        {...props}
      />
    </label>
  );
};

export default Checkbox;

