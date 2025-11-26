// 패키지 설정 관리 Custom Hook

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../utils/api';
import { useConfigStorage } from './useConfigStorage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * 패키지 설정을 관리하는 Custom Hook
 * @param {string} packageId - 패키지 ID
 * @param {object} defaultFormData - 기본 폼 데이터
 * @param {object} defaultToggles - 기본 토글 상태
 * @returns {object} 설정 관리 객체
 */
export const usePackageConfig = (packageId, defaultFormData = {}, defaultToggles = {}) => {
  // 패키지 ID를 STORAGE_KEYS 형식으로 변환
  const keyName = packageId.toUpperCase().replace(/-/g, '_') + '_CONFIG';
  const storageKey = STORAGE_KEYS[keyName] || `config_${packageId}`;
  
  const defaultConfig = {
    formData: defaultFormData,
    toggles: defaultToggles,
  };

  const {
    config,
    updateConfig,
    resetConfig,
    hasChanges,
    loading: storageLoading,
    markAsSaved,
  } = useConfigStorage(storageKey, defaultConfig);

  const [installed, setInstalled] = useState(true);
  const [checking, setChecking] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loading, setLoading] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // success, error, warning

  // 설치 여부 확인
  const checkInstalled = useCallback(async () => {
    setChecking(true);
    try {
      const response = await apiFetch(`/${packageId}-config/installed`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setInstalled(data.installed);
      }
    } catch (error) {
      console.error('설치 여부 확인 실패:', error);
      setInstalled(true); // 기본값
    } finally {
      setChecking(false);
    }
  }, [packageId]);

  // 현재 설정 로드
  const loadCurrentConfig = useCallback(async () => {
    if (!installed) return;
    
    setLoadingConfig(true);
    try {
      const response = await apiFetch(`/${packageId}-config/current`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        // 서버 데이터와 localStorage 데이터 병합 (서버 우선)
        // config를 직접 참조하지 않고 함수형 업데이트 사용
        updateConfig((prev) => {
          const mergedFormData = { ...prev.formData, ...data };
          const mergedToggles = { ...prev.toggles, ...(data.toggles || {}) };
          return { formData: mergedFormData, toggles: mergedToggles };
        });
      }
    } catch (error) {
      console.error('설정 로드 실패:', error);
    } finally {
      setLoadingConfig(false);
    }
  }, [packageId, installed, updateConfig]);

  // 설정 저장
  const saveConfig = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await apiFetch(`/${packageId}-config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...config.formData,
          ...config.toggles,
        }),
      });
      if (response.ok) {
        setMessage('설정이 저장되었습니다.');
        setMessageType('success');
        markAsSaved();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setMessage(data.error || '설정 저장에 실패했습니다.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('설정 저장 실패:', error);
      setMessage('설정 저장 중 오류가 발생했습니다.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, [packageId, config, markAsSaved]);

  // 서비스 재시작
  const restartService = useCallback(async () => {
    setRestarting(true);
    setMessage('');
    try {
      const response = await apiFetch(`/${packageId}-config/restart`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || '서비스가 재시작되었습니다.');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setMessage(data.error || '서비스 재시작에 실패했습니다.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('서비스 재시작 실패:', error);
      setMessage('서비스 재시작 중 오류가 발생했습니다.');
      setMessageType('error');
    } finally {
      setRestarting(false);
    }
  }, [packageId]);

  // 초기화
  useEffect(() => {
    checkInstalled();
  }, [checkInstalled]);

  // 초기 로드만 실행 (무한루프 방지)
  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (installed && !checking && !storageLoading && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadCurrentConfig();
    }
  }, [installed, checking, storageLoading, loadCurrentConfig]);

  // formData와 toggles 업데이트 헬퍼
  const updateFormData = useCallback((updates) => {
    updateConfig((prev) => ({
      ...prev,
      formData: typeof updates === 'function' ? updates(prev.formData) : { ...prev.formData, ...updates },
    }));
  }, [updateConfig]);

  const updateToggles = useCallback((updates) => {
    updateConfig((prev) => ({
      ...prev,
      toggles: typeof updates === 'function' ? updates(prev.toggles) : { ...prev.toggles, ...updates },
    }));
  }, [updateConfig]);

  return {
    // 상태
    formData: config.formData,
    toggles: config.toggles,
    installed,
    checking,
    loadingConfig,
    loading,
    restarting,
    message,
    messageType,
    hasChanges,
    
    // 메서드
    updateFormData,
    updateToggles,
    saveConfig,
    restartService,
    resetConfig,
    checkInstalled,
    loadCurrentConfig,
    setMessage,
  };
};

