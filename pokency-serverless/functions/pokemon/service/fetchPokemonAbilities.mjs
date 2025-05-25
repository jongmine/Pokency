const API_BASE = "https://pokeapi.co/api/v2";

export const fetchPokemonAbilities = async (name) => {
  const pokemonRes = await fetch(`${API_BASE}/pokemon/${name}`);
  if (!pokemonRes.ok) throw new Error("Failed to fetch Pokémon data");

  const pokemonData = await pokemonRes.json();
  const abilityList = pokemonData.abilities;

  const results = await Promise.all(
    abilityList.map(async ({ ability }) => {
      const abilityRes = await fetch(ability.url);
      if (!abilityRes.ok) return null;

      const abilityData = await abilityRes.json();

      const name_ko =
        abilityData.names.find((n) => n.language.name === "ko")?.name ||
        ability.name;

      const effectEntry = abilityData.effect_entries.find(
        (entry) => entry.language.name === "ko"
      );
      const shortEffect = abilityData.flavor_text_entries.find(
        (entry) => entry.language.name === "ko"
      );

      return {
        name: ability.name,
        name_ko,
        effect_ko: effectEntry?.effect || null,
        short_effect_ko: shortEffect?.flavor_text || null,
      };
    })
  );

  return {
    pokemon: name.toLowerCase(),
    abilities: results.filter(Boolean),
  };
};
