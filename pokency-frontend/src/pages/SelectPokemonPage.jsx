import PokemonCard from "../components/PokemonCard";
import PokemonDetailModal from "../components/PokemonDetailModal";
import RecentBattleHistory from "../components/RecentBattleHistory";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_POKEMONS = [
  // ...12개 이상 채워도 OK
  {
    name: "bulbasaur",
    name_ko: "이상해씨",
    id: 1,
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  },
  {
    name: "charmander",
    name_ko: "파이리",
    id: 4,
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
  },
  {
    name: "squirtle",
    name_ko: "꼬부기",
    id: 7,
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
  },
  {
    name: "pikachu",
    name_ko: "피카츄",
    id: 25,
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  },
  {
    name: "eevee",
    name_ko: "이브이",
    id: 133,
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
  },
  {
    name: "jigglypuff",
    name_ko: "푸린",
    id: 39,
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
  },
  {
    name: "snorlax",
    name_ko: "잠만보",
    id: 143,
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png",
  },
  {
    name: "psyduck",
    name_ko: "고라파덕",
    id: 54,
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png",
  },
  {
    name: "gengar",
    name_ko: "팬텀",
    id: 94,
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
  },
  {
    name: "meowth",
    name_ko: "나옹",
    id: 52,
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png",
  },
  {
    name: "magikarp",
    name_ko: "잉어킹",
    id: 129,
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png",
  },
  {
    name: "mew",
    name_ko: "뮤",
    id: 151,
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png",
  },
];

const PAGE_SIZE = 8;

export default function SelectPokemonPage() {
  const [page, setPage] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [battlePokemon, setBattlePokemon] = useState(null);
  const [recentPokemonId, setRecentPokemonId] = useState(null); // 최근 포켓몬 id
  const [battleHistory, setBattleHistory] = useState([]);
  const navigate = useNavigate();

  const total = MOCK_POKEMONS.length;
  const maxPage = Math.ceil(total / PAGE_SIZE) - 1;
  const pagePokemons = MOCK_POKEMONS.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  const handleSelect = (pokemon) => {
    setSelectedPokemon(pokemon);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedPokemon(null);
  };

  const handleBattleSelect = (pokemon) => {
    setBattlePokemon(pokemon);
    setDrawerOpen(false);
    setSelectedPokemon(null);
  };

  // 최근 선택 포켓몬 복원
  useEffect(() => {
    const last = localStorage.getItem("lastSelectedPokemon");
    if (last) {
      const lastPokemon = JSON.parse(last);
      setBattlePokemon(lastPokemon);
      setRecentPokemonId(lastPokemon.id);
    }
  }, []);

  // 최근 5개 배틀 기록 불러오기
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("battleHistory") || "[]");
    setBattleHistory(history);
  }, []);

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center py-14 px-4">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent drop-shadow-md">
        배틀할 포켓몬을 선택하세요!
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 w-full max-w-5xl mb-10">
        {pagePokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={() => handleSelect(pokemon)}
            isSelected={battlePokemon?.id === pokemon.id}
            isRecent={recentPokemonId === pokemon.id} // 최근 포켓몬 뱃지
          />
        ))}
      </div>
      <div className="flex gap-4">
        <button
          className="bg-yellow-300 hover:bg-yellow-400 border-2 border-yellow-400 text-yellow-900 font-extrabold py-3 px-6 rounded-3xl shadow-lg transition duration-300 ease-in-out disabled:bg-yellow-200"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 0}
        >
          이전
        </button>
        <button
          className="bg-yellow-300 hover:bg-yellow-400 border-2 border-yellow-400 text-yellow-900 font-extrabold py-3 px-6 rounded-3xl shadow-lg transition duration-300 ease-in-out disabled:bg-yellow-200"
          onClick={() => setPage((p) => p + 1)}
          disabled={page === maxPage}
        >
          다음
        </button>
      </div>
      <PokemonDetailModal
        open={drawerOpen}
        onClose={handleClose}
        selectedPokemon={selectedPokemon}
        onSelect={handleBattleSelect}
      />
      {battlePokemon && (
        <>
          <div className="mt-8 bg-white rounded-3xl shadow-xl border-2 border-orange-200 p-5 flex items-center gap-4 w-full max-w-md">
            <img
              src={battlePokemon.sprite}
              alt={battlePokemon.name_ko}
              className="w-24 h-24 rounded-full border-2 border-orange-300 bg-orange-50"
            />
            <div>
              <div className="text-orange-500 text-2xl font-extrabold">
                {battlePokemon.name_ko}
              </div>
              <div className="text-orange-200 text-lg font-semibold">
                #{battlePokemon.id}
              </div>
            </div>
          </div>
          <button
            className="bg-orange-300 hover:bg-orange-400 ... "
            onClick={() => {
              // localStorage와 recentPokemonId 갱신은 여기서!
              localStorage.setItem(
                "lastSelectedPokemon",
                JSON.stringify(battlePokemon)
              );
              setRecentPokemonId(battlePokemon.id);
              alert(`배틀하러 갑니다! 선택 포켓몬: ${battlePokemon.name_ko}`);
              navigate("/battle", { state: { pokemon: battlePokemon } });
            }}
          >
            배틀하러 가기
          </button>
        </>
      )}

      {/* 최근 5개 배틀 결과 */}
      <RecentBattleHistory history={battleHistory} />
    </div>
  );
}
