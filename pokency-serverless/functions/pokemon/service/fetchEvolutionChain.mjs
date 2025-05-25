export async function fetchEvolutionChain(name) {
  // Step 1: Get Pokémon species info
  const speciesRes = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${name}`
  );
  if (!speciesRes.ok) throw new Error("Failed to fetch species info");
  const speciesData = await speciesRes.json();

  const evoChainUrl = speciesData.evolution_chain.url;

  // Step 2: Get the full evolution chain
  const evoRes = await fetch(evoChainUrl);
  if (!evoRes.ok) throw new Error("Failed to fetch evolution chain data");
  const evoData = await evoRes.json();

  // Step 3: Traverse evolution chain
  const chain = [];

  const traverse = async (node) => {
    const res = await fetch(node.species.url);
    const detail = await res.json();

    const koreanNameEntry = detail.names.find(
      (entry) => entry.language.name === "ko"
    );
    const koreanName = koreanNameEntry ? koreanNameEntry.name : detail.name;

    chain.push({
      id: parseInt(detail.id),
      name: detail.name,
      name_ko: koreanName,
    });

    if (node.evolves_to.length > 0) {
      await traverse(node.evolves_to[0]);
    }
  };

  await traverse(evoData.chain);
  return { chain };
}
