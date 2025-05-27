export default function MoveButton({ move, onClick, disabled }) {
  // 모든 포켓몬 타입 컬러 (Pokency 컨셉 반영)
  const typeColor = {
    normal: "bg-gray-100 text-gray-800",
    fire: "bg-orange-200 text-orange-700",
    water: "bg-blue-200 text-blue-700",
    electric: "bg-yellow-200 text-yellow-700",
    grass: "bg-green-200 text-green-800",
    ice: "bg-cyan-100 text-cyan-700",
    fighting: "bg-red-200 text-red-700",
    poison: "bg-purple-200 text-purple-700",
    ground: "bg-yellow-300 text-yellow-800",
    flying: "bg-blue-100 text-blue-600",
    psychic: "bg-pink-200 text-pink-700",
    bug: "bg-lime-200 text-lime-700",
    rock: "bg-yellow-400 text-yellow-900",
    ghost: "bg-violet-200 text-violet-700",
    dragon: "bg-indigo-200 text-indigo-700",
    dark: "bg-gray-700 text-gray-100",
    steel: "bg-gray-300 text-gray-900",
    fairy: "bg-pink-100 text-pink-600",
    // 이하 없는 타입은 default
  };
  const color = typeColor[move.type] || "bg-slate-100 text-slate-700";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${color}
        border-2 border-gray-200 rounded-2xl shadow font-bold text-base py-3 px-4
        hover:border-yellow-400 hover:shadow-lg transition-all
        disabled:bg-gray-100 disabled:text-gray-400 disabled:opacity-60
        flex flex-col items-center w-full h-24
      `}
      style={{ minWidth: 0, minHeight: "56px" }}
    >
      <span className="text-lg">{move.name_ko || move.name}</span>
      <span className="mt-1 text-xs">
        PP: {move.current_pp ?? move.pp} / {move.pp} | 위력: {move.power ?? "-"}
      </span>
      <span className="mt-0.5 text-xs font-normal">타입: {move.type}</span>
    </button>
  );
}
