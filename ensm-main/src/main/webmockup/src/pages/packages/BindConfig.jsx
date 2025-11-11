// BindConfig.jsx - SettingItem 컴포넌트 사용
import React, { useState } from "react";
import SettingItem from "../../components/SettingItem";

export default function BindConfig() {
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

  const inputStyle = {
    padding: "6px 10px",
    width: "240px",
    backgroundColor: "#1e1f22",
    color: "white",
    border: "1px solid #555",
    borderRadius: "4px",
    textAlign: "right"
  };

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


      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📂 /etc/named.conf파일</h3>
        <SettingItem
          label="listen-on port 53"
          input={<input type="text" value={formData.listenOn} onChange={(e) => handleInputChange("listenOn", e.target.value)} placeholder="127.0.0.1" style={inputStyle} />}
          hint="IPv4 주소에서 수신할 인터페이스를 지정합니다."
          description="IPv4 수신 주소"
        />
        <SettingItem
          label="listen-on-v6 port 53"
          input={<input type="text" value={formData.listenOnV6} onChange={(e) => handleInputChange("listenOnV6", e.target.value)} placeholder="::1" style={inputStyle} />}
          hint="IPv6 주소에서 수신할 인터페이스를 지정합니다."
          description="IPv6 수신 주소"
        />
        <SettingItem
          label="forward"
          input={
            <select value={formData.forward} onChange={(e) => handleInputChange("forward", e.target.value)} style={inputStyle}>
              <option value="only">only</option>
              <option value="first">first</option>
            </select>
          }
          hint="포워딩 모드를 지정합니다. only는 포워더만 사용, first는 먼저 포워더를 시도합니다."
          description="포워딩 모드"
        />
        <SettingItem
          label="forwarders"
          input={<input type="text" value={formData.forwarders} onChange={(e) => handleInputChange("forwarders", e.target.value)} placeholder="8.8.8.8; 8.8.4.4;" style={inputStyle} />}
          hint="DNS 쿼리를 포워딩할 서버 주소를 지정합니다."
          description="포워더 주소"
        />
        <SettingItem
          label="allow-query"
          input={<input type="text" value={formData.allowQuery} onChange={(e) => handleInputChange("allowQuery", e.target.value)} placeholder="any" style={inputStyle} />}
          hint="DNS 쿼리를 허용할 클라이언트를 지정합니다."
          description="쿼리 허용 범위"
        />
        <SettingItem
          label="allow-transfer"
          input={<input type="text" value={formData.allowTransfer} onChange={(e) => handleInputChange("allowTransfer", e.target.value)} placeholder="none" style={inputStyle} />}
          hint="Zone 전송을 허용할 서버를 지정합니다."
          description="Zone 전송 허용"
        />
        <SettingItem
          label="acl"
          input={<input type="text" value={formData.acl} onChange={(e) => handleInputChange("acl", e.target.value)} placeholder="member { 210.96.52.100; 203.247.40/24; }" style={inputStyle} />}
          hint="접근 제어 목록을 정의합니다."
          description="ACL 정의"
        />
      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📝 zone 구문</h3>
        <SettingItem
          label="zone 도메인명"
          input={<input type="text" value={formData.zoneDomain} onChange={(e) => handleInputChange("zoneDomain", e.target.value)} placeholder="example.com" style={inputStyle} />}
          hint="Zone의 도메인 이름을 지정합니다."
          description="Zone 도메인"
        />
        <SettingItem
          label="type"
          input={
            <select value={formData.zoneType} onChange={(e) => handleInputChange("zoneType", e.target.value)} style={inputStyle}>
              <option value="master">master</option>
              <option value="slave">slave</option>
              <option value="hint">hint</option>
            </select>
          }
          hint="Zone의 타입을 지정합니다. master는 주 서버, slave는 보조 서버입니다."
          description="Zone 타입"
        />
        <SettingItem
          label="file"
          input={<input type="text" value={formData.zoneFile} onChange={(e) => handleInputChange("zoneFile", e.target.value)} placeholder="/var/named/example.com.zone" style={inputStyle} />}
          hint="Zone 파일의 경로를 지정합니다."
          description="Zone 파일 경로"
        />
      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📁 zone 파일</h3>
        <SettingItem
          label="$TTL"
          input={<input type="text" placeholder="" style={inputStyle} />}
          hint="Time To Live 값을 지정합니다."
          description="TTL 값"
        />
        <SettingItem
          label="사이트 이름"
          input={<input type="text" placeholder="linux.com" style={inputStyle} />}
          hint="도메인 이름을 지정합니다."
          description="도메인명"
        />
        <SettingItem
          label="DNS server address"
          input={<input type="text" placeholder="" style={inputStyle} />}
          hint="DNS 서버 주소를 지정합니다."
          description="DNS 서버 주소"
        />
        <SettingItem
          label="DNS 관리자 메일 주소"
          input={<input type="text" placeholder="" style={inputStyle} />}
          hint="DNS 관리자의 이메일 주소를 지정합니다."
          description="관리자 이메일"
        />
        <SettingItem
          label="serial"
          input={<input type="text" placeholder="" style={inputStyle} />}
          hint="Zone 파일의 시리얼 번호를 지정합니다."
          description="시리얼 번호"
        />
        <SettingItem
          label="refresh"
          input={<input type="text" placeholder="" style={inputStyle} />}
          hint="보조 서버가 주 서버를 확인하는 주기를 지정합니다."
          description="새로고침 주기"
        />
        <SettingItem
          label="retry"
          input={<input type="text" placeholder="" style={inputStyle} />}
          hint="새로고침 실패 시 재시도 주기를 지정합니다."
          description="재시도 주기"
        />
        <SettingItem
          label="expire"
          input={<input type="text" placeholder="" style={inputStyle} />}
          hint="보조 서버가 주 서버에 접근할 수 없을 때 데이터를 유지하는 시간을 지정합니다."
          description="만료 시간"
        />
        <SettingItem
          label="minimum TTL"
          input={<input type="text" placeholder="" style={inputStyle} />}
          hint="음의 캐시 TTL 값을 지정합니다."
          description="최소 TTL"
        />
      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📦로컬 네임 서버 설정(/etc/hosts)</h3>
        <SettingItem
          label="name server_hosts"
          input={<input type="text" placeholder="192.168.100.5" style={inputStyle} />}
          hint="로컬 호스트 파일에 등록할 네임 서버 이름을 지정합니다."
          description="네임 서버 이름"
        />
        <SettingItem
          label="IP address_hosts"
          input={<input type="text" placeholder="192.168.100.5" style={inputStyle} />}
          hint="로컬 호스트 파일에 등록할 IP 주소를 지정합니다."
          description="IP 주소"
        />
      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>👤 외부 네임 서버 설정(/etc/resolv.conf)</h3>
        <SettingItem
          label="name server_resolv.conf"
          input={<input type="text" placeholder="192.168.100.5" style={inputStyle} />}
          hint="외부 네임 서버 이름을 지정합니다."
          description="네임 서버 이름"
        />
        <SettingItem
          label="IP address_resolv.conf"
          input={<input type="text" placeholder="192.168.100.5" style={inputStyle} />}
          hint="외부 네임 서버 IP 주소를 지정합니다."
          description="IP 주소"
        />
      </div>

      <div style={{ backgroundColor: "#313338", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📄 네임 서버 정의 파일</h3>
        <SettingItem
          label="도메인"
          input={<input type="text" placeholder="" style={inputStyle} />}
          hint="Zone의 도메인 이름을 지정합니다."
          description="도메인명"
        />
        <SettingItem
          label="방향"
          input={renderToggle("authz_user_module")}
          hint="정방향 또는 역방향 Zone을 지정합니다."
          description="Zone 방향"
        />
        <SettingItem
          label="type-master"
          input={
            <select style={inputStyle} defaultValue="master">
              <option value="master">master</option>
              <option value="slave">slave</option>
            </select>
          }
          hint="Zone의 타입을 지정합니다."
          description="Zone 타입"
        />
        <SettingItem
          label="file'zone 파일 이름'"
          input={<input type="text" placeholder="" style={inputStyle} />}
          hint="Zone 파일의 경로를 지정합니다."
          description="Zone 파일 경로"
        />
        <SettingItem
          label="allow-update"
          input={<input type="text" placeholder="" style={inputStyle} />}
          hint="동적 업데이트를 허용할 클라이언트를 지정합니다."
          description="동적 업데이트 허용"
        />
        <SettingItem
          label="allow-transfer"
          input={<input type="text" placeholder="" style={inputStyle} />}
          hint="Zone 전송을 허용할 서버를 지정합니다."
          description="Zone 전송 허용"
        />
      </div>


    </div>
  );
}
