// DockerConfig.jsx - 리팩토링된 설정 페이지
import React from "react";
import PackageConfigLayout from "../../components/PackageConfigLayout";
import SettingItem from "../../components/SettingItem";
import ValidatedInput from "../../components/ValidatedInput";
import { validatePath } from "../../utils/validation";
import { commonStyles } from "../../utils/theme";

export default function DockerConfig() {
  const defaultFormData = {
    dataRoot: "/var/lib/docker",
    logDriver: "json-file",
    maxLogSize: "10m",
    logOptMaxFile: "3",
    storageDriver: "overlay2",
    dns: "8.8.8.8",
    defaultAddressPool: "",
    liveRestore: true,
    userlandProxy: true,
    ipv6: false
  };

  const defaultToggles = {};

  const renderToggle = (key, formData, updateFormData) => (
    <div
      onClick={() => updateFormData({ [key]: !formData[key] })}
      role="switch"
      aria-checked={formData[key]}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          updateFormData({ [key]: !formData[key] });
        }
      }}
      style={{
        display: "inline-block",
        width: "46px",
        height: "24px",
        backgroundColor: formData[key] ? "#4ade80" : "#888",
        borderRadius: "24px",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: formData[key] ? "24px" : "3px",
          width: "18px",
          height: "18px",
          backgroundColor: "white",
          borderRadius: "50%",
          transition: "left 0.3s"
        }}
      />
    </div>
  );

  return (
    <PackageConfigLayout
      packageId="docker"
      title="Docker 설정"
      defaultFormData={defaultFormData}
      defaultToggles={defaultToggles}
    >
      {({ formData, toggles, updateFormData, updateToggles, loading, restarting }) => (
        <>
          {/* 기본 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>⚙️ 기본 설정</h3>
            <SettingItem
              label="데이터 저장 경로"
              docKey="docker_DataRoot"
              input={
                <ValidatedInput
                  type="text"
                  value={formData.dataRoot}
                  onChange={(e) => updateFormData({ dataRoot: e.target.value })}
                  validator={(val) => validatePath(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="docker-data-root"
                />
              }
              hint="Docker 이미지, 컨테이너, 볼륨 등이 저장되는 경로입니다."
              description="data-root"
            />
            <SettingItem
              label="스토리지 드라이버"
              docKey="docker_StorageDriver"
              input={
                <select
                  value={formData.storageDriver}
                  onChange={(e) => updateFormData({ storageDriver: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="docker-storage-driver"
                >
                  <option value="overlay2">overlay2 (권장)</option>
                  <option value="overlay">overlay</option>
                  <option value="devicemapper">devicemapper</option>
                  <option value="btrfs">btrfs</option>
                  <option value="zfs">zfs</option>
                </select>
              }
              hint="컨테이너 이미지 저장에 사용할 스토리지 드라이버입니다."
              description="storage-driver"
            />
            <SettingItem
              label="DNS 서버"
              docKey="docker_DNS"
              input={
                <input
                  type="text"
                  value={formData.dns}
                  onChange={(e) => updateFormData({ dns: e.target.value })}
                  placeholder="8.8.8.8"
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="docker-dns"
                />
              }
              hint="컨테이너에서 사용할 DNS 서버 주소입니다."
              description="dns"
            />
          </div>

          {/* 로그 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>📝 로그 설정</h3>
            <SettingItem
              label="로그 드라이버"
              docKey="docker_LogDriver"
              input={
                <select
                  value={formData.logDriver}
                  onChange={(e) => updateFormData({ logDriver: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="docker-log-driver"
                >
                  <option value="json-file">json-file (기본)</option>
                  <option value="syslog">syslog</option>
                  <option value="journald">journald</option>
                  <option value="none">none (로그 비활성화)</option>
                </select>
              }
              hint="컨테이너 로그를 저장하는 방식입니다."
              description="log-driver"
            />
            <SettingItem
              label="최대 로그 크기"
              docKey="docker_MaxLogSize"
              input={
                <input
                  type="text"
                  value={formData.maxLogSize}
                  onChange={(e) => updateFormData({ maxLogSize: e.target.value })}
                  placeholder="10m"
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="docker-max-log-size"
                />
              }
              hint="컨테이너 로그 파일의 최대 크기입니다. (예: 10m, 50m)"
              description="log-opts max-size"
            />
            <SettingItem
              label="로그 파일 최대 개수"
              docKey="docker_LogOptMaxFile"
              input={
                <ValidatedInput
                  type="number"
                  value={formData.logOptMaxFile}
                  onChange={(e) => updateFormData({ logOptMaxFile: e.target.value })}
                  validator={(val) => {
                    const num = parseInt(val);
                    if (isNaN(num) || num < 1) {
                      return { valid: false, error: "1 이상의 숫자여야 합니다." };
                    }
                    return { valid: true, error: null };
                  }}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="docker-log-max-file"
                />
              }
              hint="로그 파일을 순환할 때 유지할 최대 파일 개수입니다."
              description="log-opts max-file"
            />
          </div>

          {/* 고급 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔧 고급 설정</h3>
            <SettingItem
              label="기본 주소 풀"
              docKey="docker_AddressPool"
              input={
                <input
                  type="text"
                  value={formData.defaultAddressPool}
                  onChange={(e) => updateFormData({ defaultAddressPool: e.target.value })}
                  placeholder="예: 172.17.0.0/16"
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="docker-address-pool"
                />
              }
              hint="Docker 네트워크에 사용할 기본 IP 주소 범위입니다."
              description="default-address-pool"
            />
            <SettingItem
              label="라이브 복원"
              docKey="docker_LiveRestore"
              input={renderToggle("liveRestore", formData, updateFormData)}
              hint="Docker 데몬이 재시작되어도 실행 중인 컨테이너를 유지합니다."
              description="live-restore"
            />
            <SettingItem
              label="사용자 랜드 프록시"
              docKey="docker_UserlandProxy"
              input={renderToggle("userlandProxy", formData, updateFormData)}
              hint="포트 포워딩에 사용자 공간 프록시를 사용합니다."
              description="userland-proxy"
            />
            <SettingItem
              label="IPv6 지원"
              docKey="docker_IPv6"
              input={renderToggle("ipv6", formData, updateFormData)}
              hint="IPv6 네트워킹을 활성화합니다."
              description="ipv6"
            />
          </div>
        </>
      )}
    </PackageConfigLayout>
  );
}
