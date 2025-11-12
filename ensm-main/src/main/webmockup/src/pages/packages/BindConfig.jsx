// BindConfig.jsx 수정본 - 힌트창 내부에 📄 문서버튼과 ❌ 닫기버튼 배치
import React, { useState, useRef } from "react";
import { HelpCircle } from "lucide-react";
import { useOutletContext } from "react-router-dom";

export default function BindConfig() {
  const [showHint, setShowHint] = useState(null);
  const [toggles, setToggles] = useState({});
  const [formData, setFormData] = useState({
    listenOn: "127.0.0.1",
    listenOnV6: "::1",
    forward: "first",
    forwarders: "",
    allowQuery: "any",
    allowTransfer: "none",
    acl: "",
    zoneDomain: "",
    zoneType: "master",
    zoneFile: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const hintRefs = useRef({});
  const { setSelectedDocKey, setDocContent } = useOutletContext();


  const toggleSwitch = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };




  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/main/api/bind-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          apply: true
        })
      });

      const result = await response.text();



      if (response.ok) {
        setMessage("설정이 적용되었습니다.");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("설정 적용 실패: " + result);
      }
    } catch (error) {
      console.error("설정 저장 실패:", error);
      setMessage("설정 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
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
    <div style={{ marginBottom: "1.5rem", position: "relative", zIndex: 1000 }}>
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
        backgroundColor: "#fff",
        color: "black",
      padding: "10px 12px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
      minWidth: "240px",
      zIndex: 100001
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          BIND DNS 서버 설정
        </h2>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: loading ? "#555" : "#5865f2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "500"
          }}
        >
          {loading ? "적용 중..." : "설정 적용"}
        </button>
      </div>

      {message && (
        <div style={{
          padding: "0.75rem",
          marginBottom: "1rem",
          borderRadius: "4px",
          backgroundColor: message.includes("실패") ? "#3a1a1a" : "#1a3a1a",
          color: message.includes("실패") ? "#ff6666" : "#66ff66",
          border: `1px solid ${message.includes("실패") ? "#ff4444" : "#44ff44"}`
        }}>
          {message}
        </div>
      )}


      <div style={{ backgroundColor: "#313338", padding: "1rem 1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.3rem", borderBottom: "1.5px solid #666666", fontWeight: "bold", marginBottom: "2rem", color: "#f2f2d3", paddingBottom: "0.4rem" }}>/etc/named.conf 파일</h3>
        {renderSetting("listen-on port 53", <input type="text" value={formData.listenOn} onChange={(e) => handleInputChange("listenOn", e.target.value)} placeholder="127.0.0.1" style={inputStyle} />, "IPv4 주소에서 수신할 인터페이스를 지정합니다.", "IPv4 수신 주소")}
        {renderSetting("listen-on-v6 port 53", <input type="text" value={formData.listenOnV6} onChange={(e) => handleInputChange("listenOnV6", e.target.value)} placeholder="::1" style={inputStyle} />, "IPv6 주소에서 수신할 인터페이스를 지정합니다.", "IPv6 수신 주소")}
        {renderSetting("forward", <select value={formData.forward} onChange={(e) => handleInputChange("forward", e.target.value)} style={inputStyle}>
          <option value="only">only</option>
          <option value="first">first</option>
        </select>, "포워딩 모드를 지정합니다. only는 포워더만 사용, first는 먼저 포워더를 시도합니다.", "포워딩 모드")}
        {renderSetting("forwarders", <input type="text" value={formData.forwarders} onChange={(e) => handleInputChange("forwarders", e.target.value)} placeholder="8.8.8.8; 8.8.4.4;" style={inputStyle} />, "DNS 쿼리를 포워딩할 서버 주소를 지정합니다.", "포워더 주소")}
        {renderSetting("allow-query", <input type="text" value={formData.allowQuery} onChange={(e) => handleInputChange("allowQuery", e.target.value)} placeholder="any" style={inputStyle} />, "DNS 쿼리를 허용할 클라이언트를 지정합니다.", "쿼리 허용 범위")}
        {renderSetting("allow-transfer", <input type="text" value={formData.allowTransfer} onChange={(e) => handleInputChange("allowTransfer", e.target.value)} placeholder="none" style={inputStyle} />, "Zone 전송을 허용할 서버를 지정합니다.", "Zone 전송 허용")}
        {renderSetting("acl",<input type="text" value={formData.acl} onChange={(e) => handleInputChange("acl", e.target.value)} placeholder="member { 210.96.52.100; 203.247.40/24; }" style={inputStyle}/>,
        "접근 제어 목록을 정의합니다.", "ACL 정의")}
      </div>


      <div style={{ backgroundColor: "#313338", padding: "1rem 1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.3rem", borderBottom: "1.5px solid #666666", fontWeight: "bold", marginBottom: "2rem", color: "#f2f2d3", paddingBottom: "0.4rem" }}>zone 구문</h3>

        {renderSetting("zone 도메인명", <input type="text" value={formData.zoneDomain} onChange={(e) => handleInputChange("zoneDomain", e.target.value)} placeholder="example.com" style={inputStyle} />, "Zone의 도메인 이름을 지정합니다.", "Zone 도메인")}
        {renderSetting("type", <select value={formData.zoneType} onChange={(e) => handleInputChange("zoneType", e.target.value)} style={inputStyle}>
          <option value="master">master</option>
          <option value="slave">slave</option>
          <option value="hint">hint</option>
        </select>, "Zone의 타입을 지정합니다. master는 주 서버, slave는 보조 서버입니다.", "Zone 타입")}
        {renderSetting("file", <input type="text" value={formData.zoneFile} onChange={(e) => handleInputChange("zoneFile", e.target.value)} placeholder="/var/named/example.com.zone" style={inputStyle} />, "Zone 파일의 경로를 지정합니다.", "Zone 파일 경로")}


      </div>

      <div style={{ backgroundColor: "#313338", padding: "1rem 1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.3rem", borderBottom: "1.5px solid #666666", fontWeight: "bold", marginBottom: "2rem", color: "#f2f2d3", paddingBottom: "0.4rem" }}>zone 파일</h3>
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

      <div style={{ backgroundColor: "#313338", padding: "1rem 1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.3rem", borderBottom: "1.5px solid #666666", fontWeight: "bold", marginBottom: "2rem", color: "#f2f2d3", paddingBottom: "0.4rem" }}>로컬 네임 서버 설정(/etc/hosts)</h3>

        {renderSetting("name server_hosts", <input type="text" placeholder="192.168.100.5" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("IP address_hosts", <input type="text" placeholder="192.168.100.5" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}


      </div>

      <div style={{ backgroundColor: "#313338", padding: "1rem 1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.3rem", borderBottom: "1.5px solid #666666", fontWeight: "bold", marginBottom: "2rem", color: "#f2f2d3", paddingBottom: "0.4rem" }}>외부 네임 서버 설정(/etc/resolv.conf)</h3>

        {renderSetting("name server_resolv.conf", <input type="text" placeholder="192.168.100.5" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("IP address_resolv.conf", <input type="text" placeholder="192.168.100.5" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
      </div>

      <div style={{ backgroundColor: "#313338", padding: "1rem 1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.3rem", borderBottom: "1.5px solid #666666", fontWeight: "bold", marginBottom: "2rem", color: "#f2f2d3", paddingBottom: "0.4rem" }}>네임 서버 정의 파일일</h3>

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
