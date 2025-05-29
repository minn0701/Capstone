// src/components/DetailPane.jsx
import React, { useEffect, useState } from "react";

// 예시: public/descriptions/*.md 파일을 fetch 해서 보여주기
export default function DetailPane({ docKey }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!docKey) return;
    fetch(`/descriptions/${docKey}.md`)
      .then((res) => res.text())
      .then((md) => {
        setContent(md);
      })
      .catch(() => {
        setContent("설명 파일을 로드할 수 없습니다.");
      });
  }, [docKey]);

  return (
    <div style={{ width: 300, background: "#282a36", color: "#fff", padding: "1rem", overflow: "auto" }}>
      {!docKey ? (
        <div>항목을 선택하세요.</div>
      ) : (
        <>
          <h4 style={{ marginBottom: "0.5rem" }}>{docKey} 설명</h4>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>{content}</pre>
        </>
      )}
    </div>
  );
}
