// ApacheConfig.jsx 수정본 - 힌트창 내부에 📄 문서버튼과 ❌ 닫기버튼 배치
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
      left: hintRefs.current[label]?.offsetLeft ?? 0,
      top: (hintRefs.current[label]?.offsetTop ?? 0) + 24,
      backgroundColor: "#fff",
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
    fontSize: "1.[1rem",
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
        Apache httpd.conf 설정 (데모 UI)
      </h2>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📂 Server Settings</h3>
        {renderSetting("ServerAdmin", <input type="email" placeholder="webmaster@example.com" style={inputStyle} />, "에러가 발생할 경우 이메일로 관리자에게 전송됩니다.", "서버 관리자 이메일 주소")}
        {renderSetting("ServerName", <input type="text" placeholder="localhost" style={inputStyle} />, "도메인 또는 IP를 지정하여 요청을 처리합니다.", "서버 도메인명")}
        {renderSetting("DocumentRoot", <input type="text" placeholder="/var/www/html" style={inputStyle} />, "웹 문서의 기본 경로를 지정합니다.", "웹 문서 루트 경로")}
        {renderSetting("ServerTokens", <select style={inputStyle} defaultValue="Prod">
          <option value="Full">Full</option>
          <option value="OS">OS</option>
          <option value="Minimal">Minimal</option>
          <option value="Minor">Minor</option>
          <option value="Major">Major</option>
          <option value="Prod">Prod</option>
        </select>, "응답 헤더에 포함될 서버 정보의 범위를 지정합니다.", "서버 정보 노출 정도")}
        {renderSetting("HostnameLookups", renderToggle("HostnameLookups"), "클라이언트의 IP를 호스트명으로 변환합니다. 비활성 권장.", "호스트 이름 조회 여부")}
        {renderSetting("Timeout", <input type="number" placeholder="60" style={inputStyle} />, "요청 완료까지 기다릴 최대 시간(초)입니다.", "요청 대기 시간")}
      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📝 Logging</h3>
        {renderSetting("LogLevel", <select style={inputStyle} defaultValue="warn">
          <option value="debug">debug</option>
          <option value="info">info</option>
          <option value="notice">notice</option>
          <option value="warn">warn</option>
          <option value="error">error</option>
          <option value="crit">crit</option>
          <option value="alert">alert</option>
          <option value="emerg">emerg</option>
        </select>, "기록할 로그의 상세 수준을 지정합니다.", "로그 레벨 설정")}
        {renderSetting("ErrorLog", <input type="text" placeholder="logs/error_log" style={inputStyle} />, "에러 로그가 저장될 파일 경로입니다.", "에러 로그 경로")}
        {renderSetting("CustomLog", <input type="text" placeholder="logs/access_log common" style={inputStyle} />, "접속 로그의 파일 경로와 형식을 지정합니다.", "접속 로그 설정")}
      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔐 Access Control</h3>
        {renderSetting("Require", <input type="text" placeholder="all granted" style={inputStyle} />, "접근을 허용할 조건을 지정합니다. 예: all granted", "접근 제어 규칙")}
        {renderSetting("AllowOverride", <select style={inputStyle} defaultValue="All">
          <option value="None">None</option>
          <option value="All">All</option>
        </select>, ".htaccess 파일의 적용 여부를 지정합니다.", "디렉터리 별 설정 허용")}
      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📁 Directory Options</h3>
        {renderSetting("Indexes", renderToggle("Indexes"), "디렉토리 목록을 보여줄지 여부입니다.", "디렉터리 목록 표시")}
        {renderSetting("FollowSymLinks", renderToggle("FollowSymLinks"), "심볼릭 링크를 따라가도록 허용합니다.", "링크 추적 허용 여부")}
        {renderSetting("SymLinksIfOwnerMatch", renderToggle("SymLinksIfOwnerMatch"), "소유자가 같을 경우 심볼릭 링크를 허용합니다.", "소유자 일치 시 링크 허용")}
        {renderSetting("ExecCGI", renderToggle("ExecCGI"), "CGI 프로그램 실행을 허용합니다.", "CGI 실행 허용")}
      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📦 Modules (계속)</h3>
        {renderSetting("LoadModule env_module", renderToggle("env_module"), "환경변수 설정을 가능하게 하는 모듈입니다.", "mod_env 로드 여부")}
        {renderSetting("LoadModule mime_module", renderToggle("mime_module"), "MIME 타입 처리를 위한 모듈입니다.", "mod_mime 로드 여부")}
        {renderSetting("LoadModule alias_module", renderToggle("alias_module"), "URL을 실제 경로로 매핑합니다.", "mod_alias 로드 여부")}
        {renderSetting("LoadModule dir_module", renderToggle("dir_module"), "디렉토리 인덱스와 기본 파일 처리 담당.", "mod_dir 로드 여부")}
        {renderSetting("LoadModule status_module", renderToggle("status_module"), "서버 상태 정보를 확인할 수 있습니다.", "mod_status 로드 여부")}
        {renderSetting("LoadModule autoindex_module", renderToggle("autoindex_module"), "디렉토리 목록 생성을 지원합니다.", "mod_autoindex 로드 여부")}
        {renderSetting("LoadModule include_module", renderToggle("include_module"), "서버 사이드 인클루드를 지원합니다.", "mod_include 로드 여부")}
        {renderSetting("LoadModule negotiation_module", renderToggle("negotiation_module"), "콘텐츠 협상 기능을 제공합니다.", "mod_negotiation 로드 여부")}
        {renderSetting("LoadModule auth_basic_module", renderToggle("auth_basic_module"), "기본 인증을 위한 모듈입니다.", "mod_auth_basic 로드 여부")}
        {renderSetting("LoadModule authn_file_module", renderToggle("authn_file_module"), "파일 기반 사용자 인증을 지원합니다.", "mod_authn_file 로드 여부")}
        {renderSetting("LoadModule authz_host_module", renderToggle("authz_host_module"), "호스트 기반 접근 제어 기능을 제공합니다.", "mod_authz_host 로드 여부")}
        {renderSetting("LoadModule authz_user_module", renderToggle("authz_user_module"), "사용자 기반 접근 제어를 지원합니다.", "mod_authz_user 로드 여부")}
      </div>  

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
  <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>👤 UserDir</h3>
  {renderSetting("UserDir", <input type="text" placeholder="public_html" style={inputStyle} />, "사용자 홈 디렉토리 내 웹 루트 디렉토리를 설정합니다.", "UserDir 기본 경로")}
</div>

<div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
  <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📄 AutoIndex</h3>
  {renderSetting("IndexOptions", <input type="text" placeholder="FancyIndexing VersionSort" style={inputStyle} />, "디렉토리 인덱싱 옵션을 설정합니다.", "인덱스 옵션")}
  {renderSetting("AddDescription", <input type="text" placeholder="README.html" style={inputStyle} />, "인덱스 출력 시 설명 문서를 추가합니다.", "설명 문서 추가")}
</div>

<div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
  <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🗂️ Types 설정</h3>
  {renderSetting("TypesConfig", <input type="text" placeholder="/etc/mime.types" style={inputStyle} />, "MIME 타입 정의 파일의 경로를 지정합니다.", "MIME 설정 파일 경로")}
  {renderSetting("DefaultType", <input type="text" placeholder="text/plain" style={inputStyle} />, "확장자가 없는 파일의 기본 MIME 타입입니다.", "기본 MIME 타입")}
</div>

<div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
  <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔗 Include</h3>
  {renderSetting("IncludeOptional", <input type="text" placeholder="conf.d/*.conf" style={inputStyle} />, "선택적으로 외부 설정 파일을 포함시킵니다.", "외부 conf 파일 포함")}
</div>

<div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
  <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🌐 VirtualHost</h3>
  {renderSetting("<VirtualHost *:80>", <input type="text" placeholder="* or 192.168.0.1" style={inputStyle} />, "가상 호스트가 수신할 IP:포트 조합입니다.", "수신 인터페이스")}
  {renderSetting("ServerName", <input type="text" placeholder="www.example.com" style={inputStyle} />, "이 가상 호스트와 연결된 도메인 이름입니다.", "서버 도메인명")}
  {renderSetting("DocumentRoot", <input type="text" placeholder="/var/www/example" style={inputStyle} />, "이 가상 호스트의 문서 루트 디렉토리입니다.", "문서 루트 경로")}
  {renderSetting("ErrorLog", <input type="text" placeholder="logs/example_error.log" style={inputStyle} />, "가상 호스트의 에러 로그 경로입니다.", "에러 로그 경로")}
  {renderSetting("CustomLog", <input type="text" placeholder="logs/example_access.log common" style={inputStyle} />, "가상 호스트의 접속 로그 경로입니다.", "접속 로그 경로")}
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
