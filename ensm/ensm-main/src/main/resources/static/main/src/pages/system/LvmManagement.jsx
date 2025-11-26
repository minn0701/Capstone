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

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>LVM 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>LVM 관리</h2>
        <p style={styles.pageSubtitle}>물리 볼륨(PV), 볼륨 그룹(VG), 논리 볼륨(LV)을 생성하고 관리합니다.</p>
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
        
        {/* ==================================================
            1. 물리 볼륨 (PV) 관리
           ================================================== */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>물리 볼륨 (PV)</h3>
          
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={styles.subTitle}>기존 물리 볼륨</h4>
            {physicalVolumes.length === 0 ? (
              <div style={styles.emptyState}>생성된 물리 볼륨이 없습니다.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {physicalVolumes.map((pv, index) => (
                  <div key={index} style={styles.listItem}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: "600", fontSize: "1rem", color: "#fff", marginBottom: "0.2rem" }}>
                        {pv.name || pv.device}
                      </span>
                      <span style={{ fontSize: "0.85rem", color: "#aaa" }}>
                        크기: {pv.size || "N/A"} | VG: {pv.vg ? <span style={{ color: "#5a9fd1" }}>{pv.vg}</span> : "미할당"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.divider}></div>

          <div style={{ paddingTop: "1rem" }}>
            <h4 style={styles.subTitle}>새 물리 볼륨 생성</h4>
            <p style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "1rem" }}>
              디스크 전체를 초기화하여 LVM에서 사용할 수 있도록 만듭니다.
            </p>
            {availableDisks.length === 0 ? (
              <div style={styles.emptyState}>사용 가능한 디스크가 없습니다.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {availableDisks.map((disk, index) => (
                  <div key={index} style={styles.listItem}>
                    <span style={{ fontWeight: "500", color: "#ddd" }}>{disk.device}</span>
                    <button
                      onClick={() => handleCreatePV(disk.device)}
                      disabled={saving}
                      style={{
                        ...styles.primaryButton,
                        padding: "0.4rem 0.8rem",
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
        </section>

        {/* ==================================================
            2. 볼륨 그룹 (VG) 관리
           ================================================== */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>볼륨 그룹 (VG)</h3>
          
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={styles.subTitle}>기존 볼륨 그룹</h4>
            {volumeGroups.length === 0 ? (
              <div style={styles.emptyState}>생성된 볼륨 그룹이 없습니다.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {volumeGroups.map((vg, index) => (
                  <div key={index} style={styles.listItem}>
                    <div>
                      <div style={{ fontWeight: "600", color: "#fff", marginBottom: "0.2rem" }}>{vg.name}</div>
                      <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                        크기: {vg.size || "N/A"} | 
                        여유: <span style={{ color: "#6ee7b7" }}>{vg.free || "N/A"}</span> | 
                        PV: {vg.pvCount || 0}개
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.divider}></div>

          <div style={{ paddingTop: "1rem" }}>
            <h4 style={styles.subTitle}>새 볼륨 그룹 생성</h4>
            
            <SettingItem
              label="VG 이름"
              menu="system"
              input={
                <ValidatedInput
                  type="text"
                  value={newVG.name}
                  onChange={(e) => setNewVG({ ...newVG, name: e.target.value })}
                  validator={(val) => {
                    if (!val || val.trim() === "") return { valid: false, error: "필수 입력입니다." };
                    if (!/^[a-zA-Z0-9_-]+$/.test(val)) return { valid: false, error: "영문, 숫자, -, _ 만 허용됩니다." };
                    return { valid: true, error: null };
                  }}
                  style={styles.input}
                  placeholder="vg0"
                />
              }
              hint="볼륨 그룹 이름 (예: vg0)"
            />

            <SettingItem
              label="물리 볼륨(PV)"
              menu="system"
              input={
                <div style={styles.scrollBox}>
                  {physicalVolumes.length === 0 ? (
                    <p style={{ color: "#888", fontSize: "0.9rem", textAlign: "center", padding: "1rem" }}>생성된 PV가 없습니다.</p>
                  ) : (
                    physicalVolumes
                      .filter(pv => !pv.vg || pv.vg === "")
                      .length === 0 ? (
                        <p style={{ color: "#888", fontSize: "0.9rem", padding: "0.5rem" }}>가용 가능한 PV가 없습니다.</p>
                      ) : (
                        physicalVolumes
                          .filter(pv => !pv.vg || pv.vg === "")
                          .map((pv, index) => (
                            <div key={index} style={{ marginBottom: "0.5rem" }}>
                              <Checkbox
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
                            </div>
                          ))
                      )
                  )}
                </div>
              }
              hint="VG에 포함할 PV를 선택하세요."
            />

            <button
              onClick={handleCreateVG}
              disabled={saving || !newVG.name || newVG.physicalVolumes.length === 0}
              style={{
                ...styles.primaryButton,
                opacity: (saving || !newVG.name || newVG.physicalVolumes.length === 0) ? 0.5 : 1,
                marginTop: "1rem",
                width: "100%"
              }}
            >
              {saving ? "생성 중..." : "볼륨 그룹 생성"}
            </button>
          </div>

          {/* VG 확장 기능 */}
          {volumeGroups.length > 0 && (
            <>
              <div style={styles.divider}></div>
              <div style={{ paddingTop: "1rem" }}>
                <h4 style={styles.subTitle}>볼륨 그룹 확장</h4>
                
                <SettingItem
                  label="대상 VG"
                  menu="system"
                  input={
                    <select
                      value={expandVG.volumeGroup}
                      onChange={(e) => setExpandVG({ ...expandVG, volumeGroup: e.target.value, physicalVolumes: [] })}
                      style={styles.select}
                    >
                      <option value="">VG 선택</option>
                      {volumeGroups.map((vg, index) => (
                        <option key={index} value={vg.name}>
                          {vg.name} (여유: {vg.free || "N/A"})
                        </option>
                      ))}
                    </select>
                  }
                  hint="확장할 볼륨 그룹을 선택하세요."
                />

                {expandVG.volumeGroup && (
                  <SettingItem
                    label="추가할 PV"
                    menu="system"
                    input={
                      <div style={styles.scrollBox}>
                        {physicalVolumes.filter(pv => !pv.vg || pv.vg === "").length === 0 ? (
                          <p style={{ color: "#888", fontSize: "0.9rem", padding: "0.5rem" }}>추가 가능한 PV가 없습니다.</p>
                        ) : (
                          physicalVolumes
                            .filter(pv => !pv.vg || pv.vg === "")
                            .map((pv, index) => (
                              <div key={index} style={{ marginBottom: "0.5rem" }}>
                                <Checkbox
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
                              </div>
                            ))
                        )}
                      </div>
                    }
                    hint="추가할 물리 볼륨을 선택하세요."
                  />
                )}

                <button
                  onClick={handleExpandVG}
                  disabled={saving || !expandVG.volumeGroup || expandVG.physicalVolumes.length === 0}
                  style={{
                    ...styles.successButton,
                    opacity: (saving || !expandVG.volumeGroup || expandVG.physicalVolumes.length === 0) ? 0.5 : 1,
                    marginTop: "1rem",
                    width: "100%"
                  }}
                >
                  {saving ? "확장 중..." : "볼륨 그룹 확장"}
                </button>
              </div>
            </>
          )}
        </section>

        {/* ==================================================
            3. 논리 볼륨 (LV) 관리
           ================================================== */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>논리 볼륨 (LV)</h3>
          
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={styles.subTitle}>기존 논리 볼륨</h4>
            {logicalVolumes.length === 0 ? (
              <div style={styles.emptyState}>생성된 논리 볼륨이 없습니다.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {logicalVolumes.map((lv, index) => (
                  <div key={index} style={styles.listItem}>
                    <div>
                      <div style={{ fontWeight: "600", color: "#fff", marginBottom: "0.2rem" }}>{lv.name || lv.path}</div>
                      <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                        VG: <span style={{ color: "#ddd" }}>{lv.vg || "N/A"}</span> | 
                        크기: {lv.size || "N/A"} | 
                        마운트: <span style={{ color: lv.mountPoint ? "#6ee7b7" : "#aaa" }}>{lv.mountPoint || "마운트 안됨"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.divider}></div>

          <div style={{ paddingTop: "1rem" }}>
            <h4 style={styles.subTitle}>새 논리 볼륨 생성</h4>
            
            <SettingItem
              label="LV 이름"
              menu="system"
              input={
                <ValidatedInput
                  type="text"
                  value={newLV.name}
                  onChange={(e) => setNewLV({ ...newLV, name: e.target.value })}
                  validator={(val) => {
                    if (!val || val.trim() === "") return { valid: false, error: "필수 입력입니다." };
                    if (!/^[a-zA-Z0-9_-]+$/.test(val)) return { valid: false, error: "영문, 숫자, -, _ 만 허용됩니다." };
                    return { valid: true, error: null };
                  }}
                  style={styles.input}
                  placeholder="lv0"
                />
              }
              hint="논리 볼륨 이름 (예: lv0)"
            />

            <SettingItem
              label="VG 선택"
              menu="system"
              input={
                <select
                  value={newLV.volumeGroup}
                  onChange={(e) => setNewLV({ ...newLV, volumeGroup: e.target.value })}
                  style={styles.select}
                >
                  <option value="">VG 선택</option>
                  {volumeGroups.map((vg, index) => (
                    <option key={index} value={vg.name}>
                      {vg.name} (가용: {vg.free || "N/A"})
                    </option>
                  ))}
                </select>
              }
              hint="어떤 VG에서 공간을 할당할지 선택하세요."
            />

            <SettingItem
              label="크기"
              menu="system"
              input={
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    type="number"
                    value={newLV.size}
                    onChange={(e) => setNewLV({ ...newLV, size: e.target.value })}
                    min="1"
                    step="0.1"
                    style={{ ...styles.input, flex: 1 }}
                    placeholder="10"
                  />
                  <select
                    value={newLV.sizeUnit}
                    onChange={(e) => setNewLV({ ...newLV, sizeUnit: e.target.value })}
                    style={{ ...styles.select, width: "90px" }}
                  >
                    <option value="M">MB</option>
                    <option value="G">GB</option>
                    <option value="T">TB</option>
                  </select>
                </div>
              }
              hint="할당할 크기 (VG의 여유 공간 이내)"
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
                      return { valid: false, error: "절대 경로여야 합니다 (예: /mnt/data)." };
                    }
                    return { valid: true, error: null };
                  }}
                  style={styles.input}
                  placeholder="/mnt/data (선택사항)"
                />
              }
              hint="마운트할 경로 (선택사항)"
            />

            <button
              onClick={handleCreateLV}
              disabled={saving || !newLV.name || !newLV.volumeGroup || !newLV.size}
              style={{
                ...styles.primaryButton,
                opacity: (saving || !newLV.name || !newLV.volumeGroup || !newLV.size) ? 0.5 : 1,
                marginTop: "1rem",
                width: "100%"
              }}
            >
              {saving ? "생성 중..." : "논리 볼륨 생성"}
            </button>
          </div>

          {/* LV 확장 및 축소 기능 */}
          {logicalVolumes.length > 0 && (
            <>
              <div style={styles.divider}></div>
              
              {/* 확장 */}
              <div style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
                <h4 style={styles.subTitle}>논리 볼륨 확장</h4>
                <SettingItem
                  label="대상 LV"
                  menu="system"
                  input={
                    <select
                      value={expandLV.logicalVolume}
                      onChange={(e) => setExpandLV({ ...expandLV, logicalVolume: e.target.value })}
                      style={styles.select}
                    >
                      <option value="">LV 선택</option>
                      {logicalVolumes.map((lv, index) => (
                        <option key={index} value={lv.name || lv.path}>
                          {lv.name || lv.path} (현재: {lv.size || "N/A"})
                        </option>
                      ))}
                    </select>
                  }
                  hint="확장할 논리 볼륨 선택"
                />
                
                {expandLV.logicalVolume && (
                  <>
                    <SettingItem
                      label="추가 크기"
                      menu="system"
                      input={
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <input
                            type="number"
                            value={expandLV.size}
                            onChange={(e) => setExpandLV({ ...expandLV, size: e.target.value })}
                            min="1"
                            step="0.1"
                            style={{ ...styles.input, flex: 1 }}
                            placeholder="5"
                          />
                          <select
                            value={expandLV.sizeUnit}
                            onChange={(e) => setExpandLV({ ...expandLV, sizeUnit: e.target.value })}
                            style={{ ...styles.select, width: "90px" }}
                          >
                            <option value="M">MB</option>
                            <option value="G">GB</option>
                            <option value="T">TB</option>
                          </select>
                        </div>
                      }
                      hint="추가할 용량"
                    />
                    <button
                      onClick={handleExpandLV}
                      disabled={saving || !expandLV.logicalVolume || !expandLV.size}
                      style={{
                        ...styles.successButton,
                        opacity: (saving || !expandLV.logicalVolume || !expandLV.size) ? 0.5 : 1,
                        marginTop: "1rem",
                        width: "100%"
                      }}
                    >
                      {saving ? "확장 중..." : "논리 볼륨 확장"}
                    </button>
                  </>
                )}
              </div>

              <div style={styles.divider}></div>

              {/* 축소 */}
              <div style={{ paddingTop: "1rem" }}>
                <h4 style={styles.subTitle}>논리 볼륨 축소</h4>
                <p style={styles.warningBox}>
                  ⚠️ 주의: 볼륨 축소는 파일 시스템 손상 및 데이터 손실 위험이 있습니다. 반드시 백업 후 진행하세요.
                </p>
                
                <SettingItem
                  label="대상 LV"
                  menu="system"
                  input={
                    <select
                      value={shrinkLV.logicalVolume}
                      onChange={(e) => setShrinkLV({ ...shrinkLV, logicalVolume: e.target.value })}
                      style={styles.select}
                    >
                      <option value="">LV 선택</option>
                      {logicalVolumes.map((lv, index) => (
                        <option key={index} value={lv.name || lv.path}>
                          {lv.name || lv.path} (현재: {lv.size || "N/A"})
                        </option>
                      ))}
                    </select>
                  }
                  hint="축소할 논리 볼륨 선택"
                />

                {shrinkLV.logicalVolume && (
                  <>
                    <SettingItem
                      label="축소 크기"
                      menu="system"
                      input={
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <input
                            type="number"
                            value={shrinkLV.size}
                            onChange={(e) => setShrinkLV({ ...shrinkLV, size: e.target.value })}
                            min="1"
                            step="0.1"
                            style={{ ...styles.input, flex: 1 }}
                            placeholder="5"
                          />
                          <select
                            value={shrinkLV.sizeUnit}
                            onChange={(e) => setShrinkLV({ ...shrinkLV, sizeUnit: e.target.value })}
                            style={{ ...styles.select, width: "90px" }}
                          >
                            <option value="M">MB</option>
                            <option value="G">GB</option>
                            <option value="T">TB</option>
                          </select>
                        </div>
                      }
                      hint="줄일 용량 (현재 크기에서 차감)"
                    />
                    <button
                      onClick={handleShrinkLV}
                      disabled={saving || !shrinkLV.logicalVolume || !shrinkLV.size}
                      style={{
                        ...styles.dangerButton,
                        opacity: (saving || !shrinkLV.logicalVolume || !shrinkLV.size) ? 0.5 : 1,
                        marginTop: "1rem",
                        width: "100%",
                        textAlign: "center"
                      }}
                    >
                      {saving ? "축소 중..." : "논리 볼륨 축소"}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
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
  divider: {
    height: "1px",
    backgroundColor: "#444",
    margin: "1.5rem 0"
  },
  scrollBox: {
    backgroundColor: "var(--bg-primary, #1e1e1e)",
    border: "1px solid #555",
    borderRadius: "6px",
    padding: "1rem",
    maxHeight: "200px",
    overflowY: "auto"
  },
  warningBox: {
    fontSize: "0.85rem",
    color: "#fca5a5",
    marginBottom: "1rem",
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid rgba(239, 68, 68, 0.2)'
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
  successButton: {
    padding: "0.85rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  dangerButton: {
    padding: "0.85rem",
    backgroundColor: "transparent",
    color: "#ef4444",
    border: "1px solid #ef4444",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s"
  }
};