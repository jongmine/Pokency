export async function fetchPokemonList({ limit = 20, offset = 0 }) {
  console.time(`[fetchPokemonList] 전체`);
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  console.time(`[fetchPokemonList] pokemon 리스트`);
  const response = await fetch(url);
  console.timeEnd(`[fetchPokemonList] pokemon 리스트`);

  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon list");
  }

  const data = await response.json();

  console.time(`[fetchPokemonList] species 한글명 fetch`);
  const localizedList = await Promise.all(
    data.results.map(async (pokemon) => {
      const id = Number(pokemon.url.split("/").filter(Boolean).pop());
      let koreanName = pokemon.name;
      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`
        );
        if (res.ok) {
          const species = await res.json();
          const koreanNameEntry = species.names.find(
            (entry) => entry.language.name === "ko"
          );
          if (koreanNameEntry) koreanName = koreanNameEntry.name;
        }
      } catch (e) {}
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

  console.timeEnd(`[fetchPokemonList] species 한글명 fetch`);
  console.timeEnd(`[fetchPokemonList] 전체`);

  return {
    results: localizedList,
    count: data.count,
  };
}
