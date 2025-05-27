export async function fetchPokemonList(limit = 20, offset = 0) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon list");
  }

  const data = await response.json();

  const localizedList = await Promise.all(
    data.results.map(async (pokemon) => {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`
      );
      let koreanName = pokemon.name;
      if (res.ok) {
        const species = await res.json();
        const koreanNameEntry = species.names.find(
          (entry) => entry.language.name === "ko"
        );
        if (koreanNameEntry) {
          koreanName = koreanNameEntry.name;
        }
      }
      // id 추출
      const id = Number(pokemon.url.split("/").filter(Boolean).pop());
      return {
        name: pokemon.name,
        name_ko: koreanName,
        url: pokemon.url,
        id,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        official_artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      };
    })
  );

  return localizedList;
}
