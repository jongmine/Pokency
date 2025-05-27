export default function PokemonMovesTab({ moves }) {
  return (
    <div className="max-h-48 overflow-y-auto flex flex-wrap gap-2">
      {moves.slice(0, 30).map((move) => (
        <div
          key={move.name}
          className="bg-orange-100 text-orange-600 rounded-xl px-4 py-1 text-sm font-semibold shadow"
        >
          <span className="font-bold">{move.name_ko}</span>
          <span className="ml-2 text-xs text-orange-400">{move.type}</span>
          <span className="ml-2 text-xs">
            {move.power && `위력: ${move.power}`}
          </span>
          <span className="block text-xs text-gray-500 mt-1">
            {move.description_ko}
          </span>
        </div>
      ))}
      {moves.length > 30 && (
        <div className="w-full text-center text-gray-400 mt-3">
          (기술이 너무 많아 30개만 표시됨)
        </div>
      )}
    </div>
  );
}
