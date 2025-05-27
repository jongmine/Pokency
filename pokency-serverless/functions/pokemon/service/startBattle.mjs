const MAX_MOVES = 4;
const MAX_HP = 100;
// PokéAPI 기준 전체 포켓몬 개수(2025.05 기준)
const MAX_POKEMON_ID = 1302; // 필요시 최신화

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function selectRandomMoves(moves) {
  const filtered = moves.filter((m) => m.power > 0);
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, MAX_MOVES);
}

// 단일 파일 내 직접 fetch
async function fetchPokemonDataByIdOrName(idOrName) {
  const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${idOrName}`;
  const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${idOrName}`;
  const [pokemonRes, speciesRes] = await Promise.all([
    fetch(pokemonUrl),
    fetch(speciesUrl),
  ]);
  if (!pokemonRes.ok)
    throw new Error(`[fetchPokemonData] not found: ${idOrName}`);
  const data = await pokemonRes.json();
  const speciesData = await speciesRes.json();
  const koreanName = speciesData.names.find(
    (n) => n.language.name === "ko"
  )?.name;
  return {
    name: data.name,
    name_ko: koreanName || data.name,
    id: data.id,
    stats: Object.fromEntries(
      data.stats.map((s) => [s.stat.name, s.base_stat])
    ),
    types: data.types.map((t) => t.type.name),
    sprite: data.sprites.front_default,
    official_artwork: data.sprites.other["official-artwork"].front_default,
    moves: data.moves, // [{move: {name}} ...]
  };
}

// 기술 상세 정보 fetch
async function fetchMoveDetails(moveName) {
  const moveUrl = `https://pokeapi.co/api/v2/move/${moveName}`;
  const res = await fetch(moveUrl);
  if (!res.ok) return null;
  const moveData = await res.json();
  const koreanNameEntry = moveData.names.find(
    (entry) => entry.language.name === "ko"
  );
  const koreanDescEntry = moveData.flavor_text_entries.find(
    (entry) => entry.language.name === "ko"
  );
  return {
    name: moveData.name,
    name_ko: koreanNameEntry ? koreanNameEntry.name : moveData.name,
    type: moveData.type.name,
    power: moveData.power,
    accuracy: moveData.accuracy,
    pp: moveData.pp,
    damage_class: moveData.damage_class.name,
    description_ko: koreanDescEntry
      ? koreanDescEntry.flavor_text.replace(/\n|\f/g, " ")
      : null,
  };
}

export const startBattle = async (userPokemonName) => {
  console.time(`[startBattle] 전체`);
  console.log(`[startBattle] 시작: 유저 포켓몬 = ${userPokemonName}`);

  // 적 포켓몬은 랜덤 id로 뽑는다
  let enemyData = null;
  let tries = 0;
  while (!enemyData && tries < 3) {
    const enemyId = getRandomInt(1, MAX_POKEMON_ID);
    try {
      enemyData = await fetchPokemonDataByIdOrName(enemyId);
    } catch (e) {
      tries++;
      console.warn(
        `[startBattle] enemy fetch fail (id=${enemyId}), retrying...`
      );
    }
  }
  if (!enemyData) throw new Error("[startBattle] 적 포켓몬 fetch 실패");

  // 유저 포켓몬 정보
  const userData = await fetchPokemonDataByIdOrName(userPokemonName);

  // 기술 정보: 유저/적 각자 보유한 기술에서만 랜덤 4개 뽑기 (power > 0)
  const userMoveNames = userData.moves
    .filter((m) => m.move)
    .map((m) => m.move.name);
  const enemyMoveNames = enemyData.moves
    .filter((m) => m.move)
    .map((m) => m.move.name);

  // 유저/적 각각 기술 중 랜덤 4개씩 뽑아서 동시에 상세 fetch
  const userMovesSample = selectRandomMoves(
    await Promise.all(userMoveNames.map(fetchMoveDetails))
  );
  const enemyMovesSample = selectRandomMoves(
    await Promise.all(enemyMoveNames.map(fetchMoveDetails))
  );

  console.timeEnd(`[startBattle] 전체`);
  return {
    user: {
      name: userData.name,
      name_ko: userData.name_ko,
      hp: MAX_HP,
      stats: userData.stats,
      types: userData.types,
      sprite: userData.sprite,
      official_artwork: userData.official_artwork,
      moves: userMovesSample,
    },
    enemy: {
      name: enemyData.name,
      name_ko: enemyData.name_ko,
      hp: MAX_HP,
      stats: enemyData.stats,
      types: enemyData.types,
      sprite: enemyData.sprite,
      official_artwork: enemyData.official_artwork,
      moves: enemyMovesSample,
    },
  };
};
