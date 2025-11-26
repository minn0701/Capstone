import React, { useState, useEffect, useMemo } from "react";
import SettingItem from "../../components/SettingItem";
import { apiFetch } from '../../utils/api';

export default function CronManagement() {
  const [user, setUser] = useState("root");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSchedule, setNewSchedule] = useState("");
  const [newCommand, setNewCommand] = useState("");
  const [message, setMessage] = useState("");

  // CRON 스케줄 구성 요소
  const [scheduleConfig, setScheduleConfig] = useState({
    minute: { type: "every", value: "*" }, // "every" 또는 "specific"
    hour: { type: "every", value: "*" },
    day: { type: "every", value: "*" },
    month: { type: "every", value: "*" },
    weekday: { type: "every", value: "*" }
  });

  useEffect(() => {
    loadCronJobs();
  }, [user]);

  const loadCronJobs = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/main/api/cron/${user}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error("CRON 작업 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 스케줄 구성에서 CRON 형식 문자열 생성
  const generateCronSchedule = useMemo(() => {
    const parts = [];
    
    const getValue = (field) => {
      const config = scheduleConfig[field];
      if (config.type === "every") {
        // "마다" 선택 시
        if (config.value === "*" || config.value === "" || !config.value) {
          return "*";
        } else {
          // "*/N" 형식이면 N만 추출, 아니면 그대로 사용
          const numValue = config.value.replace("*/", "");
          return numValue ? `*/${numValue}` : "*";
        }
      } else {
        // "특정" 선택 시
        if (field === "weekday") {
          // 요일은 배열이거나 쉼표로 구분된 문자열일 수 있음
          if (Array.isArray(config.value)) {
            return config.value.length > 0 ? config.value.join(",") : "*";
          } else if (typeof config.value === "string" && config.value.includes(",")) {
            return config.value || "*";
          } else {
            return config.value || "*";
          }
        }
        return config.value || "*";
      }
    };
    
    parts.push(getValue("minute"));
    parts.push(getValue("hour"));
    parts.push(getValue("day"));
    parts.push(getValue("month"));
    parts.push(getValue("weekday"));
    
    return parts.join(" ");
  }, [scheduleConfig]);

  const handleScheduleChange = (field, type, value) => {
    setScheduleConfig(prev => ({
      ...prev,
      [field]: { type, value: value || (type === "every" ? "*" : "") }
    }));
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

  const handleAdd = async () => {
    const schedule = generateCronSchedule;
    if (!schedule || !newCommand) {
      setMessage("스케줄과 명령어를 입력해주세요.");
      return;
    }

    try {
      const response = await apiFetch(`/main/api/cron/${user}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          schedule: schedule,
          command: newCommand
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "알 수 없는 오류가 발생했습니다." }));
        setMessage("작업 추가 실패: " + (errorData.error || errorData.message || "HTTP " + response.status));
        return;
      }
      
      const data = await response.json().catch((e) => {
        console.error("JSON 파싱 오류:", e);
        return { message: "응답을 파싱할 수 없습니다." };
      });
      
      setMessage(data.message || data.error || "작업이 추가되었습니다.");
      
      // 성공한 경우에만 초기화
      if (data.message && !data.error) {
        // 스케줄 초기화
        setScheduleConfig({
          minute: { type: "every", value: "*" },
          hour: { type: "every", value: "*" },
          day: { type: "every", value: "*" },
          month: { type: "every", value: "*" },
          weekday: { type: "every", value: "*" }
        });
        setNewCommand("");
        loadCronJobs();
      }
    } catch (error) {
      console.error("작업 추가 오류:", error);
      setMessage("작업 추가 실패: " + (error.message || "알 수 없는 오류"));
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("정말로 이 CRON 작업을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await apiFetch(`/main/api/cron/${user}/${index}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "알 수 없는 오류가 발생했습니다." }));
        setMessage("작업 삭제 실패: " + (errorData.error || errorData.message || "HTTP " + response.status));
        return;
      }
      
      const data = await response.json().catch((e) => {
        console.error("JSON 파싱 오류:", e);
        return { message: "응답을 파싱할 수 없습니다." };
      });
      
      setMessage(data.message || data.error || "작업이 삭제되었습니다.");
      
      // 성공한 경우에만 새로고침
      if (data.message && !data.error) {
        loadCronJobs();
      }
    } catch (error) {
      console.error("작업 삭제 오류:", error);
      setMessage("작업 삭제 실패: " + (error.message || "알 수 없는 오류"));
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>⏰ CRON 작업 관리</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ marginRight: "1rem" }}>사용자:</label>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={{
            padding: "0.5rem",
            backgroundColor: "#2b2d31",
            border: "1px solid #444",
            borderRadius: "4px",
            color: "white"
          }}
        />
        <button
          onClick={loadCronJobs}
          style={{
            marginLeft: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#5865f2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          새로고침
        </button>
      </div>

      {message && (
        <div style={{
          padding: "0.75rem",
          marginBottom: "1rem",
          borderRadius: "4px",
          backgroundColor: message.includes("실패") ? "#3a1a1a" : "#1a3a1a",
          color: message.includes("실패") ? "#ff6666" : "#66ff66"
        }}>
          {message}
        </div>
      )}

      <div style={{ backgroundColor: "#2b2d31", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>새 CRON 작업 추가</h3>
        
        {/* 스케줄 설정 */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#aaa" }}>⏰ 실행 스케줄 설정</h4>
          
          {/* 분 */}
          <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#1e1e1e", borderRadius: "4px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>분 (0-59)</label>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="radio"
                  id="minute-every"
                  name="minute-type"
                  checked={scheduleConfig.minute.type === "every"}
                  onChange={() => handleScheduleChange("minute", "every", "*")}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor="minute-every" style={{ cursor: "pointer" }}>마다</label>
              </div>
              {scheduleConfig.minute.type === "every" && (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span>매</span>
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
                      width: "80px",
                      padding: "0.5rem",
                      backgroundColor: "#2b2d31",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                  <span>분</span>
                  {(scheduleConfig.minute.value === "*" || !scheduleConfig.minute.value) && <span style={{ color: "#888" }}>(매번)</span>}
                </div>
              )}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="radio"
                  id="minute-specific"
                  name="minute-type"
                  checked={scheduleConfig.minute.type === "specific"}
                  onChange={() => handleScheduleChange("minute", "specific", "0")}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor="minute-specific" style={{ cursor: "pointer" }}>특정</label>
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
                    width: "80px",
                    padding: "0.5rem",
                    backgroundColor: "#2b2d31",
                    border: "1px solid #444",
                    borderRadius: "4px",
                    color: "white"
                  }}
                />
              )}
            </div>
          </div>

          {/* 시 */}
          <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#1e1e1e", borderRadius: "4px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>시 (0-23)</label>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="radio"
                  id="hour-every"
                  name="hour-type"
                  checked={scheduleConfig.hour.type === "every"}
                  onChange={() => handleScheduleChange("hour", "every", "*")}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor="hour-every" style={{ cursor: "pointer" }}>마다</label>
              </div>
              {scheduleConfig.hour.type === "every" && (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span>매</span>
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
                      width: "80px",
                      padding: "0.5rem",
                      backgroundColor: "#2b2d31",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                  <span>시</span>
                  {(scheduleConfig.hour.value === "*" || !scheduleConfig.hour.value) && <span style={{ color: "#888" }}>(매번)</span>}
                </div>
              )}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="radio"
                  id="hour-specific"
                  name="hour-type"
                  checked={scheduleConfig.hour.type === "specific"}
                  onChange={() => handleScheduleChange("hour", "specific", "0")}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor="hour-specific" style={{ cursor: "pointer" }}>특정</label>
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
                    width: "80px",
                    padding: "0.5rem",
                    backgroundColor: "#2b2d31",
                    border: "1px solid #444",
                    borderRadius: "4px",
                    color: "white"
                  }}
                />
              )}
            </div>
          </div>

          {/* 일 */}
          <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#1e1e1e", borderRadius: "4px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>일 (1-31)</label>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="radio"
                  id="day-every"
                  name="day-type"
                  checked={scheduleConfig.day.type === "every"}
                  onChange={() => handleScheduleChange("day", "every", "*")}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor="day-every" style={{ cursor: "pointer" }}>마다</label>
              </div>
              {scheduleConfig.day.type === "every" && (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span>매</span>
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
                      width: "80px",
                      padding: "0.5rem",
                      backgroundColor: "#2b2d31",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                  <span>일</span>
                  {(scheduleConfig.day.value === "*" || !scheduleConfig.day.value) && <span style={{ color: "#888" }}>(매번)</span>}
                </div>
              )}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="radio"
                  id="day-specific"
                  name="day-type"
                  checked={scheduleConfig.day.type === "specific"}
                  onChange={() => handleScheduleChange("day", "specific", "1")}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor="day-specific" style={{ cursor: "pointer" }}>특정</label>
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
                    width: "80px",
                    padding: "0.5rem",
                    backgroundColor: "#2b2d31",
                    border: "1px solid #444",
                    borderRadius: "4px",
                    color: "white"
                  }}
                />
              )}
            </div>
          </div>

          {/* 월 */}
          <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#1e1e1e", borderRadius: "4px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>월 (1-12)</label>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="radio"
                  id="month-every"
                  name="month-type"
                  checked={scheduleConfig.month.type === "every"}
                  onChange={() => handleScheduleChange("month", "every", "*")}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor="month-every" style={{ cursor: "pointer" }}>마다</label>
              </div>
              {scheduleConfig.month.type === "every" && (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span>매</span>
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
                      width: "80px",
                      padding: "0.5rem",
                      backgroundColor: "#2b2d31",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                  <span>월</span>
                  {(scheduleConfig.month.value === "*" || !scheduleConfig.month.value) && <span style={{ color: "#888" }}>(매번)</span>}
                </div>
              )}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="radio"
                  id="month-specific"
                  name="month-type"
                  checked={scheduleConfig.month.type === "specific"}
                  onChange={() => handleScheduleChange("month", "specific", "1")}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor="month-specific" style={{ cursor: "pointer" }}>특정</label>
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
                    width: "80px",
                    padding: "0.5rem",
                    backgroundColor: "#2b2d31",
                    border: "1px solid #444",
                    borderRadius: "4px",
                    color: "white"
                  }}
                />
              )}
            </div>
          </div>

          {/* 요일 */}
          <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#1e1e1e", borderRadius: "4px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>요일 (0-7, 0과 7은 일요일)</label>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="radio"
                  id="weekday-every"
                  name="weekday-type"
                  checked={scheduleConfig.weekday.type === "every"}
                  onChange={() => handleScheduleChange("weekday", "every", "*")}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor="weekday-every" style={{ cursor: "pointer" }}>마다</label>
              </div>
              {scheduleConfig.weekday.type === "every" && (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span>매</span>
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
                      width: "80px",
                      padding: "0.5rem",
                      backgroundColor: "#2b2d31",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                  <span>요일</span>
                  {(scheduleConfig.weekday.value === "*" || !scheduleConfig.weekday.value) && <span style={{ color: "#888" }}>(매번)</span>}
                </div>
              )}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="radio"
                  id="weekday-specific"
                  name="weekday-type"
                  checked={scheduleConfig.weekday.type === "specific"}
                  onChange={() => handleScheduleChange("weekday", "specific", "0")}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor="weekday-specific" style={{ cursor: "pointer" }}>특정</label>
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
                          backgroundColor: isChecked ? "#5865f2" : "#2b2d31",
                          border: `1px solid ${isChecked ? "#5865f2" : "#444"}`,
                          borderRadius: "4px",
                          transition: "all 0.2s"
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleWeekdayToggle(day.value)}
                          style={{ cursor: "pointer" }}
                        />
                        <span style={{ fontSize: "0.9rem" }}>{day.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 생성된 CRON 스케줄 미리보기 */}
          <div style={{ 
            marginTop: "1rem", 
            padding: "0.75rem", 
            backgroundColor: "#313338", 
            borderRadius: "4px",
            border: "1px solid #444"
          }}>
            <div style={{ fontSize: "0.9rem", color: "#aaa", marginBottom: "0.5rem" }}>생성된 CRON 스케줄:</div>
            <div style={{ 
              fontFamily: "monospace", 
              fontSize: "1rem", 
              color: "#4ade80",
              fontWeight: "500"
            }}>
              {generateCronSchedule}
            </div>
          </div>
        </div>
        <SettingItem
          label="명령어"
          menu="cron"
          input={
            <input
              type="text"
              value={newCommand}
              onChange={(e) => setNewCommand(e.target.value)}
              placeholder="/usr/bin/command"
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#1e1e1e",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "white"
              }}
            />
          }
          hint="실행할 명령어 또는 스크립트의 전체 경로를 지정합니다."
          description="실행 명령어"
        />
        <button
          onClick={handleAdd}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: "#5865f2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "1rem"
          }}
        >
          추가
        </button>
      </div>

      <div style={{ backgroundColor: "#2b2d31", padding: "1.5rem", borderRadius: "8px" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>현재 CRON 작업 목록</h3>
        {loading ? (
          <p>로딩 중...</p>
        ) : jobs.length === 0 ? (
          <p>등록된 CRON 작업이 없습니다.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #444" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>스케줄</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>작업</th>
                <th style={{ padding: "0.75rem", textAlign: "right" }}>액션</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => {
                const parts = job.schedule ? job.schedule.split(/\s+/, 6) : [];
                const schedule = parts.length >= 5 ? parts.slice(0, 5).join(" ") : "";
                const command = parts.length >= 6 ? parts.slice(5).join(" ") : job.schedule || "";
                return (
                <tr key={index} style={{ borderBottom: "1px solid #333" }}>
                  <td style={{ padding: "0.75rem" }}>{schedule}</td>
                  <td style={{ padding: "0.75rem" }}>{command}</td>
                  <td style={{ padding: "0.75rem", textAlign: "right" }}>
                    <button
                      onClick={() => handleDelete(index)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
