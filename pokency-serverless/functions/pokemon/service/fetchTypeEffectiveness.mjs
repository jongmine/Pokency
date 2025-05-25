export const fetchTypeEffectiveness = async (attacker, defenderStr) => {
  if (!attacker || !defenderStr) {
    throw new Error("Missing required parameters: attacker or defender");
  }

  const defenderTypes = defenderStr
    .split(",")
    .map((t) => t.trim().toLowerCase());

  // Fetch attacker's type data
  const res = await fetch(
    `https://pokeapi.co/api/v2/type/${attacker.toLowerCase()}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch attacker type info");
  }

  const data = await res.json();
  const damageRelations = data.damage_relations;

  let multiplier = 1.0;

  for (const defType of defenderTypes) {
    if (damageRelations.double_damage_to.some((t) => t.name === defType)) {
      multiplier *= 2;
    } else if (damageRelations.half_damage_to.some((t) => t.name === defType)) {
      multiplier *= 0.5;
    } else if (damageRelations.no_damage_to.some((t) => t.name === defType)) {
      multiplier *= 0;
    }
  }

  let effectiveness = "normal";
  if (multiplier === 0) {
    effectiveness = "no-effect";
  } else if (multiplier < 1) {
    effectiveness = "not-very-effective";
  } else if (multiplier > 1) {
    effectiveness = "super-effective";
  }

  return {
    attacker: attacker.toLowerCase(),
    defender: defenderTypes,
    multiplier,
    effectiveness,
  };
};
