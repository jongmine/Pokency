import { fetchPokemonList } from "./service/fetchPokemonList.mjs";
import { fetchPokemonData } from "./service/fetchSinglePokemon.mjs";
import { ok, badRequest, internalError } from "./utils/response.mjs";

export const lambdaHandler = async (event) => {
  const { httpMethod, path, queryStringParameters, pathParameters } = event;

  // 목록 조회
  if (httpMethod === "GET" && path === "/pokemon") {
    try {
      const limit = parseInt(queryStringParameters?.limit) || 20;
      const offset = parseInt(queryStringParameters?.offset) || 0;
      const list = await fetchPokemonList(limit, offset);
      return ok(list);
    } catch (err) {
      return internalError(err.message || "Failed to fetch Pokémon list");
    }
  }

  // 단일 조회
  if (httpMethod === "GET" && pathParameters?.name) {
    try {
      const data = await fetchPokemonData(pathParameters.name);
      return ok(data);
    } catch (err) {
      return internalError(err.message || "Failed to fetch Pokémon data");
    }
  }

  return badRequest("Invalid request");
};
