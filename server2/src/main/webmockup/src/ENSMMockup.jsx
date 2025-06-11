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
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="설정 검색..."
            style={{ width: "80%", padding: "8px", borderRadius: "4px", marginBottom: "12px", background: "#222", color: "white", border: "1px solid #555" }}
          />
          <button
            onClick={() => {
              console.log("검색어:", searchQuery); // 검색 버튼 클릭 시 처리할 내용
              // 여기서 검색 로직을 실행할 수 있습니다.
            }}
            style={{
              backgroundColor: "#444",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              border: "none",
              fontSize: "1rem",
            }}
          >
            검색
          </button>
        </div>
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
