// App.jsx 수정 사항 포함된 전체 코드 (📄 문서 버튼 작동 + UI 통일)

import { Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";
import ENSMMockup from "./ENSMMockup";
import ReactMarkdown from "react-markdown";

import SystemNameEdit from "./pages/ensm/SystemNameEdit";
import AccessRangeEdit from "./pages/ensm/AccessRangeEdit";
import CronManagement from "./pages/system/CronManagement";
import DiskRaidStatus from "./pages/system/DiskRaidStatus";
import ApacheConfig from "./pages/packages/ApacheConfig";
import BindConfig from "./pages/packages/BindConfig";
import MailServerConfig from "./pages/packages/MailServerConfig";
import NetworkLog from "./pages/network/NetworkLog";
import PortDaemonStatus from "./pages/network/PortDaemonStatus";
import SSHAutomation from "./pages/tools/SSHAutomation";
import WebFTP from "./pages/tools/WebFTP";
import Dashboard from "./pages/Dashboard1"; // 홈 대체할 컴포넌트
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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                <Route index element={<Dashboard />} />
                <Route path="/ensm/시스템이름수정" element={<SystemNameEdit />} />
                <Route path="/ensm/접속가능범위수정" element={<AccessRangeEdit />} />
                <Route path="/system/cron" element={<CronManagement />} />
                <Route path="/system/disk" element={<DiskRaidStatus />} />
                <Route path="/packages/apache" element={<ApacheConfig />} />
                <Route path="/packages/bind" element={<BindConfig />} />
                <Route path="/packages/mail" element={<MailServerConfig />} />
                <Route path="/network/log" element={<NetworkLog />} />
                <Route path="/network/port" element={<PortDaemonStatus />} />
                <Route path="/tools/ssh" element={<SSHAutomation />} />
                <Route path="/tools/webftp" element={<WebFTP />} />
            </Route>
        </Routes>
    );
}

export default App;