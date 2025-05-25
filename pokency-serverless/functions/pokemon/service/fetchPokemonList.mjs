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
      if (!res.ok) {
        return {
          name: pokemon.name,
          url: pokemon.url,
        };
      }
      const species = await res.json();
      const koreanNameEntry = species.names.find(
        (entry) => entry.language.name === "ko"
      );
      const koreanName = koreanNameEntry ? koreanNameEntry.name : pokemon.name;

      return {
        name: pokemon.name,
        name_ko: koreanName,
        url: pokemon.url,
      };
    })
  );

  return localizedList;
}
