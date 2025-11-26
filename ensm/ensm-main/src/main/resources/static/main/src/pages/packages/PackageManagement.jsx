import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, safeJsonParse } from "../../utils/api";

// 사용 가능한 패키지 목록 (검색 가능)
const availablePackages = [
    { id: 'apache', name: 'Apache HTTP Server', description: '웹 서버 소프트웨어', category: '웹서버' },
    { id: 'bind', name: 'BIND DNS Server', description: 'DNS 서버 소프트웨어', category: 'DNS서버' },
    { id: 'vsftpd', name: 'vsftpd', description: 'FTP 서버', category: '파일서버' },
    { id: 'nfs-utils', name: 'NFS Utils', description: 'NFS (Network File System) 유틸리티', category: '파일서버' },
    { id: 'docker', name: 'Docker', description: '컨테이너 플랫폼', category: '컨테이너' },
    { id: 'git', name: 'Git', description: '버전 관리 시스템', category: '개발도구' },
    { id: 'jellyfin', name: 'Jellyfin', description: '미디어 서버 소프트웨어', category: '미디어서버' },
    { id: 'plex', name: 'Plex', description: '미디어 스트리밍 서버', category: '미디어서버' },
    { id: 'home-assistant', name: 'Home Assistant', description: '홈 자동화 플랫폼', category: '홈자동화' },
    { id: 'novnc', name: 'noVNC', description: '웹 기반 VNC 클라이언트', category: '원격접속' },
];

// 패키지 ID로 카테고리 가져오기
const getPackageCategory = (packageId) => {
    const pkg = availablePackages.find(p => p.id === packageId);
    return pkg ? pkg.category : '';
};

// 패키지 크기에 따른 설치 시간 계산 (밀리초)
const getInstallTime = (packageId) => {
    // 작은 패키지: 1-2초
    const smallPackages = ['bind', 'git', 'novnc'];
    // 중간 패키지: 2-3초
    const mediumPackages = ['apache', 'vsftpd', 'nfs-utils'];
    // 큰 패키지: 4-6초
    const largePackages = ['docker', 'jellyfin', 'plex', 'home-assistant'];
    
    if (smallPackages.includes(packageId)) {
        return 1000 + Math.random() * 1000; // 1-2초
    } else if (mediumPackages.includes(packageId)) {
        return 2000 + Math.random() * 1000; // 2-3초
    } else if (largePackages.includes(packageId)) {
        return 4000 + Math.random() * 2000; // 4-6초
    }
    // 기본값: 2-3초
    return 2000 + Math.random() * 1000;
};

// localStorage에서 초기 패키지 목록 불러오기
const getInitialPackages = () => {
    try {
        const savedPackages = localStorage.getItem('installedPackages');
        if (savedPackages) {
            const parsed = JSON.parse(savedPackages);
            // installed를 boolean으로 처리 (백엔드에서 boolean으로 반환)
            return parsed.map(pkg => ({
                ...pkg,
                installed: typeof pkg.installed === 'boolean' ? pkg.installed : pkg.installed === 'true' || pkg.installed === true
            }));
        }
    } catch (e) {
        console.error('패키지 목록 로드 실패:', e);
    }
    // 기본값: apache와 bind
    return [
        { id: 'apache', name: 'Apache HTTP Server', installed: true, serviceStatus: 'running', autoStart: true },
        { id: 'bind', name: 'BIND DNS Server', installed: true, serviceStatus: 'stopped', autoStart: false }
    ];
};

export default function PackageManagement() {
    const navigate = useNavigate();
    const [packages, setPackages] = useState(getInitialPackages);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [loading, setLoading] = useState({});
    const [installing, setInstalling] = useState({});
    const [installProgress, setInstallProgress] = useState({});
    const [message, setMessage] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        // 페이지 로드 시 localStorage에서 최신 상태 확인 (다른 탭에서 변경된 경우 대비)
        const savedPackages = localStorage.getItem('installedPackages');
        if (savedPackages) {
            try {
                const parsed = JSON.parse(savedPackages);
                // installed를 boolean으로 처리
                const normalized = parsed.map(pkg => ({
                    ...pkg,
                    installed: typeof pkg.installed === 'boolean' ? pkg.installed : pkg.installed === 'true' || pkg.installed === true
                }));
                setPackages(normalized);
            } catch (e) {
                console.error('패키지 목록 로드 실패:', e);
            }
        }
        loadPackages();
    }, []);

    // packages 변경 시 localStorage에 저장하고 이벤트 발생
    useEffect(() => {
        localStorage.setItem('installedPackages', JSON.stringify(packages));
        // 다른 컴포넌트에 변경 알림 (ENSMMockup 등)
        window.dispatchEvent(new Event('packagesUpdated'));
    }, [packages]);

    // 외부 클릭 감지로 검색 결과 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        if (showSearchResults) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showSearchResults]);

    useEffect(() => {
        // 검색어가 변경될 때마다 검색 결과 업데이트
        if (searchQuery.trim() === "") {
            // 검색어가 없으면 설치 가능한 모든 패키지 표시
            const installable = availablePackages.filter(pkg => 
                !packages.some(installed => installed.id === pkg.id)
            );
            setSearchResults(installable);
        } else {
            const filtered = availablePackages.filter(pkg => {
                const query = searchQuery.toLowerCase();
                return (
                    pkg.name.toLowerCase().includes(query) ||
                    pkg.id.toLowerCase().includes(query) ||
                    pkg.description.toLowerCase().includes(query) ||
                    pkg.category.toLowerCase().includes(query)
                ) && !packages.some(installed => installed.id === pkg.id);
            });
            setSearchResults(filtered);
        }
    }, [searchQuery, packages]);

    const loadPackages = async () => {
        setRefreshing(true);
        try {
            const response = await apiFetch("/main/api/packages");
            if (response.ok) {
                const data = await safeJsonParse(response, []);
                // 설치된 패키지만 필터링 (installed === true인 것만)
                const installedPackages = Array.isArray(data) 
                    ? data.filter(pkg => pkg.installed === true || pkg.installed === "true")
                    : [];
                console.log("로드된 패키지 목록:", installedPackages);
                setPackages(installedPackages);
            } else {
                console.error("패키지 목록 API 응답 실패:", response.status, response.statusText);
                setPackages([]);
            }
        } catch (error) {
            console.error("패키지 목록 로드 실패:", error);
            setPackages([]);
        } finally {
            setRefreshing(false);
        }
    };

    const handleInstall = async (packageId, packageName) => {
        setMessage("");
        
        // 즉시 패키지 목록에 추가 (installing 상태로)
        const newPackage = {
            id: packageId,
            name: packageName,
            installed: 'installing', // 설치 중 상태 (문자열로 유지)
            serviceStatus: 'stopped',
            autoStart: false
        };
        
        setPackages(prev => [...prev, newPackage]);
        setInstalling(prev => ({ ...prev, [packageId]: true }));
        setInstallProgress(prev => ({ ...prev, [packageId]: 0 }));
        
        try {
            const response = await apiFetch(`/main/api/packages/${packageId}/install`, {
                method: "POST",
                credentials: "include"
            });
            
            const data = await safeJsonParse(response, {});
            
            if (response.ok) {
                // 설치 완료: installed 상태를 true로 변경
                setPackages(prev => prev.map(pkg => 
                    pkg.id === packageId 
                        ? { ...pkg, installed: true }
                        : pkg
                ));
                setMessage(`✅ ${packageName} 설치가 완료되었습니다.`);
                setSearchQuery(""); // 검색창 초기화
                setShowSearchResults(false);
                loadPackages(); // 목록 새로고침
            } else {
                // 설치 실패: 패키지 제거
                setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
                setMessage(data.error || `❌ ${packageName} 설치에 실패했습니다.`);
            }
        } catch (error) {
            console.error("패키지 설치 실패:", error);
            setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
            setMessage(`❌ ${packageName} 설치 중 오류가 발생했습니다.`);
        } finally {
            setInstalling(prev => ({ ...prev, [packageId]: false }));
            setInstallProgress(prev => ({ ...prev, [packageId]: 0 }));
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const handleRemove = async (packageId) => {
        if (!window.confirm("정말로 이 패키지를 제거하시겠습니까?")) {
            return;
        }
        setLoading(prev => ({ ...prev, [packageId]: true }));
        setMessage("");
        
        try {
            const response = await apiFetch(`/main/api/packages/${packageId}`, {
                method: "DELETE",
                credentials: "include"
            });
            
            const data = await safeJsonParse(response, {});
            
            if (response.ok) {
                setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
                setMessage("✅ 패키지가 제거되었습니다.");
                loadPackages(); // 목록 새로고침
            } else {
                setMessage(data.error || "❌ 패키지 제거에 실패했습니다.");
            }
        } catch (error) {
            console.error("패키지 제거 실패:", error);
            setMessage("❌ 패키지 제거 중 오류가 발생했습니다.");
        } finally {
            setLoading(prev => ({ ...prev, [packageId]: false }));
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const handleServiceControl = async (packageId, action) => {
        setLoading(prev => ({ ...prev, [packageId]: true }));
        setMessage("");
        
        try {
            const response = await apiFetch(`/main/api/packages/${packageId}/service/${action}`, {
                method: "POST",
                credentials: "include"
            });
            
            const data = await safeJsonParse(response, {});
            
            if (response.ok) {
                // 서비스 상태 업데이트
                setPackages(prev => prev.map(pkg => {
                    if (pkg.id === packageId) {
                        let newStatus = pkg.serviceStatus;
                        
                        if (action === 'start') {
                            newStatus = 'running';
                        } else if (action === 'stop') {
                            newStatus = 'stopped';
                        } else if (action === 'restart' || action === 'reload') {
                            newStatus = 'running'; // 재시작/리로드 후 실행 중
                        }
                        
                        return { ...pkg, serviceStatus: newStatus };
                    }
                    return pkg;
                }));
                setMessage(`✅ 서비스가 ${action === 'start' ? '시작' : action === 'stop' ? '중지' : action === 'restart' ? '재시작' : '리로드'}되었습니다.`);
                loadPackages(); // 목록 새로고침
            } else {
                setMessage(data.error || `❌ 서비스 ${action}에 실패했습니다.`);
            }
        } catch (error) {
            console.error("서비스 제어 실패:", error);
            setMessage(`❌ 서비스 ${action} 중 오류가 발생했습니다.`);
        } finally {
            setLoading(prev => ({ ...prev, [packageId]: false }));
            setTimeout(() => setMessage(""), 2000);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "running":
                return "#4ade80";
            case "stopped":
                return "#ef4444";
            case "inactive":
                return "#888";
            default:
                return "#888";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "running":
                return "실행 중";
            case "stopped":
                return "중지됨";
            case "inactive":
                return "비활성";
            default:
                return "알 수 없음";
        }
    };

    const handleAutoStartToggle = async (packageId) => {
        setLoading(prev => ({ ...prev, [packageId]: true }));
        setMessage("");
        
        // 현재 상태 확인
        const currentPkg = packages.find(pkg => pkg.id === packageId);
        const newAutoStart = !currentPkg?.autoStart;
        
        try {
            const response = await apiFetch(`/main/api/packages/${packageId}/autostart/toggle`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    enable: newAutoStart
                })
            });
            
            const data = await safeJsonParse(response, {});
            
            if (response.ok) {
                // 상태 업데이트
                setPackages(prev => prev.map(pkg => {
                    if (pkg.id === packageId) {
                        return { ...pkg, autoStart: newAutoStart };
                    }
                    return pkg;
                }));
                setMessage(`✅ 자동 시작이 ${newAutoStart ? '활성화' : '비활성화'}되었습니다.`);
                loadPackages(); // 목록 새로고침
            } else {
                setMessage(data.error || `❌ 자동 시작 변경에 실패했습니다.`);
            }
        } catch (error) {
            console.error("자동 시작 토글 실패:", error);
            setMessage(`❌ 자동 시작 변경 중 오류가 발생했습니다.`);
        } finally {
            setLoading(prev => ({ ...prev, [packageId]: false }));
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const isServiceControlDisabled = (pkg, action) => {
        if (loading[pkg.id]) return true;
        
        if (action === 'start') {
            return pkg.serviceStatus === 'running';
        } else if (action === 'stop') {
            return pkg.serviceStatus === 'stopped';
        } else if (action === 'restart' || action === 'reload') {
            return pkg.serviceStatus === 'stopped';
        }
        return false;
    };

    // 패키지 ID에 따른 설정 페이지 경로 매핑
    const getPackageConfigPath = (packageId) => {
        const configPaths = {
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
        return configPaths[packageId] || null;
    };

    const renderToggle = (checked, onChange, disabled) => (
        <div
            onClick={() => !disabled && onChange()}
            style={{
                display: "inline-block",
                width: "46px",
                height: "24px",
                backgroundColor: checked ? "#4ade80" : "#888",
                borderRadius: "24px",
                position: "relative",
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "background-color 0.3s",
                opacity: disabled ? 0.6 : 1
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: "3px",
                    left: checked ? "24px" : "3px",
                    width: "18px",
                    height: "18px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    transition: "left 0.3s"
                }}
            />
        </div>
    );

    return (
        <div style={{ padding: "1rem", color: "white" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>패키지 관리</h2>
                <button
                    onClick={loadPackages}
                    disabled={refreshing}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: refreshing ? "#555" : "#5865f2",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: refreshing ? "not-allowed" : "pointer",
                        fontSize: "0.9rem"
                    }}
                >
                    {refreshing ? "새로고침 중..." : "🔄 새로고침"}
                </button>
            </div>

            {/* 검색창 */}
            <div 
                ref={searchContainerRef}
                style={{ marginBottom: "1.5rem", position: "relative" }}
            >
                <input
                    type="text"
                    placeholder="패키지 검색 (예: apache, nginx, mysql, docker...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                        setIsSearchFocused(true);
                        setShowSearchResults(true);
                        // 포커스 시 검색 결과 업데이트
                        if (searchQuery.trim() === "") {
                            const installable = availablePackages.filter(pkg => 
                                !packages.some(installed => installed.id === pkg.id)
                            );
                            setSearchResults(installable);
                        }
                    }}
                    onBlur={() => {
                        // 드롭다운 클릭 시 blur 방지를 위해 약간의 지연
                        setTimeout(() => {
                            setIsSearchFocused(false);
                            setShowSearchResults(false);
                        }, 200);
                    }}
                    style={{
                        width: "100%",
                        padding: "0.75rem",
                        backgroundColor: "#2b2d31",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        color: "white",
                        fontSize: "1rem"
                    }}
                />
                {/* 검색 결과 및 설치 가능한 패키지 목록 드롭다운 */}
                {isSearchFocused && showSearchResults && searchResults.length > 0 && (
                    <div 
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            marginTop: "0.25rem",
                            backgroundColor: "#2b2d31",
                            border: "1px solid #444",
                            borderRadius: "4px",
                            maxHeight: "400px",
                            overflowY: "auto",
                            zIndex: 1000,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
                        }}
                        onMouseDown={(e) => e.preventDefault()} // 드롭다운 클릭 시 blur 방지
                    >
                        {searchResults.map((pkg) => (
                            <div
                                key={pkg.id}
                                style={{
                                    padding: "1rem",
                                    borderBottom: "1px solid #444",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    transition: "background-color 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3a3c42"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                onClick={() => handleInstall(pkg.id, pkg.name)}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                        <div style={{ fontWeight: "bold" }}>
                                            {pkg.name}
                                        </div>
                                        <div style={{ 
                                            fontSize: "0.7rem", 
                                            color: "#888", 
                                            backgroundColor: "#1a1a1a",
                                            padding: "0.15rem 0.5rem",
                                            borderRadius: "4px"
                                        }}>
                                            {pkg.category}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                                        {pkg.description}
                                    </div>
                                </div>
                                <button
                                    disabled={installing[pkg.id]}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleInstall(pkg.id, pkg.name);
                                    }}
                                    style={{
                                        padding: "0.5rem 1rem",
                                        backgroundColor: installing[pkg.id] ? "#555" : "#4ade80",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: installing[pkg.id] ? "not-allowed" : "pointer",
                                        fontSize: "0.9rem",
                                        minWidth: "80px",
                                        marginLeft: "1rem"
                                    }}
                                >
                                    {installing[pkg.id] ? `${Math.round(installProgress[pkg.id] || 0)}%` : "설치"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {message && (
                <div style={{
                    padding: "0.75rem",
                    marginBottom: "1rem",
                    borderRadius: "4px",
                    backgroundColor: message.includes("실패") || message.includes("❌") ? "#3a1a1a" : "#1a3a1a",
                    color: message.includes("실패") || message.includes("❌") ? "#ff6666" : "#66ff66",
                    border: `1px solid ${message.includes("실패") || message.includes("❌") ? "#ff4444" : "#44ff44"}`
                }}>
                    {message}
                </div>
            )}

            <div style={{ display: "grid", gap: "1rem" }}>
                {packages.filter(pkg => pkg.installed === true || pkg.installed === "true").map((pkg) => (
                    <div
                        key={pkg.id}
                        style={{
                            backgroundColor: "#313338",
                            padding: "1.5rem",
                            borderRadius: "8px",
                            border: "1px solid #444"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <div>
                                <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                                    {pkg.name || availablePackages.find(ap => ap.id === pkg.id)?.name || pkg.id}
                                </h3>
                                <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                                    <div style={{ 
                                        fontSize: "0.75rem", 
                                        color: "#888", 
                                        backgroundColor: "#1a1a1a",
                                        padding: "0.25rem 0.5rem",
                                        borderRadius: "4px"
                                    }}>
                                        {getPackageCategory(pkg.id) || pkg.id}
                                    </div>
                                    <span
                                        style={{
                                            padding: "0.25rem 0.75rem",
                                            borderRadius: "4px",
                                            fontSize: "0.85rem",
                                            backgroundColor: pkg.installed === true ? "#1a3a1a" : pkg.installed === "installing" ? "#3a3a1a" : "#3a1a1a",
                                            color: pkg.installed === true ? "#66ff66" : pkg.installed === "installing" ? "#ffaa00" : "#ff6666"
                                        }}
                                    >
                                        {pkg.installed === true ? "✓ 설치됨" : pkg.installed === "installing" ? "⏳ 설치 중..." : "✗ 미설치"}
                                    </span>
                                    {pkg.installed === true && (
                                        <span
                                            style={{
                                                padding: "0.25rem 0.75rem",
                                                borderRadius: "4px",
                                                fontSize: "0.85rem",
                                                backgroundColor: getStatusColor(pkg.serviceStatus) + "33",
                                                color: getStatusColor(pkg.serviceStatus)
                                            }}
                                        >
                                            {getStatusText(pkg.serviceStatus)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                {pkg.installed === true && (
                                    <button
                                        onClick={() => handleRemove(pkg.id)}
                                        disabled={loading[pkg.id]}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            backgroundColor: loading[pkg.id] ? "#555" : "#ef4444",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: loading[pkg.id] ? "not-allowed" : "pointer",
                                            fontSize: "0.9rem"
                                        }}
                                    >
                                        제거
                                    </button>
                                )}
                            </div>
                        </div>

                        {(pkg.installed === true || pkg.installed === "installing") && (
                            <div style={{ borderTop: "1px solid #444", paddingTop: "1rem", marginTop: "1rem" }}>
                                {pkg.installed === "installing" ? (
                                    // 설치 중일 때 로딩바 표시
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                                            <h4 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                                                설치 중...
                                            </h4>
                                            <span style={{ fontSize: "0.9rem", color: "#aaa" }}>
                                                {Math.round(installProgress[pkg.id] || 0)}%
                                            </span>
                                        </div>
                                        <div style={{
                                            width: "100%",
                                            height: "24px",
                                            backgroundColor: "#2a2a2a",
                                            borderRadius: "4px",
                                            overflow: "hidden",
                                            position: "relative"
                                        }}>
                                            <div style={{
                                                width: `${installProgress[pkg.id] || 0}%`,
                                                height: "100%",
                                                backgroundColor: "#4ade80",
                                                transition: "width 0.1s ease-out",
                                                borderRadius: "4px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#fff",
                                                fontSize: "0.75rem",
                                                fontWeight: "bold"
                                            }}>
                                                {installProgress[pkg.id] >= 10 && `${Math.round(installProgress[pkg.id] || 0)}%`}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // 설치 완료 후 서비스 제어 버튼 표시
                                    <>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                                            <h4 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                                                서비스 제어
                                            </h4>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <span style={{ fontSize: "0.9rem", color: "#aaa" }}>
                                                    부팅시 자동시작
                                                </span>
                                                {renderToggle(
                                                    pkg.autoStart || false,
                                                    () => handleAutoStartToggle(pkg.id),
                                                    loading[pkg.id]
                                                )}
                                            </div>
                                        </div>
                                        {loading[pkg.id] && (
                                            <div style={{
                                                marginBottom: "0.75rem",
                                                padding: "0.5rem",
                                                backgroundColor: "#2a2a2a",
                                                borderRadius: "4px",
                                                fontSize: "0.85rem",
                                                color: "#aaa"
                                            }}>
                                                처리 중...
                                            </div>
                                        )}
                                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                    <button
                                        onClick={() => handleServiceControl(pkg.id, "start")}
                                        disabled={isServiceControlDisabled(pkg, "start")}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            backgroundColor: isServiceControlDisabled(pkg, "start") ? "#555" : "#4ade80",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: isServiceControlDisabled(pkg, "start") ? "not-allowed" : "pointer",
                                            fontSize: "0.9rem",
                                            opacity: isServiceControlDisabled(pkg, "start") ? 0.5 : 1
                                        }}
                                    >
                                        시작
                                    </button>
                                    <button
                                        onClick={() => handleServiceControl(pkg.id, "stop")}
                                        disabled={isServiceControlDisabled(pkg, "stop")}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            backgroundColor: isServiceControlDisabled(pkg, "stop") ? "#555" : "#ef4444",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: isServiceControlDisabled(pkg, "stop") ? "not-allowed" : "pointer",
                                            fontSize: "0.9rem",
                                            opacity: isServiceControlDisabled(pkg, "stop") ? 0.5 : 1
                                        }}
                                    >
                                        중지
                                    </button>
                                    <button
                                        onClick={() => handleServiceControl(pkg.id, "restart")}
                                        disabled={isServiceControlDisabled(pkg, "restart")}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            backgroundColor: isServiceControlDisabled(pkg, "restart") ? "#555" : "#f59e0b",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: isServiceControlDisabled(pkg, "restart") ? "not-allowed" : "pointer",
                                            fontSize: "0.9rem",
                                            opacity: isServiceControlDisabled(pkg, "restart") ? 0.5 : 1
                                        }}
                                    >
                                        재시작
                                    </button>
                                    <button
                                        onClick={() => handleServiceControl(pkg.id, "reload")}
                                        disabled={isServiceControlDisabled(pkg, "reload")}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            backgroundColor: isServiceControlDisabled(pkg, "reload") ? "#555" : "#3b82f6",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: isServiceControlDisabled(pkg, "reload") ? "not-allowed" : "pointer",
                                            fontSize: "0.9rem",
                                            opacity: isServiceControlDisabled(pkg, "reload") ? 0.5 : 1
                                        }}
                                    >
                                        리로드
                                    </button>
                                    {getPackageConfigPath(pkg.id) && (
                                        <button
                                            onClick={() => navigate(getPackageConfigPath(pkg.id))}
                                            style={{
                                                padding: "0.5rem 1rem",
                                                backgroundColor: "#5865f2",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontSize: "0.9rem"
                                            }}
                                        >
                                            ⚙️ 설정
                                        </button>
                                    )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {packages.length === 0 && !refreshing && (
                <div style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#888",
                    backgroundColor: "#313338",
                    borderRadius: "8px"
                }}>
                    설치된 패키지가 없습니다. 위 검색창에서 패키지를 검색하여 설치하세요.
                </div>
            )}
        </div>
    );
}
