import PokemonCard from "../components/PokemonCard";
import PokemonDetailModal from "../components/PokemonDetailModal";
import RecentBattleHistory from "../components/RecentBattleHistory";
import { fetchPokemonList } from "../api/pokemon";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePokemonStore } from "../store/pokemonStore";

const PAGE_SIZE = 20;

export default function SelectPokemonPage() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedPokemon, setSelectedPokemonLocal] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [battlePokemon, setBattlePokemon] = useState(null);
  const [recentPokemonId, setRecentPokemonId] = useState(null);
  const [battleHistory, setBattleHistory] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const setSelectedPokemon = usePokemonStore(
    (state) => state.setSelectedPokemon
  );

  // 페이지네이션: page가 바뀔 때마다 포켓몬 데이터 fetch
  useEffect(() => {
    setLoading(true);
    fetchPokemonList(PAGE_SIZE, page * PAGE_SIZE)
      .then((data) => {
        // fetchPokemonList는 { results, count } 형태로 반환되어야 함!
        setPokemons(data?.results ?? []);
        setTotalCount(data?.count ?? 0);
      })
      .catch(() => {
        setPokemons([]);
        setTotalCount(0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const maxPage = totalCount > 0 ? Math.ceil(totalCount / PAGE_SIZE) - 1 : 0;

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

  const handleSelect = (pokemon) => {
    setSelectedPokemonLocal(pokemon);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedPokemonLocal(null);
  };

  const handleBattleSelect = (pokemon) => {
    setBattlePokemon(pokemon);
    setSelectedPokemon(pokemon); // Zustand store에 반영
    setDrawerOpen(false);
    setSelectedPokemonLocal(null);
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center py-14 px-4">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent drop-shadow-md">
        배틀할 포켓몬을 선택하세요!
      </h1>
      {loading ? (
        <div className="flex flex-col items-center my-20 gap-4">
          <div className="text-lg text-yellow-500 font-semibold animate-pulse">
            포켓몬을 불러오는 중...
          </div>
          <div className="relative flex items-center justify-center w-32 h-32">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="포켓볼"
              className="w-24 h-24 animate-spin-slow"
              style={{ animationDuration: "2s" }}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 w-full max-w-5xl mb-10">
            {Array.isArray(pokemons) && pokemons.length > 0 ? (
              pokemons.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id || pokemon.name}
                  pokemon={pokemon}
                  onClick={() => handleSelect(pokemon)}
                  isSelected={battlePokemon?.id === pokemon.id}
                  isRecent={recentPokemonId === pokemon.id}
                />
              ))
            ) : (
              <div className="col-span-full text-gray-400 text-center py-10">
                포켓몬 데이터가 없습니다.
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button
              className="bg-yellow-300 hover:bg-yellow-400 border-2 border-yellow-400 text-yellow-900 font-extrabold py-3 px-6 rounded-3xl shadow-lg transition duration-300 ease-in-out disabled:bg-yellow-200"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              이전
            </button>
            <span className="font-bold text-lg text-orange-500 px-4 self-center">{`${
              page + 1
            } / ${maxPage + 1}`}</span>
            <button
              className="bg-yellow-300 hover:bg-yellow-400 border-2 border-yellow-400 text-yellow-900 font-extrabold py-3 px-6 rounded-3xl shadow-lg transition duration-300 ease-in-out disabled:bg-yellow-200"
              onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
              disabled={page >= maxPage}
            >
              다음
            </button>
          </div>
        </>
      )}
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
            className="bg-orange-300 hover:bg-orange-400 border-2 border-orange-400 text-yellow-900 font-extrabold py-3 px-8 mt-3 rounded-3xl shadow-lg transition duration-300 ease-in-out"
            onClick={() => {
              localStorage.setItem(
                "lastSelectedPokemon",
                JSON.stringify(battlePokemon)
              );
              setRecentPokemonId(battlePokemon.id);
              alert(`배틀하러 갑니다! 선택 포켓몬: ${battlePokemon.name_ko}`);
              navigate("/battle");
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
