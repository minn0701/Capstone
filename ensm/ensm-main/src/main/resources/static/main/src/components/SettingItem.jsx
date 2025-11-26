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
 * @param {string} docKey - 설명서 파일 이름 (메뉴_설정명 형식, 예: "apache_DocumentRoot", "bind_listen-on")
 * @param {string} menu - 메뉴 이름 (docKey가 없을 때 사용, 예: "apache", "bind")
 */
export default function SettingItem({ label, input, hint, description, docKey, menu }) {
  const [showHint, setShowHint] = useState(false);
  const hintRef = useRef(null);
  const hintBoxRef = useRef(null);
  const { setSelectedDocKey, setDocContent } = useOutletContext();

  // docKey가 없으면 menu와 label을 조합하여 생성
  // label에서 특수문자 제거 및 공백을 언더스코어로 변경
  const getDocumentKey = () => {
    if (docKey) {
      return docKey;
    }
    if (menu) {
      // label을 파일명에 적합한 형식으로 변환 (공백을 언더스코어로, 특수문자 제거하되 한글은 유지)
      const sanitizedLabel = label.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_가-힣]/g, '');
      return `${menu}_${sanitizedLabel}`;
    }
    // menu도 없으면 label만 사용 (하위 호환성)
    return label.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_가-힣]/g, '');
  };
  
  const documentKey = getDocumentKey();

  // 외부 클릭 시 툴팁 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 힌트 버튼이나 힌트박스 내부를 클릭한 경우 닫지 않음
      if (
        hintRef.current && 
        hintBoxRef.current &&
        !hintRef.current.contains(event.target) &&
        !hintBoxRef.current.contains(event.target)
      ) {
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
      // URL 인코딩 (한글 파일명 처리)
      const encodedKey = encodeURIComponent(documentKey);
      const url = `/main/descriptions/${encodedKey}.md`;
      console.log(`설명서 요청: ${url} (원본: ${documentKey})`);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      setDocContent(text);
      setSelectedDocKey(documentKey);
      setShowHint(false);
    } catch (err) {
      console.error(`❌ 설명서 로드 실패: ${documentKey}`, err);
      setDocContent(`# ${documentKey}\n\n설명을 불러오는 데 실패했습니다.\n\n파일 경로: /main/descriptions/${documentKey}.md\n\n오류: ${err.message}`);
      setSelectedDocKey(documentKey);
      setShowHint(false);
    }
  };

  return (
    <div style={{ marginBottom: "1.5rem", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: "40%", position: "relative" }}>
          <label style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
            {label}
            <span style={{ display: "flex", alignItems: "center", marginLeft: "8px", position: "relative" }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("힌트 버튼 클릭, 현재 상태:", showHint);
                  setShowHint(!showHint);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ccc",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 1
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
          ref={hintBoxRef}
          style={{
            position: "absolute",
            left: "0px",
            top: "100%",
            marginTop: "8px",
            backgroundColor: "#fff",
            color: "black",
            padding: "10px 12px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            minWidth: "240px",
            maxWidth: "400px",
            zIndex: 1000,
            pointerEvents: "auto"
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
            <strong>{label}</strong>
            <span style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("설명서 버튼 클릭, documentKey:", documentKey);
                  loadMarkdown();
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                title="설명서 보기"
                style={{
                  background: "none",
                  border: "none",
                  padding: "4px",
                  margin: 0,
                  color: "#555",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center"
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

