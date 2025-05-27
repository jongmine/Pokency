// components/mockData.js
export const mockInfo = {
  name: "pikachu",
  name_ko: "피카츄",
  id: 25,
  base_experience: 112,
  height: 4,
  weight: 60,
  types: ["electric"],
  stats: {
    hp: 35,
    attack: 55,
    defense: 40,
    "special-attack": 50,
    "special-defense": 50,
    speed: 90,
  },
  sprite:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  official_artwork:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  description_ko:
    "꼬리를 세우고 주변의 상황을 살피다 보면 가끔 꼬리에 번개가 친다.",
};

export const mockAbilities = [
  {
    name: "static",
    name_ko: "정전기",
    short_effect_ko: "접촉한 상대를\n마비시킬 때가 있다.",
  },
  {
    name: "lightning-rod",
    name_ko: "피뢰침",
    short_effect_ko: "전기를 끌어모아\n특수공격을 올린다.",
  },
];

export const mockMoves = [
  {
    name: "thunderbolt",
    name_ko: "10만 볼트",
    type: "electric",
    power: 90,
    pp: 15,
    accuracy: 100,
    damage_class: "special",
    description_ko:
      "강력한 전기 충격으로 상대를 공격한다. 마비 상태로 만들기도 한다.",
  },
  {
    name: "quick-attack",
    name_ko: "전광석화",
    type: "normal",
    power: 40,
    pp: 30,
    accuracy: 100,
    damage_class: "physical",
    description_ko: "상대보다 먼저 공격한다.",
  },
  // ...더 추가 가능
];

export const mockEvolution = {
  chain: [
    { id: 172, name: "pichu", name_ko: "피츄" },
    { id: 25, name: "pikachu", name_ko: "피카츄" },
    { id: 26, name: "raichu", name_ko: "라이츄" },
  ],
};
