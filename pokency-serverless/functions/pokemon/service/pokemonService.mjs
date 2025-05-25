import axios from "axios";

export const fetchPokemonData = async (name) => {
  const res = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
  );
  return {
    name: res.data.name,
    id: res.data.id,
    height: res.data.height,
    weight: res.data.weight,
    types: res.data.types.map((t) => t.type.name),
  };
};
