import HpBar from "../components/Battle/HpBar";
import MoveButton from "../components/Battle/MoveButton";
import NarrationBox from "../components/Battle/NarrationBox";
import BattleResultModal from "../components/Battle/BattleResultModal";
import { startBattle, proceedTurn } from "../api/battle";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePokemonStore } from "../store/pokemonStore";

// [1] API 재시도 래퍼 함수 (최대 2회)
async function startBattleWithRetry(pokemon, maxRetry = 2) {
  let error = null;
  for (let i = 0; i <= maxRetry; i++) {
    try {
      return await startBattle(pokemon);
    } catch (e) {
      error = e;
      if (i < maxRetry) {
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
  }
  throw error;
}

export default function BattlePage() {
  const selectedPokemon = usePokemonStore((state) => state.selectedPokemon);
  const [user, setUser] = useState(null);
  const [userMoves, setUserMoves] = useState([]); // [추가] 내 포켓몬 기술(PP 포함)
  const [enemy, setEnemy] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // 전체 로딩(배틀 시작)
  const [turnLoading, setTurnLoading] = useState(false); // 공격 버튼 개별 로딩
  const [selectedMove, setSelectedMove] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false); // [모달 X버튼용]

  const navigate = useNavigate();

  // [2] 자동 홈 이동 (포켓몬 미선택)
  useEffect(() => {
    if (!selectedPokemon?.name) {
      setBattleLog(["포켓몬이 선택되지 않았습니다."]);
      setTimeout(() => navigate("/"), 2000);
      return;
    }
    start();
    // eslint-disable-next-line
  }, [selectedPokemon?.name]);

  // [3] 배틀 시작 (자동 재시도 + UX 개선)
  const start = useCallback(async () => {
    setLoading(true);
    setBattleLog([
      "배틀을 준비 중입니다...",
      "서버와 통신 중입니다. 최대 40초 이상 소요될 수 있습니다.",
      "응답 지연 시 자동 재시도합니다.",
    ]);
    try {
      const data = await startBattleWithRetry(selectedPokemon.name, 2);

      if (!data?.user || !data?.enemy) {
        throw new Error("서버에서 플레이어/상대 정보를 받지 못했습니다.");
      }

      setUser(data.user);
      // 기술(PP 상태 관리용) - 초기값 pp로 복사
      setUserMoves(
        data.user.moves.map((move) => ({ ...move, current_pp: move.pp }))
      );
      setEnemy(data.enemy);
      setBattleLog([
        `야생의 ${data.enemy.name_ko}가 나타났다!`,
        `${data.user.name_ko}는 어떻게 할까?`,
      ]);
      setGameOver(false);
      setResult(null);
      setSelectedMove(null);
      setShowResultModal(false);
    } catch (err) {
      setBattleLog([
        `배틀 시작 에러: ${err.message}`,
        "네트워크가 불안정하거나 서버 응답이 지연되고 있습니다.",
        "다시 시도하려면 아래 버튼을 눌러주세요.",
      ]);
      setUser(null);
      setUserMoves([]);
      setEnemy(null);
      setGameOver(true);
      setResult("error");
      setShowResultModal(true);
      console.error("[BattlePage] startBattle 에러", err);
    } finally {
      setLoading(false);
    }
  }, [selectedPokemon?.name]);

  // [4] 턴 진행 (프론트에서 상태 직접 관리)
  const attack = async () => {
    if (!selectedMove || !user || !enemy || gameOver) return;
    setTurnLoading(true);

    // 공격 시에만 PP 1 감소
    setUserMoves((prevMoves) =>
      prevMoves.map((m) =>
        m.name === selectedMove.name && m.current_pp > 0
          ? { ...m, current_pp: m.current_pp - 1 }
          : m
      )
    );

    try {
      // 실제 API 호출
      const turnResult = await proceedTurn({
        user,
        enemy,
        userMove: selectedMove.name,
      });

      setUser((prev) => ({ ...prev, hp: turnResult.user.hp }));
      setEnemy((prev) => ({ ...prev, hp: turnResult.enemy.hp }));

      setBattleLog((prev) => {
        const newLogs = [...prev, ...turnResult.narration];
        return newLogs.slice(-2);
      });
      setSelectedMove(null);

      if (turnResult.isGameOver) {
        setGameOver(true);
        setResult(turnResult.winner === user.name_ko ? "win" : "lose");
        setShowResultModal(true);
      }
    } catch (err) {
      // 에러 발생 시 PP 원상복구
      setUserMoves((prevMoves) =>
        prevMoves.map((m) =>
          m.name === selectedMove.name
            ? { ...m, current_pp: m.current_pp + 1 }
            : m
        )
      );
      setBattleLog((prev) =>
        [...prev, `턴 진행 중 에러: ${err.message}`].slice(-2)
      );
      setGameOver(true);
      setResult("error");
      setShowResultModal(true);
      console.error("[BattlePage] proceedTurn 에러", err);
    } finally {
      setTurnLoading(false);
    }
  };

  // [스킬 선택/해제 토글, PP 감소는 attack 함수에서 처리]
  const handleMoveSelect = (move) => {
    if (selectedMove && selectedMove.name === move.name) {
      setSelectedMove(null); // 이미 선택되어 있으면 해제
    } else if (move.current_pp > 0) {
      setSelectedMove(move);
    }
  };

  // [5] 렌더링
  if (!selectedPokemon?.name)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        포켓몬이 선택되지 않았습니다. 홈으로 이동합니다...
      </div>
    );

  if (loading || !user || !enemy)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-xl gap-5 bg-gradient-to-b from-yellow-100 via-blue-50 to-pink-100">
        {/* 포켓볼 회전 애니메이션 */}
        <div className="relative flex items-center justify-center w-32 h-32">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="포켓볼"
            className="w-24 h-24 animate-spin-slow"
            style={{ animationDuration: "2s" }}
          />
        </div>
        <div className="text-lg font-semibold text-yellow-700 flex items-center gap-2">
          <span className="animate-bounce">⚡</span>
          배틀을 준비 중입니다!
          <span className="animate-bounce">⚡</span>
        </div>
        <div className="text-gray-500 text-base text-center">
          Lambda 서버 환경에서는 최대 40초 이상 소요될 수 있습니다.
          <br />
          응답이 지연되면 자동 재시도합니다.
          <br />
          <span className="text-sm">(인터넷 연결을 확인해 주세요.)</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-yellow-100 to-blue-100 flex flex-col items-center justify-center py-8 px-2 relative">
      {/* 상단(상대) */}
      <div className="w-full max-w-2xl flex flex-col items-end mb-12 select-none">
        <div className="flex items-center gap-6 mb-2">
          <div className="text-xl font-bold text-green-900 drop-shadow">
            {enemy.name_ko}
          </div>
          <HpBar hp={enemy.hp} maxHp={100} />
          <div className="text-lg text-green-700 font-bold ml-2">
            {enemy.hp} / 100
          </div>
        </div>
        <div className="h-56 flex items-center justify-end relative">
          <img
            src={enemy.official_artwork}
            alt={enemy.name_ko}
            className={`w-56 h-56 drop-shadow-2xl transition-transform duration-300
              ${enemy.hp <= 0 ? "opacity-50 grayscale" : ""}
            `}
            style={{ filter: "brightness(0.95)" }}
          />
        </div>
      </div>

      {/* 내러티브/로그 */}
      <div className="w-full max-w-2xl bg-white/80 rounded-xl shadow-lg p-6 mb-10 border-2 border-blue-200 min-h-[90px] backdrop-blur-sm">
        <NarrationBox narrations={battleLog} showCount={2} />
      </div>

      {/* 내 영역 */}
      <div className="w-full max-w-2xl flex flex-col items-start mb-3 select-none">
        <div className="flex items-center gap-6 mb-2">
          <img
            src={user.official_artwork}
            alt={user.name_ko}
            className={`w-44 h-44 drop-shadow-lg transition-transform duration-300
              ${user.hp <= 0 ? "opacity-50 grayscale" : ""}
            `}
            style={{ filter: "brightness(1.05)" }}
          />
          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold text-yellow-700 drop-shadow">
              {user.name_ko}
            </div>
            <HpBar hp={user.hp} maxHp={100} />
            <div className="text-lg text-yellow-700 font-bold mt-1">
              {user.hp} / 100
            </div>
          </div>
        </div>
      </div>

      {/* 기술 선택 */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
        {userMoves.map((move) => (
          <MoveButton
            key={move.name}
            move={move}
            onClick={() => handleMoveSelect(move)}
            selected={selectedMove && selectedMove.name === move.name}
            disabled={gameOver || turnLoading || move.current_pp === 0}
            className={turnLoading ? "opacity-50 pointer-events-none" : ""}
          >
            <div className="flex flex-col items-center">
              <span>{move.name_ko || move.name}</span>
              <span className="text-xs mt-1 text-gray-500">
                PP: {move.current_pp} / {move.pp}
              </span>
            </div>
          </MoveButton>
        ))}
      </div>
      <div className="my-3">
        <button
          className="bg-yellow-400 text-yellow-900 font-bold rounded-2xl px-8 py-3 shadow flex items-center gap-2 disabled:opacity-50"
          onClick={attack}
          disabled={!selectedMove || turnLoading || gameOver}
        >
          {turnLoading && (
            <span className="animate-spin inline-block w-6 h-6 border-2 border-yellow-600 border-t-transparent rounded-full"></span>
          )}
          공격!
        </button>
      </div>

      {/* 결과 모달 */}
      {showResultModal && gameOver && result !== "error" && (
        <BattleResultModal
          result={result === "win" ? "win" : "lose"}
          onRestart={start}
          onClose={() => setShowResultModal(false)}
        />
      )}
      {showResultModal && gameOver && result === "error" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-red-200 p-10 text-red-600 text-lg font-bold flex flex-col items-center">
            오류가 발생했습니다.
            <br />
            네트워크 상태 또는 서버 지연일 수 있습니다.
            <br />
            <button
              className="mt-6 px-6 py-3 bg-blue-200 rounded-xl font-bold"
              onClick={start}
            >
              다시 시도
            </button>
            <button
              className="mt-3 px-6 py-2 bg-gray-200 rounded-xl font-bold"
              onClick={() => window.location.reload()}
            >
              새로고침
            </button>
            <button
              className="absolute top-4 right-8 text-2xl text-gray-400 hover:text-red-400"
              onClick={() => setShowResultModal(false)}
              style={{ position: "absolute", top: "1rem", right: "2rem" }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
