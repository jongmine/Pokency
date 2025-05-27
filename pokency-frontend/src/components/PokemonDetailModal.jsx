import { useState } from "react";
import PokemonBasicTab from "./PokemonBasicTab";
import PokemonMovesTab from "./PokemonMovesTab";
import PokemonAbilitiesTab from "./PokemonAbilitiesTab";
import PokemonEvolutionTab from "./PokemonEvolutionTab";
import { mockInfo, mockAbilities, mockMoves, mockEvolution } from "./mockData";

const TABS = [
  { key: "basic", label: "기본정보" },
  { key: "moves", label: "기술" },
  { key: "abilities", label: "특성" },
  { key: "evolution", label: "진화" },
];

export default function PokemonDetailModal({
  open,
  onClose,
  selectedPokemon,
  onSelect,
}) {
  const [activeTab, setActiveTab] = useState("basic");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border-4 border-yellow-200 animate-fade-in-up relative"
        style={{ minWidth: 320, maxHeight: "90vh", overflowY: "auto" }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="닫기"
          className="absolute top-5 right-5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-extrabold border border-gray-300 shadow-sm transition-colors duration-300 z-10"
        >
          ×
        </button>
        {/* 상단 정보 */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={mockInfo.official_artwork || mockInfo.sprite}
            alt={mockInfo.name_ko}
            className="w-28 h-28 rounded-full shadow-xl border-4 border-yellow-200 bg-yellow-50 mb-4"
          />
          <h2 className="text-3xl font-extrabold text-yellow-600 flex items-center gap-3">
            {mockInfo.name_ko}
            <span className="text-lg text-gray-500 font-semibold">
              #{mockInfo.id}
            </span>
          </h2>
          <div className="flex gap-3 mt-2">
            {mockInfo.types.map((type) => (
              <span
                key={type}
                className="px-4 py-1 bg-yellow-200 text-yellow-700 rounded-2xl text-sm font-bold shadow"
              >
                {type}
              </span>
            ))}
          </div>
          <p className="mt-4 text-base text-gray-600 text-center">
            {mockInfo.description_ko}
          </p>
        </div>
        {/* 탭 바 */}
        <nav className="flex justify-center gap-6 border-b border-yellow-200 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 font-semibold text-yellow-600 border-b-4 ${
                activeTab === tab.key
                  ? "border-yellow-400"
                  : "border-transparent hover:border-yellow-300"
              } transition-colors duration-300`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        {/* 탭 컨텐츠 */}
        <div className="text-gray-700 text-base min-h-[130px]">
          {activeTab === "basic" && <PokemonBasicTab info={mockInfo} />}
          {activeTab === "moves" && <PokemonMovesTab moves={mockMoves} />}
          {activeTab === "abilities" && (
            <PokemonAbilitiesTab abilities={mockAbilities} />
          )}
          {activeTab === "evolution" && (
            <PokemonEvolutionTab evolution={mockEvolution} />
          )}
        </div>
        {/* === CTA 버튼 추가 === */}
        <button
          onClick={() => {
            if (onSelect) onSelect(selectedPokemon);
            onClose();
          }}
          className="mt-6 w-full bg-yellow-300 hover:bg-yellow-400 border border-yellow-500 text-yellow-900 font-extrabold text-lg rounded-3xl shadow-lg py-3 transition-colors duration-300"
        >
          이 포켓몬으로 배틀
        </button>
      </div>
    </div>
  );
}
