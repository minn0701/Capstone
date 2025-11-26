// 설정값 localStorage 저장/로드 유틸리티

/**
 * localStorage에서 설정 로드
 * @param {string} storageKey - 저장소 키
 * @returns {object|null} 저장된 설정 또는 null
 */
export const loadConfigFromStorage = (storageKey) => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error(`localStorage에서 설정 로드 실패 (${storageKey}):`, error);
    // 에러 발생 시 사용자에게 알림 (옵션)
    if (window.showToast) {
      window.showToast('설정을 불러오는데 실패했습니다.', 'error');
    }
  }
  return null;
};

/**
 * localStorage에 설정 저장
 * @param {string} storageKey - 저장소 키
 * @param {object} configData - 저장할 설정 데이터
 * @returns {boolean} 저장 성공 여부
 */
export const saveConfigToStorage = (storageKey, configData) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(configData));
    return true;
  } catch (error) {
    console.error(`localStorage에 설정 저장 실패 (${storageKey}):`, error);
    // QuotaExceededError 등 처리
    if (error.name === 'QuotaExceededError') {
      if (window.showToast) {
        window.showToast('저장 공간이 부족합니다. 브라우저 저장 공간을 확인해주세요.', 'error');
      }
    } else if (window.showToast) {
      window.showToast('설정 저장에 실패했습니다.', 'error');
    }
    return false;
  }
};

/**
 * 설정 내보내기 (JSON 다운로드)
 * @param {string} storageKey - 저장소 키
 * @param {string} filename - 파일명
 */
export const exportConfig = (storageKey, filename = 'config.json') => {
  const config = loadConfigFromStorage(storageKey);
  if (!config) {
    if (window.showToast) {
      window.showToast('내보낼 설정이 없습니다.', 'warning');
    }
    return;
  }

  const dataStr = JSON.stringify(config, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  if (window.showToast) {
    window.showToast('설정이 내보내졌습니다.', 'success');
  }
};

/**
 * 설정 가져오기 (JSON 파일 읽기)
 * @param {File} file - 가져올 파일
 * @param {string} storageKey - 저장소 키
 * @returns {Promise<boolean>} 가져오기 성공 여부
 */
export const importConfig = async (file, storageKey) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        if (saveConfigToStorage(storageKey, config)) {
          if (window.showToast) {
            window.showToast('설정이 가져와졌습니다. 페이지를 새로고침해주세요.', 'success');
          }
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        console.error('설정 파일 파싱 실패:', error);
        if (window.showToast) {
          window.showToast('설정 파일 형식이 올바르지 않습니다.', 'error');
        }
        resolve(false);
      }
    };
    reader.onerror = () => {
      if (window.showToast) {
        window.showToast('파일을 읽는데 실패했습니다.', 'error');
      }
      resolve(false);
    };
    reader.readAsText(file);
  });
};

/**
 * 설정 삭제
 * @param {string} storageKey - 저장소 키
 */
export const deleteConfig = (storageKey) => {
  try {
    localStorage.removeItem(storageKey);
    if (window.showToast) {
      window.showToast('설정이 삭제되었습니다.', 'success');
    }
    return true;
  } catch (error) {
    console.error(`설정 삭제 실패 (${storageKey}):`, error);
    return false;
  }
};

