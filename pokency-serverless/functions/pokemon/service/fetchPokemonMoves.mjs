const API_BASE = "https://pokeapi.co/api/v2";

export const fetchPokemonMoves = async (name) => {
  console.time(`[fetchPokemonMoves] ${name}`);
  const res = await fetch(`${API_BASE}/pokemon/${name.toLowerCase()}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon data");

  const pokemonData = await res.json();

  console.log(`[fetchPokemonMoves] ${name}의 기술 수: ${pokemonData.moves.length}`);

  console.time(`[fetchPokemonMoves] move 상세 fetch: ${name}`);
  const movePromises = pokemonData.moves.map(async (moveEntry, idx) => {
    const moveName = moveEntry.move.name;

    // move 상세정보 가져오기
    const moveRes = await fetch(`${API_BASE}/move/${moveName}`);
    if (!moveRes.ok) return null;

    const moveData = await moveRes.json();

    // 한글 이름과 설명 추출
    const koreanNameEntry = moveData.names.find(
      (entry) => entry.language.name === "ko"
    );
    const koreanName = koreanNameEntry ? koreanNameEntry.name : moveName;

    const koreanDescEntry = moveData.flavor_text_entries.find(
      (entry) => entry.language.name === "ko"
    );
    const koreanDesc = koreanDescEntry
      ? koreanDescEntry.flavor_text.replace(/\n|\f/g, " ")
      : null;

    // 배우는 방식 정리
    const learnMethods = moveEntry.version_group_details.map((detail) => ({
      method: detail.move_learn_method.name,
      level: detail.level_learned_at || null,
      version_group: detail.version_group.name,
    }));

    if (idx % 10 === 0) {
      // 10개 단위마다 진행상황 로깅
      console.log(`[fetchPokemonMoves] ${name}: ${idx + 1}/${pokemonData.moves.length} 기술 fetch 중`);
    }

    return {
      name: moveName,
      name_ko: koreanName,
      type: moveData.type.name,
      power: moveData.power,
      pp: moveData.pp,
      accuracy: moveData.accuracy,
      damage_class: moveData.damage_class.name,
      description_ko: koreanDesc,
      learn_methods: learnMethods,
    };
  });

  const moves = (await Promise.all(movePromises)).filter((m) => m !== null);
  console.timeEnd(`[fetchPokemonMoves] move 상세 fetch: ${name}`);
  console.timeEnd(`[fetchPokemonMoves] ${name}`);

  return {
    pokemon: pokemonData.name,
    moves,
  };
};
