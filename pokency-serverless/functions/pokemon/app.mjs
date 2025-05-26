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

  // 포켓몬 기술 목록 조회
  if (httpMethod === "GET" && path.match(/^\/pokemon\/[^/]+\/moves$/)) {
    try {
      const name = pathParameters?.name;
      if (!name) return badRequest("Missing Pokémon name in path");

      const { fetchPokemonMoves } = await import(
        "./service/fetchPokemonMoves.mjs"
      );
      const data = await fetchPokemonMoves(name);
      return ok(data);
    } catch (err) {
      return internalError(err.message || "Failed to fetch Pokémon moves");
    }
  }

  // 단일 조회
  if (
    httpMethod === "GET" &&
    pathParameters?.name &&
    !path.includes("/evolution") &&
    !path.includes("/moves") &&
    !path.includes("/abilities")
  ) {
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

  // 포켓몬 능력 조회
  if (httpMethod === "GET" && path.match(/^\/pokemon\/[^/]+\/abilities$/)) {
    try {
      const name = pathParameters?.name;
      if (!name) return badRequest("Missing Pokémon name in path");

      const { fetchPokemonAbilities } = await import(
        "./service/fetchPokemonAbilities.mjs"
      );
      const data = await fetchPokemonAbilities(name);
      return ok(data);
    } catch (err) {
      return internalError(err.message || "Failed to fetch Pokémon abilities");
    }
  }

  // 배틀 시작
  if (httpMethod === "POST" && path === "/battle/start") {
    try {
      const body = event.body ? JSON.parse(event.body) : {};
      const playerName = body?.playerName;
      if (!playerName) return badRequest("Missing playerName in request body");

      const { startBattle } = await import("./service/startBattle.mjs");
      const result = await startBattle(playerName);
      return ok(result);
    } catch (err) {
      return internalError(err.message || "Failed to start battle");
    }
  }

  // 턴 실행 (배틀 중 한 턴 진행)
  if (httpMethod === "POST" && path === "/battle/turn") {
    try {
      const params = JSON.parse(event.body);
      const { user, enemy, userMove } = params;
      const { executeTurn } = await import("./service/executeTurn.mjs");
      const result = await executeTurn(user, enemy, userMove);
      return ok(result);
    } catch (err) {
      console.error("[/battle/turn] error:", err);
      return internalError(err.message || "Failed to execute battle turn");
    }
  }

  return badRequest("Invalid request");
};
