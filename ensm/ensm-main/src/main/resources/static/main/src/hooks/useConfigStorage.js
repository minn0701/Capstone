// 설정 저장소 Custom Hook

import { useState, useEffect, useCallback } from 'react';
import { loadConfigFromStorage, saveConfigToStorage } from '../utils/configStorage';

/**
 * 설정 저장소를 관리하는 Custom Hook
 * @param {string} storageKey - localStorage 키
 * @param {object} defaultConfig - 기본 설정값
 * @returns {object} { config, updateConfig, resetConfig, hasChanges, originalConfig }
 */
export const useConfigStorage = (storageKey, defaultConfig = {}) => {
  const [config, setConfig] = useState(defaultConfig);
  const [originalConfig, setOriginalConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);

  // 초기 로드
  useEffect(() => {
    const saved = loadConfigFromStorage(storageKey);
    if (saved) {
      const mergedConfig = { ...defaultConfig, ...saved };
      setConfig(mergedConfig);
      setOriginalConfig(mergedConfig);
    } else {
      setConfig(defaultConfig);
      setOriginalConfig(defaultConfig);
    }
    setLoading(false);
  }, [storageKey]);

  // 설정 업데이트
  const updateConfig = useCallback((updates) => {
    setConfig((prev) => {
      const newConfig = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      saveConfigToStorage(storageKey, newConfig);
      return newConfig;
    });
  }, [storageKey]);

  // 설정 리셋
  const resetConfig = useCallback(() => {
    setConfig(originalConfig);
    saveConfigToStorage(storageKey, originalConfig);
  }, [originalConfig, storageKey]);

  // 변경사항 확인
  const hasChanges = JSON.stringify(config) !== JSON.stringify(originalConfig);

  // 원본 설정 업데이트 (저장 후)
  const markAsSaved = useCallback(() => {
    setOriginalConfig(config);
  }, [config]);

  return {
    config,
    updateConfig,
    resetConfig,
    hasChanges,
    originalConfig,
    loading,
    markAsSaved,
  };
};

