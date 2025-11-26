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
    minute: { type: "every", value: "5" },
    hour: { type: "every", value: "*" },
    day: { type: "every", value: "*" },
    month: { type: "every", value: "*" },
    weekday: { type: "every", value: "*" }
  });

  const STORAGE_KEY = "config_ddns";

  // ==========================================
  // Logic Section (기존 로직 유지)
  // ==========================================

  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.error("localStorage 로드 실패:", error);
    }
    return null;
  };

  const saveToStorage = (configData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configData));
    } catch (error) {
      console.error("localStorage 저장 실패:", error);
    }
  };

  const generateCronSchedule = useMemo(() => {
    const parts = [];
    const getValue = (field) => {
      const scheduleField = scheduleConfig[field];
      if (scheduleField.type === "every") {
        if (scheduleField.value === "*" || !scheduleField.value) return "*";
        const numValue = scheduleField.value.replace("*/", "");
        return numValue ? `*/${numValue}` : "*";
      } else {
        if (field === "weekday") {
          if (Array.isArray(scheduleField.value)) return scheduleField.value.length > 0 ? scheduleField.value.join(",") : "*";
          return scheduleField.value || "*";
        }
        return scheduleField.value || "*";
      }
    };
    parts.push(getValue("minute"), getValue("hour"), getValue("day"), getValue("month"), getValue("weekday"));
    return parts.join(" ");
  }, [scheduleConfig]);

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
      if (value === "*") return { type: "every", value: "*" };
      else if (value.startsWith("*/")) return { type: "every", value: value.replace("*/", "") };
      else return { type: "specific", value: value };
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
    isInternalUpdate.current = true;
    
    // Config 업데이트를 위한 임시 생성 로직
    const parts = [];
    const getValue = (f, conf) => {
      const sf = conf[f];
      if (sf.type === "every") {
        const val = sf.value.replace("*/", "");
        return (val && val !== "*") ? `*/${val}` : "*";
      }
      return sf.value || "*";
    };
    ['minute', 'hour', 'day', 'month', 'weekday'].forEach(f => parts.push(getValue(f, newScheduleConfig)));
    setConfig({ ...config, schedule: parts.join(" ") });
  };

  const handleWeekdayToggle = (dayValue) => {
    const currentValue = scheduleConfig.weekday.value;
    let selectedDays = [];
    if (Array.isArray(currentValue)) selectedDays = [...currentValue];
    else if (typeof currentValue === "string" && currentValue !== "*" && currentValue !== "") {
      selectedDays = currentValue.split(",").map(d => d.trim()).filter(d => d);
    }
    
    if (selectedDays.includes(dayValue)) selectedDays = selectedDays.filter(d => d !== dayValue);
    else selectedDays.push(dayValue);
    
    selectedDays.sort((a, b) => parseInt(a) - parseInt(b));
    handleScheduleChange("weekday", "specific", selectedDays.length > 0 ? selectedDays.join(",") : "");
  };

  useEffect(() => { loadConfig(); }, []);
  useEffect(() => { if (!loading) saveToStorage(config); }, [config, loading]);
  useEffect(() => {
    if (config.schedule && !isInternalUpdate.current) {
      setScheduleConfig(parseCronSchedule(config.schedule));
    }
    isInternalUpdate.current = false;
  }, [config.schedule]);

  const loadConfig = async () => {
    const savedConfig = loadFromStorage();
    if (savedConfig) {
      setConfig(savedConfig);
      if (savedConfig.schedule) setScheduleConfig(parseCronSchedule(savedConfig.schedule));
    }
    try {
      const response = await apiFetch("/main/api/ddns");
      if (response.ok) {
        const data = await response.json();
        const mergedConfig = savedConfig ? { ...savedConfig, ...data } : data;
        setConfig(mergedConfig);
        if (mergedConfig.schedule) setScheduleConfig(parseCronSchedule(mergedConfig.schedule));
        saveToStorage(mergedConfig);
      }
    } catch (error) {
      console.error("DDNS 설정 로드 실패:", error);
      if (!savedConfig) setMessage("설정을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    saveToStorage(config);
    try {
      const response = await apiFetch("/main/api/ddns", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(config)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("설정이 저장되었습니다.");
        setTimeout(() => setMessage(""), 3000);
        saveToStorage(config);
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
    const newCronEnabled = !config.cronEnabled;
    const updatedConfig = { ...config, cronEnabled: newCronEnabled };
    setConfig(updatedConfig);
    saveToStorage(updatedConfig);
    
    try {
      const response = await apiFetch("/main/api/ddns/cron/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ enable: newCronEnabled })
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
        headers: { "Content-Type": "application/json" },
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

  // ==========================================
  // Render Section (디자인 개선)
  // ==========================================

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>설정을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>Cloudflare DDNS 설정</h2>
        <p style={styles.pageSubtitle}>
          동적 IP 환경에서 도메인 연결을 유지하기 위한 자동화 설정을 관리합니다.
        </p>
      </header>

      {message && (
        <div style={{
          ...styles.messageBox,
          backgroundColor: message.includes("실패") || message.includes("오류") ? "rgba(220, 38, 38, 0.2)" : "rgba(16, 185, 129, 0.2)",
          borderColor: message.includes("실패") || message.includes("오류") ? "#ef4444" : "#10b981",
          color: message.includes("실패") || message.includes("오류") ? "#fca5a5" : "#6ee7b7",
        }}>
          {message}
        </div>
      )}

      <div style={styles.gridContainer}>
        {/* 기본 연결 설정 */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>기본 연결 설정</h3>
          
          <SettingItem
            label="DDNS 기능 활성화"
            menu="ddns"
            input={
              <div
                onClick={() => setConfig({ ...config, enabled: !config.enabled })}
                style={{
                  ...styles.toggleTrack,
                  backgroundColor: config.enabled ? "#4ade80" : "#4b5563"
                }}
              >
                <div
                  style={{
                    ...styles.toggleThumb,
                    left: config.enabled ? "24px" : "3px"
                  }}
                />
              </div>
            }
            hint="Cloudflare DDNS 자동 업데이트 기능을 켜거나 끕니다."
          />

          <SettingItem
            label="Cloudflare API 토큰"
            menu="ddns"
            input={
              <input
                type="password"
                style={styles.input}
                value={config.apiToken}
                onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                placeholder="API Token 입력"
              />
            }
            hint="Cloudflare 대시보드 > My Profile > API Tokens에서 발급받은 토큰"
          />

          <SettingItem
            label="Zone 이름 (도메인)"
            menu="ddns"
            input={
              <input
                type="text"
                style={styles.input}
                value={config.zoneName}
                onChange={(e) => setConfig({ ...config, zoneName: e.target.value })}
                placeholder="example.com"
              />
            }
            hint="Cloudflare에 등록된 루트 도메인 (예: example.com)"
          />
        </section>

        {/* 레코드 설정 */}
        <section style={{ ...styles.card, gridColumn: "0.5 / 1" }}> 
          <h3 style={styles.cardTitle}>DNS 레코드 상세</h3>
          
          <SettingItem
            label="레코드 이름"
            menu="ddns"
            input={
              <input
                type="text"
                style={styles.input}
                value={config.recordName}
                onChange={(e) => setConfig({ ...config, recordName: e.target.value })}
                placeholder="ddns.example.com"
              />
            }
            hint="업데이트할 전체 호스트네임 (예: home.example.com)"
          />

          <SettingItem
            label="TTL"
            menu="ddns"
            input={
              <input
                type="number"
                style={styles.input}
                value={config.ttl}
                onChange={(e) => setConfig({ ...config, ttl: parseInt(e.target.value) || 120 })}
                min="60"
                placeholder="120"
              />
            }
            hint="DNS 레코드 캐시 유효 시간 (최소 60초)"
          />
        </section>

        {/* 스케줄 설정 (전체 너비 사용) */}
        <section style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <h3 style={styles.cardTitle}>업데이트 스케줄 (CRON)</h3>
          
          <div style={styles.cronPreviewContainer}>
            <div style={styles.cronPreviewText}>
              현재 설정: <span style={{ color: "#4ade80", fontFamily: "monospace" }}>{generateCronSchedule}</span>
            </div>
            <button
              type="button"
              onClick={() => setScheduleExpanded(!scheduleExpanded)}
              style={styles.expandButton}
            >
              {scheduleExpanded ? "설정 접기 ▲" : "스케줄 상세 설정 ▼"}
            </button>
          </div>

          {scheduleExpanded && (
            <div style={styles.cronEditorContainer}>
              {/* 분/시/일/월 설정 그리드 */}
              <div style={styles.cronGrid}>
                {/* 1. 분 설정 */}
                <div style={styles.cronGroup}>
                  <label style={styles.cronLabel}>분 (Minute, 0-59)</label>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        checked={scheduleConfig.minute.type === "every"}
                        onChange={() => handleScheduleChange("minute", "every", "*")}
                      />
                      <span>주기적 (Every)</span>
                    </label>
                    {scheduleConfig.minute.type === "every" && (
                      <div style={styles.inlineInputGroup}>
                        <span>매</span>
                        <input
                          type="number"
                          min="1" max="59"
                          value={scheduleConfig.minute.value === "*" ? "" : scheduleConfig.minute.value.replace("*/", "")}
                          onChange={(e) => handleScheduleChange("minute", "every", e.target.value || "*")}
                          style={styles.miniInput}
                          placeholder="All"
                        />
                        <span>분 마다</span>
                      </div>
                    )}
                  </div>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        checked={scheduleConfig.minute.type === "specific"}
                        onChange={() => handleScheduleChange("minute", "specific", "0")}
                      />
                      <span>특정 시간 (Specific)</span>
                    </label>
                    {scheduleConfig.minute.type === "specific" && (
                      <input
                        type="number" min="0" max="59"
                        value={scheduleConfig.minute.value}
                        onChange={(e) => handleScheduleChange("minute", "specific", e.target.value)}
                        style={styles.miniInput}
                      />
                    )}
                  </div>
                </div>

                {/* 2. 시 설정 */}
                <div style={styles.cronGroup}>
                  <label style={styles.cronLabel}>시 (Hour, 0-23)</label>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        checked={scheduleConfig.hour.type === "every"}
                        onChange={() => handleScheduleChange("hour", "every", "*")}
                      />
                      <span>주기적</span>
                    </label>
                    {scheduleConfig.hour.type === "every" && (
                      <div style={styles.inlineInputGroup}>
                        <span>매</span>
                        <input
                          type="number" min="1" max="23"
                          value={scheduleConfig.hour.value === "*" ? "" : scheduleConfig.hour.value.replace("*/", "")}
                          onChange={(e) => handleScheduleChange("hour", "every", e.target.value || "*")}
                          style={styles.miniInput}
                          placeholder="All"
                        />
                        <span>시간 마다</span>
                      </div>
                    )}
                  </div>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        checked={scheduleConfig.hour.type === "specific"}
                        onChange={() => handleScheduleChange("hour", "specific", "0")}
                      />
                      <span>특정 시</span>
                    </label>
                    {scheduleConfig.hour.type === "specific" && (
                      <input
                        type="number" min="0" max="23"
                        value={scheduleConfig.hour.value}
                        onChange={(e) => handleScheduleChange("hour", "specific", e.target.value)}
                        style={styles.miniInput}
                      />
                    )}
                  </div>
                </div>

                {/* 3. 일 설정 */}
                <div style={styles.cronGroup}>
                  <label style={styles.cronLabel}>일 (Day, 1-31)</label>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        checked={scheduleConfig.day.type === "every"}
                        onChange={() => handleScheduleChange("day", "every", "*")}
                      />
                      <span>매일</span>
                    </label>
                    {scheduleConfig.day.type === "every" && (
                      <div style={styles.inlineInputGroup}>
                        <span>또는 매</span>
                        <input
                          type="number" min="1" max="31"
                          value={scheduleConfig.day.value === "*" ? "" : scheduleConfig.day.value.replace("*/", "")}
                          onChange={(e) => handleScheduleChange("day", "every", e.target.value || "*")}
                          style={styles.miniInput}
                          placeholder="All"
                        />
                        <span>일 마다</span>
                      </div>
                    )}
                  </div>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        checked={scheduleConfig.day.type === "specific"}
                        onChange={() => handleScheduleChange("day", "specific", "1")}
                      />
                      <span>특정 일</span>
                    </label>
                    {scheduleConfig.day.type === "specific" && (
                      <input
                        type="number" min="1" max="31"
                        value={scheduleConfig.day.value}
                        onChange={(e) => handleScheduleChange("day", "specific", e.target.value)}
                        style={styles.miniInput}
                      />
                    )}
                  </div>
                </div>

                {/* 4. 월 설정 */}
                <div style={styles.cronGroup}>
                  <label style={styles.cronLabel}>월 (Month, 1-12)</label>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        checked={scheduleConfig.month.type === "every"}
                        onChange={() => handleScheduleChange("month", "every", "*")}
                      />
                      <span>매월</span>
                    </label>
                    {scheduleConfig.month.type === "every" && (
                      <div style={styles.inlineInputGroup}>
                        <span>또는 매</span>
                        <input
                          type="number" min="1" max="12"
                          value={scheduleConfig.month.value === "*" ? "" : scheduleConfig.month.value.replace("*/", "")}
                          onChange={(e) => handleScheduleChange("month", "every", e.target.value || "*")}
                          style={styles.miniInput}
                          placeholder="All"
                        />
                        <span>개월 마다</span>
                      </div>
                    )}
                  </div>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        checked={scheduleConfig.month.type === "specific"}
                        onChange={() => handleScheduleChange("month", "specific", "1")}
                      />
                      <span>특정 월</span>
                    </label>
                    {scheduleConfig.month.type === "specific" && (
                      <input
                        type="number" min="1" max="12"
                        value={scheduleConfig.month.value}
                        onChange={(e) => handleScheduleChange("month", "specific", e.target.value)}
                        style={styles.miniInput}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* 5. 요일 설정 (전체 너비) */}
              <div style={{ ...styles.cronGroup, marginTop: "1rem" }}>
                <label style={styles.cronLabel}>요일 (Weekday)</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      checked={scheduleConfig.weekday.type === "every"}
                      onChange={() => handleScheduleChange("weekday", "every", "*")}
                    />
                    <span>매일 (모든 요일)</span>
                  </label>
                </div>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      checked={scheduleConfig.weekday.type === "specific"}
                      onChange={() => handleScheduleChange("weekday", "specific", "0")}
                    />
                    <span>특정 요일 선택</span>
                  </label>
                </div>
                
                {scheduleConfig.weekday.type === "specific" && (
                  <div style={styles.weekdaySelector}>
                    {[
                      { v: "1", l: "월" }, { v: "2", l: "화" }, { v: "3", l: "수" },
                      { v: "4", l: "목" }, { v: "5", l: "금" }, { v: "6", l: "토" },
                      { v: "0", l: "일" }
                    ].map(day => {
                      const cv = scheduleConfig.weekday.value;
                      const isChecked = Array.isArray(cv) ? cv.includes(day.v) : (typeof cv === 'string' && cv.includes(day.v));
                      return (
                        <div
                          key={day.v}
                          onClick={() => handleWeekdayToggle(day.v)}
                          style={{
                            ...styles.weekdayItem,
                            backgroundColor: isChecked ? "#5865f2" : "#2b2d31",
                            borderColor: isChecked ? "#5865f2" : "#444",
                            color: isChecked ? "white" : "#aaa"
                          }}
                        >
                          {day.l}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 자동 업데이트 제어 */}
        <section style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <h3 style={styles.cardTitle}>자동 업데이트 상태 제어</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>
                현재 상태: 
                <span style={{ fontWeight: 'bold', marginLeft: '0.5rem', color: config.cronEnabled ? "#4ade80" : "#ef4444" }}>
                  {config.cronEnabled ? "✅ 스케줄러 실행 중" : "❌ 스케줄러 중지됨"}
                </span>
              </div>
              {!config.enabled && (
                <div style={{ color: "#f59e0b", fontSize: "0.85rem" }}>
                  ⚠️ 상단의 'DDNS 기능 활성화'를 먼저 켜주세요.
                </div>
              )}
            </div>
            
            <button
              onClick={handleToggleCron}
              disabled={saving || !config.enabled}
              style={{
                ...styles.actionButton,
                backgroundColor: config.cronEnabled ? "#dc2626" : "#059669",
                opacity: (saving || !config.enabled) ? 0.5 : 1
              }}
            >
              {config.cronEnabled ? "자동 업데이트 중지 (Stop)" : "자동 업데이트 시작 (Start)"}
            </button>
          </div>
        </section>
      </div>

      <div style={styles.footerAction}>
        <button
          onClick={handleTest}
          disabled={saving || !config.enabled}
          style={{
            ...styles.saveButton,
            backgroundColor: "#2b2d31",
            border: "1px solid #444",
            marginRight: "1rem",
            opacity: (saving || !config.enabled) ? 0.5 : 1,
            color: "#fff"
          }}
        >
          {saving ? "테스트 중..." : "⚡ 지금 테스트 실행"}
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            ...commonStyles.button.primary,
            ...styles.saveButton,
            opacity: saving ? 0.7 : 1,
            cursor: saving ? 'wait' : 'pointer'
          }}
        >
          {saving ? "저장 중..." : "설정 적용하기"}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// Styles Object
// ==========================================
const styles = {
  pageContainer: {
    padding: "2rem max(2rem, 5vw)",
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    minHeight: "100vh",
    color: "var(--text-primary, #ffffff)",
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
  },
  loadingContainer: {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    height: "100vh", color: "#ccc", gap: "1rem"
  },
  spinner: {
    width: "40px", height: "40px",
    border: "4px solid rgba(255,255,255,0.1)",
    borderLeftColor: "#5865f2",
    borderRadius: "50%",
    animation: "spin 1s linear infinite" // Note: define keyframes globally if needed
  },
  header: {
    marginBottom: "2.5rem",
    borderBottom: "1px solid var(--border-color, #444)",
    paddingBottom: "1.5rem"
  },
  pageTitle: {
    fontSize: "1.8rem", fontWeight: "700", marginBottom: "0.5rem",
    color: "var(--text-primary, #ffffff)"
  },
  pageSubtitle: {
    color: "var(--text-secondary, #aaaaaa)", fontSize: "0.95rem"
  },
  messageBox: {
    padding: "1rem", marginBottom: "2rem", borderRadius: "8px",
    border: "1px solid", fontWeight: "500",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  gridContainer: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "1.5rem", marginBottom: "3rem"
  },
  card: {
    backgroundColor: "var(--bg-secondary, #2b2d31)",
    padding: "1.5rem", borderRadius: "12px",
    border: "1px solid var(--border-color, #444)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex", flexDirection: "column"
  },
  cardTitle: {
    fontSize: "1.1rem", fontWeight: "600", color: "#5a9fd1",
    marginBottom: "1.5rem", paddingBottom: "0.75rem",
    borderBottom: "1px solid var(--border-color, #444)"
  },
  input: {
    width: "95%", padding: "0.75rem",
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    border: "1px solid #555", borderRadius: "6px",
    color: "var(--text-primary, #fff)", fontSize: "0.9rem",
    outline: "none", transition: "border-color 0.2s"
  },
  // 토글 스위치 스타일 (CSS-in-JS로 구현)
  toggleTrack: {
    display: "inline-block", width: "46px", height: "24px",
    borderRadius: "24px", position: "relative",
    cursor: "pointer", transition: "background-color 0.3s"
  },
  toggleThumb: {
    position: "absolute", top: "3px",
    width: "18px", height: "18px",
    backgroundColor: "white", borderRadius: "50%",
    transition: "left 0.3s"
  },
  // CRON 스케줄 관련 스타일
  cronPreviewContainer: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "1rem", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "8px",
    marginBottom: "1rem", border: "1px solid #444"
  },
  cronPreviewText: {
    fontSize: "1rem", fontWeight: "500"
  },
  expandButton: {
    padding: "0.4rem 0.8rem", backgroundColor: "#313338",
    color: "#ccc", border: "1px solid #555", borderRadius: "4px",
    cursor: "pointer", fontSize: "0.85rem"
  },
  cronEditorContainer: {
    marginTop: "1rem", padding: "1rem",
    backgroundColor: "rgba(0,0,0,0.1)", borderRadius: "8px",
    border: "1px dashed #555"
  },
  cronGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem"
  },
  cronGroup: {
    backgroundColor: "#2b2d31", padding: "1rem", borderRadius: "6px",
    border: "1px solid #444"
  },
  cronLabel: {
    display: "block", marginBottom: "0.8rem",
    fontWeight: "600", fontSize: "0.9rem", color: "#ddd"
  },
  radioGroup: {
    display: "flex", alignItems: "center", gap: "0.5rem",
    marginBottom: "0.5rem", fontSize: "0.85rem"
  },
  radioLabel: {
    display: "flex", alignItems: "center", gap: "0.4rem",
    cursor: "pointer", color: "#ccc"
  },
  inlineInputGroup: {
    display: "flex", alignItems: "center", gap: "0.4rem",
    marginLeft: "1.2rem", fontSize: "0.85rem", color: "#999"
  },
  miniInput: {
    width: "50px", padding: "0.3rem",
    backgroundColor: "#1e1e1e", border: "1px solid #555",
    borderRadius: "4px", color: "white", textAlign: "center"
  },
  weekdaySelector: {
    display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem"
  },
  weekdayItem: {
    padding: "0.4rem 0.8rem", cursor: "pointer",
    border: "1px solid #444", borderRadius: "4px",
    fontSize: "0.85rem", transition: "all 0.2s"
  },
  actionButton: {
    padding: "0.75rem 1.5rem", border: "none", borderRadius: "6px",
    color: "white", fontWeight: "600", cursor: "pointer",
    transition: "opacity 0.2s"
  },
  footerAction: {
    display: "flex", justifyContent: "flex-end",
    marginTop: "2rem", paddingTop: "2rem",
    borderTop: "1px solid var(--border-color, #444)"
  },
  saveButton: {
    padding: "0.8rem 2.5rem", fontSize: "1rem",
    borderRadius: "6px", fontWeight: "600", border: "none"
  }
};