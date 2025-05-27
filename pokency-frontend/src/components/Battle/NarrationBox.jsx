import { useEffect, useRef } from "react";

/**
 * narrations: ["문장1", "문장2", ...]
 * showCount: 최근 몇 개만 보여줄지(예: 2개)
 */
export default function NarrationBox({ narrations = [], showCount = 2 }) {
  const narrationRef = useRef();

  // 스크롤 항상 최신으로
  useEffect(() => {
    narrationRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [narrations]);

  const lastNarrations = narrations.slice(-showCount);

  return (
    <div className="overflow-y-auto h-28 px-2">
      {lastNarrations.map((msg, idx) => (
        <div key={idx} className="fade-in">
          {msg}
        </div>
      ))}
      <div ref={narrationRef} />
    </div>
  );
}
