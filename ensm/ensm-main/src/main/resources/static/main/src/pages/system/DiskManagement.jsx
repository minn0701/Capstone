// 디스크 및 파티션 관리 페이지
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

  const sectionStyle = {
    backgroundColor: "#2b2d31",
    padding: "1.5rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    border: "1px solid #444"
  };

  const inputStyle = {
    ...commonStyles.input,
    width: "100%"
  };

  const getDiskPartitions = (diskDevice) => {
    return partitions.filter(p => p.disk === diskDevice);
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: "white", textAlign: "center" }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  const handleResetDisks = () => {
    if (window.confirm("디스크 목록을 초기화하시겠습니까? 기본 디스크 목록으로 재설정됩니다.")) {
      localStorage.removeItem('mock_disks');
      loadDisks();
      setMessage("디스크 목록이 초기화되었습니다.");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", margin: 0 }}>💾 디스크 및 파티션 관리</h2>
        {(!disks || disks.length === 0) && (
          <button
            onClick={handleResetDisks}
            style={{
              ...commonStyles.button.secondary,
              padding: "0.5rem 1rem",
              fontSize: "0.85rem"
            }}
          >
            디스크 목록 초기화
          </button>
        )}
      </div>

      {message && (
        <div style={commonStyles.message[messageType] || commonStyles.message.success}>
          {message}
        </div>
      )}

      {/* 디스크 목록 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>🖥️ 디스크 목록</h3>
        {!Array.isArray(disks) || disks.length === 0 ? (
          <p style={{ color: "#888", fontSize: "0.9rem" }}>디스크가 없습니다.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {disks.map((disk, index) => {
              const diskPartitions = getDiskPartitions(disk.device);
              return (
                <div
                  key={index}
                  style={{
                    padding: "1rem",
                    backgroundColor: "#1e1e1e",
                    borderRadius: "4px",
                    border: "1px solid #444"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div>
                    <div style={{ fontWeight: "500", fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                      {disk.device}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                      크기: {disk.size || "N/A"} | 모델: {disk.model || "N/A"} | 인터페이스: {disk.interface || "N/A"} | 파티션: {diskPartitions.length}개
                    </div>
                  </div>
                    <button
                      onClick={() => setSelectedDisk(selectedDisk === disk.device ? null : disk.device)}
                      style={{
                        ...commonStyles.button.primary,
                        padding: "0.5rem 1rem",
                        fontSize: "0.85rem"
                      }}
                    >
                      {selectedDisk === disk.device ? "접기" : "상세보기"}
                    </button>
                  </div>
                  
                  {selectedDisk === disk.device && (
                    <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #444" }}>
                      <h4 style={{ fontSize: "0.95rem", marginBottom: "0.5rem", color: "#ccc" }}>파티션 목록</h4>
                      {diskPartitions.length === 0 ? (
                        <p style={{ color: "#888", fontSize: "0.85rem" }}>파티션이 없습니다.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          {diskPartitions.map((part, partIndex) => (
                            <div
                              key={partIndex}
                              style={{
                                padding: "0.75rem",
                                backgroundColor: "#2b2d31",
                                borderRadius: "4px",
                                border: "1px solid #555"
                              }}
                            >
                              <div style={{ fontWeight: "500", marginBottom: "0.25rem" }}>{part.device}</div>
                              <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                                크기: {part.size || "N/A"} | 파일시스템: {part.fileSystem || "N/A"} | 
                                마운트: {part.mountPoint || "마운트 안됨"}
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
      </div>

      {/* 파티션 목록 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>📁 파티션 목록</h3>
        {!Array.isArray(partitions) || partitions.length === 0 ? (
          <p style={{ color: "#888", fontSize: "0.9rem" }}>생성된 파티션이 없습니다.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {partitions.map((partition, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem",
                  backgroundColor: "#1e1e1e",
                  borderRadius: "4px",
                  border: "1px solid #444"
                }}
              >
                <div>
                  <div style={{ fontWeight: "500", marginBottom: "0.25rem" }}>{partition.device}</div>
                  <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                    디스크: {partition.disk || "N/A"} | 크기: {partition.size || "N/A"} | 
                    파일시스템: {partition.fileSystem || "N/A"} | 
                    마운트: {partition.mountPoint || "마운트 안됨"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {partition.mountPoint ? (
                    <button
                      onClick={() => handleUnmountPartition(partition)}
                      disabled={saving}
                      style={{
                        ...commonStyles.button.secondary,
                        padding: "0.5rem 1rem",
                        fontSize: "0.85rem",
                        opacity: saving ? 0.5 : 1
                      }}
                    >
                      언마운트
                    </button>
                  ) : null}
                  <button
                    onClick={() => handleDeletePartition(partition)}
                    disabled={saving}
                    style={{
                      ...commonStyles.button.danger,
                      padding: "0.5rem 1rem",
                      fontSize: "0.85rem",
                      opacity: saving ? 0.5 : 1
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 새 파티션 생성 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>➕ 새 파티션 생성</h3>
        
        <SettingItem
          label="디스크 선택"
          menu="system"
          input={
            <select
              value={newPartition.disk}
              onChange={(e) => setNewPartition({ ...newPartition, disk: e.target.value })}
              style={inputStyle}
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
          description="디스크 선택"
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
                style={{ ...inputStyle, flex: 1 }}
                placeholder="10"
              />
              <select
                value={newPartition.sizeUnit}
                onChange={(e) => setNewPartition({ ...newPartition, sizeUnit: e.target.value })}
                style={{ ...inputStyle, width: "80px" }}
              >
                <option value="M">MB</option>
                <option value="G">GB</option>
                <option value="T">TB</option>
              </select>
            </div>
          }
          hint="파티션의 크기를 지정합니다."
          description="파티션 크기"
        />

        <SettingItem
          label="파티션 타입"
          menu="system"
          input={
            <select
              value={newPartition.partitionType}
              onChange={(e) => setNewPartition({ ...newPartition, partitionType: e.target.value })}
              style={inputStyle}
            >
              <option value="primary">Primary (주 파티션)</option>
              <option value="extended">Extended (확장 파티션)</option>
              <option value="logical">Logical (논리 파티션)</option>
            </select>
          }
          hint="파티션 타입을 선택합니다."
          description="파티션 타입"
        />

        <SettingItem
          label="파일시스템"
          menu="system"
          input={
            <select
              value={newPartition.fileSystem}
              onChange={(e) => setNewPartition({ ...newPartition, fileSystem: e.target.value })}
              style={inputStyle}
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
          description="파일시스템"
        />

        <button
          onClick={handleCreatePartition}
          disabled={saving || !newPartition.disk || !newPartition.size}
          style={{
            ...commonStyles.button.primary,
            opacity: (saving || !newPartition.disk || !newPartition.size) ? 0.5 : 1,
            marginTop: "1rem"
          }}
        >
          {saving ? "생성 중..." : "파티션 생성"}
        </button>
      </div>

      {/* 파티션 포맷 */}
      {partitions.length > 0 && (
        <div style={sectionStyle}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>🔧 파티션 포맷</h3>
          <p style={{ fontSize: "0.85rem", color: "#ffaa00", marginBottom: "1rem" }}>
            ⚠️ 파티션을 포맷하면 모든 데이터가 삭제됩니다. 반드시 백업 후 진행하세요.
          </p>
          
          <SettingItem
            label="파티션 선택"
            menu="system"
            input={
              <select
                value={formatPartition.partition}
                onChange={(e) => setFormatPartition({ ...formatPartition, partition: e.target.value })}
                style={inputStyle}
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
            description="파티션 선택"
          />

          <SettingItem
            label="파일시스템"
            menu="system"
            input={
              <select
                value={formatPartition.fileSystem}
                onChange={(e) => setFormatPartition({ ...formatPartition, fileSystem: e.target.value })}
                style={inputStyle}
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
            description="파일시스템"
          />

          <SettingItem
            label="레이블 (선택사항)"
            menu="system"
            input={
              <ValidatedInput
                type="text"
                value={formatPartition.label}
                onChange={(e) => setFormatPartition({ ...formatPartition, label: e.target.value })}
                style={inputStyle}
                placeholder="MyDisk"
              />
            }
            hint="파티션 레이블을 지정합니다. (선택사항)"
            description="레이블"
          />

          <button
            onClick={handleFormatPartition}
            disabled={saving || !formatPartition.partition || !formatPartition.fileSystem}
            style={{
              ...commonStyles.button.danger,
              opacity: (saving || !formatPartition.partition || !formatPartition.fileSystem) ? 0.5 : 1,
              marginTop: "1rem"
            }}
          >
            {saving ? "포맷 중..." : "파티션 포맷"}
          </button>
        </div>
      )}

      {/* 파티션 마운트 */}
      {partitions.filter(p => !p.mountPoint).length > 0 && (
        <div style={sectionStyle}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>📌 파티션 마운트</h3>
          
          <SettingItem
            label="파티션 선택"
            menu="system"
            input={
              <select
                value={mountPartition.partition}
                onChange={(e) => setMountPartition({ ...mountPartition, partition: e.target.value })}
                style={inputStyle}
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
            description="파티션 선택"
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
                    return { valid: false, error: "마운트 위치는 절대 경로여야 합니다. (예: /mnt/data)" };
                  }
                  return { valid: true, error: null };
                }}
                style={inputStyle}
                placeholder="/mnt/data"
              />
            }
            hint="파티션을 마운트할 디렉토리 경로를 지정합니다."
            description="마운트 위치"
          />

          <button
            onClick={handleMountPartition}
            disabled={saving || !mountPartition.partition || !mountPartition.mountPoint}
            style={{
              ...commonStyles.button.primary,
              opacity: (saving || !mountPartition.partition || !mountPartition.mountPoint) ? 0.5 : 1,
              marginTop: "1rem"
            }}
          >
            {saving ? "마운트 중..." : "파티션 마운트"}
          </button>
        </div>
      )}
    </div>
  );
}

