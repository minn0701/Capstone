// Toggle 스위치 컴포넌트

import React from 'react';

/**
 * Toggle 스위치 컴포넌트
 * @param {boolean} checked - 토글 상태
 * @param {function} onChange - 변경 핸들러
 * @param {boolean} disabled - 비활성화 여부
 */
const ToggleSwitch = ({ checked, onChange, disabled = false }) => {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      style={{
        display: "inline-block",
        width: "46px",
        height: "24px",
        backgroundColor: checked ? "#4ade80" : "#888",
        borderRadius: "24px",
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color 0.3s",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "24px" : "3px",
          width: "18px",
          height: "18px",
          backgroundColor: "white",
          borderRadius: "50%",
          transition: "left 0.3s"
        }}
      />
    </div>
  );
};

export default ToggleSwitch;

