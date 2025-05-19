import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";
import ENSMMockup from "./ENSMMockup";


import LoginPage from "./pages/LoginPage";
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
import Dashboard from "./pages/Dashboard"; // 홈 대체할 컴포넌트



function LayoutWrapper() {
  const [selectedDocKey, setSelectedDocKey] = useState(null);
  const [docContent, setDocContent] = useState("");

  return (
    <ENSMMockup
        selectedDocKey={selectedDocKey}
        setSelectedDocKey={setSelectedDocKey}
        docContent={docContent}>
      <Outlet context={{ setSelectedDocKey, setDocContent }} />
    </ENSMMockup>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<LayoutWrapper />}>
          <Route path="/" element={<LoginPage />} />  
          <Route path="/DashBoard" element={<Dashboard />} />
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
    </Router>
  );
}

export default App;
