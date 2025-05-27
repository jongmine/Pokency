import HpBar from "../components/Battle/HpBar";
import MoveButton from "../components/Battle/MoveButton";
import BattleLog from "../components/Battle/BattleLog";
import BattleResultModal from "../components/Battle/BattleResultModal";
import { useState } from "react";

const mockPlayer = {
  name: "피카츄",
  level: 50,
  sprite:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  hp: 70,
  maxHp: 100,
};
const mockEnemy = {
  name: "이상해씨",
  level: 50,
  sprite:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  hp: 45,
  maxHp: 100,
};
const mockMoves = [
  { name: "10만 볼트", type: "electric", pp: 15, maxPp: 15 },
  { name: "아이언 테일", type: "steel", pp: 10, maxPp: 10 },
  { name: "전광석화", type: "normal", pp: 20, maxPp: 20 },
  { name: "볼트태클", type: "electric", pp: 5, maxPp: 5 },
];

export default function BattlePage() {
  const [battleLog, setBattleLog] = useState([
    "야생의 이상해씨가 나타났다!",
    "피카츄는 어떻게 할까?",
  ]);
  const [playerHp, setPlayerHp] = useState(mockPlayer.hp);
  const [enemyHp, setEnemyHp] = useState(mockEnemy.hp);
  const [playerPp, setPlayerPp] = useState(mockMoves.map((move) => move.pp));
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);

  // 애니메이션용 상태
  const [attackAnim, setAttackAnim] = useState(""); // "player" or "enemy" or ""
  const [damageNumber, setDamageNumber] = useState(null);

  const handleMove = (move, idx) => {
    if (gameOver || playerPp[idx] <= 0) return;
    setAttackAnim("player");
    const damage = Math.floor(Math.random() * 24) + 12;
    const newPp = [...playerPp];
    newPp[idx] = Math.max(0, newPp[idx] - 1);
    setPlayerPp(newPp);
    setTimeout(() => {
      setBattleLog((log) => [
        ...log,
        `피카츄의 ${move.name}!`,
        "효과는 굉장했다!",
      ]);
      setEnemyHp((hp) => {
        const nextHp = Math.max(0, hp - damage);
        if (nextHp <= 0) {
          setResult("win");
          setGameOver(true);
          setBattleLog((log) => [...log, "이상해씨는 쓰러졌다! 승리!"]);
        }
        return nextHp;
      });
      setDamageNumber({ to: "enemy", value: `-${damage}` });
      setTimeout(() => setDamageNumber(null), 900);
      setAttackAnim("");
    }, 400);
  };

  const handleRestart = () => {
    setPlayerHp(mockPlayer.hp);
    setEnemyHp(mockEnemy.hp);
    setPlayerPp(mockMoves.map((move) => move.pp));
    setBattleLog(["야생의 이상해씨가 나타났다!", "피카츄는 어떻게 할까?"]);
    setResult(null);
    setGameOver(false);
    setAttackAnim("");
    setDamageNumber(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-yellow-100 to-blue-100 flex flex-col items-center justify-center py-8 px-2 relative">
      {/* 상단 영역(상대) */}
      <div className="w-full max-w-2xl flex flex-col items-end mb-12 select-none">
        <div className="flex items-center gap-6 mb-2">
          <div className="text-xl font-bold text-green-900 drop-shadow">
            {mockEnemy.name}{" "}
            <span className="text-base">Lv.{mockEnemy.level}</span>
          </div>
          <HpBar hp={enemyHp} maxHp={mockEnemy.maxHp} />
        </div>
        <div className="h-36 flex items-center justify-end relative">
          <img
            src={mockEnemy.sprite}
            alt={mockEnemy.name}
            className={`w-32 h-32 drop-shadow-2xl transition-transform duration-300
              ${attackAnim === "player" ? "animate-shake" : ""}
              ${enemyHp <= 0 ? "opacity-50 grayscale" : ""}
            `}
            style={{ filter: "brightness(0.95)" }}
          />
          {damageNumber?.to === "enemy" && (
            <span className="absolute left-1/2 -translate-x-1/2 top-6 text-3xl font-extrabold text-red-500 animate-bounce drop-shadow-lg pointer-events-none select-none">
              {damageNumber.value}
            </span>
          )}
        </div>
      </div>

      {/* 중앙 내러티브 */}
      <div className="w-full max-w-2xl bg-white/80 rounded-xl shadow-lg p-6 mb-10 border-2 border-blue-200 min-h-[90px] backdrop-blur-sm">
        <BattleLog log={battleLog} />
      </div>

      {/* 내 영역 */}
      <div className="w-full max-w-2xl flex flex-col items-start mb-3 select-none">
        <div className="flex items-center gap-6 mb-2">
          <img
            src={mockPlayer.sprite}
            alt={mockPlayer.name}
            className={`w-24 h-24 drop-shadow-lg transition-transform duration-300
              ${attackAnim === "enemy" ? "animate-shake" : ""}
              ${playerHp <= 0 ? "opacity-50 grayscale" : ""}
            `}
            style={{ filter: "brightness(1.05)" }}
          />
          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold text-yellow-700 drop-shadow">
              {mockPlayer.name}{" "}
              <span className="text-base">Lv.{mockPlayer.level}</span>
            </div>
            <HpBar hp={playerHp} maxHp={mockPlayer.maxHp} />
          </div>
        </div>
      </div>

      {/* 기술 선택 버튼 */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
        {mockMoves.map((move, idx) => (
          <MoveButton
            key={move.name}
            move={{ ...move, pp: playerPp[idx] }}
            onClick={() => handleMove(move, idx)}
            disabled={gameOver || playerPp[idx] <= 0}
          />
        ))}
      </div>

      {/* 게임 결과 모달 */}
      {gameOver && (
        <BattleResultModal result={result} onRestart={handleRestart} showHome />
      )}

      {/* 애니메이션용 Tailwind 클래스 */}
      <style>
        {`
        @keyframes shake {
          0% { transform: translateX(0);}
          20% { transform: translateX(-7px);}
          40% { transform: translateX(5px);}
          60% { transform: translateX(-7px);}
          80% { transform: translateX(5px);}
          100% { transform: translateX(0);}
        }
        .animate-shake {
          animation: shake 0.45s;
        }
        `}
      </style>
    </div>
  );
}
