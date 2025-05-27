export default function PokemonAbilitiesTab({ abilities }) {
  return (
    <div className="flex flex-col gap-3">
      {abilities.map((ab) => (
        <div
          key={ab.name}
          className="bg-green-100 text-green-700 rounded-xl px-4 py-2 text-sm font-semibold shadow"
        >
          <span>{ab.name_ko}</span>
          <span className="ml-2 text-xs text-green-500">
            {ab.short_effect_ko}
          </span>
        </div>
      ))}
    </div>
  );
}
