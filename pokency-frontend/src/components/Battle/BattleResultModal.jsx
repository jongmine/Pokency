import { useNavigate } from "react-router-dom";

export default function BattleResultModal({ result, onRestart }) {
  const navigate = useNavigate();
  const isWin = result === "win";
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-yellow-200 p-10 flex flex-col items-center max-w-xs">
        <div className="text-3xl font-extrabold mb-3">
          {isWin ? "승리!" : "패배..."}
        </div>
        <div className="mb-6 text-lg text-gray-700">
          {isWin
            ? "축하합니다! 상대를 이겼습니다."
            : "아쉽게도 패배했습니다. 다시 도전해보세요!"}
        </div>
        <div className="flex gap-3">
          <button
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-extrabold rounded-2xl shadow transition"
            onClick={onRestart}
          >
            다시하기
          </button>
          <button
            className="px-6 py-3 bg-blue-200 hover:bg-blue-300 text-blue-900 font-extrabold rounded-2xl shadow transition"
            onClick={() => navigate("/")}
          >
            홈페이지로
          </button>
        </div>
      </div>
    </div>
  );
}
