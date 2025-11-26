import React, { useState, useEffect } from "react";
import SettingItem from "../../components/SettingItem";
import ValidatedInput from "../../components/ValidatedInput";
import { apiFetch, safeJsonParse } from '../../utils/api';
import { commonStyles } from '../../utils/theme';

export default function DiskManagement() {
  const [disks, setDisks] = useState([]);
  const [partitions, setPartitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [selectedDisk, setSelectedDisk] = useState(null);
  
  // 새 파티션 생성 폼
  const [newPartition, setNewPartition] = useState({
    disk: "",
    size: "",
    sizeUnit: "G",
    partitionType: "primary",
    fileSystem: "ext4"
  });

  // 파티션 포맷 폼
  const [formatPartition, setFormatPartition] = useState({
    partition: "",
    fileSystem: "ext4",
    label: ""
  });

  // 마운트 폼
  const [mountPartition, setMountPartition] = useState({
    partition: "",
    mountPoint: ""
  });

  useEffect(() => {
    loadDisks();
    loadPartitions();
  }, []);

  const loadDisks = async () => {
    setLoading(true);
    try {
      const response = await apiFetch("/main/api/disks/list");
      if (response.ok) {
        const data = await safeJsonParse(response, []);
        console.log("디스크 목록 로드 성공:", data);
        const diskArray = Array.isArray(data) ? data : [];
        setDisks(diskArray);
        if (diskArray.length === 0) {
          console.warn("디스크 목록이 비어있습니다.");
        }
      } else {
        console.error("디스크 목록 API 응답 실패:", response.status, response.statusText);
        setDisks([]);
      }
    } catch (error) {
      console.error("디스크 목록 로드 실패:", error);
      setMessage("디스크 목록을 불러오는데 실패했습니다.");
      setMessageType("error");
      setDisks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPartitions = async () => {
    try {
      const response = await apiFetch("/main/api/partitions/list");
      if (response.ok) {
        const data = await safeJsonParse(response, []);
        setPartitions(Array.isArray(data) ? data : []);
      } else {
        console.error("파티션 목록 API 응답 실패:", response.status, response.statusText);
        setPartitions([]);
      }
    } catch (error) {
      console.error("파티션 목록 로드 실패:", error);
      setPartitions([]);
    }
  };

  const handleCreatePartition = async () => {
    if (!newPartition.disk || !newPartition.size) {
      setMessage("디스크와 크기를 모두 입력해주세요.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await apiFetch("/main/api/partitions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newPartition)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("파티션이 생성되었습니다.");
        setMessageType("success");
        setNewPartition({
          disk: "",
          size: "",
          sizeUnit: "G",
          partitionType: "primary",
          fileSystem: "ext4"
        });
        loadDisks();
        loadPartitions();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "파티션 생성에 실패했습니다.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("파티션 생성 실패:", error);
      setMessage("파티션 생성 중 오류가 발생했습니다.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePartition = async (partition) => {
    if (!window.confirm(`정말로 파티션 "${partition.device}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await apiFetch(`/main/api/partitions/${partition.device}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("파티션이 삭제되었습니다.");
        setMessageType("success");
        loadDisks();
        loadPartitions();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "파티션 삭제에 실패했습니다.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("파티션 삭제 실패:", error);
      setMessage("파티션 삭제 중 오류가 발생했습니다.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleFormatPartition = async () => {
    if (!formatPartition.partition || !formatPartition.fileSystem) {
      setMessage("파티션과 파일시스템을 선택해주세요.");
      setMessageType("error");
      return;
    }

    if (!window.confirm(`파티션 "${formatPartition.partition}"을(를) 포맷하시겠습니까? 모든 데이터가 삭제됩니다.`)) {
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await apiFetch("/main/api/partitions/format", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formatPartition)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("파티션이 포맷되었습니다.");
        setMessageType("success");
        setFormatPartition({
          partition: "",
          fileSystem: "ext4",
          label: ""
        });
        loadPartitions();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "파티션 포맷에 실패했습니다.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("파티션 포맷 실패:", error);
      setMessage("파티션 포맷 중 오류가 발생했습니다.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleMountPartition = async () => {
    if (!mountPartition.partition || !mountPartition.mountPoint) {
      setMessage("파티션과 마운트 위치를 입력해주세요.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await apiFetch("/main/api/partitions/mount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(mountPartition)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("파티션이 마운트되었습니다.");
        setMessageType("success");
        setMountPartition({
          partition: "",
          mountPoint: ""
        });
        loadPartitions();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "파티션 마운트에 실패했습니다.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("파티션 마운트 실패:", error);
      setMessage("파티션 마운트 중 오류가 발생했습니다.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleUnmountPartition = async (partition) => {
    if (!window.confirm(`파티션 "${partition.device}"을(를) 언마운트하시겠습니까?`)) {
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await apiFetch(`/main/api/partitions/${partition.device}/unmount`, {
        method: "POST"
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("파티션이 언마운트되었습니다.");
        setMessageType("success");
        loadPartitions();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "파티션 언마운트에 실패했습니다.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("파티션 언마운트 실패:", error);
      setMessage("파티션 언마운트 중 오류가 발생했습니다.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const getDiskPartitions = (diskDevice) => {
    return partitions.filter(p => p.disk === diskDevice);
  };

  const handleResetDisks = () => {
    if (window.confirm("디스크 목록을 초기화하시겠습니까? 기본 디스크 목록으로 재설정됩니다.")) {
      localStorage.removeItem('mock_disks');
      loadDisks();
      setMessage("디스크 목록이 초기화되었습니다.");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>디스크 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 style={styles.pageTitle}>디스크 및 파티션 관리</h2>
          {(!disks || disks.length === 0) && (
            <button
              onClick={handleResetDisks}
              style={{
                ...commonStyles.button.secondary,
                padding: "0.5rem 1rem",
                fontSize: "0.85rem",
                backgroundColor: "#4b5563",
                border: "none",
                color: "white"
              }}
            >
              디스크 목록 초기화
            </button>
          )}
        </div>
        <p style={styles.pageSubtitle}>서버의 물리적 디스크를 확인하고 파티션을 생성, 포맷, 마운트합니다.</p>
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
        {/* 디스크 목록 (Full Width) */}
        <section style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <h3 style={styles.cardTitle}>디스크 목록</h3>
          {!Array.isArray(disks) || disks.length === 0 ? (
            <div style={styles.emptyState}>디스크가 없습니다.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {disks.map((disk, index) => {
                const diskPartitions = getDiskPartitions(disk.device);
                return (
                  <div key={index} style={styles.listItem}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "1.1rem", marginBottom: "0.25rem", color: "#fff" }}>
                          {disk.device}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                          크기: {disk.size || "N/A"} | 모델: {disk.model || "N/A"} | 인터페이스: {disk.interface || "N/A"} | 파티션: {diskPartitions.length}개
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedDisk(selectedDisk === disk.device ? null : disk.device)}
                        style={styles.actionButton}
                      >
                        {selectedDisk === disk.device ? "접기" : "상세보기"}
                      </button>
                    </div>
                    
                    {selectedDisk === disk.device && (
                      <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #444" }}>
                        <h4 style={styles.subTitle}>파티션 목록</h4>
                        {diskPartitions.length === 0 ? (
                          <p style={{ color: "#888", fontSize: "0.85rem", fontStyle: "italic" }}>파티션이 없습니다.</p>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {diskPartitions.map((part, partIndex) => (
                              <div
                                key={partIndex}
                                style={{
                                  padding: "0.75rem",
                                  backgroundColor: "rgba(0,0,0,0.2)",
                                  borderRadius: "4px",
                                  border: "1px solid #555"
                                }}
                              >
                                <div style={{ fontWeight: "500", marginBottom: "0.25rem", color: "#ddd" }}>{part.device}</div>
                                <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                                  크기: {part.size || "N/A"} | 파일시스템: {part.fileSystem || "N/A"} | 
                                  마운트: <span style={{ color: part.mountPoint ? "#6ee7b7" : "#aaa" }}>{part.mountPoint || "마운트 안됨"}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 파티션 목록 (Full Width) */}
        <section style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <h3 style={styles.cardTitle}>전체 파티션 목록</h3>
          {!Array.isArray(partitions) || partitions.length === 0 ? (
            <div style={styles.emptyState}>생성된 파티션이 없습니다.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {partitions.map((partition, index) => (
                <div key={index} style={styles.listItem}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div>
                      <div style={{ fontWeight: "500", marginBottom: "0.25rem", color: "#fff" }}>{partition.device}</div>
                      <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                        디스크: {partition.disk || "N/A"} | 크기: {partition.size || "N/A"} | 
                        파일시스템: {partition.fileSystem || "N/A"} | 
                        마운트: <span style={{ color: partition.mountPoint ? "#6ee7b7" : "#aaa" }}>{partition.mountPoint || "마운트 안됨"}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {partition.mountPoint ? (
                        <button
                          onClick={() => handleUnmountPartition(partition)}
                          disabled={saving}
                          style={{ ...styles.dangerButton, opacity: saving ? 0.5 : 1, backgroundColor: "#4b5563", borderColor: "#6b7280" }}
                        >
                          언마운트
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleDeletePartition(partition)}
                        disabled={saving}
                        style={{ ...styles.dangerButton, opacity: saving ? 0.5 : 1 }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 새 파티션 생성 */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>새 파티션 생성</h3>
          
          <SettingItem
            label="디스크 선택"
            menu="system"
            input={
              <select
                value={newPartition.disk}
                onChange={(e) => setNewPartition({ ...newPartition, disk: e.target.value })}
                style={styles.select}
              >
                <option value="">디스크 선택</option>
                {disks.map((disk, index) => (
                  <option key={index} value={disk.device}>
                    {disk.device}
                  </option>
                ))}
              </select>
            }
            hint="파티션을 생성할 디스크를 선택합니다."
          />

          <SettingItem
            label="파티션 크기"
            menu="system"
            input={
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="number"
                  value={newPartition.size}
                  onChange={(e) => setNewPartition({ ...newPartition, size: e.target.value })}
                  min="1"
                  step="0.1"
                  style={{ ...styles.input, flex: 1 }}
                  placeholder="10"
                />
                <select
                  value={newPartition.sizeUnit}
                  onChange={(e) => setNewPartition({ ...newPartition, sizeUnit: e.target.value })}
                  style={{ ...styles.select, width: "80px" }}
                >
                  <option value="M">MB</option>
                  <option value="G">GB</option>
                  <option value="T">TB</option>
                </select>
              </div>
            }
            hint="파티션의 크기를 지정합니다."
          />

          <SettingItem
            label="파티션 타입"
            menu="system"
            input={
              <select
                value={newPartition.partitionType}
                onChange={(e) => setNewPartition({ ...newPartition, partitionType: e.target.value })}
                style={styles.select}
              >
                <option value="primary">Primary (주 파티션)</option>
                <option value="extended">Extended (확장 파티션)</option>
                <option value="logical">Logical (논리 파티션)</option>
              </select>
            }
            hint="파티션 타입을 선택합니다."
          />

          <SettingItem
            label="파일시스템"
            menu="system"
            input={
              <select
                value={newPartition.fileSystem}
                onChange={(e) => setNewPartition({ ...newPartition, fileSystem: e.target.value })}
                style={styles.select}
              >
                <option value="ext4">ext4 (Linux 기본)</option>
                <option value="ext3">ext3</option>
                <option value="xfs">XFS</option>
                <option value="btrfs">Btrfs</option>
                <option value="ntfs">NTFS (Windows)</option>
                <option value="fat32">FAT32</option>
              </select>
            }
            hint="파티션에 사용할 파일시스템을 선택합니다."
          />

          <button
            onClick={handleCreatePartition}
            disabled={saving || !newPartition.disk || !newPartition.size}
            style={{
              ...styles.primaryButton,
              opacity: (saving || !newPartition.disk || !newPartition.size) ? 0.5 : 1,
              marginTop: "1.5rem",
              width: "100%"
            }}
          >
            {saving ? "생성 중..." : "파티션 생성"}
          </button>
        </section>

        {/* 파티션 포맷 & 마운트 그룹 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
          {/* 파티션 포맷 */}
          {partitions.length > 0 && (
            <section style={styles.card}>
              <h3 style={styles.cardTitle}>파티션 포맷</h3>
              <p style={{ fontSize: "0.85rem", color: "#fca5a5", marginBottom: "1rem", backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                ⚠️ 파티션을 포맷하면 모든 데이터가 삭제됩니다.
              </p>
              
              <SettingItem
                label="파티션 선택"
                menu="system"
                input={
                  <select
                    value={formatPartition.partition}
                    onChange={(e) => setFormatPartition({ ...formatPartition, partition: e.target.value })}
                    style={styles.select}
                  >
                    <option value="">파티션 선택</option>
                    {partitions.map((partition, index) => (
                      <option key={index} value={partition.device}>
                        {partition.device}
                      </option>
                    ))}
                  </select>
                }
                hint="포맷할 파티션을 선택합니다."
              />

              <SettingItem
                label="파일시스템"
                menu="system"
                input={
                  <select
                    value={formatPartition.fileSystem}
                    onChange={(e) => setFormatPartition({ ...formatPartition, fileSystem: e.target.value })}
                    style={styles.select}
                  >
                    <option value="ext4">ext4 (Linux 기본)</option>
                    <option value="ext3">ext3</option>
                    <option value="xfs">XFS</option>
                    <option value="btrfs">Btrfs</option>
                    <option value="ntfs">NTFS (Windows)</option>
                    <option value="fat32">FAT32</option>
                  </select>
                }
                hint="포맷에 사용할 파일시스템을 선택합니다."
              />

              <SettingItem
                label="레이블 (선택)"
                menu="system"
                input={
                  <ValidatedInput
                    type="text"
                    value={formatPartition.label}
                    onChange={(e) => setFormatPartition({ ...formatPartition, label: e.target.value })}
                    style={styles.input}
                    placeholder="MyDisk"
                  />
                }
                hint="파티션 레이블을 지정합니다."
              />

              <button
                onClick={handleFormatPartition}
                disabled={saving || !formatPartition.partition || !formatPartition.fileSystem}
                style={{
                  ...styles.dangerButton,
                  opacity: (saving || !formatPartition.partition || !formatPartition.fileSystem) ? 0.5 : 1,
                  marginTop: "1rem",
                  width: "100%",
                  textAlign: 'center'
                }}
              >
                {saving ? "포맷 중..." : "파티션 포맷"}
              </button>
            </section>
          )}

          {/* 파티션 마운트 */}
          {partitions.filter(p => !p.mountPoint).length > 0 && (
            <section style={styles.card}>
              <h3 style={styles.cardTitle}>파티션 마운트</h3>
              
              <SettingItem
                label="파티션 선택"
                menu="system"
                input={
                  <select
                    value={mountPartition.partition}
                    onChange={(e) => setMountPartition({ ...mountPartition, partition: e.target.value })}
                    style={styles.select}
                  >
                    <option value="">파티션 선택</option>
                    {partitions
                      .filter(p => !p.mountPoint)
                      .map((partition, index) => (
                        <option key={index} value={partition.device}>
                          {partition.device}
                        </option>
                      ))}
                  </select>
                }
                hint="마운트할 파티션을 선택합니다."
              />

              <SettingItem
                label="마운트 위치"
                menu="system"
                input={
                  <ValidatedInput
                    type="text"
                    value={mountPartition.mountPoint}
                    onChange={(e) => setMountPartition({ ...mountPartition, mountPoint: e.target.value })}
                    validator={(val) => {
                      if (!val || val.trim() === "") {
                        return { valid: false, error: "마운트 위치를 입력해주세요." };
                      }
                      if (!val.startsWith("/")) {
                        return { valid: false, error: "마운트 위치는 절대 경로여야 합니다." };
                      }
                      return { valid: true, error: null };
                    }}
                    style={styles.input}
                    placeholder="/mnt/data"
                  />
                }
                hint="절대 경로 (예: /mnt/data)"
              />

              <button
                onClick={handleMountPartition}
                disabled={saving || !mountPartition.partition || !mountPartition.mountPoint}
                style={{
                  ...styles.primaryButton,
                  opacity: (saving || !mountPartition.partition || !mountPartition.mountPoint) ? 0.5 : 1,
                  marginTop: "1rem",
                  width: "100%"
                }}
              >
                {saving ? "마운트 중..." : "파티션 마운트"}
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Styles Object (CSS in JS) - Adapted from Settings.js
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
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", // Slightly wider for disk forms
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
    marginBottom: "0.75rem"
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
  actionButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#5865f2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "500",
    transition: "background-color 0.2s"
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
  }
};