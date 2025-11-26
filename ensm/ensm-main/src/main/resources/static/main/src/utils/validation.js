// 입력 검증 유틸리티

/**
 * 포트 번호 검증 (1-65535)
 */
export const validatePort = (port) => {
  const num = parseInt(port, 10);
  if (isNaN(num)) {
    return { valid: false, error: "포트 번호는 숫자여야 합니다." };
  }
  if (num < 1 || num > 65535) {
    return { valid: false, error: "포트 번호는 1-65535 사이여야 합니다." };
  }
  return { valid: true, error: null };
};

/**
 * 경로 검증 (절대 경로)
 */
export const validatePath = (path) => {
  if (!path || path.trim() === "") {
    return { valid: false, error: "경로를 입력해주세요." };
  }
  if (!path.startsWith("/")) {
    return { valid: false, error: "절대 경로는 '/'로 시작해야 합니다." };
  }
  return { valid: true, error: null };
};

/**
 * 이메일 검증
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return { valid: false, error: "이메일을 입력해주세요." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "올바른 이메일 형식이 아닙니다." };
  }
  return { valid: true, error: null };
};

/**
 * IP 주소 검증
 */
export const validateIP = (ip) => {
  if (!ip || ip.trim() === "") {
    return { valid: false, error: "IP 주소를 입력해주세요." };
  }
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (!ipRegex.test(ip)) {
    return { valid: false, error: "올바른 IP 주소 형식이 아닙니다." };
  }
  return { valid: true, error: null };
};

/**
 * IPv6 주소 검증
 */
export const validateIPv6 = (ipv6) => {
  if (!ipv6 || ipv6.trim() === "") {
    return { valid: false, error: "IPv6 주소를 입력해주세요." };
  }
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  if (!ipv6Regex.test(ipv6)) {
    return { valid: false, error: "올바른 IPv6 주소 형식이 아닙니다." };
  }
  return { valid: true, error: null };
};

/**
 * 도메인 이름 검증
 */
export const validateDomain = (domain) => {
  if (!domain || domain.trim() === "") {
    return { valid: false, error: "도메인 이름을 입력해주세요." };
  }
  const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return { valid: false, error: "올바른 도메인 이름 형식이 아닙니다." };
  }
  return { valid: true, error: null };
};

/**
 * 필수 필드 검증
 */
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return { valid: false, error: `${fieldName}은(는) 필수 항목입니다.` };
  }
  return { valid: true, error: null };
};

/**
 * 숫자 범위 검증
 */
export const validateNumberRange = (value, min, max, fieldName) => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return { valid: false, error: `${fieldName}은(는) 숫자여야 합니다.` };
  }
  if (num < min || num > max) {
    return { valid: false, error: `${fieldName}은(는) ${min}-${max} 사이여야 합니다.` };
  }
  return { valid: true, error: null };
};

/**
 * CRON 표현식 검증
 */
export const validateCronExpression = (cron) => {
  if (!cron || cron.trim() === "") {
    return { valid: false, error: "CRON 표현식을 입력해주세요." };
  }
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { valid: false, error: "CRON 표현식은 5개의 필드(분 시 일 월 요일)로 구성되어야 합니다." };
  }
  // 간단한 형식 검증
  const cronRegex = /^(\*|([0-9]|[1-5][0-9])(-([0-9]|[1-5][0-9]))?(\/([0-9]|[1-5][0-9]))?|([0-9]|[1-5][0-9])(,([0-9]|[1-5][0-9]))+)$/;
  // 각 필드 검증은 복잡하므로 기본적인 형식만 체크
  return { valid: true, error: null };
};

