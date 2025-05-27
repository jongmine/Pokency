export default function MoveButton({ move, onClick, disabled }) {
  // 포켓몬 타입별 배경색 추천값
  const typeColor = {
    electric: "bg-yellow-200 text-yellow-700",
    normal: "bg-gray-100 text-gray-600",
    steel: "bg-gray-200 text-gray-700",
    fire: "bg-orange-200 text-orange-700",
    water: "bg-blue-200 text-blue-700",
    grass: "bg-green-200 text-green-700",
    // 기타 타입 추가 가능
  };
  const color = typeColor[move.type] || "bg-slate-100 text-slate-600";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${color} border-2 border-gray-200 rounded-2xl shadow font-bold text-lg py-3 px-6
        hover:border-yellow-400 hover:shadow-lg transition-all
        disabled:bg-gray-100 disabled:text-gray-400 disabled:opacity-60
      `}
      style={{ minWidth: 0 }}
    >
      <span>{move.name}</span>
      <span className="ml-2 text-xs align-middle">PP:{move.pp}</span>
    </button>
  );
}
