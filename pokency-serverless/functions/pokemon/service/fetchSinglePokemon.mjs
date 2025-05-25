export async function fetchPokemonData(name) {
  const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${name}`;
  const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${name}`;

  const [pokemonResponse, speciesResponse] = await Promise.all([
    fetch(pokemonUrl),
    fetch(speciesUrl),
  ]);

  if (!pokemonResponse.ok) {
    throw new Error(`Pokémon "${name}" not found`);
  }

  const data = await pokemonResponse.json();
  const speciesData = await speciesResponse.json();

  const koreanName = speciesData.names.find(
    (n) => n.language.name === "ko"
  )?.name;
  const koreanFlavor = speciesData.flavor_text_entries
    .find((e) => e.language.name === "ko")
    ?.flavor_text?.replace(/\f/g, " ")
    .replace(/\n/g, " ");

  return {
    name: data.name,
    name_ko: koreanName,
    id: data.id,
    base_experience: data.base_experience,
    height: data.height,
    weight: data.weight,
    types: data.types.map((t) => t.type.name),
    stats: Object.fromEntries(
      data.stats.map((s) => [s.stat.name, s.base_stat])
    ),
    sprite: data.sprites.front_default,
    official_artwork: data.sprites.other["official-artwork"].front_default,
    description_ko: koreanFlavor,
  };
}
