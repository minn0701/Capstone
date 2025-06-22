// BindConfig.jsx 수정본 - 힌트창 내부에 📄 문서버튼과 ❌ 닫기버튼 배치
import React, { useState, useRef } from "react";
import { HelpCircle } from "lucide-react";
import { useOutletContext } from "react-router-dom";

export default function ApacheConfig() {
  const [showHint, setShowHint] = useState(null);
  const [toggles, setToggles] = useState({});
  const hintRefs = useRef({});
  const { setSelectedDocKey, setDocContent } = useOutletContext();

  const toggleSwitch = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

const loadMarkdown = async (label) => {
  try {
    const response = await fetch(`/descriptions/${label}.md`);
    const text = await response.text();
    setDocContent(text);
    setSelectedDocKey(label);
    setShowHint(null)
  } catch (err) {
    console.error(`❌ 설명서 로드 실패: ${label}`, err);
    setDocContent("설명을 불러오는 데 실패했습니다.");
    setSelectedDocKey(label);
  }
};

  const renderSetting = (label, input, hint, description) => (
    <div style={{ marginBottom: "1.5rem", position: "relative", zIndex: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: "40%", position: "relative" }}>
          <label style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
            {label}
            <span style={{ display: "flex", alignItems: "center", marginLeft: "8px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint(label);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ccc",
                  padding: 0,
                  display: "flex",
                  alignItems: "center"
                }}
                title="간단 설명 보기"
                ref={(el) => (hintRefs.current[label] = el)}
              >
                <HelpCircle size={16} />
              </button>
            </span>
          </label>
          <div style={{ fontSize: "0.85rem", color: "#aaa", marginTop: "0.25rem" }}>{description}</div>
        </div>
        <div style={{ width: "55%", textAlign: "right" }}>{input}</div>
      </div>
{showHint === label && (
  <div
    style={{
      position: "absolute",
      left:"0px",
      top: "-90px",
        backgroundColor: "#f1f1f1",
        color: "black",
      padding: "10px 12px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      minWidth: "240px",
      zIndex: 9999
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
      <strong>{label}</strong>
      <span style={{ display: "flex", gap: "6px" }}>
        {/* ✅ 설명서 보기 버튼 수정됨 */}
<button
  onClick={() => loadMarkdown(label)}
  title="설명서 보기"
  style={{
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    color: "#555", // 원하는 색으로 조정 가능
    fontSize: "1.1rem", // 아이콘 크기 조정
    cursor: "pointer"
  }}
>
  📄
</button>
<button
  onClick={() => setShowHint(null)}
  title="닫기"
  style={{
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    color: "#555",
    fontSize: "1.1rem",
    cursor: "pointer"
  }}
>
  ❌
</button>
      </span>
    </div>
    <div style={{ fontSize: "0.9rem" }}>{hint}</div>
  </div>
)}

    </div>
  );

  const renderToggle = (key) => (
    <div
      onClick={() => toggleSwitch(key)}
      style={{
        display: "inline-block",
        width: "46px",
        height: "24px",
        backgroundColor: toggles[key] ? "#4ade80" : "#888",
        borderRadius: "24px",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.3s"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: toggles[key] ? "24px" : "3px",
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
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        BIND DNS 서버 설정
      </h2>


      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>



        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📂 /etc/named.conf파일</h3>
        {renderSetting("listen-on port 53", <input type="email" placeholder="webmaster@example.com" style={inputStyle} />, "에러가 발생할 경우 이메일로 관리자에게 전송됩니다.", "서버 관리자 이메일 주소")}
        {renderSetting("listen-on-v6 port 53", <input type="text" placeholder="localhost" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("forward", <select style={inputStyle} defaultValue="Prod">
          <option value="only">only</option>
          <option value="first">first</option>
        </select>, "응답 헤더에 포함될 서버 정보의 범위를 지정합니다.", "서버 정보 노출 정도")}
        {renderSetting("forwarders", <input type="text" placeholder="localhost" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("allow-query", <input type="text" placeholder="192.168.0.1" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("allow-transfer", <input type="text" placeholder="localhost" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("acl",<input type="text" placeholder="member { 210.96.52.100; 203.247.40/24; 211.58.96.100; }" style={inputStyle}/>,
        "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
      </div>


      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📝 zone 구문</h3>

        {renderSetting("zone'도메인명'IN", <input type="text" placeholder="192.168.0.1" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("type", <select style={inputStyle} defaultValue="Prod">
          <option value="master">master</option>
          <option value="slave">slave</option>
          <option value="hint">hint</option>
        </select>, "응답 헤더에 포함될 서버 정보의 범위를 지정합니다.", "서버 정보 노출 정도")}
        {renderSetting("file", <input type="text" placeholder="" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}


      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📁 zone 파일</h3>
        {renderSetting("$TTL", <input type="text" placeholder="" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("사이트 이름", <input type="text" placeholder="linux.com" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("DNS server adderess", <input type="text" placeholder="" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("DNS 관리자 메일 주소", <input type="text" placeholder="" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("serial", <input type="text" placeholder="" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("refresh", <input type="text" placeholder="" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("retry", <input type="text" placeholder="" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("expire", <input type="text" placeholder="" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("minimum TTL", <input type="text" placeholder="" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}

      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📦로컬 네임 서버 설정(/etc/hosts)</h3>

        {renderSetting("name server_hosts", <input type="text" placeholder="192.168.100.5" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("IP address_hosts", <input type="text" placeholder="192.168.100.5" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}


      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>👤 외부 네임 서버 설정(/etc/resolv.conf)</h3>

        {renderSetting("name server_resolv.conf", <input type="text" placeholder="192.168.100.5" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("IP address_resolv.conf", <input type="text" placeholder="192.168.100.5" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📄 네임 서버 정의 파일일</h3>

        {renderSetting("도메인", <input type="text" placeholder="" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("방향", renderToggle("authz_user_module"), "정방향 / 역방향", "mod_authz_user 로드 여부")}
        {renderSetting("type-master", <select style={inputStyle} defaultValue="Prod">
          <option value="master">master</option>
          <option value="slave">slave</option>
        </select>, "응답 헤더에 포함될 서버 정보의 범위를 지정합니다.", "서버 정보 노출 정도")}
        {renderSetting("file'zone 파일 이름'", <input type="text" placeholder="" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("allow-update", <input type="text" placeholder="" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("allow-transfer", <input type="text" placeholder="" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
      </div>


    </div>
  );
}

  const inputStyle = {
    padding: "6px 10px",
    width: "240px",
    backgroundColor: "#1e1f22",
    color: "white",
    border: "1px solid #555",
    borderRadius: "4px",
    textAlign: "right"
  };
