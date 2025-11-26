// Toast 알림 컴포넌트

import React, { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // 애니메이션 대기
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: { bg: '#1a3a1a', border: '#44ff44', text: '#66ff66', icon: '#66ff66' },
    error: { bg: '#3a1a1a', border: '#ff4444', text: '#ff6666', icon: '#ff6666' },
    warning: { bg: '#3a3a1a', border: '#ffaa00', text: '#ffaa00', icon: '#ffaa00' },
    info: { bg: '#1a3a3a', border: '#4488ff', text: '#66aaff', icon: '#66aaff' },
  };

  const Icon = icons[type] || Info;
  const color = colors[type] || colors.info;

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: color.bg,
        border: `1px solid ${color.border}`,
        borderRadius: '8px',
        padding: '1rem',
        minWidth: '300px',
        maxWidth: '500px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <Icon size={20} color={color.icon} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1, color: color.text }}>
        <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{type.toUpperCase()}</div>
        <div style={{ fontSize: '0.9rem' }}>{message}</div>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: color.text,
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        aria-label="닫기"
      >
        <X size={16} />
      </button>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// Toast 컨테이너 (여러 Toast 관리)
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Toast Hook
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => showToast(message, 'success', duration), [showToast]);
  const error = useCallback((message, duration) => showToast(message, 'error', duration), [showToast]);
  const warning = useCallback((message, duration) => showToast(message, 'warning', duration), [showToast]);
  const info = useCallback((message, duration) => showToast(message, 'info', duration), [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};

export default Toast;

