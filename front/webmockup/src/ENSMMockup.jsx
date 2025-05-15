import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Search,
  Settings,
  Network,
  Monitor,
  PackageSearch,
  Home,
  TerminalSquare
} from "lucide-react";

export default function ENSMMockup({ children, selectedDocKey, setSelectedDocKey }) {
  const [openSidebar, setOpenSidebar] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [docContent, setDocContent] = useState("");  // 마크다운 설명
  const searchRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (selectedDocKey) {
      fetch(`/descriptions/${selectedDocKey}.md`)
        .then(res => res.ok ? res.text() : "설명이 아직 준비되지 않았습니다.")
        .then(setDocContent)
        .catch(() => setDocContent("설명을 불러오지 못했습니다."));
    } else {
      setDocContent("");
    }
  }, [selectedDocKey]);

  const sidebarContents = {
    ensm: [
      { label: "시스템 이름 수정", path: "/ensm/시스템이름수정" },
      { label: "접속 가능 범위 수정", path: "/ensm/접속가능범위수정" }
    ],
    system: [
      { label: "CRON 관리", path: "/system/cron" },
      { label: "Disk 확인 및 RAID 확인", path: "/system/disk" }
    ],
    packages: [
      { label: "아파치 서버 config", path: "/packages/apache" },
      { label: "BIND DNS config", path: "/packages/bind" },
      { label: "메일서버 config", path: "/packages/mail" }
    ],
    network: [
      { label: "네트워크 상태 및 로그 확인", path: "/network/log" },
      { label: "개방 포트 및 관련 Daemon 확인", path: "/network/port" }
    ],
    tools: [
      { label: "SSH 자동화", path: "/tools/ssh" },
      { label: "웹 FTP", path: "/tools/webftp" }
    ]
  };

  return (
    <div style={{ height: "100vh", overflow: "hidden", backgroundColor: "#1e1f22", color: "white", fontFamily: "sans-serif" }}>
      {/* 상단바 */}
      <div style={{ height: "48px", backgroundColor: "#2b2d31", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #444", position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <h1 style={{ fontWeight: "bold", fontSize: "1rem" }}>ENSM</h1>
      </div>

      {/* 아이콘바 */}
      <div style={{ position: "fixed", top: "48px", left: 0, bottom: 0, width: "64px", backgroundColor: "#2b2d31", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: "16px", borderRight: "1px solid #444", zIndex: 999 }}>
        <button onClick={() => { navigate("/"); setOpenSidebar(null); }} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Home size={20} /></button>
        <button onClick={() => { setShowSearch(!showSearch); setOpenSidebar(null); }} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Search size={20} /></button>
        <button onClick={() => setOpenSidebar(openSidebar === "ensm" ? null : "ensm") } style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Settings size={20} /></button>
        <button onClick={() => setOpenSidebar(openSidebar === "network" ? null : "network") } style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Network size={20} /></button>
        <button onClick={() => setOpenSidebar(openSidebar === "system" ? null : "system") } style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Monitor size={20} /></button>
        <button onClick={() => setOpenSidebar(openSidebar === "packages" ? null : "packages") } style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><PackageSearch size={20} /></button>
        <button onClick={() => setOpenSidebar(openSidebar === "tools" ? null : "tools") } style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><TerminalSquare size={20} /></button>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{ marginLeft: "64px", marginTop: "48px", height: "calc(100vh - 48px)", overflowY: "auto", backgroundColor: "#1e1f22", padding: "24px" }}>
        <div style={{ backgroundColor: "#2b2d31", minHeight: "78vh", border: "1px solid #444", borderRadius: "8px", padding: "16px" }}>
          {children}
        </div>
      </div>

      {/* 오버레이 사이드 메뉴 */}
      {(openSidebar || showSearch) && (
        <motion.div
          ref={searchRef}
          initial={{ x: -260 }}
          animate={{ x: 64 }}
          exit={{ x: -260 }}
          transition={{ duration: 0.2 }}
          style={{ position: "fixed", top: 48, bottom: 0, left: 0, width: "240px", backgroundColor: "#313338", borderRight: "1px solid #444", padding: "16px", zIndex: 1100 }}
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
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="설정 검색..."
                style={{ width: "100%", padding: "8px", borderRadius: "4px", marginBottom: "12px", background: "#222", color: "white", border: "1px solid #555" }}
              />
              {Object.entries(sidebarContents).map(([key, items], idx) => (
                <div key={idx}>
                  {items.filter((item) => item.label.includes(searchQuery)).map((item, i) => (
                    <div key={i} style={{ fontSize: "0.85rem", padding: "4px 0" }}>{item.label}</div>
                  ))}
                </div>
              ))}
            </>
          )}
        </motion.div>
      )}

      {/* 오른쪽 설명 사이드바 */}
      {selectedDocKey && (
        <div
          style={{
            position: "fixed",
            top: 48,
            bottom: 0,
            right: 0,
            width: "320px",
            backgroundColor: "#282a36",
            color: "white",
            padding: "20px",
            borderLeft: "1px solid #444",
            overflowY: "auto",
            zIndex: 1300
          }}
        >
          <div style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" }}>{selectedDocKey}</div>
          <ReactMarkdown>{docContent}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
