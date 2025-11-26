import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import React from "react";
import ENSMMockup from "./ENSMMockup";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastContainer, useToast } from "./components/Toast";

// ★ [추가] 테마 공급자 import (파일 경로가 src/context/ThemeContext.js 라고 가정)
import { ThemeProvider } from "./context/ThemeContext";

import Settings from "./pages/ensm/Settings";
import CronManagement from "./pages/system/CronManagement";
import DiskRaidStatus from "./pages/system/DiskRaidStatus";
import DiskManagement from "./pages/system/DiskManagement";
import RaidManagement from "./pages/system/RaidManagement";
import LvmManagement from "./pages/system/LvmManagement";
import ApacheConfig from "./pages/packages/ApacheConfig";
import BindConfig from "./pages/packages/BindConfig";
import VsftpdConfig from "./pages/packages/VsftpdConfig";
import NfsConfig from "./pages/packages/NfsConfig";
import DockerConfig from "./pages/packages/DockerConfig";
import GitConfig from "./pages/packages/GitConfig";
import JellyfinConfig from "./pages/packages/JellyfinConfig";
import PlexConfig from "./pages/packages/PlexConfig";
import HomeAssistantConfig from "./pages/packages/HomeAssistantConfig";
import NovncConfig from "./pages/packages/NovncConfig";
import PackageManagement from "./pages/packages/PackageManagement";
import NetworkLog from "./pages/network/NetworkLog";
import PortDaemonStatus from "./pages/network/PortDaemonStatus";
import DdnsManagement from "./pages/network/DdnsManagement";
import SSHAutomation from "./pages/tools/SSHAutomation";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function LayoutWrapper() {
    const [selectedDocKey, setSelectedDocKey] = useState(null);
    const [docContent, setDocContent] = useState("");
    const [sidebarWidth, setSidebarWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = React.useRef(null);
    const { toasts, removeToast, showToast } = useToast();

    // 전역에서 Toast 사용 가능하도록 설정
    React.useEffect(() => {
        window.showToast = showToast;
        return () => {
            delete window.showToast;
        };
    }, [showToast]);

    // 리사이저 핸들러
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsResizing(true);
    };

    React.useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const newWidth = window.innerWidth - e.clientX;
            // 최소 300px, 최대 800px
            if (newWidth >= 300 && newWidth <= 800) {
                setSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isResizing]);

    return (
        <>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <div style={{ display: "flex", width: "100%", height: "100vh", overflow: "hidden" }}>
                <div
                    style={{
                        flex: selectedDocKey ? `0 0 calc(100% - ${sidebarWidth}px)` : "1 1 100%",
                        transition: "flex 0.3s ease-in-out",
                        overflow: "auto",
                        minWidth: 0
                    }}
                >
                    <ENSMMockup
                        selectedDocKey={selectedDocKey}
                        setSelectedDocKey={setSelectedDocKey}
                        docContent={docContent}
                    >
                        <Outlet context={{ setSelectedDocKey, setDocContent }} />
                    </ENSMMockup>
                </div>

            {selectedDocKey && (
                <>
                    <div
                        ref={sidebarRef}
                        className="doc-sidebar"
                        style={{
                            width: `${sidebarWidth}px`,
                            flexShrink: 0,
                            transition: "width 0.3s ease-in-out",
                            position: "relative"
                        }}
                    >
                        {/* 리사이저 핸들러 */}
                        <div
                            onMouseDown={handleMouseDown}
                            style={{
                                position: "absolute",
                                left: "-3px",
                                top: 0,
                                bottom: 0,
                                width: "6px",
                                backgroundColor: isResizing ? "#5865f2" : "transparent",
                                cursor: "col-resize",
                                transition: "background-color 0.2s",
                                userSelect: "none",
                                zIndex: 1001,
                                borderRadius: "3px"
                            }}
                            onMouseEnter={(e) => {
                                if (!isResizing) {
                                    e.currentTarget.style.backgroundColor = "#666";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isResizing) {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }
                            }}
                            title="드래그하여 너비 조절"
                        />
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingTop: "32px",
                            paddingRight: "16px",
                            paddingBottom: "12px",
                            paddingLeft: "16px",
                            alignItems: "flex-start",
                            borderBottom: "1px solid #444"
                        }}>
                            <h3 className="doc-sidebar-title">📄 {selectedDocKey} 설명서</h3>
                            <button
                                onClick={() => {
                                    setSelectedDocKey(null);
                                    setDocContent("");
                                }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "white",
                                    fontSize: "1.2rem",
                                    cursor: "pointer",
                                    padding: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                title="닫기"
                            >
                                ❌
                            </button>
                        </div>

                        <div className="doc-sidebar-content">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                            >
                                {docContent}
                            </ReactMarkdown>
                        </div>
                    </div>
                </>
            )}
            </div>
        </>
    );
}

function App() {
    return (
        // ★ [추가] ThemeProvider로 앱 전체를 감싸줍니다.
        // 이제 ErrorBoundary, Routes, 그리고 그 안의 모든 페이지에서 useTheme()을 쓸 수 있어요!
        <ThemeProvider>
            <ErrorBoundary>
                <Routes>
                    <Route element={<LayoutWrapper />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/ensm/settings" element={<Settings />} />
                        <Route path="/system/cron" element={<CronManagement />} />
                        <Route path="/system/disk" element={<DiskRaidStatus />} />
                        <Route path="/system/disk-management" element={<DiskManagement />} />
                        <Route path="/system/raid" element={<RaidManagement />} />
                        <Route path="/system/lvm" element={<LvmManagement />} />
                        <Route path="/packages/apache" element={<ApacheConfig />} />
                        <Route path="/packages/bind" element={<BindConfig />} />
                        <Route path="/packages/vsftpd" element={<VsftpdConfig />} />
                        <Route path="/packages/nfs" element={<NfsConfig />} />
                        <Route path="/packages/docker" element={<DockerConfig />} />
                        <Route path="/packages/git" element={<GitConfig />} />
                        <Route path="/packages/jellyfin" element={<JellyfinConfig />} />
                        <Route path="/packages/plex" element={<PlexConfig />} />
                        <Route path="/packages/home-assistant" element={<HomeAssistantConfig />} />
                        <Route path="/packages/novnc" element={<NovncConfig />} />
                        <Route path="/packages/management" element={<PackageManagement />} />
                        <Route path="/network/log" element={<NetworkLog />} />
                        <Route path="/network/port" element={<PortDaemonStatus />} />
                        <Route path="/network/ddns" element={<DdnsManagement />} />
                        <Route path="/tools/ssh" element={<SSHAutomation />} />
                    </Route>
                </Routes>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;