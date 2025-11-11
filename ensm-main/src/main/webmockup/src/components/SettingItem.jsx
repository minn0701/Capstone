import React, { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import { useOutletContext } from "react-router-dom";

/**
 * 설정 항목 컴포넌트
 * 
 * @param {string} label - 설정 항목 이름 (예: "ServerName")
 * @param {ReactNode} input - 입력 컴포넌트 (input, select, toggle 등)
 * @param {string} hint - 간단한 설명 (툴팁에 표시)
 * @param {string} description - 상세 설명 (라벨 아래에 표시)
 * @param {string} docKey - 설명서 파일 이름 (descriptions 폴더의 .md 파일명, label과 다를 경우)
 */
export default function SettingItem({ label, input, hint, description, docKey }) {
  const [showHint, setShowHint] = useState(false);
  const hintRef = useRef(null);
  const { setSelectedDocKey, setDocContent } = useOutletContext();

  // docKey가 없으면 label을 사용
  const documentKey = docKey || label;

  // 외부 클릭 시 툴팁 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hintRef.current && !hintRef.current.contains(event.target)) {
        setShowHint(false);
      }
    };

    if (showHint) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showHint]);

  const loadMarkdown = async () => {
    try {
      const response = await fetch(`/main/descriptions/${documentKey}.md`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      setDocContent(text);
      setSelectedDocKey(documentKey);
      setShowHint(false);
    } catch (err) {
      console.error(`❌ 설명서 로드 실패: ${documentKey}`, err);
      setDocContent(`# ${documentKey}\n\n설명을 불러오는 데 실패했습니다.\n\n파일 경로: /main/descriptions/${documentKey}.md`);
      setSelectedDocKey(documentKey);
      setShowHint(false);
    }
  };

  return (
    <div style={{ marginBottom: "1.5rem", position: "relative", zIndex: showHint ? 1000 : 1 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: "40%", position: "relative" }}>
          <label style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
            {label}
            <span style={{ display: "flex", alignItems: "center", marginLeft: "8px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint(!showHint);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ccc",
                  padding: 0,
                  display: "flex",
                  alignItems: "center"
                }}
                title="간단 설명 보기"
                ref={hintRef}
              >
                <HelpCircle size={16} />
              </button>
            </span>
          </label>
          {description && (
            <div style={{ fontSize: "0.85rem", color: "#aaa", marginTop: "0.25rem" }}>
              {description}
            </div>
          )}
        </div>
        <div style={{ width: "55%", textAlign: "right" }}>{input}</div>
      </div>

      {showHint && (
        <div
          style={{
            position: "absolute",
            left: "0px",
            top: "-90px",
            backgroundColor: "#fff",
            color: "black",
            padding: "10px 12px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            minWidth: "240px",
            zIndex: 100001
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
            <strong>{label}</strong>
            <span style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={loadMarkdown}
                title="설명서 보기"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  color: "#555",
                  fontSize: "1.1rem",
                  cursor: "pointer"
                }}
              >
                📄
              </button>
              <button
                onClick={() => setShowHint(false)}
                title="닫기"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  color: "#555",
                  fontSize: "1.1rem",
                  cursor: "pointer"
                }}
              >
                ❌
              </button>
            </span>
          </div>
          <div style={{ fontSize: "0.9rem" }}>{hint}</div>
        </div>
      )}
    </div>
  );
}

