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

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: "white", textAlign: "center" }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>💾 RAID 관리</h2>

      {message && (
        <div style={commonStyles.message[messageType] || commonStyles.message.success}>
          {message}
        </div>
      )}

      {/* 기존 RAID 목록 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>📋 기존 RAID 목록</h3>
        {!Array.isArray(raids) || raids.length === 0 ? (
          <p style={{ color: "#888", fontSize: "0.9rem" }}>생성된 RAID가 없습니다.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {raids.map((raid, index) => (
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
                  <div style={{ fontWeight: "500", marginBottom: "0.25rem" }}>{raid.name || `/dev/md${index}`}</div>
                  <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                    레벨: {raid.level || "N/A"} | 디스크: {raid.devices?.length || 0}개 | 상태: {raid.state || "N/A"}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteRaid(raid.name || `/dev/md${index}`)}
                  style={{
                    ...commonStyles.button.danger,
                    padding: "0.5rem 1rem",
                    fontSize: "0.85rem"
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 새 RAID 생성 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>➕ 새 RAID 생성</h3>
        
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
                  return { valid: false, error: "RAID 이름은 영문, 숫자, 하이픈, 언더스코어만 사용할 수 있습니다." };
                }
                return { valid: true, error: null };
              }}
              style={inputStyle}
              placeholder="md0"
            />
          }
          hint="RAID 장치 이름을 지정합니다. (예: md0, md1)"
          description="RAID 이름"
        />

        <SettingItem
          label="RAID 레벨"
          menu="system"
          input={
            <select
              value={newRaid.level}
              onChange={(e) => setNewRaid({ ...newRaid, level: e.target.value })}
              style={inputStyle}
            >
              <option value="0">RAID 0 (스트라이핑, 성능 우선, 미러링 없음)</option>
              <option value="1">RAID 1 (미러링, 안정성 우선, 최소 2개 디스크)</option>
              <option value="5">RAID 5 (패리티, 최소 3개 디스크)</option>
              <option value="6">RAID 6 (이중 패리티, 최소 4개 디스크)</option>
              <option value="10">RAID 10 (1+0, 미러링+스트라이핑, 최소 4개 디스크)</option>
            </select>
          }
          hint="RAID 레벨을 선택합니다. 레벨에 따라 필요한 최소 디스크 수가 다릅니다."
          description="RAID 레벨"
        />

          <SettingItem
            label="사용할 디스크 선택"
            menu="system"
            input={
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "200px", overflowY: "auto" }}>
                {availableDisks.length === 0 ? (
                  <p style={{ color: "#888", fontSize: "0.9rem" }}>사용 가능한 디스크가 없습니다.</p>
                ) : (
                  availableDisks.map((disk, index) => (
                    <Checkbox
                      key={index}
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
                  ))
                )}
              </div>
            }
            hint="RAID에 사용할 디스크를 선택합니다. 최소 2개 이상 선택해야 합니다."
            description="디스크 선택"
          />

        <SettingItem
          label="스페어 디스크 수"
          menu="system"
          input={
            <input
              type="number"
              value={newRaid.spare}
              onChange={(e) => setNewRaid({ ...newRaid, spare: parseInt(e.target.value) || 0 })}
              min="0"
              style={inputStyle}
            />
          }
          hint="스페어(예비) 디스크 개수를 지정합니다. 디스크 장애 시 자동으로 교체됩니다."
          description="스페어 디스크"
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
              style={inputStyle}
            />
          }
          hint="RAID 0, 5, 6, 10에서 사용할 청크 크기를 지정합니다. (4-1024 KB)"
          description="청크 크기"
        />

        <button
          onClick={handleCreateRaid}
          disabled={saving || !newRaid.name || newRaid.devices.length < 2}
          style={{
            ...commonStyles.button.primary,
            opacity: (saving || !newRaid.name || newRaid.devices.length < 2) ? 0.5 : 1,
            marginTop: "1rem"
          }}
        >
          {saving ? "생성 중..." : "RAID 생성"}
        </button>
      </div>
    </div>
  );
}

