import { fetchPokemonData } from "./service/fetchSinglePokemon.mjs";
import { ok, badRequest, internalError } from "./utils/response.mjs";

export const lambdaHandler = async (event) => {
  const { name } = event.pathParameters || {};
  if (!name) {
    return badRequest("Missing Pokémon name in path.");
  }

  try {
    const data = await fetchPokemonData(name);
    return ok(data);
  } catch (err) {
    return internalError(err.message || "Failed to fetch Pokémon data");
  }
};
