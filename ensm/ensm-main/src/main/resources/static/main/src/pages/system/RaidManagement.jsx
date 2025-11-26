// RAID 관리 페이지
import React, { useState, useEffect } from "react";
import SettingItem from "../../components/SettingItem";
import ToggleSwitch from "../../components/ToggleSwitch";
import ValidatedInput from "../../components/ValidatedInput";
import Checkbox from "../../components/Checkbox";
import { apiFetch } from '../../utils/api';
import { commonStyles } from '../../utils/theme';

export default function RaidManagement() {
  const [raids, setRaids] = useState([]);
  const [availableDisks, setAvailableDisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  
  // 새 RAID 생성 폼
  const [newRaid, setNewRaid] = useState({
    name: "",
    level: "1",
    devices: [],
    spare: 0,
    chunkSize: 512
  });

  useEffect(() => {
    loadRaids();
    loadAvailableDisks();
  }, []);

  const loadRaids = async () => {
    setLoading(true);
    try {
      const response = await apiFetch("/main/api/raid/list");
      if (response.ok) {
        const data = await response.json();
        // 배열인지 확인하고, 아니면 빈 배열로 설정
        setRaids(Array.isArray(data) ? data : []);
      } else {
        setRaids([]);
      }
    } catch (error) {
      console.error("RAID 목록 로드 실패:", error);
      setMessage("RAID 목록을 불러오는데 실패했습니다.");
      setMessageType("error");
      setRaids([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableDisks = async () => {
    try {
      const response = await apiFetch("/main/api/disks/available");
      if (response.ok) {
        const data = await response.json();
        setAvailableDisks(data);
      }
    } catch (error) {
      console.error("사용 가능한 디스크 로드 실패:", error);
    }
  };

  const handleCreateRaid = async () => {
    if (!newRaid.name || newRaid.devices.length < 2) {
      setMessage("RAID 이름과 최소 2개의 디스크를 선택해주세요.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await apiFetch("/main/api/raid/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newRaid)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("RAID가 생성되었습니다.");
        setMessageType("success");
        setNewRaid({
          name: "",
          level: "1",
          devices: [],
          spare: 0,
          chunkSize: 512
        });
        loadRaids();
        loadAvailableDisks();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "RAID 생성에 실패했습니다.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("RAID 생성 실패:", error);
      setMessage("RAID 생성 중 오류가 발생했습니다.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRaid = async (raidName) => {
    if (!window.confirm(`정말로 RAID "${raidName}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await apiFetch(`/main/api/raid/${raidName}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("RAID가 삭제되었습니다.");
        setMessageType("success");
        loadRaids();
        loadAvailableDisks();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "RAID 삭제에 실패했습니다.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("RAID 삭제 실패:", error);
      setMessage("RAID 삭제 중 오류가 발생했습니다.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const toggleDevice = (device) => {
    setNewRaid(prev => {
      const devices = prev.devices.includes(device)
        ? prev.devices.filter(d => d !== device)
        : [...prev.devices, device];
      return { ...prev, devices };
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>RAID 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>RAID 관리</h2>
        <p style={styles.pageSubtitle}>여러 디스크를 결합하여 성능을 높이거나 데이터 안정성을 확보합니다.</p>
      </header>

      {message && (
        <div style={{
          ...styles.messageBox,
          backgroundColor: messageType === "error" ? "rgba(220, 38, 38, 0.2)" : "rgba(16, 185, 129, 0.2)",
          borderColor: messageType === "error" ? "#ef4444" : "#10b981",
          color: messageType === "error" ? "#fca5a5" : "#6ee7b7",
        }}>
          {message}
        </div>
      )}

      <div style={styles.gridContainer}>
        {/* 기존 RAID 목록 */}
        <section style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <h3 style={styles.cardTitle}>기존 RAID 목록</h3>
          {!Array.isArray(raids) || raids.length === 0 ? (
            <div style={styles.emptyState}>생성된 RAID가 없습니다.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {raids.map((raid, index) => (
                <div key={index} style={styles.listItem}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                      <span style={{ fontWeight: "600", fontSize: "1.1rem", color: "#fff" }}>
                        {raid.name || `/dev/md${index}`}
                      </span>
                      <span style={{ 
                        fontSize: "0.75rem", 
                        padding: "0.1rem 0.5rem", 
                        borderRadius: "4px", 
                        backgroundColor: "#374151", 
                        color: "#60a5fa",
                        fontWeight: "600"
                      }}>
                        RAID {raid.level || "?"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                      디스크: {raid.devices?.length || 0}개 | 상태: <span style={{ color: raid.state === "clean" || raid.state === "active" ? "#6ee7b7" : "#fca5a5" }}>{raid.state || "N/A"}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteRaid(raid.name || `/dev/md${index}`)}
                    style={styles.dangerButton}
                    disabled={saving}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 새 RAID 생성 */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>새 RAID 생성</h3>
          
          <SettingItem
            label="RAID 이름"
            menu="system"
            input={
              <ValidatedInput
                type="text"
                value={newRaid.name}
                onChange={(e) => setNewRaid({ ...newRaid, name: e.target.value })}
                validator={(val) => {
                  if (!val || val.trim() === "") {
                    return { valid: false, error: "RAID 이름을 입력해주세요." };
                  }
                  if (!/^[a-zA-Z0-9_-]+$/.test(val)) {
                    return { valid: false, error: "영문, 숫자, -, _ 만 사용 가능합니다." };
                  }
                  return { valid: true, error: null };
                }}
                style={styles.input}
                placeholder="md0"
              />
            }
            hint="RAID 장치 이름을 지정합니다. (예: md0)"
          />

          <SettingItem
            label="RAID 레벨"
            menu="system"
            input={
              <select
                value={newRaid.level}
                onChange={(e) => setNewRaid({ ...newRaid, level: e.target.value })}
                style={styles.select}
              >
                <option value="0">RAID 0 (스트라이핑)</option>
                <option value="1">RAID 1 (미러링)</option>
                <option value="5">RAID 5 (패리티)</option>
                <option value="6">RAID 6 (이중 패리티)</option>
                <option value="10">RAID 10 (1+0)</option>
              </select>
            }
            hint="RAID 레벨을 선택합니다."
          />

          <SettingItem
            label="사용할 디스크"
            menu="system"
            input={
              <div style={styles.diskSelectionBox}>
                {availableDisks.length === 0 ? (
                  <p style={{ color: "#888", fontSize: "0.9rem", textAlign: "center", padding: "1rem" }}>사용 가능한 디스크가 없습니다.</p>
                ) : (
                  availableDisks.map((disk, index) => (
                    <div key={index} style={{ marginBottom: "0.5rem" }}>
                        <Checkbox
                        checked={newRaid.devices.includes(disk.device)}
                        onChange={(checked) => {
                            if (checked) {
                            toggleDevice(disk.device);
                            } else {
                            setNewRaid(prev => ({
                                ...prev,
                                devices: prev.devices.filter(d => d !== disk.device)
                            }));
                            }
                        }}
                        label={disk.device}
                        />
                    </div>
                  ))
                )}
              </div>
            }
            hint="최소 2개 이상의 디스크를 선택하세요."
          />

          {/* 수정된 부분: 가로 배치를 제거하고 세로로 배치하여 글씨 깨짐 방지 */}
          <SettingItem
            label="스페어 디스크"
            menu="system"
            input={
                <input
                type="number"
                value={newRaid.spare}
                onChange={(e) => setNewRaid({ ...newRaid, spare: parseInt(e.target.value) || 0 })}
                min="0"
                style={styles.input}
                />
            }
            hint="장애 발생 시 자동으로 교체될 예비 디스크 개수입니다."
          />
        
          <SettingItem
            label="청크 크기 (KB)"
            menu="system"
            input={
                <input
                type="number"
                value={newRaid.chunkSize}
                onChange={(e) => setNewRaid({ ...newRaid, chunkSize: parseInt(e.target.value) || 512 })}
                min="4"
                max="1024"
                step="4"
                style={styles.input}
                />
            }
            hint="데이터 블록 크기입니다. (기본값: 512)"
          />

          <button
            onClick={handleCreateRaid}
            disabled={saving || !newRaid.name || newRaid.devices.length < 2}
            style={{
              ...styles.primaryButton,
              opacity: (saving || !newRaid.name || newRaid.devices.length < 2) ? 0.5 : 1,
              marginTop: "1.5rem",
              width: "100%"
            }}
          >
            {saving ? "생성 중..." : "RAID 생성"}
          </button>
        </section>
      </div>
    </div>
  );
}

// ==========================================
// Styles Object (CSS in JS) - Consistent Theme
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
    gap: "1rem"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(255,255,255,0.1)",
    borderLeftColor: "#5a9fd1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
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
    color: "var(--text-primary, #ffffff)",
    margin: 0
  },
  pageSubtitle: {
    color: "var(--text-secondary, #aaaaaa)",
    fontSize: "0.95rem",
    marginTop: "0.5rem"
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
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
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
    cursor: "pointer"
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    borderRadius: "8px",
    border: "1px solid #444",
    transition: "background-color 0.2s",
  },
  emptyState: {
    padding: "2rem",
    textAlign: "center",
    color: "#666",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: "8px",
    border: "1px dashed #444"
  },
  dangerButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "transparent",
    color: "#ef4444",
    border: "1px solid #ef4444",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "500",
    transition: "all 0.2s"
  },
  primaryButton: {
    padding: "0.85rem",
    backgroundColor: "#5865f2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  diskSelectionBox: {
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    border: "1px solid #555",
    borderRadius: "6px",
    padding: "1rem",
    maxHeight: "200px",
    overflowY: "auto"
  }
};