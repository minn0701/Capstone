// 확인 다이얼로그 컴포넌트

import React from 'react';

/**
 * 확인 다이얼로그 컴포넌트
 */
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = '확인', cancelText = '취소', type = 'warning' }) => {
  if (!isOpen) return null;

  const colors = {
    warning: { bg: '#3a3a1a', border: '#ffaa00', text: '#ffaa00' },
    danger: { bg: '#3a1a1a', border: '#ff4444', text: '#ff6666' },
    info: { bg: '#1a3a3a', border: '#4488ff', text: '#66aaff' },
  };

  const color = colors[type] || colors.warning;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: '#2b2d31',
          border: `1px solid ${color.border}`,
          borderRadius: '8px',
          padding: '1.5rem',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
      >
        <h3
          id="dialog-title"
          style={{
            fontSize: '1.2rem',
            marginBottom: '1rem',
            color: color.text,
          }}
        >
          {title}
        </h3>
        <p
          id="dialog-message"
          style={{
            marginBottom: '1.5rem',
            color: '#aaa',
            lineHeight: '1.5',
          }}
        >
          {message}
        </p>
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: type === 'danger' ? '#dc2626' : '#5865f2',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

