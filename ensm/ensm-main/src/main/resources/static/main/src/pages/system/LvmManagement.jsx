// LVM 관리 페이지
import React, { useState, useEffect } from "react";
import SettingItem from "../../components/SettingItem";
import ValidatedInput from "../../components/ValidatedInput";
import Checkbox from "../../components/Checkbox";
import { apiFetch } from '../../utils/api';
import { commonStyles } from '../../utils/theme';

export default function LvmManagement() {
  const [volumeGroups, setVolumeGroups] = useState([]);
  const [logicalVolumes, setLogicalVolumes] = useState([]);
  const [physicalVolumes, setPhysicalVolumes] = useState([]);
  const [availableDisks, setAvailableDisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  
  // 새 Volume Group 생성 폼
  const [newVG, setNewVG] = useState({
    name: "",
    physicalVolumes: []
  });

  // 새 Logical Volume 생성 폼
  const [newLV, setNewLV] = useState({
    name: "",
    volumeGroup: "",
    size: "",
    sizeUnit: "G",
    mountPoint: ""
  });

  // VG 확장 폼
  const [expandVG, setExpandVG] = useState({
    volumeGroup: "",
    physicalVolumes: []
  });

  // LV 확장 폼
  const [expandLV, setExpandLV] = useState({
    logicalVolume: "",
    size: "",
    sizeUnit: "G"
  });

  // LV 축소 폼
  const [shrinkLV, setShrinkLV] = useState({
    logicalVolume: "",
    size: "",
    sizeUnit: "G"
  });

  useEffect(() => {
    loadLvmInfo();
    loadAvailableDisks();
  }, []);

  const loadLvmInfo = async () => {
    setLoading(true);
    try {
      const [vgRes, lvRes, pvRes] = await Promise.all([
        apiFetch("/main/api/lvm/vg"),
        apiFetch("/main/api/lvm/lv"),
        apiFetch("/main/api/lvm/pv")
      ]);

      if (vgRes.ok) {
        const vgData = await vgRes.json();
        setVolumeGroups(vgData);
      }
      if (lvRes.ok) {
        const lvData = await lvRes.json();
        setLogicalVolumes(lvData);
      }
      if (pvRes.ok) {
        const pvData = await pvRes.json();
        setPhysicalVolumes(pvData);
      }
    } catch (error) {
      console.error("LVM 정보 로드 실패:", error);
      setMessage("LVM 정보를 불러오는데 실패했습니다.");
      setMessageType("error");
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

  const handleCreatePV = async (device) => {
    setSaving(true);
    setMessage("");
    try {
      const response = await apiFetch("/main/api/lvm/pv/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ device })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`물리 볼륨 ${device}가 생성되었습니다.`);
        setMessageType("success");
        loadLvmInfo();
        loadAvailableDisks();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "물리 볼륨 생성에 실패했습니다.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("물리 볼륨 생성 실패:", error);
      setMessage("물리 볼륨 생성 중 오류가 발생했습니다.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateVG = async () => {
    if (!newVG.name || newVG.physicalVolumes.length === 0) {
      setMessage("볼륨 그룹 이름과 최소 1개의 물리 볼륨을 선택해주세요.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await apiFetch("/main/api/lvm/vg/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newVG)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("볼륨 그룹이 생성되었습니다.");
        setMessageType("success");
        setNewVG({
          name: "",
          physicalVolumes: []
        });
        loadLvmInfo();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "볼륨 그룹 생성에 실패했습니다.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("볼륨 그룹 생성 실패:", error);
      setMessage("볼륨 그룹 생성 중 오류가 발생했습니다.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleExpandVG = async () => {
    if (!expandVG.volumeGroup || expandVG.physicalVolumes.length === 0) {
      setMessage("볼륨 그룹과 추가할 물리 볼륨을 선택해주세요.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await apiFetch("/main/api/lvm/vg/expand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(expandVG)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("볼륨 그룹이 확장되었습니다.");
        setMessageType("success");
        setExpandVG({
          volumeGroup: "",
          physicalVolumes: []
        });
        loadLvmInfo();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "볼륨 그룹 확장에 실패했습니다.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("볼륨 그룹 확장 실패:", error);
      setMessage("볼륨 그룹 확장 중 오류가 발생했습니다.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateLV = async () => {
    if (!newLV.name || !newLV.volumeGroup || !newLV.size) {
      setMessage("논리 볼륨 이름, 볼륨 그룹, 크기를 모두 입력해주세요.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await apiFetch("/main/api/lvm/lv/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newLV)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("논리 볼륨이 생성되었습니다.");
        setMessageType("success");
        setNewLV({
          name: "",
          volumeGroup: "",
          size: "",
          sizeUnit: "G",
          mountPoint: ""
        });
        loadLvmInfo();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "논리 볼륨 생성에 실패했습니다.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("논리 볼륨 생성 실패:", error);
      setMessage("논리 볼륨 생성 중 오류가 발생했습니다.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleExpandLV = async () => {
    if (!expandLV.logicalVolume || !expandLV.size) {
      setMessage("논리 볼륨과 확장할 크기를 입력해주세요.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await apiFetch("/main/api/lvm/lv/expand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(expandLV)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("논리 볼륨이 확장되었습니다.");
        setMessageType("success");
        setExpandLV({
          logicalVolume: "",
          size: "",
          sizeUnit: "G"
        });
        loadLvmInfo();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "논리 볼륨 확장에 실패했습니다.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("논리 볼륨 확장 실패:", error);
      setMessage("논리 볼륨 확장 중 오류가 발생했습니다.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleShrinkLV = async () => {
    if (!shrinkLV.logicalVolume || !shrinkLV.size) {
      setMessage("논리 볼륨과 축소할 크기를 입력해주세요.");
      setMessageType("error");
      return;
    }

    if (!window.confirm(`논리 볼륨을 축소하면 데이터 손실이 발생할 수 있습니다. 계속하시겠습니까?`)) {
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await apiFetch("/main/api/lvm/lv/shrink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(shrinkLV)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("논리 볼륨이 축소되었습니다.");
        setMessageType("success");
        setShrinkLV({
          logicalVolume: "",
          size: "",
          sizeUnit: "G"
        });
        loadLvmInfo();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "논리 볼륨 축소에 실패했습니다.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("논리 볼륨 축소 실패:", error);
      setMessage("논리 볼륨 축소 중 오류가 발생했습니다.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const togglePV = (pv) => {
    setNewVG(prev => {
      const pvs = prev.physicalVolumes.includes(pv)
        ? prev.physicalVolumes.filter(p => p !== pv)
        : [...prev.physicalVolumes, pv];
      return { ...prev, physicalVolumes: pvs };
    });
  };

  const toggleExpandPV = (pv) => {
    setExpandVG(prev => {
      const pvs = prev.physicalVolumes.includes(pv)
        ? prev.physicalVolumes.filter(p => p !== pv)
        : [...prev.physicalVolumes, pv];
      return { ...prev, physicalVolumes: pvs };
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
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>💾 LVM 관리</h2>

      {message && (
        <div style={commonStyles.message[messageType] || commonStyles.message.success}>
          {message}
        </div>
      )}

      {/* 물리 볼륨 (PV) 관리 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>🔧 물리 볼륨 (PV)</h3>
        
        <div style={{ marginBottom: "1rem" }}>
          <h4 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "#ccc" }}>기존 물리 볼륨</h4>
          {physicalVolumes.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.9rem" }}>생성된 물리 볼륨이 없습니다.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {physicalVolumes.map((pv, index) => (
                <div
                  key={index}
                  style={{
                    padding: "0.75rem",
                    backgroundColor: "#1e1e1e",
                    borderRadius: "4px",
                    border: "1px solid #444"
                  }}
                >
                  <div style={{ fontWeight: "500" }}>{pv.name || pv.device}</div>
                  <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                    크기: {pv.size || "N/A"} | VG: {pv.vg || "없음"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid #444", paddingTop: "1rem" }}>
          <h4 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "#ccc" }}>새 물리 볼륨 생성</h4>
          <p style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "0.75rem" }}>
            물리 볼륨은 디스크 전체를 사용하며, 이름이나 크기를 지정할 수 없습니다.
          </p>
          {availableDisks.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.9rem" }}>사용 가능한 디스크가 없습니다.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {availableDisks.map((disk, index) => (
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
                  <span>{disk.device}</span>
                  <button
                    onClick={() => handleCreatePV(disk.device)}
                    disabled={saving}
                    style={{
                      ...commonStyles.button.primary,
                      padding: "0.5rem 1rem",
                      fontSize: "0.85rem",
                      opacity: saving ? 0.5 : 1
                    }}
                  >
                    PV 생성
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 볼륨 그룹 (VG) 관리 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>📦 볼륨 그룹 (VG)</h3>
        
        <div style={{ marginBottom: "1rem" }}>
          <h4 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "#ccc" }}>기존 볼륨 그룹</h4>
          {volumeGroups.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.9rem" }}>생성된 볼륨 그룹이 없습니다.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {volumeGroups.map((vg, index) => (
                <div
                  key={index}
                  style={{
                    padding: "0.75rem",
                    backgroundColor: "#1e1e1e",
                    borderRadius: "4px",
                    border: "1px solid #444"
                  }}
                >
                  <div style={{ fontWeight: "500" }}>{vg.name}</div>
                  <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                    크기: {vg.size || "N/A"} | 사용: {vg.used || "N/A"} | 여유: {vg.free || "N/A"} | PV: {vg.pvCount || 0}개
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid #444", paddingTop: "1rem" }}>
          <h4 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "#ccc" }}>새 볼륨 그룹 생성</h4>
          
          <SettingItem
            label="볼륨 그룹 이름"
            menu="system"
            input={
              <ValidatedInput
                type="text"
                value={newVG.name}
                onChange={(e) => setNewVG({ ...newVG, name: e.target.value })}
                validator={(val) => {
                  if (!val || val.trim() === "") {
                    return { valid: false, error: "볼륨 그룹 이름을 입력해주세요." };
                  }
                  if (!/^[a-zA-Z0-9_-]+$/.test(val)) {
                    return { valid: false, error: "볼륨 그룹 이름은 영문, 숫자, 하이픈, 언더스코어만 사용할 수 있습니다." };
                  }
                  return { valid: true, error: null };
                }}
                style={inputStyle}
                placeholder="vg0"
              />
            }
            hint="볼륨 그룹 이름을 지정합니다. (예: vg0, vg1)"
            description="볼륨 그룹 이름"
          />

          <SettingItem
            label="물리 볼륨 선택"
            menu="system"
            input={
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "200px", overflowY: "auto" }}>
                {physicalVolumes.length === 0 ? (
                  <p style={{ color: "#888", fontSize: "0.9rem" }}>사용 가능한 물리 볼륨이 없습니다. 먼저 물리 볼륨을 생성해주세요.</p>
                ) : (
                  physicalVolumes
                    .filter(pv => !pv.vg || pv.vg === "")
                    .map((pv, index) => (
                      <Checkbox
                        key={index}
                        checked={newVG.physicalVolumes.includes(pv.name || pv.device)}
                        onChange={(checked) => {
                          if (checked) {
                            togglePV(pv.name || pv.device);
                          } else {
                            setNewVG(prev => ({
                              ...prev,
                              physicalVolumes: prev.physicalVolumes.filter(p => p !== (pv.name || pv.device))
                            }));
                          }
                        }}
                        label={`${pv.name || pv.device} (${pv.size || "N/A"})`}
                      />
                    ))
                )}
              </div>
            }
            hint="볼륨 그룹에 포함할 물리 볼륨을 선택합니다. 최소 1개 이상 선택해야 합니다."
            description="물리 볼륨 선택"
          />

          <button
            onClick={handleCreateVG}
            disabled={saving || !newVG.name || newVG.physicalVolumes.length === 0}
            style={{
              ...commonStyles.button.primary,
              opacity: (saving || !newVG.name || newVG.physicalVolumes.length === 0) ? 0.5 : 1,
              marginTop: "1rem"
            }}
          >
            {saving ? "생성 중..." : "볼륨 그룹 생성"}
          </button>
        </div>

        {/* 볼륨 그룹 확장 */}
        {volumeGroups.length > 0 && (
          <div style={{ borderTop: "1px solid #444", paddingTop: "1rem", marginTop: "1rem" }}>
            <h4 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "#ccc" }}>볼륨 그룹 확장</h4>
            
            <SettingItem
              label="볼륨 그룹 선택"
              menu="system"
              input={
                <select
                  value={expandVG.volumeGroup}
                  onChange={(e) => setExpandVG({ ...expandVG, volumeGroup: e.target.value, physicalVolumes: [] })}
                  style={inputStyle}
                >
                  <option value="">볼륨 그룹 선택</option>
                  {volumeGroups.map((vg, index) => (
                    <option key={index} value={vg.name}>
                      {vg.name} (여유: {vg.free || "N/A"})
                    </option>
                  ))}
                </select>
              }
              hint="확장할 볼륨 그룹을 선택합니다."
              description="볼륨 그룹"
            />

            {expandVG.volumeGroup && (
              <SettingItem
                label="추가할 물리 볼륨 선택"
                menu="system"
                input={
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "200px", overflowY: "auto" }}>
                    {physicalVolumes
                      .filter(pv => !pv.vg || pv.vg === "")
                      .length === 0 ? (
                      <p style={{ color: "#888", fontSize: "0.9rem" }}>사용 가능한 물리 볼륨이 없습니다.</p>
                    ) : (
                      physicalVolumes
                        .filter(pv => !pv.vg || pv.vg === "")
                        .map((pv, index) => (
                          <Checkbox
                            key={index}
                            checked={expandVG.physicalVolumes.includes(pv.name || pv.device)}
                            onChange={(checked) => {
                              if (checked) {
                                toggleExpandPV(pv.name || pv.device);
                              } else {
                                setExpandVG(prev => ({
                                  ...prev,
                                  physicalVolumes: prev.physicalVolumes.filter(p => p !== (pv.name || pv.device))
                                }));
                              }
                            }}
                            label={`${pv.name || pv.device} (${pv.size || "N/A"})`}
                          />
                        ))
                    )}
                  </div>
                }
                hint="볼륨 그룹에 추가할 물리 볼륨을 선택합니다."
                description="물리 볼륨 선택"
              />
            )}

            <button
              onClick={handleExpandVG}
              disabled={saving || !expandVG.volumeGroup || expandVG.physicalVolumes.length === 0}
              style={{
                ...commonStyles.button.success,
                opacity: (saving || !expandVG.volumeGroup || expandVG.physicalVolumes.length === 0) ? 0.5 : 1,
                marginTop: "1rem"
              }}
            >
              {saving ? "확장 중..." : "볼륨 그룹 확장"}
            </button>
          </div>
        )}
      </div>

      {/* 논리 볼륨 (LV) 관리 */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>📁 논리 볼륨 (LV)</h3>
        
        <div style={{ marginBottom: "1rem" }}>
          <h4 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "#ccc" }}>기존 논리 볼륨</h4>
          {logicalVolumes.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.9rem" }}>생성된 논리 볼륨이 없습니다.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {logicalVolumes.map((lv, index) => (
                <div
                  key={index}
                  style={{
                    padding: "0.75rem",
                    backgroundColor: "#1e1e1e",
                    borderRadius: "4px",
                    border: "1px solid #444"
                  }}
                >
                  <div style={{ fontWeight: "500" }}>{lv.name || lv.path}</div>
                  <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                    VG: {lv.vg || "N/A"} | 크기: {lv.size || "N/A"} | 경로: {lv.path || "N/A"} | 마운트: {lv.mountPoint || "마운트 안됨"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid #444", paddingTop: "1rem" }}>
          <h4 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "#ccc" }}>새 논리 볼륨 생성</h4>
          
          <SettingItem
            label="논리 볼륨 이름"
            menu="system"
            input={
              <ValidatedInput
                type="text"
                value={newLV.name}
                onChange={(e) => setNewLV({ ...newLV, name: e.target.value })}
                validator={(val) => {
                  if (!val || val.trim() === "") {
                    return { valid: false, error: "논리 볼륨 이름을 입력해주세요." };
                  }
                  if (!/^[a-zA-Z0-9_-]+$/.test(val)) {
                    return { valid: false, error: "논리 볼륨 이름은 영문, 숫자, 하이픈, 언더스코어만 사용할 수 있습니다." };
                  }
                  return { valid: true, error: null };
                }}
                style={inputStyle}
                placeholder="lv0"
              />
            }
            hint="논리 볼륨 이름을 지정합니다. (예: lv0, lv1)"
            description="논리 볼륨 이름"
          />

          <SettingItem
            label="볼륨 그룹 선택"
            menu="system"
            input={
              <select
                value={newLV.volumeGroup}
                onChange={(e) => setNewLV({ ...newLV, volumeGroup: e.target.value })}
                style={inputStyle}
              >
                <option value="">볼륨 그룹 선택</option>
                {volumeGroups.map((vg, index) => (
                  <option key={index} value={vg.name}>
                    {vg.name} (사용 가능: {vg.free || "N/A"})
                  </option>
                ))}
              </select>
            }
            hint="논리 볼륨을 생성할 볼륨 그룹을 선택합니다."
            description="볼륨 그룹"
          />

          <SettingItem
            label="논리 볼륨 크기"
            menu="system"
            input={
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="number"
                  value={newLV.size}
                  onChange={(e) => setNewLV({ ...newLV, size: e.target.value })}
                  min="1"
                  step="0.1"
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="10"
                />
                <select
                  value={newLV.sizeUnit}
                  onChange={(e) => setNewLV({ ...newLV, sizeUnit: e.target.value })}
                  style={{ ...inputStyle, width: "80px" }}
                >
                  <option value="M">MB</option>
                  <option value="G">GB</option>
                  <option value="T">TB</option>
                </select>
              </div>
            }
            hint="논리 볼륨의 크기를 지정합니다. 선택한 볼륨 그룹의 사용 가능한 크기 이내여야 합니다."
            description="논리 볼륨 크기"
          />

          <SettingItem
            label="마운트 위치"
            menu="system"
            input={
              <ValidatedInput
                type="text"
                value={newLV.mountPoint}
                onChange={(e) => setNewLV({ ...newLV, mountPoint: e.target.value })}
                validator={(val) => {
                  if (val && val.trim() !== "" && !val.startsWith("/")) {
                    return { valid: false, error: "마운트 위치는 절대 경로여야 합니다. (예: /mnt/data)" };
                  }
                  return { valid: true, error: null };
                }}
                style={inputStyle}
                placeholder="/mnt/data (선택사항)"
              />
            }
            hint="논리 볼륨을 마운트할 디렉토리 경로를 지정합니다. (선택사항)"
            description="마운트 위치"
          />

          <button
            onClick={handleCreateLV}
            disabled={saving || !newLV.name || !newLV.volumeGroup || !newLV.size}
            style={{
              ...commonStyles.button.primary,
              opacity: (saving || !newLV.name || !newLV.volumeGroup || !newLV.size) ? 0.5 : 1,
              marginTop: "1rem"
            }}
          >
            {saving ? "생성 중..." : "논리 볼륨 생성"}
          </button>
        </div>

        {/* 논리 볼륨 확장 */}
        {logicalVolumes.length > 0 && (
          <div style={{ borderTop: "1px solid #444", paddingTop: "1rem", marginTop: "1rem" }}>
            <h4 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "#ccc" }}>논리 볼륨 확장</h4>
            
            <SettingItem
              label="논리 볼륨 선택"
              menu="system"
              input={
                <select
                  value={expandLV.logicalVolume}
                  onChange={(e) => setExpandLV({ ...expandLV, logicalVolume: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">논리 볼륨 선택</option>
                  {logicalVolumes.map((lv, index) => (
                    <option key={index} value={lv.name || lv.path}>
                      {lv.name || lv.path} (현재: {lv.size || "N/A"})
                    </option>
                  ))}
                </select>
              }
              hint="확장할 논리 볼륨을 선택합니다."
              description="논리 볼륨"
            />

            {expandLV.logicalVolume && (
              <SettingItem
                label="추가할 크기"
                menu="system"
                input={
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="number"
                      value={expandLV.size}
                      onChange={(e) => setExpandLV({ ...expandLV, size: e.target.value })}
                      min="1"
                      step="0.1"
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="10"
                    />
                    <select
                      value={expandLV.sizeUnit}
                      onChange={(e) => setExpandLV({ ...expandLV, sizeUnit: e.target.value })}
                      style={{ ...inputStyle, width: "80px" }}
                    >
                      <option value="M">MB</option>
                      <option value="G">GB</option>
                      <option value="T">TB</option>
                    </select>
                  </div>
                }
                hint="논리 볼륨에 추가할 크기를 지정합니다."
                description="추가 크기"
              />
            )}

            <button
              onClick={handleExpandLV}
              disabled={saving || !expandLV.logicalVolume || !expandLV.size}
              style={{
                ...commonStyles.button.success,
                opacity: (saving || !expandLV.logicalVolume || !expandLV.size) ? 0.5 : 1,
                marginTop: "1rem"
              }}
            >
              {saving ? "확장 중..." : "논리 볼륨 확장"}
            </button>
          </div>
        )}

        {/* 논리 볼륨 축소 */}
        {logicalVolumes.length > 0 && (
          <div style={{ borderTop: "1px solid #444", paddingTop: "1rem", marginTop: "1rem" }}>
            <h4 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "#ccc" }}>논리 볼륨 축소</h4>
            <p style={{ fontSize: "0.85rem", color: "#ffaa00", marginBottom: "0.75rem" }}>
              ⚠️ 논리 볼륨 축소는 데이터 손실 위험이 있습니다. 반드시 백업 후 진행하세요.
            </p>
            
            <SettingItem
              label="논리 볼륨 선택"
              menu="system"
              input={
                <select
                  value={shrinkLV.logicalVolume}
                  onChange={(e) => setShrinkLV({ ...shrinkLV, logicalVolume: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">논리 볼륨 선택</option>
                  {logicalVolumes.map((lv, index) => (
                    <option key={index} value={lv.name || lv.path}>
                      {lv.name || lv.path} (현재: {lv.size || "N/A"})
                    </option>
                  ))}
                </select>
              }
              hint="축소할 논리 볼륨을 선택합니다."
              description="논리 볼륨"
            />

            {shrinkLV.logicalVolume && (
              <SettingItem
                label="축소할 크기"
                menu="system"
                input={
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="number"
                      value={shrinkLV.size}
                      onChange={(e) => setShrinkLV({ ...shrinkLV, size: e.target.value })}
                      min="1"
                      step="0.1"
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="10"
                    />
                    <select
                      value={shrinkLV.sizeUnit}
                      onChange={(e) => setShrinkLV({ ...shrinkLV, sizeUnit: e.target.value })}
                      style={{ ...inputStyle, width: "80px" }}
                    >
                      <option value="M">MB</option>
                      <option value="G">GB</option>
                      <option value="T">TB</option>
                    </select>
                  </div>
                }
                hint="논리 볼륨에서 줄일 크기를 지정합니다."
                description="축소 크기"
              />
            )}

            <button
              onClick={handleShrinkLV}
              disabled={saving || !shrinkLV.logicalVolume || !shrinkLV.size}
              style={{
                ...commonStyles.button.danger,
                opacity: (saving || !shrinkLV.logicalVolume || !shrinkLV.size) ? 0.5 : 1,
                marginTop: "1rem"
              }}
            >
              {saving ? "축소 중..." : "논리 볼륨 축소"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
