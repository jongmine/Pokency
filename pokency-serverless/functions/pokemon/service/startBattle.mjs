import { fetchPokemonList } from "./fetchPokemonList.mjs";
import { fetchPokemonData } from "./fetchSinglePokemon.mjs";
import { fetchPokemonMoves } from "./fetchPokemonMoves.mjs";

const MAX_MOVES = 4;
const MAX_HP = 100;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function selectRandomMoves(moves) {
  const filtered = moves.filter((m) => m.power > 0);
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, MAX_MOVES);
}

export const startBattle = async (userPokemonName) => {
  console.time(`[startBattle] 전체`);
  console.log(`[startBattle] 시작: 유저 포켓몬 = ${userPokemonName}`);
  const allPokemon = await fetchPokemonList(200, 0);

  const enemyPokemonName = allPokemon[getRandomInt(allPokemon.length)].name;
  console.log(`[startBattle] 적 포켓몬 선택: ${enemyPokemonName}`);

  console.time(`[startBattle] userData, userMoves, enemyData, enemyMoves fetch`);
  const [userData, userMoves, enemyData, enemyMoves] = await Promise.all([
    fetchPokemonData(userPokemonName),
    fetchPokemonMoves(userPokemonName),
    fetchPokemonData(enemyPokemonName),
    fetchPokemonMoves(enemyPokemonName),
  ]);
  console.timeEnd(`[startBattle] userData, userMoves, enemyData, enemyMoves fetch`);

  const userSelectedMoves = selectRandomMoves(userMoves.moves).map((m) => ({
    name: m.name,
    name_ko: m.name_ko,
    type: m.type,
    power: m.power,
    accuracy: m.accuracy,
    pp: m.pp,
    damage_class: m.damage_class,
    description_ko: m.description_ko,
  }));

  const enemySelectedMoves = selectRandomMoves(enemyMoves.moves).map((m) => ({
    name: m.name,
    name_ko: m.name_ko,
    type: m.type,
    power: m.power,
    accuracy: m.accuracy,
    pp: m.pp,
    damage_class: m.damage_class,
    description_ko: m.description_ko,
  }));

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
      moves: userSelectedMoves,
    },
    enemy: {
      name: enemyData.name,
      name_ko: enemyData.name_ko,
      hp: MAX_HP,
      stats: enemyData.stats,
      types: enemyData.types,
      sprite: enemyData.sprite,
      official_artwork: enemyData.official_artwork,
      moves: enemySelectedMoves,
    },
  };
};
