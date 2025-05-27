import api from "./client";

export const fetchPokemonList = async ({ limit = 10, offset = 0 }) =>
  (await api.get(`/pokemon?limit=${limit}&offset=${offset}`)).data;

export const fetchPokemonDetail = async (name) =>
  (await api.get(`/pokemon/${name}`)).data;

export const fetchPokemonAbilities = async (name) =>
  (await api.get(`/pokemon/${name}/abilities`)).data;

export const fetchPokemonMoves = async (name) =>
  (await api.get(`/pokemon/${name}/moves`)).data;

export const fetchPokemonEvolution = async (name) =>
  (await api.get(`/pokemon/${name}/evolution`)).data;
