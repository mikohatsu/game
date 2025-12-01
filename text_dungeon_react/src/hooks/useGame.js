import { useState, useCallback } from 'react';

// 아이템 데이터베이스
const ITEMS = {
  weapon: [
    { name: "녹슨 검", base: 4, type: 'sword' },
    { name: "단검", base: 5, type: 'dagger' },
    { name: "도끼", base: 6, type: 'axe' },
    { name: "활", base: 7, type: 'bow' },
    { name: "쌍검", base: 8, type: 'dual' }
  ],
  armor: [
    { name: "낡은 옷", base: 3, type: 'cloth' },
    { name: "가죽 갑옷", base: 4, type: 'leather' },
    { name: "나무 방패", base: 5, type: 'wood' },
    { name: "철갑옷", base: 6, type: 'iron' },
    { name: "강철 방패", base: 7, type: 'steel' }
  ]
};

const ARTIFACTS_DB = [
  {
    name: "흡혈의 수정",
    desc: "공격 시 피해량의 10%를 흡혈",
    type: "lifesteal",
    effect: (p) => ({ ...p, lifesteal: p.lifesteal + 0.1 })
  },
  {
    name: "생명의 근원",
    desc: "최대 체력 +50, 현재 체력 회복",
    type: "health",
    effect: (p) => ({ ...p, maxHp: p.maxHp + 50, hp: p.hp + 50 })
  },
  {
    name: "정밀한 렌즈",
    desc: "치명타 확률 +20%",
    type: "crit",
    effect: (p) => ({ ...p, critChance: p.critChance + 0.2 })
  },
  {
    name: "광전사의 돌",
    desc: "공격력 +9, 방어력 -2",
    type: "berserker",
    effect: (p) => ({ ...p, baseAtk: p.baseAtk + 9, baseDef: Math.max(0, p.baseDef - 2) })
  },
  {
    name: "무한의 동전",
    desc: "치명타 확률 +10%, 공격력 +2",
    type: "coin",
    effect: (p) => ({ ...p, critChance: p.critChance + 0.1, baseAtk: p.baseAtk + 2 })
  },
  {
    name: "강철 피부",
    desc: "방어력 +5",
    type: "defense",
    effect: (p) => ({ ...p, baseDef: p.baseDef + 5 })
  }
];

const TIERS = ["일반", "희귀", "영웅", "전설", "신화"];

export const useGame = () => {
  const [floor, setFloor] = useState(1);
  const [player, setPlayer] = useState({
    maxHp: 100,
    hp: 100,
    baseAtk: 4,
    baseDef: 4,
    critChance: 0.10,
    lifesteal: 0.0,
  });
  const [equipSlots, setEquipSlots] = useState({ weapon: null, armor: null });
  const [inventory, setInventory] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [enemy, setEnemy] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [gameLog, setGameLog] = useState([]);
  const [showArtifactModal, setShowArtifactModal] = useState(false);
  const [artifactChoices, setArtifactChoices] = useState([]);
  const [animations, setAnimations] = useState({
    enemyDamage: null,
    playerDamage: null,
    playerHeal: null,
    enemyShake: false
  });

  const log = useCallback((message, type = 'normal') => {
    setGameLog(prev => [...prev, { message, type, id: Date.now() + Math.random() }]);
  }, []);

  const spawnEnemy = useCallback(() => {
    const isBoss = (floor > 1 && floor % 10 === 0);
    const hpScale = 25 + (floor * 6 * (isBoss ? 2 : 1));
    const atkScale = 4 + Math.floor(floor / 3) * (isBoss ? 1.5 : 1);

    const types = ["demon", "undead", "beast", "dragon"];
    const newEnemy = {
      name: isBoss ? `심연의 지배자` : `${floor}층 몬스터`,
      maxHp: hpScale,
      hp: hpScale,
      atk: atkScale,
      type: isBoss ? "boss" : types[Math.floor(Math.random() * 4)],
      isBoss
    };
    setEnemy(newEnemy);
    log(`==== ${floor}층 ${isBoss ? '[보스 스테이지]' : '[일반 스테이지]'} ====`, 'system');
    log(`${newEnemy.name}(HP:${newEnemy.hp}) 출현!`);
  }, [floor, log]);

  const getStats = useCallback(() => {
    let atk = player.baseAtk;
    let def = player.baseDef;
    if (equipSlots.weapon) atk += equipSlots.weapon.val;
    if (equipSlots.armor) def += equipSlots.armor.val;
    return { atk, def, crit: player.critChance, lifesteal: player.lifesteal };
  }, [player, equipSlots]);

  const battle = useCallback(() => {
    if (!enemy) return;
    const stats = getStats();

    // 플레이어 공격
    const isCrit = Math.random() < stats.crit;
    let damage = stats.atk * (isCrit ? 2 : 1);
    damage = Math.floor(damage);

    // 1. 적에게 데미지 애니메이션 표시
    setAnimations(prev => ({ ...prev, enemyDamage: damage, enemyShake: true }));

    let logMsg = `당신의 공격! ${damage} 피해!`;
    if (isCrit) logMsg += ` (치명타!)`;
    log(logMsg, 'attack');

    // 2. 500ms 후 적 HP 감소 & 애니메이션 제거
    setTimeout(() => {
      const newEnemyHp = Math.max(0, enemy.hp - damage);
      setEnemy(prev => ({ ...prev, hp: newEnemyHp }));
      setAnimations(prev => ({ ...prev, enemyDamage: null, enemyShake: false }));

      // 흡혈 처리
      if (player.lifesteal > 0) {
        const heal = Math.floor(damage * player.lifesteal);
        setAnimations(prev => ({ ...prev, playerHeal: heal }));
        setPlayer(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + heal) }));
        log(`흡혈로 ${heal} 회복.`, 'heal');

        // 힐 애니메이션 제거
        setTimeout(() => {
          setAnimations(prev => ({ ...prev, playerHeal: null }));
        }, 1000);
      }

      if (newEnemyHp <= 0) {
        win();
        return;
      }

      // 3. 적 반격 (적 애니메이션 후 500ms 뒤)
      setTimeout(() => {
        const incoming = Math.max(1, enemy.atk - Math.floor(stats.def * 0.8));

        // 플레이어 데미지 애니메이션
        setAnimations(prev => ({ ...prev, playerDamage: incoming }));

        setPlayer(prev => {
          const newHp = prev.hp - incoming;
          if (newHp <= 0) {
            log("💀 패배했습니다.", 'danger');
          }
          return { ...prev, hp: Math.max(0, newHp) };
        });
        log(`${enemy.name}의 반격! -${incoming} HP`, 'danger');

        // 플레이어 데미지 애니메이션 제거
        setTimeout(() => {
          setAnimations(prev => ({ ...prev, playerDamage: null }));
        }, 1000);
      }, 500);
    }, 500);
  }, [enemy, player, getStats, log]);

  const win = useCallback(() => {
    const isBoss = (floor % 10 === 0);
    log(`🎉 승리! ${enemy.name} 처치!`, 'success');

    const healAmt = Math.floor(player.maxHp * 0.10);
    setPlayer(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + healAmt) }));
    log(`전투 승리로 체력을 ${healAmt} 회복했습니다.`, 'heal');

    setEnemy(null);

    if (isBoss) {
      showArtifactSelection();
    } else {
      dropLoot();
      setTimeout(() => {
        setFloor(prev => prev + 1);
      }, 1000);
    }
  }, [floor, enemy, player, log]);

  const showArtifactSelection = useCallback(() => {
    const shuffled = [...ARTIFACTS_DB].sort(() => 0.5 - Math.random());
    const choices = shuffled.slice(0, 3);
    setArtifactChoices(choices);
    setShowArtifactModal(true);
  }, []);

  const selectArtifact = useCallback((artifact) => {
    setPlayer(prev => artifact.effect(prev));
    setArtifacts(prev => [...prev, artifact]);
    log(`✨ [${artifact.name}] 유물을 획득했습니다!`, 'legend');
    setShowArtifactModal(false);
    dropLoot();
    setTimeout(() => {
      setFloor(prev => prev + 1);
    }, 800);
  }, [log]);

  const dropLoot = useCallback(() => {
    if (inventory.length >= 16) {
      log("가방이 꽉 차서 아이템을 버렸습니다!", 'danger');
      return;
    }
    const type = Math.random() < 0.5 ? 'weapon' : 'armor';
    const items = ITEMS[type];
    const weights = items.map((_, index) => 1 / (index + 1));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    let baseItem = items[0];
    for (let i = 0; i < weights.length; i++) {
      if (random < weights[i]) {
        baseItem = items[i];
        break;
      }
      random -= weights[i];
    }

    const newItem = {
      id: Date.now() + Math.random(),
      type: type,
      name: baseItem.name,
      iconType: baseItem.type,
      val: baseItem.base,
      tier: 1,
      level: 1
    };

    setInventory(prev => [...prev, newItem]);
    log(`[획득] ${newItem.name}`, 'success');
  }, [inventory, log]);

  const rest = useCallback(() => {
    if (enemy) {
      log("전투 중에는 휴식할 수 없습니다!", 'danger');
      return;
    }
    const heal = Math.floor(player.maxHp * 0.15);
    setAnimations(prev => ({ ...prev, playerHeal: heal }));
    setPlayer(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + heal) }));
    log(`휴식으로 체력을 ${heal} 회복했습니다.`, 'heal');

    setTimeout(() => {
      setAnimations(prev => ({ ...prev, playerHeal: null }));
    }, 1000);
  }, [enemy, player, log]);

  const equip = useCallback((item) => {
    if (selectedIdx === -1) return;
    const slot = item.type;

    setInventory(prev => {
      const newInv = [...prev];
      if (equipSlots[slot]) {
        newInv.push(equipSlots[slot]);
      }
      newInv.splice(selectedIdx, 1);
      return newInv;
    });

    setEquipSlots(prev => ({ ...prev, [slot]: item }));
    setSelectedIdx(-1);
  }, [selectedIdx, equipSlots]);

  const unequip = useCallback((slot) => {
    if (equipSlots[slot]) {
      setInventory(prev => [...prev, equipSlots[slot]]);
      setEquipSlots(prev => ({ ...prev, [slot]: null }));
    }
  }, [equipSlots]);

  const trash = useCallback(() => {
    if (selectedIdx === -1) return;
    setInventory(prev => prev.filter((_, i) => i !== selectedIdx));
    setSelectedIdx(-1);
  }, [selectedIdx]);

  const merge = useCallback(() => {
    if (selectedIdx === -1) return;
    const item1 = inventory[selectedIdx];
    const matIdx = inventory.findIndex((item, i) =>
      i !== selectedIdx && item.name === item1.name && item.tier === item1.tier
    );

    if (matIdx === -1) return;

    const nextVal = Math.floor(item1.val * 1.8);
    const nextTier = item1.tier + 1;

    const newItem = { ...item1, id: Date.now(), tier: nextTier, val: nextVal };

    setInventory(prev => {
      const newInv = prev.filter((_, i) => i !== selectedIdx && i !== matIdx);
      return [...newInv, newItem];
    });

    log(`✨ 합성 성공! ${newItem.name} -> ${TIERS[newItem.tier - 1]} 등급!`, 'legend');
    setSelectedIdx(-1);
  }, [selectedIdx, inventory, log]);

  return {
    floor,
    player,
    equipSlots,
    inventory,
    artifacts,
    enemy,
    selectedIdx,
    gameLog,
    showArtifactModal,
    artifactChoices,
    animations,
    actions: {
      setSelectedIdx,
      spawnEnemy,
      battle,
      rest,
      equip,
      unequip,
      trash,
      merge,
      selectArtifact,
      setShowArtifactModal
    }
  };
};
