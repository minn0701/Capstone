import React from 'react';

/**
 * Grafana 스타일의 반원형 게이지 컴포넌트 (위쪽 반원)
 * @param {number} value - 현재 값 (0-100)
 * @param {string} label - 라벨
 * @param {string} unit - 단위 (기본: '%')
 * @param {number} min - 최소값 (기본: 0)
 * @param {number} max - 최대값 (기본: 100)
 * @param {boolean} isDarkMode - 다크모드 여부 (기본: true)
 */
export default function Gauge({ value, label, unit = '%', min = 0, max = 100, isDarkMode = true }) {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  const normalizedValue = Math.min(Math.max(value, min), max);
  
  // 색상 결정 (Grafana 스타일: 초록 -> 노랑 -> 주황 -> 빨강)
  let color = '#4ade80'; // 초록
  if (percentage > 80) color = '#ef4444'; // 빨강
  else if (percentage > 60) color = '#f59e0b'; // 주황
  else if (percentage > 40) color = '#eab308'; // 노랑
  
  // 위쪽 반원형 게이지 계산
  // 중심점을 아래쪽에 두고 위쪽 반원을 그림
  const radius = 80;
  const centerX = 120;
  const centerY = 100; // 중심점을 아래쪽에 위치
  
  // 시작점 (왼쪽 위, 180도)
  const startAngle = Math.PI; // 180도 (왼쪽)
  const startX = centerX + radius * Math.cos(startAngle);
  const startY = centerY + radius * Math.sin(startAngle);
  
  // 끝점 (오른쪽 위, 0도)
  const endAngle = 0; // 0도 (오른쪽)
  const endX = centerX + radius * Math.cos(endAngle);
  const endY = centerY + radius * Math.sin(endAngle);
  
  // 현재 값에 해당하는 각도 (180도에서 시작해서 시계방향으로 0도까지)
  // percentage가 0이면 180도, 100이면 0도
  const currentAngle = Math.PI - (percentage / 100) * Math.PI;
  const currentX = centerX + radius * Math.cos(currentAngle);
  const currentY = centerY + radius * Math.sin(currentAngle);
  
  // 큰 호인지 작은 호인지 판단 (180도 반원이므로 항상 큰 호)
  const largeArcFlag = 1;
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '1rem',
      position: 'relative'
    }}>
      <div style={{ position: 'relative', width: '240px', height: '140px', overflow: 'hidden' }}>
        <svg 
          width="240" 
          height="140" 
          viewBox="0 0 240 140"
          style={{ display: 'block' }}
        >
          {/* 배경 반원 (왼쪽에서 오른쪽으로, 시계방향) */}
          <path
            d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
            fill="none"
            stroke={isDarkMode ? "#2a2a2a" : "#e5e7eb"}
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* 값 반원 (왼쪽에서 현재 값까지, 시계방향) */}
          {percentage > 0 && (
            <path
              d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${currentX} ${currentY}`}
              fill="none"
              stroke={color}
              strokeWidth="16"
              strokeLinecap="round"
              style={{
                transition: 'd 0.5s ease-out, stroke 0.3s ease-out'
              }}
            />
          )}
          {/* 눈금 표시 */}
          {[0, 25, 50, 75, 100].map((val, idx) => {
            const angle = Math.PI - (val / 100) * Math.PI;
            const x1 = centerX + radius * Math.cos(angle);
            const y1 = centerY + radius * Math.sin(angle);
            const x2 = centerX + (radius + 6) * Math.cos(angle);
            const y2 = centerY + (radius + 6) * Math.sin(angle);
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isDarkMode ? "#444" : "#9ca3af"}
                strokeWidth="2"
              />
            );
          })}
        </svg>
        {/* 중앙 텍스트 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: isDarkMode ? '#fff' : '#333',
            lineHeight: 1,
            fontFamily: 'monospace'
          }}>
            {normalizedValue.toFixed(1)}
          </div>
          <div style={{
            fontSize: '1.2rem',
            color: isDarkMode ? '#aaa' : '#666',
            marginTop: '0.25rem'
          }}>
            {unit}
          </div>
        </div>
      </div>
      {/* 라벨 */}
      <div style={{
        marginTop: '0.5rem',
        fontSize: '1.1rem',
        fontWeight: '500',
        color: isDarkMode ? '#fff' : '#333',
        textAlign: 'center'
      }}>
        {label}
      </div>
    </div>
  );
}
