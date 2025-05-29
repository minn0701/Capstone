// src/components/Layout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DetailPane from "./DetailPane";

export default function Layout() {
  const [selectedDocKey, setSelectedDocKey] = useState(null);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* (1) 좌측 네비게이션 영역: 필요시 사이드바 컴포넌트 교체 */}
      <div style={{ width: 200, background: "#282a36" }}>
        {/* Sidebar */}
      </div>

      {/* (2) 중앙 메인 컨텐츠: ApacheConfig 등 Outlet */}
      <div style={{ flex: 1, overflow: "auto", padding: "1rem", background: "#1e1f22" }}>
        <Outlet context={setSelectedDocKey} />
      </div>

      {/* (3) 우측 설명 패널 */}
      <DetailPane docKey={selectedDocKey} />
    </div>
  );
}
