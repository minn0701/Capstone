// App.jsx 수정 사항 포함된 전체 코드 (📄 문서 버튼 작동 + UI 통일)

import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import ENSMMockup from "./ENSMMockup";
import ReactMarkdown from "react-markdown";

import Settings from "./pages/ensm/Settings";
import CronManagement from "./pages/system/CronManagement";
import DiskRaidStatus from "./pages/system/DiskRaidStatus";
import ApacheConfig from "./pages/packages/ApacheConfig";
import BindConfig from "./pages/packages/BindConfig";
import NetworkLog from "./pages/network/NetworkLog";
import PortDaemonStatus from "./pages/network/PortDaemonStatus";
import DdnsManagement from "./pages/network/DdnsManagement";
import SSHAutomation from "./pages/tools/SSHAutomation";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function LayoutWrapper() {
    const [selectedDocKey, setSelectedDocKey] = useState(null);
    const [docContent, setDocContent] = useState("");

    return (
        <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
                <ENSMMockup
                    selectedDocKey={selectedDocKey}
                    setSelectedDocKey={setSelectedDocKey}
                    docContent={docContent}
                >
                    <Outlet context={{ setSelectedDocKey, setDocContent }} />
                </ENSMMockup>
            </div>

            {selectedDocKey && (
                <div className="doc-sidebar">
                    <div style={{ display: "flex",
                                    justifyContent: "space-between",
                                    paddingTop: "32px",
                                    paddingRight: "16px",
                                    paddingBottom: "12px",
                                    paddingLeft: "16px",
                                    alignItems: "flex-start",

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
                                cursor: "pointer"
                            }}
                            title="닫기"
                        >
                            ❌
                        </button>
                    </div>

                    <div className="doc-sidebar-content">
                        <ReactMarkdown>{docContent}</ReactMarkdown>
                    </div>

                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route element={<LayoutWrapper />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ensm/settings" element={<Settings />} />
                <Route path="/system/cron" element={<CronManagement />} />
                <Route path="/system/disk" element={<DiskRaidStatus />} />
                <Route path="/packages/apache" element={<ApacheConfig />} />
                <Route path="/packages/bind" element={<BindConfig />} />
                       <Route path="/network/log" element={<NetworkLog />} />
                       <Route path="/network/port" element={<PortDaemonStatus />} />
                       <Route path="/network/ddns" element={<DdnsManagement />} />
                       <Route path="/tools/ssh" element={<SSHAutomation />} />
            </Route>
        </Routes>
    );
}

export default App;