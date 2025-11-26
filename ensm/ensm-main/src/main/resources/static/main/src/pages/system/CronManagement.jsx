import React, { useState, useEffect, useMemo } from "react";
import SettingItem from "../../components/SettingItem";
import { apiFetch } from '../../utils/api';

// Settings 컴포넌트와 통일된 스타일 적용
export default function CronManagement() {
  // =================================================================
  // Logic Section (기존 로직 100% 유지)
  // =================================================================
  const [user, setUser] = useState("root");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCommand, setNewCommand] = useState(""); // newSchedule은 사용되지 않아 제거(generateCronSchedule로 대체됨)
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

  // =================================================================
  // UI Render Section (새로운 스타일 적용)
  // =================================================================

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>CRON 작업 관리</h2>
        <p style={styles.pageSubtitle}>서버의 반복 작업을 스케줄링하고 관리합니다.</p>
      </header>

      {/* 메시지 알림 박스 */}
      {message && (
        <div style={{
          ...styles.messageBox,
          backgroundColor: message.includes("실패") ? "rgba(220, 38, 38, 0.2)" : "rgba(16, 185, 129, 0.2)",
          borderColor: message.includes("실패") ? "#ef4444" : "#10b981",
          color: message.includes("실패") ? "#fca5a5" : "#6ee7b7",
        }}>
          {message}
        </div>
      )}

      <div style={styles.gridContainer}>
        {/* 1. 제어 패널 (사용자 선택 및 새로고침) */}
        {/* 1. 제어 패널 (수정됨: 크기 확대 및 줄바꿈 방지) */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>관리 대상 설정</h3>
          
          <div style={styles.controlPanelRow}>
            {/* 라벨과 입력창을 감싸는 컨테이너 */}
            <div style={styles.inputGroup}>
              <label style={styles.customLabel}>
                대상 사용자
                {/* 툴팁 아이콘 느낌 (선택사항) */}
                <span title="CRON 작업을 조회할 리눅스 사용자 계정" style={{marginLeft: '0.5rem', cursor: 'help', opacity: 0.7}}></span>
              </label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                style={styles.largeInput} // 커진 입력창 스타일 적용
                placeholder="root"
              />
              
            </div>

            {/* 새로고침 버튼 */}
            <button 
              onClick={loadCronJobs}
              style={styles.largeButton} // 커진 버튼 스타일 적용
            >
              새로고침
            </button>
          </div>
        </section>

        {/* 2. 새 작업 추가 카드 */}
        <section style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <h3 style={styles.cardTitle}>새 스케줄 추가</h3>
          
          <div style={styles.scheduleGrid}>
            {/* 분 설정 */}
            <div style={styles.scheduleItem}>
              <label style={styles.scheduleLabel}>분 (Minute)</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    checked={scheduleConfig.minute.type === "every"}
                    onChange={() => handleScheduleChange("minute", "every", "*")}
                  />
                  <span>매분</span>
                </label>
                {scheduleConfig.minute.type === "every" && (
                   <input
                     type="number"
                     min="1" max="59"
                     value={scheduleConfig.minute.value === "*" ? "" : scheduleConfig.minute.value.replace("*/", "")}
                     onChange={(e) => handleScheduleChange("minute", "every", e.target.value ? e.target.value : "*")}
                     placeholder="*"
                     style={styles.smallInput}
                   />
                )}
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    checked={scheduleConfig.minute.type === "specific"}
                    onChange={() => handleScheduleChange("minute", "specific", "0")}
                  />
                  <span>특정</span>
                </label>
                {scheduleConfig.minute.type === "specific" && (
                  <input
                    type="number"
                    min="0" max="59"
                    value={scheduleConfig.minute.value}
                    onChange={(e) => handleScheduleChange("minute", "specific", e.target.value)}
                    style={styles.smallInput}
                  />
                )}
              </div>
            </div>

            {/* 시 설정 */}
            <div style={styles.scheduleItem}>
              <label style={styles.scheduleLabel}>시 (Hour)</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    checked={scheduleConfig.hour.type === "every"}
                    onChange={() => handleScheduleChange("hour", "every", "*")}
                  />
                  <span>매시</span>
                </label>
                {scheduleConfig.hour.type === "every" && (
                   <input
                     type="number"
                     min="1" max="23"
                     value={scheduleConfig.hour.value === "*" ? "" : scheduleConfig.hour.value.replace("*/", "")}
                     onChange={(e) => handleScheduleChange("hour", "every", e.target.value ? e.target.value : "*")}
                     placeholder="*"
                     style={styles.smallInput}
                   />
                )}
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    checked={scheduleConfig.hour.type === "specific"}
                    onChange={() => handleScheduleChange("hour", "specific", "0")}
                  />
                  <span>특정</span>
                </label>
                {scheduleConfig.hour.type === "specific" && (
                  <input
                    type="number"
                    min="0" max="23"
                    value={scheduleConfig.hour.value}
                    onChange={(e) => handleScheduleChange("hour", "specific", e.target.value)}
                    style={styles.smallInput}
                  />
                )}
              </div>
            </div>

            {/* 일 설정 */}
            <div style={styles.scheduleItem}>
              <label style={styles.scheduleLabel}>일 (Day)</label>
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
                   <input
                     type="number"
                     min="1" max="31"
                     value={scheduleConfig.day.value === "*" ? "" : scheduleConfig.day.value.replace("*/", "")}
                     onChange={(e) => handleScheduleChange("day", "every", e.target.value ? e.target.value : "*")}
                     placeholder="*"
                     style={styles.smallInput}
                   />
                )}
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    checked={scheduleConfig.day.type === "specific"}
                    onChange={() => handleScheduleChange("day", "specific", "1")}
                  />
                  <span>특정</span>
                </label>
                {scheduleConfig.day.type === "specific" && (
                  <input
                    type="number"
                    min="1" max="31"
                    value={scheduleConfig.day.value}
                    onChange={(e) => handleScheduleChange("day", "specific", e.target.value)}
                    style={styles.smallInput}
                  />
                )}
              </div>
            </div>

            {/* 월 설정 */}
            <div style={styles.scheduleItem}>
              <label style={styles.scheduleLabel}>월 (Month)</label>
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
                   <input
                     type="number"
                     min="1" max="12"
                     value={scheduleConfig.month.value === "*" ? "" : scheduleConfig.month.value.replace("*/", "")}
                     onChange={(e) => handleScheduleChange("month", "every", e.target.value ? e.target.value : "*")}
                     placeholder="*"
                     style={styles.smallInput}
                   />
                )}
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    checked={scheduleConfig.month.type === "specific"}
                    onChange={() => handleScheduleChange("month", "specific", "1")}
                  />
                  <span>특정</span>
                </label>
                {scheduleConfig.month.type === "specific" && (
                  <input
                    type="number"
                    min="1" max="12"
                    value={scheduleConfig.month.value}
                    onChange={(e) => handleScheduleChange("month", "specific", e.target.value)}
                    style={styles.smallInput}
                  />
                )}
              </div>
            </div>

            {/* 요일 설정 (전체 너비 사용) */}
            <div style={{ ...styles.scheduleItem, gridColumn: "1 / -1" }}>
              <label style={styles.scheduleLabel}>요일 (Weekday)</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    checked={scheduleConfig.weekday.type === "every"}
                    onChange={() => handleScheduleChange("weekday", "every", "*")}
                  />
                  <span>매일(요일무관)</span>
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    checked={scheduleConfig.weekday.type === "specific"}
                    onChange={() => handleScheduleChange("weekday", "specific", "0")}
                  />
                  <span>요일 지정</span>
                </label>
              </div>
              
              {scheduleConfig.weekday.type === "specific" && (
                <div style={styles.weekdayContainer}>
                  {[
                    { value: "0", label: "일" },
                    { value: "1", label: "월" },
                    { value: "2", label: "화" },
                    { value: "3", label: "수" },
                    { value: "4", label: "목" },
                    { value: "5", label: "금" },
                    { value: "6", label: "토" }
                  ].map(day => {
                    const currentValue = scheduleConfig.weekday.value;
                    let isChecked = false;
                    if (Array.isArray(currentValue)) {
                      isChecked = currentValue.includes(day.value);
                    } else if (typeof currentValue === "string" && currentValue !== "*" && currentValue !== "") {
                      isChecked = currentValue.split(",").map(d => d.trim()).includes(day.value);
                    }
                    return (
                      <div 
                        key={day.value}
                        onClick={() => handleWeekdayToggle(day.value)}
                        style={{
                          ...styles.weekdayChip,
                          backgroundColor: isChecked ? "#5865f2" : "#2b2d31",
                          borderColor: isChecked ? "#5865f2" : "#444",
                          color: isChecked ? "white" : "#ccc"
                        }}
                      >
                        {day.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 미리보기 및 명령어 입력 */}
          <div style={styles.previewBox}>
            <span style={{ color: "#aaa" }}>CRON Expression:</span>
            <span style={styles.cronExpression}>{generateCronSchedule}</span>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <SettingItem
              label="실행 명령어"
              menu="cron"
              input={
                <input
                  type="text"
                  value={newCommand}
                  onChange={(e) => setNewCommand(e.target.value)}
                  placeholder="/usr/bin/python3 /home/user/backup.py"
                  style={styles.input}
                />
              }
              hint="실행할 스크립트나 명령어의 절대 경로를 입력하세요."
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button onClick={handleAdd} style={styles.button}>
                + 스케줄 등록
              </button>
            </div>
          </div>
        </section>

        {/* 3. 현재 작업 목록 카드 */}
        <section style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <h3 style={styles.cardTitle}>등록된 CRON 작업 ({jobs.length})</h3>
          {loading ? (
            <div style={styles.loadingText}>데이터를 불러오는 중...</div>
          ) : jobs.length === 0 ? (
            <div style={styles.emptyState}>등록된 작업이 없습니다.</div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>스케줄 (Schedule)</th>
                    <th style={styles.th}>명령어 (Command)</th>
                    <th style={{...styles.th, textAlign: 'right'}}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, index) => {
                    const parts = job.schedule ? job.schedule.split(/\s+/, 6) : [];
                    const scheduleStr = parts.length >= 5 ? parts.slice(0, 5).join(" ") : "";
                    const commandStr = parts.length >= 6 ? parts.slice(5).join(" ") : job.schedule || "";
                    
                    return (
                      <tr key={index} style={styles.tr}>
                        <td style={styles.td}>
                          <span style={styles.cronTag}>{scheduleStr}</span>
                        </td>
                        <td style={{...styles.td, color: '#ddd'}}>{commandStr}</td>
                        <td style={{...styles.td, textAlign: 'right'}}>
                          <button
                            onClick={() => handleDelete(index)}
                            style={styles.deleteButton}
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ==========================================
// Styles Object (Settings 컴포넌트와 통일)
// ==========================================
const styles = {
  pageContainer: {
    padding: "2rem max(2rem, 5vw)",
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    minHeight: "100vh",
    color: "var(--text-primary, #ffffff)",
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  },
  header: {
    marginBottom: "2.5rem",
    borderBottom: "1px solid var(--border-color, #444)",
    paddingBottom: "1.5rem"
  },
  pageTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    color: "var(--text-primary, #ffffff)"
  },
  pageSubtitle: {
    color: "var(--text-secondary, #aaaaaa)",
    fontSize: "0.95rem"
  },
  messageBox: {
    padding: "1rem",
    marginBottom: "2rem",
    borderRadius: "8px",
    border: "1px solid",
    fontWeight: "500",
    animation: "slideDown 0.3s ease-out"
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem"
  },
  card: {
    backgroundColor: "var(--bg-secondary, #2b2d31)",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid var(--border-color, #444)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#5a9fd1",
    marginBottom: "1.5rem",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid var(--border-color, #444)"
  },
  input: {
    width: "95%",
    padding: "0.75rem",
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    border: "1px solid #555",
    borderRadius: "6px",
    color: "var(--text-primary, #fff)",
    fontSize: "0.9rem",
    outline: "none",
  },
  button: {
    padding: "0.85rem 1.5rem",
    backgroundColor: "#5865f2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  refreshButton: {
    marginTop: '1.5rem', // SettingItem의 label 높이 보정
    padding: "0.75rem 1rem",
  },
  
  // Schedule Specific Styles
  scheduleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
    marginBottom: "1.5rem"
  },
  scheduleItem: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #444"
  },
  scheduleLabel: {
    display: "block",
    marginBottom: "0.8rem",
    fontWeight: "600",
    color: "#ddd",
    fontSize: "0.9rem"
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    fontSize: "0.9rem",
    color: "#ccc"
  },
  smallInput: {
    width: "60px",
    padding: "0.3rem",
    backgroundColor: "#1e1e1e",
    border: "1px solid #555",
    borderRadius: "4px",
    color: "white",
    marginLeft: "1.5rem",
    fontSize: "0.85rem"
  },
  weekdayContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "0.5rem"
  },
  weekdayChip: {
    padding: "0.4rem 0.8rem",
    border: "1px solid #444",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s",
    userSelect: "none"
  },
  previewBox: {
    backgroundColor: "#1e1e1e",
    padding: "1rem",
    borderRadius: "6px",
    border: "1px solid #444",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    fontFamily: "monospace"
  },
  cronExpression: {
    color: "#4ade80",
    fontWeight: "bold",
    fontSize: "1.1rem"
  },
  
  // List & Table Styles
  emptyState: {
    padding: "3rem",
    textAlign: "center",
    color: "#666",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: "8px",
    border: "1px dashed #444"
  },
  loadingText: {
    textAlign: "center", 
    padding: "2rem", 
    color: "#aaa"
  },
  // ... 기존 스타일 아래에 추가 ...

  // 1. 제어 패널용 전용 스타일 (글자 잘림 해결 & 크기 확대)
  controlPanelRow: {
    display: 'flex',
    alignItems: 'flex-end', // 버튼과 입력창 바닥 라인 맞춤
    gap: '1rem',
    flexWrap: 'wrap', // 화면이 너무 좁으면 버튼이 아래로 내려가도록
  },
  inputGroup: {
    flex: 1, // 남은 공간을 입력창이 다 차지하도록
    minWidth: '250px', // 최소 너비 보장
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem', // 라벨과 입력창 사이 간격
  },
  customLabel: {
    fontSize: '1rem', // 글자 크기 키움
    fontWeight: '600',
    color: '#ddd',
    whiteSpace: 'nowrap', // ★ 핵심: 글자가 절대 줄바꿈되지 않음
  },
  largeInput: {
    width: '90%',
    padding: '0.9rem 1rem', // 패딩을 늘려 입력창을 통통하게 만듦
    backgroundColor: 'var(--bg-primary, #1e1e1e)',
    border: '1px solid #555',
    borderRadius: '6px',
    color: 'var(--text-primary, #fff)',
    fontSize: '1rem', // 입력 글자도 시원하게
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  largeButton: {
    padding: '0.9rem 2rem', // 버튼도 입력창 높이에 맞춰 키움
    backgroundColor: '#5865f2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    whiteSpace: 'nowrap', // 버튼 글자도 안 잘리게
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)', // 살짝 입체감 추가
  },
  tableContainer: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.95rem"
  },
  th: {
    textAlign: "left",
    padding: "1rem",
    color: "#aaa",
    fontWeight: "600",
    borderBottom: "1px solid #444",
    whiteSpace: "nowrap"
  },
  tr: {
    borderBottom: "1px solid #333",
    transition: "background-color 0.2s"
  },
  td: {
    padding: "1rem",
    verticalAlign: "middle"
  },
  cronTag: {
    display: "inline-block",
    padding: "0.2rem 0.6rem",
    backgroundColor: "rgba(90, 159, 209, 0.15)",
    color: "#5a9fd1",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "0.9rem"
  },
  deleteButton: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "transparent",
    color: "#ef4444",
    border: "1px solid #ef4444",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.8rem",
    transition: "all 0.2s"
  }
};