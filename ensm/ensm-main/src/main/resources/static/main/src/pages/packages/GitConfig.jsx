// GitConfig.jsx - 리팩토링된 설정 페이지
import React from "react";
import PackageConfigLayout from "../../components/PackageConfigLayout";
import SettingItem from "../../components/SettingItem";
import ValidatedInput from "../../components/ValidatedInput";
import { validateEmail } from "../../utils/validation";
import { commonStyles } from "../../utils/theme";

export default function GitConfig() {
  const defaultFormData = {
    userName: "",
    userEmail: "",
    defaultBranch: "main",
    initDefaultBranch: "main",
    editor: "vim",
    coreAutocrlf: "input",
    pullRebase: false,
    credentialHelper: "store",
    httpSslVerify: true,
    pushDefault: "simple"
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
      packageId="git"
      title="Git 설정"
      defaultFormData={defaultFormData}
      defaultToggles={defaultToggles}
    >
      {({ formData, toggles, updateFormData, updateToggles, loading, restarting }) => (
        <>
          {/* 기본 사용자 정보 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>👤 사용자 정보</h3>
            <SettingItem
              label="사용자 이름"
              docKey="git_UserName"
              input={
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => updateFormData({ userName: e.target.value })}
                  placeholder="홍길동"
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="git-user-name"
                />
              }
              hint="커밋에 표시될 사용자 이름입니다."
              description="user.name"
            />
            <SettingItem
              label="이메일 주소"
              docKey="git_UserEmail"
              input={
                <ValidatedInput
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => updateFormData({ userEmail: e.target.value })}
                  validator={(val) => validateEmail(val)}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="git-user-email"
                />
              }
              hint="커밋에 표시될 이메일 주소입니다."
              description="user.email"
            />
          </div>

          {/* 기본 브랜치 설정 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🌿 브랜치 설정</h3>
            <SettingItem
              label="기본 브랜치 이름"
              docKey="git_DefaultBranch"
              input={
                <input
                  type="text"
                  value={formData.defaultBranch}
                  onChange={(e) => updateFormData({ defaultBranch: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="git-default-branch"
                />
              }
              hint="새 저장소의 기본 브랜치 이름입니다."
              description="init.defaultBranch"
            />
          </div>

          {/* 편집기 및 기본 동작 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>⚙️ 기본 동작 설정</h3>
            <SettingItem
              label="기본 편집기"
              docKey="git_Editor"
              input={
                <select
                  value={formData.editor}
                  onChange={(e) => updateFormData({ editor: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="git-editor"
                >
                  <option value="vim">vim</option>
                  <option value="nano">nano</option>
                  <option value="emacs">emacs</option>
                  <option value="code">Visual Studio Code</option>
                </select>
              }
              hint="커밋 메시지 작성에 사용할 편집기입니다."
              description="core.editor"
            />
            <SettingItem
              label="줄바꿈 문자 처리"
              docKey="git_Autocrlf"
              input={
                <select
                  value={formData.coreAutocrlf}
                  onChange={(e) => updateFormData({ coreAutocrlf: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="git-autocrlf"
                >
                  <option value="true">true (Windows 스타일로 변환)</option>
                  <option value="false">false (변환 안 함)</option>
                  <option value="input">input (저장 시만 변환, 권장)</option>
                </select>
              }
              hint="줄바꿈 문자(CRLF/LF) 처리 방식입니다."
              description="core.autocrlf"
            />
            <SettingItem
              label="Pull 시 Rebase 사용"
              docKey="git_PullRebase"
              input={renderToggle("pullRebase", formData, updateFormData)}
              hint="pull 시 merge 대신 rebase를 사용합니다."
              description="pull.rebase"
            />
            <SettingItem
              label="Push 기본 동작"
              docKey="git_PushDefault"
              input={
                <select
                  value={formData.pushDefault}
                  onChange={(e) => updateFormData({ pushDefault: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="git-push-default"
                >
                  <option value="simple">simple (권장)</option>
                  <option value="current">current</option>
                  <option value="upstream">upstream</option>
                  <option value="nothing">nothing</option>
                </select>
              }
              hint="push 명령의 기본 동작 방식입니다."
              description="push.default"
            />
          </div>

          {/* 인증 및 보안 */}
          <div style={commonStyles.card}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🔐 인증 및 보안</h3>
            <SettingItem
              label="자격 증명 저장 방식"
              docKey="git_CredentialHelper"
              input={
                <select
                  value={formData.credentialHelper}
                  onChange={(e) => updateFormData({ credentialHelper: e.target.value })}
                  disabled={loading || restarting}
                  style={{ ...commonStyles.input, width: "240px" }}
                  id="git-credential-helper"
                >
                  <option value="store">store (파일에 저장)</option>
                  <option value="cache">cache (메모리에 임시 저장)</option>
                  <option value="manager">manager (시스템 자격 증명 관리자)</option>
                </select>
              }
              hint="Git 자격 증명을 저장하는 방식입니다."
              description="credential.helper"
            />
            <SettingItem
              label="HTTPS SSL 인증서 검증"
              docKey="git_HttpSslVerify"
              input={renderToggle("httpSslVerify", formData, updateFormData)}
              hint="HTTPS 연결 시 SSL 인증서를 검증합니다."
              description="http.sslVerify"
            />
          </div>
        </>
      )}
    </PackageConfigLayout>
  );
}
