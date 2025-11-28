import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, safeJsonParse } from "../../utils/api";

// 사용 가능한 패키지 목록 (검색 가능)
const availablePackages = [
    { id: 'apache', name: 'Apache HTTP Server', description: '웹 서버 소프트웨어', category: '웹서버' },
    { id: 'bind', name: 'BIND DNS Server', description: 'DNS 서버 소프트웨어', category: 'DNS서버' },
    { id: 'vsftpd', name: 'vsftpd', description: 'FTP 서버', category: '파일서버' },
    { id: 'docker', name: 'Docker', description: '컨테이너 플랫폼', category: '컨테이너' },
    { id: 'plex', name: 'Plex', description: '미디어 스트리밍 서버', category: '미디어서버' },
    { id: 'home-assistant', name: 'Home Assistant', description: '홈 자동화 플랫폼', category: '홈자동화' },
];

// 패키지 ID로 카테고리 가져오기
const getPackageCategory = (packageId) => {
    const pkg = availablePackages.find(p => p.id === packageId);
    return pkg ? pkg.category : '';
};

export default function PackageManagement() {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
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
        loadPackages();
    }, []);

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
            // 검색어가 없으면 설치 가능한 모든 패키지 표시 (이미 설치된 것 제외)
            const installedIds = packages
                .filter(pkg => pkg.installed === true || pkg.installed === "true")
                .map(pkg => pkg.id);
            const installable = availablePackages.filter(pkg => !installedIds.includes(pkg.id));
            setSearchResults(installable);
        } else {
            const query = searchQuery.toLowerCase();
            const installedIds = packages
                .filter(pkg => pkg.installed === true || pkg.installed === "true")
                .map(pkg => pkg.id);
            const filtered = availablePackages.filter(pkg => {
                const isNotInstalled = !installedIds.includes(pkg.id);
                return (
                    (pkg.name.toLowerCase().includes(query) ||
                    pkg.id.toLowerCase().includes(query) ||
                    pkg.description.toLowerCase().includes(query) ||
                    pkg.category.toLowerCase().includes(query))
                ) && isNotInstalled;
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
                // 백엔드에서 모든 패키지 목록 반환 (installed: true/false 포함)
                // 모든 패키지를 저장 (UI에서 필터링하여 표시)
                const allPackages = Array.isArray(data) ? data : [];
                console.log("로드된 패키지 목록:", allPackages);
                setPackages(allPackages);
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
        
        setInstalling(prev => ({ ...prev, [packageId]: true }));
        setInstallProgress(prev => ({ ...prev, [packageId]: 0 }));
        
        try {
            const response = await apiFetch(`/main/api/packages/${packageId}/install`, {
                method: "POST",
                credentials: "include"
            });
            
            const data = await safeJsonParse(response, {});
            
            if (response.ok) {
                // 설치 완료: 목록 새로고침 (백엔드에서 모든 패키지 목록 받아옴)
                setMessage(`✅ ${packageName} 설치가 완료되었습니다.`);
                setSearchQuery(""); // 검색창 초기화
                setShowSearchResults(false);
                loadPackages(); // 목록 새로고침 (모든 패키지 다시 받아서 상태 업데이트)
            } else {
                // 설치 실패
                setMessage(data.error || `❌ ${packageName} 설치에 실패했습니다.`);
            }
        } catch (error) {
            console.error("패키지 설치 실패:", error);
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
                setMessage("✅ 패키지가 제거되었습니다.");
                loadPackages(); // 목록 새로고침 (백엔드에서 업데이트된 상태 받아옴)
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
                setMessage(`✅ 서비스가 ${action === 'start' ? '시작' : action === 'stop' ? '중지' : action === 'restart' ? '재시작' : '리로드'}되었습니다.`);
                loadPackages(); // 목록 새로고침 (백엔드에서 업데이트된 상태 받아옴)
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
                setMessage(`✅ 자동 시작이 ${newAutoStart ? '활성화' : '비활성화'}되었습니다.`);
                loadPackages(); // 목록 새로고침 (백엔드에서 업데이트된 상태 받아옴)
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
            'docker': '/packages/docker',
            'plex': '/packages/plex',
            'home-assistant': '/packages/home-assistant'
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
                            const installedIds = packages
                                .filter(pkg => pkg.installed === true || pkg.installed === "true")
                                .map(pkg => pkg.id);
                            const installable = availablePackages.filter(pkg => !installedIds.includes(pkg.id));
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
                                            backgroundColor: "#1a3a1a",
                                            color: "#66ff66"
                                        }}
                                    >
                                        ✓ 설치됨
                                    </span>
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
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
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
                            </div>
                        </div>

                        <div style={{ borderTop: "1px solid #444", paddingTop: "1rem", marginTop: "1rem" }}>
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
                        </div>
                    </div>
                ))}
            </div>

            {packages.filter(pkg => pkg.installed === true || pkg.installed === "true").length === 0 && !refreshing && (
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
