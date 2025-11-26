// 검증 가능한 입력 컴포넌트

import React, { useState, useEffect } from 'react';

/**
 * 검증 가능한 입력 컴포넌트
 * @param {string} value - 입력값
 * @param {function} onChange - 변경 핸들러
 * @param {function} validator - 검증 함수 (value) => { valid: boolean, error: string }
 * @param {string} type - 입력 타입
 * @param {object} props - 기타 input props
 */
const ValidatedInput = ({
  value,
  onChange,
  validator,
  type = 'text',
  showError = true,
  ...props
}) => {
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched && validator) {
      const result = validator(value);
      setError(result.valid ? null : result.error);
    }
  }, [value, touched, validator]);

  const handleBlur = (e) => {
    setTouched(true);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const handleChange = (e) => {
    onChange(e);
    if (touched && validator) {
      const result = validator(e.target.value);
      setError(result.valid ? null : result.error);
    }
  };

  const isValid = !error;

  return (
    <div style={{ width: '100%' }}>
      <input
        {...props}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        style={{
          ...props.style,
          borderColor: touched && !isValid ? '#ff4444' : props.style?.borderColor || '#444',
        }}
        aria-invalid={!isValid}
        aria-describedby={error ? `${props.id || 'input'}-error` : undefined}
      />
      {showError && touched && error && (
        <div
          id={props.id ? `${props.id}-error` : 'input-error'}
          style={{
            marginTop: '0.25rem',
            fontSize: '0.85rem',
            color: '#ff6666',
          }}
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default ValidatedInput;

