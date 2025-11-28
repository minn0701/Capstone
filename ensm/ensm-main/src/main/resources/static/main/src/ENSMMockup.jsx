import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch, safeJsonParse } from "./utils/api";
import {
  Search,
  Settings,
  Network,
  Monitor,
  PackageSearch,
  Home,
  TerminalSquare,
  ChevronRight,
  Menu // 햄버거 메뉴 아이콘 추가 (필요시)
} from "lucide-react";

// --- [UI Component] 브랜드 로고  ---
const BrandSymbol = () => (
  <div style={{
    width: "48px",
    height: "48px",
    backgroundColor: "#5865F2", // 보내주신 사진의 그 파란색
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "28px",
    fontWeight: "900",
    fontFamily: "'Pretendard', sans-serif",
    boxShadow: "0 4px 12px rgba(88, 101, 242, 0.4)", // 은은한 발광 효과
    marginBottom: "16px", // 아래 메뉴들과 간격 분리
    flexShrink: 0
  }}>
    E
  </div>
);

// --- [UI Component] 사이드바 메뉴 아이콘 ---
const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginBottom: "8px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 활성화 표시 바 (왼쪽) */}
      {isActive && (
        <motion.div
          layoutId="active-pill"
          style={{
            position: "absolute",
            left: 0,
            width: "4px",
            height: "36px",
            backgroundColor: "white",
            borderTopRightRadius: "4px",
            borderBottomRightRadius: "4px",
          }}
        />
      )}

      {/* 아이콘 버튼 */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1, backgroundColor: "#5865F2", color: "#fff" }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: "48px",
          height: "48px",
          background: isActive ? "#5865F2" : "transparent",
          border: "none",
          color: isActive ? "#fff" : "#dbdee1",
          cursor: "pointer",
          borderRadius: "14px", // 로고와 통일감 있는 둥근 사각형
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={24} strokeWidth={2.5} /> {/* 아이콘 두께를 살짝 키워 가독성 확보 */}
      </motion.button>

      {/* 툴팁 (Hover 시 등장) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 20, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              left: "100%",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "#111214",
              color: "white",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: "600",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              zIndex: 10000,
              pointerEvents: "none",
            }}
          >
            {label}
            {/* 말풍선 꼬리 */}
            <div style={{
              position: "absolute", left: "-6px", top: "50%", marginTop: "-6px",
              width: "0", height: "0",
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderRight: "6px solid #111214"
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ENSMMockup({ children, selectedDocKey, setSelectedDocKey, docContent }) {
  const [openSidebar, setOpenSidebar] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [installedPackages, setInstalledPackages] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getPackageConfigPath = useCallback((packageId) => {
    const pathMap = {
      'apache': '/packages/apache',
      'bind': '/packages/bind',
      'vsftpd': '/packages/vsftpd',
      'docker': '/packages/docker',
      'plex': '/packages/plex',
      'home-assistant': '/packages/home-assistant'
    };
    return pathMap[packageId] || null;
  }, []);

  const getPackageDisplayName = useCallback((packageId) => {
    const nameMap = {
      'apache': 'Apache HTTP Server',
      'bind': 'BIND DNS Server',
      'vsftpd': 'vsftpd FTP Server',
      'docker': 'Docker Engine',
      'plex': 'Plex Media',
      'home-assistant': 'Home Assistant'
    };
    return nameMap[packageId] || packageId;
  }, []);

  useEffect(() => {
    const loadInstalledPackages = async () => {
      try {
        const response = await apiFetch("/main/api/packages");
        if (response.ok) {
          const data = await safeJsonParse(response, []);
          // 설치된 패키지만 필터링 (installed === true인 것만)
          const installed = Array.isArray(data) 
            ? data.filter(pkg => pkg.installed === true || pkg.installed === "true")
            : [];
          setInstalledPackages(installed);
        } else {
          console.error('패키지 목록 API 응답 실패:', response.status);
          setInstalledPackages([]);
        }
      } catch (error) {
        console.error('설치된 패키지 목록 로드 실패:', error);
        setInstalledPackages([]);
      }
    };
    
    loadInstalledPackages();
    // 주기적으로 패키지 목록 갱신 (30초마다)
    const interval = setInterval(loadInstalledPackages, 30000);
    return () => clearInterval(interval);
  }, []);

  const commandMap = {
    ServerAdmin: "/packages/apache",
    ServerName_global: "/packages/apache",
    DocumentRoot: "/packages/apache",
    "listen-on port 53": "/packages/bind",
    // ... 나머지 매핑 유지
  };

  const packageMenuItems = useMemo(() => {
    const baseItems = [
      { label: "패키지 관리자", path: "/packages/management"}
    ];
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
      { label: "CRON 스케줄러", path: "/system/cron" },
      { label: "디스크 상태 점검", path: "/system/disk" },
      { label: "파티션 관리", path: "/system/disk-management" },
      { label: "RAID 구성", path: "/system/raid" },
      { label: "LVM 볼륨 관리", path: "/system/lvm" }
    ],
    packages: packageMenuItems,
    network: [
      { label: "네트워크 로그", path: "/network/log" },
      { label: "포트 및 데몬 확인", path: "/network/port" },
      { label: "DDNS 설정", path: "/network/ddns" }
    ],
    tools: [
      { label: "SSH 자동화 도구", path: "/tools/ssh" }
    ]
  }), [packageMenuItems]);

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') return [];
    const query = searchQuery.toLowerCase().trim();
    const results = [];

    Object.entries(sidebarContents).forEach(([category, items]) => {
      items.forEach(item => {
        if (item.label.toLowerCase().includes(query) || item.path.toLowerCase().includes(query)) {
          results.push({ type: 'menu', category, label: item.label, path: item.path });
        }
      });
    });

    Object.entries(commandMap).forEach(([cmd, path]) => {
      if (cmd.toLowerCase().includes(query)) {
        results.push({ type: 'option', label: cmd, path: path, description: `${path.split('/').pop()} 옵션` });
      }
    });

    installedPackages.forEach(pkg => {
      const displayName = getPackageDisplayName(pkg.id);
      const configPath = getPackageConfigPath(pkg.id);
      if (displayName.toLowerCase().includes(query) || pkg.id.toLowerCase().includes(query)) {
        if (configPath && !results.find(r => r.path === configPath)) {
          results.push({ type: 'package', label: displayName, path: configPath, description: '설치됨' });
        }
      }
    });
    return results;
  }, [searchQuery, sidebarContents, commandMap, installedPackages, getPackageDisplayName, getPackageConfigPath]);

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

  const toggleSidebar = (menuName) => {
    if (openSidebar === menuName) {
      setOpenSidebar(null);
    } else {
      setOpenSidebar(menuName);
      setShowSearch(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#1e1f22", color: "#dbdee1", fontFamily: "'Pretendard', sans-serif", overflow: "hidden" }}>

      {/* 1. 고정 사이드바 (Navigation Rail) */}
      <nav style={{
        width: "72px",
        backgroundColor: "#1e1f22",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 0",
        zIndex: 100,
        // 오른쪽 테두리를 제거하여 더 넓어 보이는 효과 (필요시 borderRight: "1px solid #2b2d31" 추가)
      }}>
        {/* 브랜드 로고 (버튼 아님) */}
        <BrandSymbol />

        {/* 구분선 */}
        <div style={{ width: "32px", height: "2px", backgroundColor: "#35363C", borderRadius: "1px", margin: "0 0 16px 0" }} />

        {/* 메뉴 아이콘들 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", alignItems: "center" }}>
          <SidebarItem icon={Home} label="홈으로" isActive={location.pathname === "/"} onClick={() => { navigate("/"); setOpenSidebar(null); }} />
          <SidebarItem icon={Search} label="검색" isActive={showSearch} onClick={() => { setShowSearch(!showSearch); setOpenSidebar(null); }} />
          <SidebarItem icon={Settings} label="기본 설정" isActive={openSidebar === "ensm"} onClick={() => toggleSidebar("ensm")} />
          <SidebarItem icon={Network} label="네트워크" isActive={openSidebar === "network"} onClick={() => toggleSidebar("network")} />
          <SidebarItem icon={Monitor} label="시스템" isActive={openSidebar === "system"} onClick={() => toggleSidebar("system")} />
          <SidebarItem icon={PackageSearch} label="패키지" isActive={openSidebar === "packages"} onClick={() => toggleSidebar("packages")} />
          <SidebarItem icon={TerminalSquare} label="도구" isActive={openSidebar === "tools"} onClick={() => toggleSidebar("tools")} />
        </div>
      </nav>

      {/* 2. 슬라이딩 메뉴 패널 */}
      <AnimatePresence>
        {(openSidebar || showSearch) && (
          <motion.div
            ref={searchRef}
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            style={{
              position: "fixed", // fixed로 변경하여 메인 컨텐츠 위에 뜨도록 하거나, layout flow를 따르게 할 수 있음. 여기선 flow 따름
              left: "72px",
              top: 0,
              bottom: 0,
              width: "260px",
              backgroundColor: "#2b2d31",
              borderRight: "1px solid #1e1f22",
              padding: "24px 16px",
              zIndex: 90,
              overflowY: "auto",
              boxShadow: "10px 0 30px rgba(0,0,0,0.3)",
            }}
          >
             {showSearch ? (
              <>
                <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "16px", color: "white" }}>빠른 검색</h2>
                <div style={{ position: "relative", marginBottom: "20px" }}>
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="기능, 패키지 검색..."
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      background: "#1e1f22",
                      color: "white",
                      border: "1px solid #444",
                      fontSize: "0.9rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                  <Search size={16} style={{ position: "absolute", right: "12px", top: "12px", color: "#888" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {searchResults.map((result, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.01, backgroundColor: "#383a40" }}
                      onClick={() => { navigate(result.path); setShowSearch(false); setSearchQuery(''); }}
                      style={{
                        padding: "10px",
                        backgroundColor: "#1e1f22",
                        borderRadius: "6px",
                        cursor: "pointer",
                        borderLeft: result.type === 'package' ? "3px solid #5865F2" : "3px solid #94a3b8"
                      }}
                    >
                      <div style={{ fontWeight: "600", color: "#fff", fontSize: "0.9rem" }}>{result.label}</div>
                      <div style={{ fontSize: "0.75rem", color: "#aaa" }}>{result.type}</div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "20px", color: "white", display: "flex", alignItems: "center", borderBottom: "1px solid #3f4147", paddingBottom: "12px" }}>
                  {openSidebar?.toUpperCase()}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {sidebarContents[openSidebar]?.map((item, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ x: 4, backgroundColor: "#383a40", color: "#fff" }}
                      onClick={() => {navigate(item.path);
                      setOpenSidebar(null);
                      }}
                      style={{
                        background: item.highlight ? "rgba(88, 101, 242, 0.1)" : "transparent",
                        border: "none",
                        color: item.highlight ? "#5865F2" : "#b5bac1", // 기본 텍스트 색상 약간 밝게
                        textAlign: "left",
                        cursor: "pointer",
                        padding: "10px 12px",
                        borderRadius: "4px",
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.2s"
                      }}
                    >
                      <span>{item.label}</span>
                      <ChevronRight size={14} opacity={0.4} />
                    </motion.button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. 메인 콘텐츠 영역 (배경색 분리) */}
      <div style={{
        flex: 1,
        backgroundColor: "#2b2d31", // Discord 메인 채팅창 배경색
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative"
      }}>

        {/* [TOP HEADER] 로고 텍스트와 타이틀이 있는 상단 바 */}
        <header style={{
          height: "72px", // 사이드바 로고 영역 높이와 어느정도 밸런스 맞춤
          backgroundColor: "#313338",
          borderBottom: "1px solid #26272d",
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* 사진처럼 텍스트 디자인 적용 (ENSM은 굵게, Manager는 얇게) */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginRight: "32px" }}>
              <span style={{ fontSize: "1.6rem", fontWeight: "900", color: "#fff", letterSpacing: "-0.5px" }}>ENSM</span>
              <span style={{ fontSize: "1.1rem", fontWeight: "400", color: "#9ca3af" }}>Manager</span>
            </div>

            {/* 수직 구분선 */}
            <div style={{ width: "1px", height: "24px", backgroundColor: "#4e5058" }}></div>

            {/* 현재 페이지 경로 표시 */}
            <div style={{ marginLeft: "32px", fontSize: "1rem", fontWeight: "600", color: "#f2f3f5" }}>
               {location.pathname === '/' ? 'Dashboard Overview' : location.pathname.split('/').pop().toUpperCase().replace('-', ' ')}
            </div>
          </div>
        </header>

        {/* 실제 페이지 내용 (Contents) */}
        <main style={{
          flex: 1,
          padding: "32px",
          overflowY: "auto",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}