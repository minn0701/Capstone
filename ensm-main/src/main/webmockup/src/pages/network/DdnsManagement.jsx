import React, { useState, useEffect } from "react";
import SettingItem from "../../components/SettingItem";

export default function DdnsManagement() {
  const [config, setConfig] = useState({
    enabled: false,
    apiToken: "",
    zoneName: "",
    recordName: "",
    ttl: 120,
    schedule: "*/5 * * * *",
    cronEnabled: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch("/main/api/ddns");
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error("DDNS 설정 로드 실패:", error);
      setMessage("설정을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/main/api/ddns", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(config)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("설정이 저장되었습니다.");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "설정 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("설정 저장 실패:", error);
      setMessage("설정 저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCron = async () => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/main/api/ddns/cron/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          enable: !config.cronEnabled
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setConfig({ ...config, cronEnabled: !config.cronEnabled });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "CRON 작업 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("CRON 작업 변경 실패:", error);
      setMessage("CRON 작업 변경 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/main/api/ddns/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => setMessage(""), 5000);
      } else {
        setMessage(data.error || "DDNS 업데이트 테스트에 실패했습니다.");
      }
    } catch (error) {
      console.error("DDNS 테스트 실패:", error);
      setMessage("DDNS 테스트 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#2b2d31",
    border: "1px solid #444",
    borderRadius: "4px",
    color: "white",
    fontSize: "0.9rem",
    marginBottom: "1rem"
  };

  const sectionStyle = {
    backgroundColor: "#2b2d31",
    padding: "1.5rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    border: "1px solid #444"
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: "white" }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>🌐 Cloudflare DDNS 자동화</h2>

      {message && (
        <div style={{
          padding: "0.75rem",
          marginBottom: "1rem",
          borderRadius: "4px",
          backgroundColor: message.includes("실패") || message.includes("오류") ? "#3a1a1a" : "#1a3a1a",
          color: message.includes("실패") || message.includes("오류") ? "#ff6666" : "#66ff66",
          border: `1px solid ${message.includes("실패") || message.includes("오류") ? "#ff4444" : "#44ff44"}`
        }}>
          {message}
        </div>
      )}

      {/* DDNS 설정 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>⚙️ DDNS 설정</h3>

        <SettingItem
          label="DDNS 활성화"
          input={
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              style={{ width: "auto" }}
            />
          }
          hint="Cloudflare DDNS 자동 업데이트 기능을 활성화합니다."
          description="DDNS 기능 활성화"
        />

        <SettingItem
          label="Cloudflare API 토큰"
          input={
            <input
              type="password"
              style={inputStyle}
              value={config.apiToken}
              onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
              placeholder="Cloudflare API 토큰 입력"
            />
          }
          hint="Cloudflare API 토큰을 입력합니다. Cloudflare 대시보드 > My Profile > API Tokens에서 생성할 수 있습니다."
          description="API 토큰"
        />

        <SettingItem
          label="Zone 이름"
          input={
            <input
              type="text"
              style={inputStyle}
              value={config.zoneName}
              onChange={(e) => setConfig({ ...config, zoneName: e.target.value })}
              placeholder="example.com"
            />
          }
          hint="Cloudflare에 등록된 도메인(Zone) 이름을 입력합니다. 예: example.com"
          description="도메인 이름"
        />

        <SettingItem
          label="레코드 이름"
          input={
            <input
              type="text"
              style={inputStyle}
              value={config.recordName}
              onChange={(e) => setConfig({ ...config, recordName: e.target.value })}
              placeholder="ddns.example.com"
            />
          }
          hint="업데이트할 DNS 레코드 이름을 입력합니다. 예: ddns.example.com 또는 @ (루트 도메인)"
          description="DNS 레코드명"
        />

        <SettingItem
          label="TTL (초)"
          input={
            <input
              type="number"
              style={inputStyle}
              value={config.ttl}
              onChange={(e) => setConfig({ ...config, ttl: parseInt(e.target.value) || 120 })}
              min="60"
              placeholder="120"
            />
          }
          hint="DNS 레코드의 TTL(Time To Live) 값을 초 단위로 지정합니다. 최소 60초 이상이어야 합니다."
          description="TTL 값"
        />

        <SettingItem
          label="업데이트 주기 (CRON 형식)"
          input={
            <input
              type="text"
              style={inputStyle}
              value={config.schedule}
              onChange={(e) => setConfig({ ...config, schedule: e.target.value })}
              placeholder="*/5 * * * *"
            />
          }
          hint="DDNS 업데이트 주기를 CRON 형식으로 지정합니다. 예: */5 * * * * (5분마다), 0 * * * * (1시간마다)"
          description="CRON 스케줄"
        />
      </div>

      {/* CRON 작업 관리 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>⏰ 자동 업데이트</h3>

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <strong>CRON 작업 상태:</strong>
              <span style={{ marginLeft: "0.5rem", color: config.cronEnabled ? "#66ff66" : "#ff6666" }}>
                {config.cronEnabled ? "✅ 활성화됨" : "❌ 비활성화됨"}
              </span>
            </div>
            <button
              onClick={handleToggleCron}
              disabled={saving || !config.enabled}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: config.cronEnabled ? "#dc2626" : "#5865f2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: saving || !config.enabled ? "not-allowed" : "pointer",
                fontSize: "0.9rem",
                opacity: saving || !config.enabled ? 0.5 : 1
              }}
            >
              {config.cronEnabled ? "자동 업데이트 비활성화" : "자동 업데이트 활성화"}
            </button>
          </div>
          {!config.enabled && (
            <p style={{ color: "#ffaa00", fontSize: "0.9rem" }}>
              ⚠️ DDNS 기능을 먼저 활성화해야 자동 업데이트를 사용할 수 있습니다.
            </p>
          )}
        </div>

        <button
          onClick={handleTest}
          disabled={saving || !config.enabled}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: saving || !config.enabled ? "#555" : "#4ade80",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: saving || !config.enabled ? "not-allowed" : "pointer",
            fontSize: "0.9rem",
            marginRight: "1rem"
          }}
        >
          {saving ? "실행 중..." : "지금 테스트 실행"}
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: "0.75rem 2rem",
          backgroundColor: saving ? "#555" : "#5865f2",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontSize: "1rem",
          cursor: saving ? "not-allowed" : "pointer",
          fontWeight: "500"
        }}
      >
        {saving ? "저장 중..." : "설정 저장"}
      </button>
    </div>
  );
}

