// localStorage 초기화 및 관리 헬퍼 유틸리티

/**
 * localStorage에서 값을 안전하게 가져오고, 없으면 기본값을 설정하여 반환
 * @param {string} key - localStorage 키
 * @param {any} defaultValue - 키가 없을 때 설정할 기본값
 * @param {function} validator - 값 검증 함수 (선택사항)
 * @returns {any} 저장된 값 또는 기본값
 */
export const getOrInitStorage = (key, defaultValue, validator = null) => {
  try {
    const saved = localStorage.getItem(key);
    
    if (saved === null || saved === undefined) {
      // 키가 없으면 기본값 설정
      console.log(`[Storage] 키 "${key}" 없음, 기본값 설정`);
      const valueToStore = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
      try {
        localStorage.setItem(key, JSON.stringify(valueToStore));
        console.log(`[Storage] 키 "${key}" 기본값 저장 완료`);
      } catch (storageError) {
        console.error(`[Storage] 키 "${key}" 저장 실패:`, storageError);
      }
      return valueToStore;
    }
    
    // 키가 있으면 파싱 시도
    try {
      const parsed = JSON.parse(saved);
      
      // 검증 함수가 있으면 검증
      if (validator && typeof validator === 'function') {
        const isValid = validator(parsed);
        if (!isValid) {
          console.warn(`[Storage] 키 "${key}" 값 검증 실패, 기본값 사용`);
          const valueToStore = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
          localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        }
      }
      
      return parsed;
    } catch (parseError) {
      console.warn(`[Storage] 키 "${key}" 파싱 실패, 기본값 사용:`, parseError);
      // 파싱 실패 시 기본값 설정
      const valueToStore = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
      try {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (storageError) {
        console.error(`[Storage] 키 "${key}" 저장 실패:`, storageError);
      }
      return valueToStore;
    }
  } catch (error) {
    console.error(`[Storage] 키 "${key}" 처리 중 에러:`, error);
    // 에러 발생 시 기본값 반환
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  }
};

/**
 * 배열 타입 localStorage 값 가져오기 (빈 배열이면 기본값 설정)
 * @param {string} key - localStorage 키
 * @param {Array} defaultArray - 기본 배열
 * @returns {Array} 저장된 배열 또는 기본 배열
 */
export const getOrInitArrayStorage = (key, defaultArray = []) => {
  const value = getOrInitStorage(key, defaultArray, (parsed) => {
    return Array.isArray(parsed);
  });
  
  // 배열이 비어있으면 기본값으로 재설정
  if (Array.isArray(value) && value.length === 0 && defaultArray.length > 0) {
    console.log(`[Storage] 키 "${key}" 배열이 비어있음, 기본값으로 재설정`);
    try {
      localStorage.setItem(key, JSON.stringify(defaultArray));
    } catch (storageError) {
      console.error(`[Storage] 키 "${key}" 저장 실패:`, storageError);
    }
    return defaultArray;
  }
  
  return value;
};

/**
 * 객체 타입 localStorage 값 가져오기
 * @param {string} key - localStorage 키
 * @param {Object} defaultObject - 기본 객체
 * @returns {Object} 저장된 객체 또는 기본 객체
 */
export const getOrInitObjectStorage = (key, defaultObject = {}) => {
  return getOrInitStorage(key, defaultObject, (parsed) => {
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
  });
};

/**
 * localStorage에 안전하게 저장
 * @param {string} key - localStorage 키
 * @param {any} value - 저장할 값
 * @returns {boolean} 저장 성공 여부
 */
export const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[Storage] 키 "${key}" 저장 실패:`, error);
    return false;
  }
};

/**
 * localStorage에서 안전하게 삭제
 * @param {string} key - localStorage 키
 */
export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
    console.log(`[Storage] 키 "${key}" 삭제 완료`);
  } catch (error) {
    console.error(`[Storage] 키 "${key}" 삭제 실패:`, error);
  }
};

/**
 * 모든 localStorage 초기화 (개발용)
 */
export const clearAllStorage = () => {
  try {
    localStorage.clear();
    console.log('[Storage] 모든 localStorage 초기화 완료');
  } catch (error) {
    console.error('[Storage] localStorage 초기화 실패:', error);
  }
};

