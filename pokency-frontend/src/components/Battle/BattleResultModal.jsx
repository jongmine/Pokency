import { useNavigate } from "react-router-dom";

export default function BattleResultModal({ result, onRestart, onClose }) {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-yellow-300 p-10 text-xl font-bold flex flex-col items-center relative">
        <button
          className="absolute top-3 right-6 text-2xl text-gray-400 hover:text-red-400"
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
        {result === "win" ? (
          <div>
            🎉 승리! <br /> 배틀에서 이겼습니다!
          </div>
        ) : (
          <div>
            😭 패배... <br /> 다음에 더 강해져서 도전해보세요!
          </div>
        )}
        <button
          className="mt-8 px-6 py-3 bg-yellow-300 rounded-xl font-bold text-yellow-900"
          onClick={onRestart}
        >
          다시 배틀하기
        </button>
        <button
          className="mt-4 px-6 py-3 bg-blue-200 rounded-xl font-bold text-blue-900"
          onClick={goHome}
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
}
