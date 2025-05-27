export default function PokemonEvolutionTab({ evolution }) {
  // evolution이 배열인지 확인
  if (!evolution || !Array.isArray(evolution)) return null;
  return (
    <div className="flex gap-6 justify-center flex-wrap max-h-36 overflow-x-auto py-2">
      {evolution.map((evo) => (
        <div key={evo.name} className="flex flex-col items-center w-20">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`}
            alt={evo.name}
            className="w-16 h-16 rounded-full bg-gray-50 border-2 border-yellow-200 mb-2"
          />
          <span className="text-sm font-semibold text-center">
            {evo.name_ko}
          </span>
        </div>
      ))}
    </div>
  );
}
