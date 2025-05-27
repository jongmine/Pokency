export default function PokemonBasicTab({ info }) {
  return (
    <div className="space-y-3">
      <div>
        <span className="font-bold">키:</span> {info.height} dm
      </div>
      <div>
        <span className="font-bold">몸무게:</span> {info.weight} kg
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.entries(info.stats).map(([name, stat]) => (
          <div
            key={name}
            className="bg-yellow-100 rounded px-3 py-1 text-xs font-semibold"
          >
            {name}: {stat}
          </div>
        ))}
      </div>
    </div>
  );
}
