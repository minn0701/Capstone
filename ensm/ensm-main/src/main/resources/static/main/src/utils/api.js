/**
 * API 호출 유틸리티
 * 실제 백엔드 API를 호출합니다.
 */

const API_BASE_URL = '/main/api';
const AUTH_BASE_URL = '/auth';

/**
 * 통합 API 호출 함수
 * 실제 백엔드 API를 호출합니다.
 * 
 * @param {string} url - API 엔드포인트 URL
 * @param {object} options - fetch 옵션 (method, headers, body 등)
 * @returns {Promise<Response>} fetch Response 객체
 */
export const apiFetch = async (url, options = {}) => {
  // URL이 이미 전체 경로인 경우 그대로 사용, 아니면 base URL 추가
  let fullUrl;
  if (url.startsWith('http') || url.startsWith('/main/api') || url.startsWith('/auth')) {
    fullUrl = url;
  } else {
    fullUrl = `${API_BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
  }
  
  return fetch(fullUrl, {
    ...options,
    credentials: 'include', // 쿠키 포함 (인증용)
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};

/**
 * GET 요청 헬퍼
 */
export const apiGet = (url, options = {}) => {
  return apiFetch(url, { ...options, method: 'GET' });
};

/**
 * POST 요청 헬퍼
 */
export const apiPost = (url, data, options = {}) => {
  return apiFetch(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT 요청 헬퍼
 */
export const apiPut = (url, data, options = {}) => {
  return apiFetch(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE 요청 헬퍼
 */
export const apiDelete = (url, options = {}) => {
  return apiFetch(url, { ...options, method: 'DELETE' });
};


/**
 * 응답을 안전하게 JSON으로 파싱합니다.
 * 빈 응답이나 파싱 오류 시 기본값을 반환합니다.
 * 
 * @param {Response} response - fetch Response 객체
 * @param {any} defaultValue - 파싱 실패 시 반환할 기본값
 * @returns {Promise<any>} 파싱된 JSON 데이터 또는 기본값
 */
export const safeJsonParse = async (response, defaultValue = null) => {
  try {
    // 응답이 비어있는지 확인
    const text = await response.text();
    if (!text || text.trim().length === 0) {
      console.warn('빈 응답을 받았습니다.');
      return defaultValue;
    }
    
    // Content-Type 확인
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      console.warn('JSON이 아닌 응답을 받았습니다:', contentType);
      return defaultValue;
    }
    
    // JSON 파싱 시도
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('JSON 파싱 실패:', parseError);
      console.error('응답 내용:', text.substring(0, 200));
      return defaultValue;
    }
  } catch (error) {
    console.error('응답 읽기 실패:', error);
    return defaultValue;
  }
};

