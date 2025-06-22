import React, { useState, useEffect, useRef } from "react";
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


export default function ENSMMockup({ children }) {
    const [openSidebar, setOpenSidebar] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const handleSearch = () => {
        console.log("검색어:", searchQuery);
    };

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
            <div style={{ height: "48px", backgroundColor: "#2b2d31", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #444", position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
                <h1 style={{ fontWeight: "bold", fontSize: "1rem" }}>ENSM</h1>
                <button
                    onClick={() => console.log("💾 저장됨")}
                    style={{
                        backgroundColor: "#6b7280",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.85rem"
                    }}
                >
                    저장
                </button>
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
                        zIndex: 100,
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
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    placeholder="설정 검색..."
                                    style={{
                                        width: "80%",
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        background: "#222",
                                        color: "white",
                                        border: "1px solid #555"
                                    }}
                                />
                                <button
                                    onClick={handleSearch}
                                    style={{
                                        padding: "2px 6px",
                                        backgroundColor: "#444",
                                        border: "none",
                                        borderRadius: "4px",
                                        color: "white",
                                        cursor: "pointer",
                                        fontSize: "0.70rem"
                                    }}
                                >
                                    검색
                                </button>
                            </div>

                            {searchQuery &&
                                Object.entries(sidebarContents).map(([key, items], idx) => (
                                    <div key={`label-${idx}`}>
                                        {items
                                            .filter((item) => item.label.includes(searchQuery))
                                            .map((item, i) => (
                                                <div key={`label-item-${i}`} style={{ fontSize: "0.85rem", padding: "4px 0" }}>
                                                    {item.label}
                                                </div>
                                            ))}
                                    </div>
                                ))}

                            {searchQuery &&
                                Object.entries(commandMap)
                                    .filter(([cmd]) => cmd.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map(([cmd, path], i) => (
                                        <div
                                            key={`cmd-${i}`}
                                            onClick={() => navigate(path)}
                                            style={{
                                                fontSize: "0.85rem",
                                                padding: "4px 0",
                                                cursor: "pointer",
                                                color: "#4ade80"
                                            }}
                                        >
                                            {cmd} (→ {path})
                                        </div>
                                    ))}
                        </>
                    )}
                </motion.div>
            )}
        </div>
    );
}