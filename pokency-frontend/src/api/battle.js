import api from "./client";

export const startBattle = async (pokemonName) => {
  const { data } = await api.post("/battle/start", {
    playerName: pokemonName,
  });
  return data;
};

export const proceedTurn = async ({ user, enemy, userMove }) => {
  const { data } = await api.post("/battle/turn", {
    user,
    enemy,
    userMove,
  });
  return data;
};
