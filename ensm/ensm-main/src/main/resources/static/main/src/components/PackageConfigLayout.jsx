// 패키지 설정 페이지 레이아웃 컴포넌트

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
import { usePackageConfig } from '../hooks/usePackageConfig';
import { theme, commonStyles } from '../utils/theme';

/**
 * 패키지 설정 페이지 레이아웃
 * 공통 로직과 UI를 제공하는 래퍼 컴포넌트
 */
const PackageConfigLayout = ({
  packageId,
  title,
  defaultFormData,
  defaultToggles,
  children,
  onSave,
  onRestart,
  showExportImport = true,
}) => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  const {
    formData,
    toggles,
    installed,
    checking,
    loadingConfig,
    loading,
    restarting,
    message,
    messageType,
    hasChanges,
    updateFormData,
    updateToggles,
    saveConfig,
    restartService,
    resetConfig,
  } = usePackageConfig(packageId, defaultFormData, defaultToggles);

  // 변경사항 추적
  useEffect(() => {
    setHasUnsavedChanges(hasChanges);
  }, [hasChanges]);

  // 페이지 이탈 시 확인
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSave = async () => {
    if (onSave) {
      await onSave({ formData, toggles, saveConfig });
    } else {
      await saveConfig();
    }
  };

  const handleRestart = async () => {
    if (onRestart) {
      await onRestart({ formData, toggles, restartService });
    } else {
      await restartService();
    }
  };

  const handleReset = () => {
    setShowConfirmDialog(true);
    setPendingAction('reset');
  };

  const confirmAction = () => {
    if (pendingAction === 'reset') {
      resetConfig();
      setHasUnsavedChanges(false);
    }
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  if (checking || loadingConfig) {
    return (
      <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!installed) {
    return (
      <div style={{ padding: '2rem', color: 'white' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h2>
        <div style={commonStyles.card}>
          <p style={{ color: '#ffaa00', marginBottom: '1rem' }}>
            ⚠️ 이 패키지가 설치되어 있지 않습니다.
          </p>
          <button
            onClick={() => navigate('/packages/management')}
            style={commonStyles.button.primary}
          >
            패키지 관리로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: theme.colors.background.primary, minHeight: '100vh', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>{title}</h2>
        {showExportImport && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => {
                const { exportConfig } = require('../utils/configStorage');
                const { STORAGE_KEYS } = require('../utils/constants');
                const key = STORAGE_KEYS[packageId.toUpperCase().replace('-', '_') + '_CONFIG'] || `config_${packageId}`;
                exportConfig(key, `${packageId}_config.json`);
              }}
              style={{
                ...commonStyles.button.primary,
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
              }}
            >
              내보내기
            </button>
            <label
              style={{
                ...commonStyles.button.primary,
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-block',
              }}
            >
              가져오기
              <input
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const { importConfig } = require('../utils/configStorage');
                    const { STORAGE_KEYS } = require('../utils/constants');
                    const key = STORAGE_KEYS[packageId.toUpperCase().replace('-', '_') + '_CONFIG'] || `config_${packageId}`;
                    importConfig(file, key).then(() => {
                      window.location.reload();
                    });
                  }
                }}
              />
            </label>
          </div>
        )}
      </div>

      {message && (
        <div style={commonStyles.message[messageType] || commonStyles.message.success}>
          {message}
        </div>
      )}

      {hasUnsavedChanges && (
        <div style={commonStyles.message.warning}>
          ⚠️ 저장하지 않은 변경사항이 있습니다.
        </div>
      )}

      <div style={commonStyles.card}>
        {children({
          formData,
          toggles,
          updateFormData,
          updateToggles,
          loading,
          restarting,
        })}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button
          onClick={handleRestart}
          disabled={loading || restarting}
          style={{
            ...commonStyles.button.success,
            opacity: (loading || restarting) ? 0.5 : 1,
          }}
        >
          {restarting ? '재시작 중...' : '서비스 재시작'}
        </button>
        <button
          onClick={handleSave}
          disabled={loading || restarting}
          style={{
            ...commonStyles.button.primary,
            opacity: (loading || restarting) ? 0.5 : 1,
          }}
        >
          {loading ? '저장 중...' : '설정 적용'}
        </button>
        {hasUnsavedChanges && (
          <button
            onClick={handleReset}
            disabled={loading || restarting}
            style={{
              ...commonStyles.button.danger,
              opacity: (loading || restarting) ? 0.5 : 1,
            }}
          >
            변경사항 취소
          </button>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="변경사항 취소"
        message="저장하지 않은 변경사항이 모두 사라집니다. 계속하시겠습니까?"
        onConfirm={confirmAction}
        onCancel={() => {
          setShowConfirmDialog(false);
          setPendingAction(null);
        }}
        type="warning"
      />
    </div>
  );
};

export default PackageConfigLayout;

