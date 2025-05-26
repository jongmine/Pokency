import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getNarration(
  battle,
  attacker,
  move,
  resultType,
  isEnemyTurn,
  missType = null,
  endMsg = null // 종료 메시지 추가 가능
) {
  const target = isEnemyTurn
    ? battle.user.name_ko || battle.user.name || "상대"
    : battle.enemy.name_ko || battle.enemy.name || "상대";
  const subject = attacker || "포켓몬";
  const moveName_ko = move?.name_ko || move?.name || "기술";
  let prompt = "";

  if (endMsg) {
    // 배틀 종료 메시지
    return endMsg;
  }

  if (missType === "miss") {
    prompt = `${subject}가 ${moveName_ko}(을)를 시도했으나 ${target}이(가) 완벽히 피했다. 반드시 회피를 1문장에 명확히 나타내라. 액션만, 존댓말·감탄사·감정 묘사 없이.`;
  } else {
    // [프롬프트 고도화]
    prompt = `${subject}가 ${moveName_ko}(을)를 사용하여 ${target}을(를) 공격했다. 반드시 명중한 상황임을 1문장에 분명히 드러내라. ${target}은 반드시 피격된 반응만 간결하게, '피했다', '회피', '피함'이란 단어를 절대 쓰지 말고, 액션 중심으로 중계하라. 존댓말, 감탄사, 심리·묘사 금지.`;
  }

  const res = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
    max_tokens: 100,
  });
  const narration =
    res.choices[0]?.message?.content?.trim() ||
    `${subject}가 ${moveName_ko}(을)를 사용했다.`;
  console.log(`[NARRATION] 프롬프트: ${prompt} => ${narration}`);
  return narration;
}
