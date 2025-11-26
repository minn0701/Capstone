import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Settings,
  Network,
  Monitor,
  PackageSearch,
  Home,
  TerminalSquare
} from "lucide-react";


export default function ENSMMockup({ children, selectedDocKey, setSelectedDocKey, docContent }) {
  const [openSidebar, setOpenSidebar] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [installedPackages, setInstalledPackages] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // 패키지 ID를 설정 페이지 경로로 변환
  const getPackageConfigPath = useCallback((packageId) => {
    const pathMap = {
      'apache': '/packages/apache',
      'bind': '/packages/bind',
      'vsftpd': '/packages/vsftpd',
      'nfs-utils': '/packages/nfs',
      'docker': '/packages/docker',
      'git': '/packages/git',
      'jellyfin': '/packages/jellyfin',
      'plex': '/packages/plex',
      'home-assistant': '/packages/home-assistant',
      'novnc': '/packages/novnc'
    };
    return pathMap[packageId] || null;
  }, []);

  // 패키지 ID를 표시 이름으로 변환 (설정 페이지 제목과 동일하게)
  const getPackageDisplayName = useCallback((packageId) => {
    const nameMap = {
      'apache': 'Apache HTTP Server 설정',
      'bind': 'BIND DNS 서버 설정',
      'vsftpd': 'vsftpd FTP 서버 설정',
      'nfs-utils': 'NFS (Network File System) 설정',
      'docker': 'Docker 설정',
      'git': 'Git 설정',
      'jellyfin': 'Jellyfin 미디어 서버 설정',
      'plex': 'Plex 미디어 서버 설정',
      'home-assistant': 'Home Assistant 설정',
      'novnc': 'noVNC 웹 VNC 클라이언트 설정'
    };
    return nameMap[packageId] || packageId;
  }, []);

  // localStorage에서 설치된 패키지 목록 불러오기
  useEffect(() => {
    const loadInstalledPackages = () => {
      const savedPackages = localStorage.getItem('installedPackages');
      if (savedPackages) {
        try {
          const parsed = JSON.parse(savedPackages);
          // installed가 'true'인 패키지만 필터링
          const installed = parsed.filter(pkg => pkg.installed === 'true');
          setInstalledPackages(installed);
        } catch (e) {
          console.error('설치된 패키지 목록 로드 실패:', e);
        }
      } else {
        // 기본값: apache와 bind
        setInstalledPackages([
          { id: 'apache', installed: 'true' },
          { id: 'bind', installed: 'true' }
        ]);
      }
    };

    loadInstalledPackages();
    
    // storage 이벤트 리스너 추가 (다른 탭에서 변경 시 동기화)
    const handleStorageChange = (e) => {
      if (e.key === 'installedPackages') {
        loadInstalledPackages();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // 커스텀 이벤트 리스너 추가 (같은 탭에서 변경 시 동기화)
    const handlePackageChange = () => {
      loadInstalledPackages();
    };
    window.addEventListener('packagesUpdated', handlePackageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('packagesUpdated', handlePackageChange);
    };
  }, []);

  // commandMap 정의 (searchResults보다 먼저)
  const commandMap = {
    ServerAdmin: "/packages/apache",
    ServerName_global: "/packages/apache",
    DocumentRoot: "/packages/apache",
    ServerTokens: "/packages/apache",
    HostnameLookups: "/packages/apache",
    Timeout: "/packages/apache",
    LogLevel: "/packages/apache",
    ErrorLog: "/packages/apache",
    CustomLog: "/packages/apache",
    Require: "/packages/apache",
    AllowOverride: "/packages/apache",
    Indexes: "/packages/apache",
    FollowSymLinks: "/packages/apache",
    SymLinksIfOwnerMatch: "/packages/apache",
    ExecCGI: "/packages/apache",
    env_module: "/packages/apache",
    mime_module: "/packages/apache",
    alias_module: "/packages/apache",
    dir_module: "/packages/apache",
    status_module: "/packages/apache",
    autoindex_module: "/packages/apache",
    include_module: "/packages/apache",
    negotiation_module: "/packages/apache",
    auth_basic_module: "/packages/apache",
    authn_file_module: "/packages/apache",
    authz_host_module: "/packages/apache",
    authz_user_module: "/packages/apache",
    UserDir: "/packages/apache",
    IndexOptions: "/packages/apache",
    AddDescription: "/packages/apache",
    TypesConfig: "/packages/apache",
    DefaultType: "/packages/apache",
    IncludeOptional: "/packages/apache",
    VirtualHost: "/packages/apache",
    ServerName_vhost: "/packages/apache",
    "listen-on port 53": "/packages/bind",
    "listen-on-v6 port 53": "/packages/bind",
    forward: "/packages/bind",
    forwarders: "/packages/bind",
    "allow-query": "/packages/bind",
    "allow-transfer": "/packages/bind",
    acl: "/packages/bind",
    "zone'DomainName'IN": "/packages/bind",
    type: "/packages/bind",
    file: "/packages/bind",
    $TTL: "/packages/bind",
    "사이트_이름": "/packages/bind",
    DNS_server_address: "/packages/bind",
    DNS_administrator_mail_address: "/packages/bind",
    serial: "/packages/bind",
    refresh: "/packages/bind",
    retry: "/packages/bind",
    expire: "/packages/bind",
    "minimum TTL": "/packages/bind",
    name_server_hosts: "/packages/bind",
    IP_address_hosts: "/packages/bind",
    name_server_resolv_conf: "/packages/bind",
    IP_address_resolv_conf: "/packages/bind",
    "도메인": "/packages/bind",
    "방향": "/packages/bind",
    "type_master": "/packages/bind",
    "file_zone_file_name": "/packages/bind",
    "allow-update": "/packages/bind"
  };

  // 동적으로 패키지 메뉴 생성 (useMemo로 최적화)
  const packageMenuItems = useMemo(() => {
    const baseItems = [
      { label: "패키지 관리", path: "/packages/management" }
    ];
    
    // 설치된 패키지 중 설정 페이지가 있는 것만 추가
    const packageItems = installedPackages
      .filter(pkg => getPackageConfigPath(pkg.id))
      .map(pkg => ({
        label: getPackageDisplayName(pkg.id),
        path: getPackageConfigPath(pkg.id)
      }));
    
    return [...baseItems, ...packageItems];
  }, [installedPackages, getPackageConfigPath, getPackageDisplayName]);

  const sidebarContents = useMemo(() => ({
    ensm: [
      { label: "기본 설정", path: "/ensm/settings" }
    ],
    system: [
      { label: "CRON 관리", path: "/system/cron" },
      { label: "Disk 확인 및 RAID 확인", path: "/system/disk" },
      { label: "디스크 및 파티션 관리", path: "/system/disk-management" },
      { label: "RAID 관리", path: "/system/raid" },
      { label: "LVM 관리", path: "/system/lvm" }
    ],
    packages: packageMenuItems,
    network: [
      { label: "네트워크 상태 및 로그 확인", path: "/network/log" },
      { label: "개방 포트 및 관련 Daemon 확인", path: "/network/port" },
      { label: "Cloudflare DDNS 관리", path: "/network/ddns" }
    ],
    tools: [
      { label: "SSH 자동화", path: "/tools/ssh" }
    ]
  }), [packageMenuItems]);

  // 검색 결과 생성 (sidebarContents와 commandMap 이후에 정의)
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') return [];
    
    const query = searchQuery.toLowerCase().trim();
    const results = [];
    
    // 1. 메뉴 항목 검색
    Object.entries(sidebarContents).forEach(([category, items]) => {
      items.forEach(item => {
        if (item.label.toLowerCase().includes(query) || item.path.toLowerCase().includes(query)) {
          results.push({
            type: 'menu',
            category,
            label: item.label,
            path: item.path
          });
        }
      });
    });
    
    // 2. 패키지 설정 옵션 검색 (commandMap)
    Object.entries(commandMap).forEach(([cmd, path]) => {
      if (cmd.toLowerCase().includes(query)) {
        results.push({
          type: 'option',
          label: cmd,
          path: path,
          description: `${path} 페이지의 설정 옵션`
        });
      }
    });
    
    // 3. 패키지 이름으로 검색
    installedPackages.forEach(pkg => {
      const displayName = getPackageDisplayName(pkg.id);
      const configPath = getPackageConfigPath(pkg.id);
      if (displayName.toLowerCase().includes(query) || pkg.id.toLowerCase().includes(query)) {
        if (configPath && !results.find(r => r.path === configPath)) {
          results.push({
            type: 'package',
            label: displayName,
            path: configPath,
            description: '패키지 설정 페이지'
          });
        }
      }
    });
    
    return results;
  }, [searchQuery, sidebarContents, commandMap, installedPackages, getPackageDisplayName, getPackageConfigPath]);
  
  const handleSearch = () => {
    if (searchResults.length > 0) {
      navigate(searchResults[0].path);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setOpenSidebar(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#1e1f22", color: "white", fontFamily: "sans-serif", position: "relative" }}>
        <div style={{ height: "48px", backgroundColor: "#2b2d31", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #444", position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}>
          <h1 style={{ fontWeight: "bold", fontSize: "1rem" }}>ENSM</h1>
        </div>

        <div style={{ display: "flex", flex: 1 }}>
          <div style={{ width: "64px",
                        backgroundColor: "#2b2d31",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "16px 0",
                        paddingTop: "64px",
                        gap: "16px",
                        borderRight: "1px solid #444" }}>

            <button onClick={() => { navigate("/"); setOpenSidebar(null); }} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Home size={20} /></button>
            <button onClick={() => { setShowSearch(!showSearch); setOpenSidebar(null); }} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Search size={20} /></button>
            <button onClick={() => setOpenSidebar(openSidebar === "ensm" ? null : "ensm") } style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Settings size={20} /></button>
            <button onClick={() => setOpenSidebar(openSidebar === "network" ? null : "network") } style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Network size={20} /></button>
            <button onClick={() => setOpenSidebar(openSidebar === "system" ? null : "system") } style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Monitor size={20} /></button>
            <button onClick={() => setOpenSidebar(openSidebar === "packages" ? null : "packages") } style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><PackageSearch size={20} /></button>
            <button onClick={() => setOpenSidebar(openSidebar === "tools" ? null : "tools") } style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><TerminalSquare size={20} /></button>
          </div>

          <div style={{
            marginLeft: "36px",
            marginTop: "48px",
            padding: "24px 24px 24px 0px",
            overflowY: "auto",
            height: "calc(100vh - 48px)",
            backgroundColor: "#1e1f22",
            width: "100%",
            boxSizing: "border-box"
          }}>

          <div style={{ backgroundColor: "#2b2d31",
                          minHeight: "78vh",
                          border: "1px solid #444",
                          borderRadius: "8px",
                          padding: "16px",
                          }}>

              {children}
            </div>
          </div>
        </div>

        {(openSidebar || showSearch) && (
            <motion.div
                ref={searchRef}
                initial={{ x: -260 }}
                animate={{ x: 64 }}
                exit={{ x: -260 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  top: 48,
                  bottom: 0,
                  left: 0,
                  width: "240px",
                  backgroundColor: "#313338",
                  borderRight: "1px solid #444",
                  padding: "16px",
                  zIndex: 9999,
                  overflowY: "auto",
                  maxHeight: "calc(100vh - 48px)"
                }}
            >
              {!showSearch ? (
                  <>
                    <div style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "12px" }}>{openSidebar?.toUpperCase()}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {sidebarContents[openSidebar]?.map((item, idx) => (
                          <button
                              key={idx}
                              onClick={() => navigate(item.path)}
                              style={{ background: "none", border: "none", color: "white", textAlign: "left", cursor: "pointer", paddingLeft: "8px" }}
                          >
                            {item.label}
                          </button>
                      ))}
                    </div>
                  </>
              ) : (
                  <>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                      <input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && searchResults.length > 0) {
                              navigate(searchResults[0].path);
                              setShowSearch(false);
                              setSearchQuery('');
                            }
                          }}
                          placeholder="메뉴, 패키지, 설정 검색..."
                          style={{
                            width: "100%",
                            padding: "6px 8px",
                            borderRadius: "4px",
                            background: "#222",
                            color: "white",
                            border: "1px solid #555",
                            fontSize: "0.85rem"
                          }}
                      />
                    </div>

                    {searchQuery && searchResults.length === 0 && (
                      <div style={{ fontSize: "0.85rem", color: "#888", padding: "8px 0" }}>
                        검색 결과가 없습니다.
                      </div>
                    )}

                    {searchQuery && searchResults.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                        {searchResults.map((result, idx) => (
                          <div
                            key={`result-${idx}`}
                            onClick={() => {
                              navigate(result.path);
                              setShowSearch(false);
                              setSearchQuery('');
                            }}
                            style={{
                              fontSize: "0.85rem",
                              padding: "8px",
                              cursor: "pointer",
                              backgroundColor: idx === 0 ? "#444" : "transparent",
                              borderRadius: "4px",
                              border: "1px solid #555",
                              transition: "background-color 0.2s"
                            }}
                            onMouseEnter={(e) => {
                              if (idx !== 0) e.currentTarget.style.backgroundColor = "#333";
                            }}
                            onMouseLeave={(e) => {
                              if (idx !== 0) e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            <div style={{ 
                              color: result.type === 'package' ? "#4ade80" : result.type === 'option' ? "#60a5fa" : "#fff",
                              fontWeight: "500",
                              marginBottom: "2px"
                            }}>
                              {result.label}
                            </div>
                            {result.description && (
                              <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "2px" }}>
                                {result.description}
                              </div>
                            )}
                            <div style={{ fontSize: "0.7rem", color: "#666", marginTop: "2px" }}>
                              {result.path}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
              )}
            </motion.div>
        )}
      </div>
  );
}
