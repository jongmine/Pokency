export const fetchTypeEffectiveness = async (attackType, defenderTypes) => {
  if (!attackType || !defenderTypes) {
    throw new Error("Missing required parameters: attackType or defenderTypes");
  }

  // defenderTypes는 string, array 모두 지원
  const defenderTypeArr = Array.isArray(defenderTypes)
    ? defenderTypes.map((t) => t.toLowerCase())
    : typeof defenderTypes === "string"
    ? defenderTypes.split(",").map((t) => t.trim().toLowerCase())
    : [];

  // PokéAPI에서 공격 타입 정보 조회
  const res = await fetch(
    `https://pokeapi.co/api/v2/type/${attackType.toLowerCase()}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch attacker type info from PokéAPI");
  }
  const data = await res.json();
  const dmg = data.damage_relations;

  let multiplier = 1.0;
  for (const defType of defenderTypeArr) {
    if (dmg.double_damage_to.some((t) => t.name === defType)) {
      multiplier *= 2;
    } else if (dmg.half_damage_to.some((t) => t.name === defType)) {
      multiplier *= 0.5;
    } else if (dmg.no_damage_to.some((t) => t.name === defType)) {
      multiplier *= 0;
    }
  }

  return multiplier;
};
