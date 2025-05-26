export const executeTurn = async (user, enemy, userMoveName) => {
  if (!user || typeof user !== "object")
    throw new Error("User object missing or invalid");
  if (!user.stats || typeof user.stats !== "object")
    throw new Error("User.stats missing or invalid");
  if (!enemy || typeof enemy !== "object")
    throw new Error("Enemy object missing or invalid");
  if (!enemy.stats || typeof enemy.stats !== "object")
    throw new Error("Enemy.stats missing or invalid");

  // 턴 순서 결정
  const userGoesFirst = user.stats.speed >= enemy.stats.speed;

  // 기술 선택
  const userMove = user.moves.find((m) => m.name === userMoveName);
  if (!userMove) throw new Error("User's move not found: " + userMoveName);

  const enemyMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
  if (!enemyMove) throw new Error("Enemy has no moves");

  // 타입 상성
  const { fetchTypeEffectiveness } = await import(
    "./fetchTypeEffectiveness.mjs"
  );
  const userEffectiveness = await fetchTypeEffectiveness(
    userMove.type,
    enemy.types
  );
  const enemyEffectiveness = await fetchTypeEffectiveness(
    enemyMove.type,
    user.types
  );

  // 데미지 계산
  const calculateDamage = (attacker, defender, move, effectiveness, hit) => {
    if (!hit) return 0;
    const level = 50;
    const attackStat =
      move.damage_class === "physical"
        ? attacker.stats.attack
        : attacker.stats["special-attack"];
    const defenseStat =
      move.damage_class === "physical"
        ? defender.stats.defense
        : defender.stats["special-defense"];
    const power = move.power ?? 50;
    if (
      attackStat == null ||
      defenseStat == null ||
      power == null ||
      effectiveness == null
    )
      return 1;
    const base =
      (((2 * level) / 5 + 2) * attackStat * power) / defenseStat / 50 + 2;
    const damage = Math.floor(base * effectiveness);
    return Math.max(1, damage);
  };

  // 리코일 처리
  const isRecoilMove = (move) =>
    ["double-edge", "take-down"].includes(move.name);
  const getRecoilDamage = (move, dealtDamage) => {
    if (!isRecoilMove(move)) return 0;
    if (move.name === "double-edge") return Math.floor(dealtDamage / 3);
    if (move.name === "take-down") return Math.floor(dealtDamage / 4);
    return 0;
  };

  // 명중률 판정
  const isHit = (move) => {
    if (move.accuracy == null || move.accuracy >= 100) return true;
    const rnd = Math.random() * 100;
    console.log(
      `[HIT-CHECK] Move: ${move.name_ko || move.name}, Accuracy: ${
        move.accuracy
      }, Roll: ${rnd}`
    );
    return rnd < move.accuracy;
  };

  // HP 상태
  let userHp = user.hp ?? 0;
  let enemyHp = enemy.hp ?? 0;

  // 내래이션/사용 기술
  const { getNarration } = await import("./getNarration.mjs");
  const getName = (poke) => poke.name_ko || poke.name || "알 수 없음";
  let narrationArr = [];
  let movesUsed = {};

  // 공격 처리 함수
  async function processAttack(
    attacker,
    defender,
    move,
    effectiveness,
    attackerIsEnemy = false
  ) {
    const hit = isHit(move);
    let damage = 0;
    let recoil = 0;
    let resultType =
      effectiveness > 1
        ? "super-effective"
        : effectiveness < 1
        ? "not-effective"
        : "normal";
    if (hit) {
      damage = calculateDamage(attacker, defender, move, effectiveness, true);
      console.log(
        `[DAMAGE] ${getName(attacker)}의 ${
          move.name_ko || move.name
        } 명중! 데미지: ${damage}`
      );
      if (attackerIsEnemy) userHp = Math.max(0, userHp - damage);
      else enemyHp = Math.max(0, enemyHp - damage);

      // 리코일
      recoil = getRecoilDamage(move, damage);
      if (recoil > 0) {
        if (attackerIsEnemy) enemyHp = Math.max(0, enemyHp - recoil);
        else userHp = Math.max(0, userHp - recoil);
        console.log(`[RECOIL] ${getName(attacker)} 반동 데미지: ${recoil}`);
      }
    } else {
      console.log(
        `[MISS] ${getName(attacker)}의 ${move.name_ko || move.name} 빗나감!`
      );
    }

    // 내래이션 생성 (명중/회피 여부 반영)
    const narration = await getNarration(
      {
        user: { ...user, name_ko: getName(user) },
        enemy: { ...enemy, name_ko: getName(enemy) },
        userHp,
        enemyHp,
        userMove,
        enemyMove,
      },
      getName(attacker),
      move,
      resultType,
      attackerIsEnemy,
      hit ? null : "miss"
    );

    return {
      narration,
      hit,
      move,
      attacker: getName(attacker),
      damage,
      recoil,
    };
  }

  // 승패판정 및 게임오버 내래이션
  const getBattleResult = (userHp, enemyHp, userName, enemyName) => {
    if (userHp <= 0 && enemyHp <= 0) {
      return {
        winner: null,
        loser: null,
        isGameOver: true,
        endMsg: "무승부로 배틀이 종료되었다.",
      };
    }
    if (userHp <= 0) {
      return {
        winner: enemyName,
        loser: userName,
        isGameOver: true,
        endMsg: `${enemyName}의 승리로 배틀이 종료되었다.`,
      };
    }
    if (enemyHp <= 0) {
      return {
        winner: userName,
        loser: enemyName,
        isGameOver: true,
        endMsg: `${userName}의 승리로 배틀이 종료되었다.`,
      };
    }
    return { winner: null, loser: null, isGameOver: false, endMsg: "" };
  };

  // 턴 실행
  if (userGoesFirst) {
    const userAttack = await processAttack(
      user,
      enemy,
      userMove,
      userEffectiveness,
      false
    );
    narrationArr.push(userAttack.narration);
    movesUsed.user = { name: userMove?.name, name_ko: userMove?.name_ko };
    if (enemyHp > 0) {
      const enemyAttack = await processAttack(
        enemy,
        user,
        enemyMove,
        enemyEffectiveness,
        true
      );
      narrationArr.push(enemyAttack.narration);
      movesUsed.enemy = { name: enemyMove?.name, name_ko: enemyMove?.name_ko };
    } else {
      movesUsed.enemy = null;
    }
  } else {
    const enemyAttack = await processAttack(
      enemy,
      user,
      enemyMove,
      enemyEffectiveness,
      true
    );
    narrationArr.push(enemyAttack.narration);
    movesUsed.enemy = { name: enemyMove?.name, name_ko: enemyMove?.name_ko };
    if (userHp > 0) {
      const userAttack = await processAttack(
        user,
        enemy,
        userMove,
        userEffectiveness,
        false
      );
      narrationArr.push(userAttack.narration);
      movesUsed.user = { name: userMove?.name, name_ko: userMove?.name_ko };
    } else {
      movesUsed.user = null;
    }
  }

  // 승패 및 내래이션 추가
  const result = getBattleResult(
    userHp,
    enemyHp,
    getName(user),
    getName(enemy)
  );
  if (result.isGameOver && result.endMsg) {
    narrationArr.push(result.endMsg);
  }

  // 최종 결과
  console.log(`[RESULT] 유저HP: ${userHp} / 적HP: ${enemyHp}`);
  return {
    turnOrder: userGoesFirst
      ? [getName(user), getName(enemy)]
      : [getName(enemy), getName(user)],
    narration: narrationArr,
    user: { hp: userHp },
    enemy: { hp: enemyHp },
    movesUsed,
    winner: result.winner,
    loser: result.loser,
    isGameOver: result.isGameOver,
  };
};
