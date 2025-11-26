import React, { useState, useEffect } from 'react';

const sampleLogs = [
  { time: '10:23:45', level: 'INFO', service: 'systemd', message: 'System started successfully' },
  { time: '10:23:46', level: 'INFO', service: 'network', message: 'Network interface eth0 is up' },
  { time: '10:23:47', level: 'INFO', service: 'apache', message: 'Apache HTTP Server started on port 80' },
  { time: '10:23:48', level: 'WARN', service: 'system', message: 'High memory usage detected: 38.5%' },
  { time: '10:23:49', level: 'INFO', service: 'cron', message: 'Cron job executed: /usr/bin/backup.sh' },
  { time: '10:23:50', level: 'INFO', service: 'bind', message: 'DNS queries processed: 125' },
  { time: '10:23:51', level: 'INFO', service: 'system', message: 'CPU usage: 25.3%' },
  { time: '10:23:52', level: 'INFO', service: 'network', message: 'Connection established: 192.168.1.100' },
  { time: '10:23:53', level: 'INFO', service: 'apache', message: 'Request processed: GET /index.html' },
  { time: '10:23:54', level: 'INFO', service: 'system', message: 'Disk usage: 45.2%' },
];

const logLevelColors = {
  INFO: '#4ade80',
  WARN: '#f59e0b',
  ERROR: '#ef4444',
  DEBUG: '#3b82f6'
};

export default function LogViewer({ isDarkMode = true }) {
  const [logs, setLogs] = useState(sampleLogs);
  
  useEffect(() => {
    // 새로운 로그 추가 (실시간 시뮬레이션)
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('ko-KR', { hour12: false });
      
      const newLogMessages = [
        { level: 'INFO', service: 'system', message: `CPU usage: ${(20 + Math.random() * 10).toFixed(1)}%` },
        { level: 'INFO', service: 'system', message: `Memory usage: ${(30 + Math.random() * 10).toFixed(1)}%` },
        { level: 'INFO', service: 'apache', message: `Request processed: GET /api/status` },
        { level: 'INFO', service: 'network', message: `Packet received: ${Math.floor(Math.random() * 1000)} bytes` },
        { level: 'WARN', service: 'system', message: 'High memory usage detected' },
        { level: 'INFO', service: 'cron', message: 'Scheduled task executed successfully' },
        { level: 'INFO', service: 'bind', message: `DNS query resolved: ${Math.floor(Math.random() * 100)}ms` },
        { level: 'INFO', service: 'system', message: 'System health check passed' },
      ];
      
      const randomMessage = newLogMessages[Math.floor(Math.random() * newLogMessages.length)];
      
      setLogs(prev => {
        const newLogs = [...prev, { time: timeStr, ...randomMessage }];
        // 최대 50개까지만 유지
        return newLogs.slice(-50);
      });
    }, 2000 + Math.random() * 3000); // 2-5초마다
    
    return () => clearInterval(interval);
  }, []);
  
  const bgColor = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const borderColor = isDarkMode ? '#333' : '#e5e7eb';
  const timeColor = isDarkMode ? '#888' : '#666';
  const messageColor = isDarkMode ? '#fff' : '#333';

  return (
    <div style={{
      backgroundColor: bgColor,
      borderRadius: '4px',
      padding: '1rem',
      height: '520px',
      overflow: 'auto',
      fontFamily: 'monospace',
      fontSize: '0.9rem',
      color: textColor
    }}>
      {logs.map((log, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            gap: '1rem',
            padding: '0.5rem 0',
            borderBottom: index < logs.length - 1 ? `1px solid ${borderColor}` : 'none',
            alignItems: 'flex-start'
          }}
        >
          <span style={{ color: timeColor, minWidth: '80px' }}>{log.time}</span>
          <span
            style={{
              color: logLevelColors[log.level] || textColor,
              minWidth: '50px',
              fontWeight: 'bold'
            }}
          >
            {log.level}
          </span>
          <span style={{ color: '#3b82f6', minWidth: '80px' }}>{log.service}:</span>
          <span style={{ color: messageColor, flex: 1 }}>{log.message}</span>
        </div>
      ))}
    </div>
  );
}
