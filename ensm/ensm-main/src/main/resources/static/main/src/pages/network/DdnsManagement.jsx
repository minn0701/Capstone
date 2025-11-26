import React, { useState, useEffect, useMemo, useRef } from "react";
import SettingItem from "../../components/SettingItem";
import { apiFetch } from '../../utils/api';
import { commonStyles } from '../../utils/theme';

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
  const [scheduleExpanded, setScheduleExpanded] = useState(false);
  const isInternalUpdate = useRef(false);

  // CRON 스케줄 구성 요소
  const [scheduleConfig, setScheduleConfig] = useState({
    minute: { type: "every", value: "5" }, // 기본값: 매 5분
    hour: { type: "every", value: "*" },
    day: { type: "every", value: "*" },
    month: { type: "every", value: "*" },
    weekday: { type: "every", value: "*" }
  });

  const STORAGE_KEY = "config_ddns";

  // localStorage에서 설정 로드
  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("localStorage에서 설정 로드 실패:", error);
    }
    return null;
  };

  // localStorage에 설정 저장
  const saveToStorage = (configData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configData));
    } catch (error) {
      console.error("localStorage에 설정 저장 실패:", error);
    }
  };

  // 스케줄 구성에서 CRON 형식 문자열 생성
  const generateCronSchedule = useMemo(() => {
    const parts = [];
    
    const getValue = (field) => {
      const scheduleField = scheduleConfig[field];
      if (scheduleField.type === "every") {
        // "마다" 선택 시
        if (scheduleField.value === "*" || scheduleField.value === "" || !scheduleField.value) {
          return "*";
        } else {
          // "*/N" 형식이면 N만 추출, 아니면 그대로 사용
          const numValue = scheduleField.value.replace("*/", "");
          return numValue ? `*/${numValue}` : "*";
        }
      } else {
        // "특정" 선택 시
        if (field === "weekday") {
          // 요일은 배열이거나 쉼표로 구분된 문자열일 수 있음
          if (Array.isArray(scheduleField.value)) {
            return scheduleField.value.length > 0 ? scheduleField.value.join(",") : "*";
          } else if (typeof scheduleField.value === "string" && scheduleField.value.includes(",")) {
            return scheduleField.value || "*";
          } else {
            return scheduleField.value || "*";
          }
        }
        return scheduleField.value || "*";
      }
    };
    
    parts.push(getValue("minute"));
    parts.push(getValue("hour"));
    parts.push(getValue("day"));
    parts.push(getValue("month"));
    parts.push(getValue("weekday"));
    
    return parts.join(" ");
  }, [scheduleConfig]);

  // CRON 스케줄 문자열을 scheduleConfig로 파싱
  const parseCronSchedule = (schedule) => {
    const parts = schedule.split(/\s+/);
    if (parts.length < 5) {
      return {
        minute: { type: "every", value: "*" },
        hour: { type: "every", value: "*" },
        day: { type: "every", value: "*" },
        month: { type: "every", value: "*" },
        weekday: { type: "every", value: "*" }
      };
    }

    const parseField = (value, isWeekday = false) => {
      if (value === "*") {
        return { type: "every", value: "*" };
      } else if (value.startsWith("*/")) {
        return { type: "every", value: value.replace("*/", "") };
      } else {
        // 요일의 경우 쉼표로 구분된 값이 있을 수 있음
        if (isWeekday && value.includes(",")) {
          return { type: "specific", value: value };
        }
        return { type: "specific", value: value };
      }
    };

    return {
      minute: parseField(parts[0]),
      hour: parseField(parts[1]),
      day: parseField(parts[2]),
      month: parseField(parts[3]),
      weekday: parseField(parts[4], true)
    };
  };

  const handleScheduleChange = (field, type, value) => {
    const newScheduleConfig = {
      ...scheduleConfig,
      [field]: { type, value: value || (type === "every" ? "*" : "") }
    };
    setScheduleConfig(newScheduleConfig);
    // config의 schedule도 업데이트
    isInternalUpdate.current = true;
    const newSchedule = generateCronScheduleFromConfig(newScheduleConfig);
    setConfig({ ...config, schedule: newSchedule });
  };

  const generateCronScheduleFromConfig = (scheduleConfigData) => {
    const parts = [];
    
    const getValue = (field) => {
      const scheduleField = scheduleConfigData[field];
      if (scheduleField.type === "every") {
        if (scheduleField.value === "*" || scheduleField.value === "" || !scheduleField.value) {
          return "*";
        } else {
          const numValue = scheduleField.value.replace("*/", "");
          return numValue ? `*/${numValue}` : "*";
        }
      } else {
        // "특정" 선택 시
        if (field === "weekday") {
          // 요일은 배열이거나 쉼표로 구분된 문자열일 수 있음
          if (Array.isArray(scheduleField.value)) {
            return scheduleField.value.length > 0 ? scheduleField.value.join(",") : "*";
          } else if (typeof scheduleField.value === "string" && scheduleField.value.includes(",")) {
            return scheduleField.value || "*";
          } else {
            return scheduleField.value || "*";
          }
        }
        return scheduleField.value || "*";
      }
    };
    
    parts.push(getValue("minute"));
    parts.push(getValue("hour"));
    parts.push(getValue("day"));
    parts.push(getValue("month"));
    parts.push(getValue("weekday"));
    
    return parts.join(" ");
  };

  const handleWeekdayToggle = (dayValue) => {
    const currentValue = scheduleConfig.weekday.value;
    let selectedDays = [];
    
    // 현재 값을 배열로 변환
    if (Array.isArray(currentValue)) {
      selectedDays = [...currentValue];
    } else if (typeof currentValue === "string" && currentValue !== "*" && currentValue !== "") {
      selectedDays = currentValue.split(",").map(d => d.trim()).filter(d => d);
    }
    
    // 요일 토글
    if (selectedDays.includes(dayValue)) {
      selectedDays = selectedDays.filter(d => d !== dayValue);
    } else {
      selectedDays.push(dayValue);
    }
    
    // 정렬 (0-7 순서)
    selectedDays.sort((a, b) => parseInt(a) - parseInt(b));
    
    handleScheduleChange("weekday", "specific", selectedDays.length > 0 ? selectedDays.join(",") : "");
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // 설정값이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (!loading) {
      saveToStorage(config);
    }
  }, [config, loading]);

  // config.schedule이 변경되면 scheduleConfig도 업데이트 (외부에서 변경된 경우만)
  useEffect(() => {
    if (config.schedule && !isInternalUpdate.current) {
      const parsed = parseCronSchedule(config.schedule);
      setScheduleConfig(parsed);
    }
    isInternalUpdate.current = false;
  }, [config.schedule]);

  const loadConfig = async () => {
    // 먼저 localStorage에서 로드
    const savedConfig = loadFromStorage();
    if (savedConfig) {
      setConfig(savedConfig);
      // scheduleConfig도 초기화
      if (savedConfig.schedule) {
        const parsed = parseCronSchedule(savedConfig.schedule);
        setScheduleConfig(parsed);
      }
    }

    try {
      const response = await apiFetch("/main/api/ddns");
      if (response.ok) {
        const data = await response.json();
        // 서버에서 받은 데이터와 localStorage 데이터 병합 (서버 우선)
        const mergedConfig = savedConfig ? { ...savedConfig, ...data } : data;
        setConfig(mergedConfig);
        // scheduleConfig도 업데이트
        if (mergedConfig.schedule) {
          const parsed = parseCronSchedule(mergedConfig.schedule);
          setScheduleConfig(parsed);
        }
        saveToStorage(mergedConfig);
      } else {
        // 서버 로드 실패 시 localStorage 데이터 사용
        if (savedConfig) {
          setConfig(savedConfig);
          if (savedConfig.schedule) {
            const parsed = parseCronSchedule(savedConfig.schedule);
            setScheduleConfig(parsed);
          }
        }
      }
    } catch (error) {
      console.error("DDNS 설정 로드 실패:", error);
      // 서버 로드 실패 시 localStorage 데이터 사용
      if (savedConfig) {
        setConfig(savedConfig);
        if (savedConfig.schedule) {
          const parsed = parseCronSchedule(savedConfig.schedule);
          setScheduleConfig(parsed);
        }
      } else {
        setMessage("설정을 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    // localStorage에 먼저 저장
    saveToStorage(config);
    try {
      const response = await apiFetch("/main/api/ddns", {
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
        // 서버 저장 성공 후 localStorage에도 저장 (서버 데이터로 업데이트)
        saveToStorage(config);
      } else {
        setMessage(data.error || "설정 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("설정 저장 실패:", error);
      setMessage("설정 저장 중 오류가 발생했습니다.");
      // 오류 발생해도 localStorage에는 저장됨
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCron = async () => {
    setSaving(true);
    setMessage("");
    const newCronEnabled = !config.cronEnabled;
    // 먼저 상태 업데이트 및 localStorage 저장
    const updatedConfig = { ...config, cronEnabled: newCronEnabled };
    setConfig(updatedConfig);
    saveToStorage(updatedConfig);
    
    try {
      const response = await apiFetch("/main/api/ddns/cron/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          enable: newCronEnabled
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
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
      const response = await apiFetch("/main/api/ddns/test", {
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
          menu="ddns"
          input={
            <div
              onClick={() => setConfig({ ...config, enabled: !config.enabled })}
              style={{
                display: "inline-block",
                width: "46px",
                height: "24px",
                backgroundColor: config.enabled ? "#4ade80" : "#888",
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
                  left: config.enabled ? "24px" : "3px",
                  width: "18px",
                  height: "18px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  transition: "left 0.3s"
                }}
              />
            </div>
          }
          hint="Cloudflare DDNS 자동 업데이트 기능을 활성화합니다."
          description="DDNS 기능 활성화"
        />

        <SettingItem
          label="Cloudflare API 토큰"
          menu="ddns"
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
          menu="ddns"
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
          menu="ddns"
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
          menu="ddns"
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
          menu="ddns"
          input={
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div style={{ 
                  fontFamily: "monospace", 
                  fontSize: "0.95rem", 
                  color: "#4ade80",
                  fontWeight: "500"
                }}>
                  {generateCronSchedule}
                </div>
                <button
                  type="button"
                  onClick={() => setScheduleExpanded(!scheduleExpanded)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    backgroundColor: "#313338",
                    color: "white",
                    border: "1px solid #444",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.85rem"
                  }}
                >
                  {scheduleExpanded ? "접기 ▲" : "상세 설정 ▼"}
                </button>
              </div>
              
              {scheduleExpanded && (
                <div style={{ 
                  marginTop: "1rem", 
                  padding: "1rem", 
                  backgroundColor: "#1e1e1e", 
                  borderRadius: "4px",
                  border: "1px solid #444"
                }}>
                  <h4 style={{ fontSize: "0.95rem", marginBottom: "1rem", color: "#aaa" }}>⏰ 실행 스케줄 설정</h4>
                  
                  {/* 분 */}
                  <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#2b2d31", borderRadius: "4px" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>분 (0-59)</label>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="radio"
                          id="ddns-minute-every"
                          name="ddns-minute-type"
                          checked={scheduleConfig.minute.type === "every"}
                          onChange={() => handleScheduleChange("minute", "every", "*")}
                          style={{ cursor: "pointer" }}
                        />
                        <label htmlFor="ddns-minute-every" style={{ cursor: "pointer", fontSize: "0.9rem" }}>마다</label>
                      </div>
                      {scheduleConfig.minute.type === "every" && (
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <span style={{ fontSize: "0.9rem" }}>매</span>
                          <input
                            type="number"
                            min="1"
                            max="59"
                            value={scheduleConfig.minute.value === "*" || !scheduleConfig.minute.value ? "" : scheduleConfig.minute.value.replace("*/", "")}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleScheduleChange("minute", "every", val ? val : "*");
                            }}
                            placeholder="매번"
                            style={{
                              width: "70px",
                              padding: "0.4rem",
                              backgroundColor: "#1e1e1e",
                              border: "1px solid #444",
                              borderRadius: "4px",
                              color: "white",
                              fontSize: "0.9rem"
                            }}
                          />
                          <span style={{ fontSize: "0.9rem" }}>분</span>
                          {(scheduleConfig.minute.value === "*" || !scheduleConfig.minute.value) && <span style={{ color: "#888", fontSize: "0.85rem" }}>(매번)</span>}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="radio"
                          id="ddns-minute-specific"
                          name="ddns-minute-type"
                          checked={scheduleConfig.minute.type === "specific"}
                          onChange={() => handleScheduleChange("minute", "specific", "0")}
                          style={{ cursor: "pointer" }}
                        />
                        <label htmlFor="ddns-minute-specific" style={{ cursor: "pointer", fontSize: "0.9rem" }}>특정</label>
                      </div>
                      {scheduleConfig.minute.type === "specific" && (
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={scheduleConfig.minute.value}
                          onChange={(e) => handleScheduleChange("minute", "specific", e.target.value)}
                          placeholder="0"
                          style={{
                            width: "70px",
                            padding: "0.4rem",
                            backgroundColor: "#1e1e1e",
                            border: "1px solid #444",
                            borderRadius: "4px",
                            color: "white",
                            fontSize: "0.9rem"
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* 시 */}
                  <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#2b2d31", borderRadius: "4px" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>시 (0-23)</label>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="radio"
                          id="ddns-hour-every"
                          name="ddns-hour-type"
                          checked={scheduleConfig.hour.type === "every"}
                          onChange={() => handleScheduleChange("hour", "every", "*")}
                          style={{ cursor: "pointer" }}
                        />
                        <label htmlFor="ddns-hour-every" style={{ cursor: "pointer", fontSize: "0.9rem" }}>마다</label>
                      </div>
                      {scheduleConfig.hour.type === "every" && (
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <span style={{ fontSize: "0.9rem" }}>매</span>
                          <input
                            type="number"
                            min="1"
                            max="23"
                            value={scheduleConfig.hour.value === "*" || !scheduleConfig.hour.value ? "" : scheduleConfig.hour.value.replace("*/", "")}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleScheduleChange("hour", "every", val ? val : "*");
                            }}
                            placeholder="매번"
                            style={{
                              width: "70px",
                              padding: "0.4rem",
                              backgroundColor: "#1e1e1e",
                              border: "1px solid #444",
                              borderRadius: "4px",
                              color: "white",
                              fontSize: "0.9rem"
                            }}
                          />
                          <span style={{ fontSize: "0.9rem" }}>시</span>
                          {(scheduleConfig.hour.value === "*" || !scheduleConfig.hour.value) && <span style={{ color: "#888", fontSize: "0.85rem" }}>(매번)</span>}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="radio"
                          id="ddns-hour-specific"
                          name="ddns-hour-type"
                          checked={scheduleConfig.hour.type === "specific"}
                          onChange={() => handleScheduleChange("hour", "specific", "0")}
                          style={{ cursor: "pointer" }}
                        />
                        <label htmlFor="ddns-hour-specific" style={{ cursor: "pointer", fontSize: "0.9rem" }}>특정</label>
                      </div>
                      {scheduleConfig.hour.type === "specific" && (
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={scheduleConfig.hour.value}
                          onChange={(e) => handleScheduleChange("hour", "specific", e.target.value)}
                          placeholder="0"
                          style={{
                            width: "70px",
                            padding: "0.4rem",
                            backgroundColor: "#1e1e1e",
                            border: "1px solid #444",
                            borderRadius: "4px",
                            color: "white",
                            fontSize: "0.9rem"
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* 일 */}
                  <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#2b2d31", borderRadius: "4px" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>일 (1-31)</label>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="radio"
                          id="ddns-day-every"
                          name="ddns-day-type"
                          checked={scheduleConfig.day.type === "every"}
                          onChange={() => handleScheduleChange("day", "every", "*")}
                          style={{ cursor: "pointer" }}
                        />
                        <label htmlFor="ddns-day-every" style={{ cursor: "pointer", fontSize: "0.9rem" }}>마다</label>
                      </div>
                      {scheduleConfig.day.type === "every" && (
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <span style={{ fontSize: "0.9rem" }}>매</span>
                          <input
                            type="number"
                            min="1"
                            max="31"
                            value={scheduleConfig.day.value === "*" || !scheduleConfig.day.value ? "" : scheduleConfig.day.value.replace("*/", "")}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleScheduleChange("day", "every", val ? val : "*");
                            }}
                            placeholder="매번"
                            style={{
                              width: "70px",
                              padding: "0.4rem",
                              backgroundColor: "#1e1e1e",
                              border: "1px solid #444",
                              borderRadius: "4px",
                              color: "white",
                              fontSize: "0.9rem"
                            }}
                          />
                          <span style={{ fontSize: "0.9rem" }}>일</span>
                          {(scheduleConfig.day.value === "*" || !scheduleConfig.day.value) && <span style={{ color: "#888", fontSize: "0.85rem" }}>(매번)</span>}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="radio"
                          id="ddns-day-specific"
                          name="ddns-day-type"
                          checked={scheduleConfig.day.type === "specific"}
                          onChange={() => handleScheduleChange("day", "specific", "1")}
                          style={{ cursor: "pointer" }}
                        />
                        <label htmlFor="ddns-day-specific" style={{ cursor: "pointer", fontSize: "0.9rem" }}>특정</label>
                      </div>
                      {scheduleConfig.day.type === "specific" && (
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={scheduleConfig.day.value}
                          onChange={(e) => handleScheduleChange("day", "specific", e.target.value)}
                          placeholder="1"
                          style={{
                            width: "70px",
                            padding: "0.4rem",
                            backgroundColor: "#1e1e1e",
                            border: "1px solid #444",
                            borderRadius: "4px",
                            color: "white",
                            fontSize: "0.9rem"
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* 월 */}
                  <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#2b2d31", borderRadius: "4px" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>월 (1-12)</label>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="radio"
                          id="ddns-month-every"
                          name="ddns-month-type"
                          checked={scheduleConfig.month.type === "every"}
                          onChange={() => handleScheduleChange("month", "every", "*")}
                          style={{ cursor: "pointer" }}
                        />
                        <label htmlFor="ddns-month-every" style={{ cursor: "pointer", fontSize: "0.9rem" }}>마다</label>
                      </div>
                      {scheduleConfig.month.type === "every" && (
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <span style={{ fontSize: "0.9rem" }}>매</span>
                          <input
                            type="number"
                            min="1"
                            max="12"
                            value={scheduleConfig.month.value === "*" || !scheduleConfig.month.value ? "" : scheduleConfig.month.value.replace("*/", "")}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleScheduleChange("month", "every", val ? val : "*");
                            }}
                            placeholder="매번"
                            style={{
                              width: "70px",
                              padding: "0.4rem",
                              backgroundColor: "#1e1e1e",
                              border: "1px solid #444",
                              borderRadius: "4px",
                              color: "white",
                              fontSize: "0.9rem"
                            }}
                          />
                          <span style={{ fontSize: "0.9rem" }}>월</span>
                          {(scheduleConfig.month.value === "*" || !scheduleConfig.month.value) && <span style={{ color: "#888", fontSize: "0.85rem" }}>(매번)</span>}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="radio"
                          id="ddns-month-specific"
                          name="ddns-month-type"
                          checked={scheduleConfig.month.type === "specific"}
                          onChange={() => handleScheduleChange("month", "specific", "1")}
                          style={{ cursor: "pointer" }}
                        />
                        <label htmlFor="ddns-month-specific" style={{ cursor: "pointer", fontSize: "0.9rem" }}>특정</label>
                      </div>
                      {scheduleConfig.month.type === "specific" && (
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={scheduleConfig.month.value}
                          onChange={(e) => handleScheduleChange("month", "specific", e.target.value)}
                          placeholder="1"
                          style={{
                            width: "70px",
                            padding: "0.4rem",
                            backgroundColor: "#1e1e1e",
                            border: "1px solid #444",
                            borderRadius: "4px",
                            color: "white",
                            fontSize: "0.9rem"
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* 요일 */}
                  <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#2b2d31", borderRadius: "4px" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem" }}>요일 (0-7, 0과 7은 일요일)</label>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="radio"
                          id="ddns-weekday-every"
                          name="ddns-weekday-type"
                          checked={scheduleConfig.weekday.type === "every"}
                          onChange={() => handleScheduleChange("weekday", "every", "*")}
                          style={{ cursor: "pointer" }}
                        />
                        <label htmlFor="ddns-weekday-every" style={{ cursor: "pointer", fontSize: "0.9rem" }}>마다</label>
                      </div>
                      {scheduleConfig.weekday.type === "every" && (
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <span style={{ fontSize: "0.9rem" }}>매</span>
                          <input
                            type="number"
                            min="1"
                            max="7"
                            value={scheduleConfig.weekday.value === "*" || !scheduleConfig.weekday.value ? "" : scheduleConfig.weekday.value.replace("*/", "")}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleScheduleChange("weekday", "every", val ? val : "*");
                            }}
                            placeholder="매번"
                            style={{
                              width: "70px",
                              padding: "0.4rem",
                              backgroundColor: "#1e1e1e",
                              border: "1px solid #444",
                              borderRadius: "4px",
                              color: "white",
                              fontSize: "0.9rem"
                            }}
                          />
                          <span style={{ fontSize: "0.9rem" }}>요일</span>
                          {(scheduleConfig.weekday.value === "*" || !scheduleConfig.weekday.value) && <span style={{ color: "#888", fontSize: "0.85rem" }}>(매번)</span>}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="radio"
                          id="ddns-weekday-specific"
                          name="ddns-weekday-type"
                          checked={scheduleConfig.weekday.type === "specific"}
                          onChange={() => handleScheduleChange("weekday", "specific", "0")}
                          style={{ cursor: "pointer" }}
                        />
                        <label htmlFor="ddns-weekday-specific" style={{ cursor: "pointer", fontSize: "0.9rem" }}>특정</label>
                      </div>
                      {scheduleConfig.weekday.type === "specific" && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.5rem" }}>
                          {[
                            { value: "0", label: "일요일 (0)" },
                            { value: "1", label: "월요일 (1)" },
                            { value: "2", label: "화요일 (2)" },
                            { value: "3", label: "수요일 (3)" },
                            { value: "4", label: "목요일 (4)" },
                            { value: "5", label: "금요일 (5)" },
                            { value: "6", label: "토요일 (6)" }
                          ].map(day => {
                            const currentValue = scheduleConfig.weekday.value;
                            let isChecked = false;
                            if (Array.isArray(currentValue)) {
                              isChecked = currentValue.includes(day.value);
                            } else if (typeof currentValue === "string" && currentValue !== "*" && currentValue !== "") {
                              isChecked = currentValue.split(",").map(d => d.trim()).includes(day.value);
                            }
                            
                            return (
                              <label
                                key={day.value}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                  cursor: "pointer",
                                  padding: "0.4rem 0.6rem",
                                  backgroundColor: isChecked ? "#5865f2" : "#1e1e1e",
                                  border: `1px solid ${isChecked ? "#5865f2" : "#444"}`,
                                  borderRadius: "4px",
                                  transition: "all 0.2s",
                                  fontSize: "0.9rem"
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleWeekdayToggle(day.value)}
                                  style={{ cursor: "pointer" }}
                                />
                                <span>{day.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          }
          hint="DDNS 업데이트 주기를 CRON 형식으로 지정합니다. '상세 설정' 버튼을 클릭하여 세부 스케줄을 설정할 수 있습니다."
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
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            ...commonStyles.button.primary,
            opacity: saving ? 0.5 : 1,
          }}
        >
          {saving ? "저장 중..." : "설정 적용"}
        </button>

        <button
          onClick={handleTest}
          disabled={saving || !config.enabled}
          style={{
            ...commonStyles.button.success,
            opacity: (saving || !config.enabled) ? 0.5 : 1,
          }}
        >
          {saving ? "실행 중..." : "지금 테스트 실행"}
        </button>
      </div>
    </div>
  );
}

