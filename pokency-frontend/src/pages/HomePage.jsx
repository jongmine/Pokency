import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-pink-100 text-gray-800 px-4">
      <div className="w-[90vw] max-w-screen-lg aspect-video bg-white bg-opacity-30 rounded-xl shadow-xl p-8 flex flex-col items-center justify-center">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-sm mb-6">
            Pokency
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600">
            나만의 포켓몬을 선택하고, 전투를 시작하세요!
          </p>
          <Link
            to="/select"
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition duration-300 ease-in-out"
          >
            포켓몬 선택하러 가기
          </Link>
        </div>
        <div className="mt-16 opacity-80">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
            alt="피카츄"
            className="w-40 md:w-52 mx-auto animate-bounce"
          />
        </div>
      </div>
    </div>
  );
}
