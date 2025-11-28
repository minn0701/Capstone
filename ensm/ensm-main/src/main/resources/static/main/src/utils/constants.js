// 상수 정의

// 스토리지 키
export const STORAGE_KEYS = {
  INSTALLED_PACKAGES: 'installedPackages',
  APACHE_CONFIG: 'config_apache',
  BIND_CONFIG: 'config_bind',
  VSFTPD_CONFIG: 'config_vsftpd',
  DOCKER_CONFIG: 'config_docker',
  PLEX_CONFIG: 'config_plex',
  HOME_ASSISTANT_CONFIG: 'config_home-assistant',
  DDNS_CONFIG: 'config_ddns',
};

// 패키지 정보
export const PACKAGE_INFO = {
  'apache': { name: 'Apache HTTP Server', category: '웹서버' },
  'bind': { name: 'BIND DNS Server', category: 'DNS서버' },
  'vsftpd': { name: 'vsftpd', category: '파일서버' },
  'docker': { name: 'Docker', category: '컨테이너' },
  'plex': { name: 'Plex', category: '미디어서버' },
  'home-assistant': { name: 'Home Assistant', category: '홈자동화' },
};

// 패키지 설정 페이지 경로
export const PACKAGE_ROUTES = {
  'apache': '/packages/apache',
  'bind': '/packages/bind',
  'vsftpd': '/packages/vsftpd',
  'docker': '/packages/docker',
  'plex': '/packages/plex',
  'home-assistant': '/packages/home-assistant',
};

// 패키지 표시 이름
export const PACKAGE_DISPLAY_NAMES = {
  'apache': 'Apache HTTP Server 설정',
  'bind': 'BIND DNS 서버 설정',
  'vsftpd': 'vsftpd FTP 서버 설정',
  'docker': 'Docker 설정',
  'plex': 'Plex 미디어 서버 설정',
  'home-assistant': 'Home Assistant 설정',
};


// 서비스 상태
export const SERVICE_STATUS = {
  RUNNING: 'running',
  STOPPED: 'stopped',
  FAILED: 'failed',
  RESTARTING: 'restarting',
};

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 연결을 확인해주세요.',
  STORAGE_ERROR: '설정 저장에 실패했습니다. 브라우저 저장 공간을 확인해주세요.',
  VALIDATION_ERROR: '입력값이 올바르지 않습니다.',
  INSTALL_FAILED: '패키지 설치에 실패했습니다.',
  SAVE_FAILED: '설정 저장에 실패했습니다.',
  LOAD_FAILED: '설정을 불러오는데 실패했습니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
};

// 성공 메시지
export const SUCCESS_MESSAGES = {
  SAVED: '설정이 저장되었습니다.',
  INSTALLED: '패키지가 설치되었습니다.',
  RESTARTED: '서비스가 재시작되었습니다.',
  STARTED: '서비스가 시작되었습니다.',
  STOPPED: '서비스가 중지되었습니다.',
};

