import React, { useState, useEffect } from "react";
import SettingItem from "../../components/SettingItem";
import ToggleSwitch from "../../components/ToggleSwitch";
import { apiFetch, safeJsonParse } from '../../utils/api';
import { commonStyles } from '../../utils/theme';

export default function Settings() {
  const STORAGE_KEY = "ensm_settings";

  const [config, setConfig] = useState({
    systemName: "",
    darkMode: true,
    autoRefresh: false,
    refreshInterval: 30,
    notifications: true,
    lokiLogLevel: "error"
  });
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ==========================================
  // Logic Section (기존 로직 유지)
  // ==========================================

  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.error("localStorage에서 설정 로드 실패:", error);
    }
    return null;
  };

  const saveToStorage = (configData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configData));
    } catch (error) {
      console.error("localStorage에 설정 저장 실패:", error);
    }
  };

  const applyDarkMode = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg-primary', '#1e1e1e');
      root.style.setProperty('--bg-secondary', '#2b2d31');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#aaaaaa');
      root.style.setProperty('--border-color', '#444444');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f5f5f5');
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', '#666666');
      root.style.setProperty('--border-color', '#dddddd');
    }
    document.body.style.backgroundColor = isDark ? '#1e1e1e' : '#ffffff';
    document.body.style.color = isDark ? '#ffffff' : '#000000';
  };

  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      setConfig(saved);
      if (saved.darkMode !== undefined) applyDarkMode(saved.darkMode);
    }
    loadConfig();
    loadUsers();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveToStorage(config);
      if (config.darkMode !== undefined) applyDarkMode(config.darkMode);
    }
  }, [config, loading]);

  const loadConfig = async () => {
    try {
      const response = await apiFetch("/main/api/system-config");
      if (response.ok) {
        const data = await safeJsonParse(response, {});
        const saved = loadFromStorage();
        setConfig({ ...config, ...saved, ...data });
      } else {
        console.error("설정 로드 API 응답 실패:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("설정 로드 실패:", error);
      const saved = loadFromStorage();
      if (saved) setConfig(saved);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await apiFetch("/auth/users");
      if (response.ok) {
        const data = await safeJsonParse(response, []);
        setUsers(Array.isArray(data) ? data : []);
      } else {
        console.error("사용자 목록 로드 API 응답 실패:", response.status, response.statusText);
        setUsers([]);
      }
    } catch (error) {
      console.error("사용자 목록 로드 실패:", error);
    }
  };

  const handleAddUser = async () => {
    if (!newUsername || !newPassword) {
      setMessage("사용자명과 비밀번호를 입력해주세요.");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    try {
      const response = await apiFetch("/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: newUsername, password: newPassword })
      });

      const data = await safeJsonParse(response, {});

      if (response.ok) {
        setMessage("사용자가 추가되었습니다.");
        setNewUsername("");
        setNewPassword("");
        loadUsers();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "사용자 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("사용자 추가 실패:", error);
      setMessage("사용자 추가 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteUser = async (username) => {
    if (!window.confirm(`정말로 사용자 "${username}"을(를) 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await apiFetch(`/auth/users/${username}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await safeJsonParse(response, {});

      if (response.ok) {
        setMessage("사용자가 삭제되었습니다.");
        loadUsers();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "사용자 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("사용자 삭제 실패:", error);
      setMessage("사용자 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    saveToStorage(config);

    try {
      const response = await apiFetch("/main/api/system-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      const data = await safeJsonParse(response, {});

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
        <h2 style={styles.pageTitle}>ENSM 환경 설정</h2>
        <p style={styles.pageSubtitle}>시스템 전반의 동작 방식과 사용자 계정을 관리합니다.</p>
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
        {/* 시스템 설정 */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>시스템 설정</h3>
          <SettingItem
            label="시스템 이름"
            menu="ensm"
            input={
              <input
                type="text"
                style={styles.input}
                value={config.systemName}
                onChange={(e) => setConfig({ ...config, systemName: e.target.value })}
                placeholder="ENSM"
              />
            }
            hint="대시보드에 표시될 시스템 이름을 지정합니다."
          />
        </section>

        {/* UI 설정 */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>UI 설정</h3>
          <SettingItem
            label="다크 모드"
            menu="ensm"
            input={
              <ToggleSwitch
                checked={config.darkMode}
                onChange={async (checked) => {
                  const newConfig = { ...config, darkMode: checked };
                  setConfig(newConfig);
                  applyDarkMode(checked);
                  try {
                    saveToStorage(newConfig);
                    await apiFetch("/main/api/system-config", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(newConfig)
                    });
                  } catch (error) {
                    console.error("다크모드 설정 저장 실패:", error);
                  }
                }}
              />
            }
            hint="어두운 테마를 적용하여 눈의 피로를 줄입니다."
          />
        </section>

        {/* 모니터링 설정 */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>모니터링 설정</h3>
          <SettingItem
            label="Loki 로그 레벨"
            menu="ensm"
            input={
              <select
                style={styles.select}
                value={config.lokiLogLevel || "error"}
                onChange={(e) => setConfig({ ...config, lokiLogLevel: e.target.value })}
              >
                <option value="debug">Debug (모든 로그)</option>
                <option value="info">Info (정보 이상)</option>
                <option value="warn">Warn (경고 이상)</option>
                <option value="error">Error (오류만)</option>
              </select>
            }
            hint="수집할 로그의 최소 레벨을 설정합니다."
          />
        </section>

        {/* 알림 및 새로고침 */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>알림 및 데이터 갱신</h3>
          <SettingItem
            label="시스템 알림"
            menu="ensm"
            input={
              <ToggleSwitch
                checked={config.notifications}
                onChange={(checked) => setConfig({ ...config, notifications: checked })}
              />
            }
            hint="주요 이벤트 발생 시 알림을 받습니다."
          />

          <div style={{ marginTop: '1rem' }}>
            <SettingItem
              label="자동 새로고침"
              menu="ensm"
              input={
                <ToggleSwitch
                  checked={config.autoRefresh}
                  onChange={(checked) => setConfig({ ...config, autoRefresh: checked })}
                />
              }
              hint="대시보드 데이터를 주기적으로 갱신합니다."
            />
          </div>

          {config.autoRefresh && (
            <div style={{ marginTop: '1rem', animation: 'fadeIn 0.3s ease-in-out' }}>
              <SettingItem
                label="새로고침 주기(초)"
                menu="ensm"
                input={
                  <input
                    type="number"
                    style={styles.input}
                    value={config.refreshInterval}
                    onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) || 30 })}
                    min="5"
                    max="300"
                  />
                }
                hint="5초에서 300초 사이로 설정해주세요."
              />
            </div>
          )}
        </section>

        {/* 사용자 관리 (디자인 대폭 개선) */}
        <section style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <h3 style={styles.cardTitle}>사용자 관리</h3>

          <div style={styles.userSectionGrid}>
            {/* 왼쪽: 사용자 목록 */}
            <div style={styles.userListContainer}>
              <h4 style={styles.subTitle}>등록된 사용자 ({users.length})</h4>
              {users.length === 0 ? (
                <div style={styles.emptyState}>등록된 사용자가 없습니다.</div>
              ) : (
                <ul style={styles.userList}>
                  {users.map((user, index) => (
                    <li key={index} style={styles.userItem}>
                      <div style={styles.userInfo}>
                        <div style={styles.userIcon}>👤</div>
                        <span style={styles.userName}>{user.username}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        style={styles.deleteButton}
                        title="사용자 삭제"
                      >
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 오른쪽: 사용자 추가 폼 */}
            <div style={styles.addUserContainer}>
              <h4 style={styles.subTitle}>새 사용자 추가</h4>
              <div style={styles.addUserForm}>
                <input
                  type="text"
                  style={styles.input}
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="아이디"
                />
                <input
                  type="password"
                  style={styles.input}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="비밀번호 (6자 이상)"
                />
                <button
                  onClick={handleAddUser}
                  style={styles.addButton}
                >
                  + 사용자 등록
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div style={styles.footerAction}>
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
// Styles Object (CSS in JS)
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    color: "#ccc",
    gap: "rem"
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  subTitle: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "var(--text-secondary, #ccc)",
    marginBottom: "1rem"
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
    transition: "border-color 0.2s",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    border: "1px solid #555",
    borderRadius: "6px",
    color: "var(--text-primary, #fff)",
    fontSize: "0.9rem",
    outline: "none",
  },

  // 사용자 관리 섹션 스타일
  userSectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem"
  },
  userListContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  userList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  userItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1rem",
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    borderRadius: "8px",
    border: "1px solid #444",
    transition: "transform 0.1s",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem"
  },
  userIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#374151",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem"
  },
  userName: {
    fontWeight: "500"
  },
  emptyState: {
    padding: "2rem",
    textAlign: "center",
    color: "#666",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: "8px",
    border: "1px dashed #444"
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
  },
  addUserContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: "1.5rem",
    borderRadius: "8px",
  },
  addUserForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  addButton: {
    padding: "0.85rem",
    backgroundColor: "#5865f2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s",
    marginTop: "0.5rem"
  },
  footerAction: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "2rem",
    paddingTop: "2rem",
    borderTop: "1px solid var(--border-color, #444)"
  },
  saveButton: {
    padding: "0.8rem 2.5rem",
    fontSize: "1rem",
    boxShadow: "0 4px 12px rgba(88, 101, 242, 0.3)"
  }
};