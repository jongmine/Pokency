export default function PokemonCard({
  pokemon,
  onClick,
  isSelected,
  isRecent,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group flex flex-col items-center !bg-white rounded-3xl shadow-xl p-6
        border-2 border-fuchsia-100 hover:bg-fuchsia-50 hover:border-fuchsia-300
        active:bg-fuchsia-100 transition focus-visible:ring-2 focus-visible:ring-fuchsia-300 cursor-pointer
        ${
          isSelected
            ? "ring-4 ring-orange-400 scale-105 z-10 border-orange-300"
            : ""
        }
      `}
      style={{ minWidth: 0, minHeight: 0, position: "relative" }}
    >
      {isRecent && (
        <span className="absolute -top-2 -left-2 bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
          최근 사용!
        </span>
      )}
      <div
        className={`
          w-24 h-24 flex items-center justify-center rounded-full
          bg-gradient-to-br from-indigo-200 via-pink-100 to-sky-200 mb-3 shadow-inner overflow-hidden
          border-2 border-fuchsia-200 group-hover:border-fuchsia-300 transition
          ${isSelected ? "border-4 border-orange-400" : ""}
        `}
      >
        <img
          src={pokemon.sprite}
          alt={pokemon.name_ko}
          className="w-20 h-20 object-contain transition group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <span className="font-bold text-lg text-indigo-700 mb-1 tracking-tight">
        {pokemon.name_ko}
      </span>
      <span className="text-xs text-fuchsia-500">
        #{String(pokemon.id).padStart(3, "0")}
      </span>
    </button>
  );
}
