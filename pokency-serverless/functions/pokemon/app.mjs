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

  // 진화 트리 조회
  if (httpMethod === "GET" && path.match(/^\/pokemon\/[^/]+\/evolution$/)) {
    try {
      const name = pathParameters?.name;
      if (!name) return badRequest("Missing Pokémon name in path");

      const { fetchEvolutionChain } = await import(
        "./service/fetchEvolutionChain.mjs"
      );
      const data = await fetchEvolutionChain(name);
      return ok(data);
    } catch (err) {
      return internalError(err.message || "Failed to fetch evolution chain");
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

  // 타입 상성 조회
  if (httpMethod === "GET" && path === "/battle/type-effectiveness") {
    try {
      const attacker = queryStringParameters?.attacker;
      const defender = queryStringParameters?.defender;
      if (!attacker || !defender) {
        return badRequest("Missing attacker or defender type");
      }

      const { fetchTypeEffectiveness } = await import(
        "./service/fetchTypeEffectiveness.mjs"
      );
      const result = await fetchTypeEffectiveness(attacker, defender);
      return ok(result);
    } catch (err) {
      return internalError(err.message || "Failed to fetch type effectiveness");
    }
  }

  return badRequest("Invalid request");
};
