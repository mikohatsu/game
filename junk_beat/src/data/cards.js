export const cardLibrary = {
  rustSlice: {
    name: 'Rust Slice',
    type: '공격',
    rarity: 'common',
    energy: 1,
    desc: '피해 5',
    play: ({ applyDamage }) => applyDamage(5),
  },
  rustSlicePlus: {
    name: 'Rust Slice+',
    type: '공격',
    rarity: 'upgrade',
    energy: 1,
    desc: '피해 9',
    play: ({ applyDamage }) => applyDamage(9),
  },
  makeshiftGuard: {
    name: 'Makeshift Guard',
    type: '방어',
    rarity: 'common',
    energy: 1,
    desc: '실드 6',
    play: ({ addBlock }) => addBlock(6),
  },
  makeshiftGuardPlus: {
    name: 'Makeshift Guard+',
    type: '방어',
    rarity: 'upgrade',
    energy: 1,
    desc: '실드 10',
    play: ({ addBlock }) => addBlock(10),
  },
  pulseWeak: {
    name: 'Pulse Weak',
    type: '공격',
    rarity: 'common',
    energy: 1,
    desc: '피해 4, 적 취약 1',
    play: ({ applyDamage, applyStatus }) => {
      applyDamage(4)
      applyStatus('vulnerable', 1)
    },
  },
  pulseWeakPlus: {
    name: 'Pulse Weak+',
    type: '공격',
    rarity: 'upgrade',
    energy: 1,
    desc: '피해 7, 적 취약 2',
    play: ({ applyDamage, applyStatus }) => {
      applyDamage(7)
      applyStatus('vulnerable', 2)
    },
  },
  overclock: {
    name: 'Overclock',
    type: '부스트',
    rarity: 'uncommon',
    energy: 0,
    desc: '다음 공격 피해 +50%, 열 상승 1',
    play: ({ addStatus }) => {
      addStatus('boost', 1)
      addStatus('heat', 1)
    },
  },
  empLance: {
    name: 'EMP Lance',
    type: '공격',
    rarity: 'uncommon',
    energy: 2,
    desc: '피해 10, 적 방해 2',
    play: ({ applyDamage, applyStatus }) => {
      applyDamage(10)
      applyStatus('jammed', 2)
    },
  },
  coolantFlush: {
    name: 'Coolant Flush',
    type: '지원',
    rarity: 'uncommon',
    energy: 1,
    desc: '실드 6, 열 2 제거',
    play: ({ addBlock, clearStatus }) => {
      addBlock(6)
      clearStatus('heat', 2)
    },
  },
  scrapstorm: {
    name: 'Scrapstorm',
    type: '공격',
    rarity: 'rare',
    energy: 2,
    desc: '5×3 피해, 모든 취약 소모',
    play: ({ applyDamage, statuses, consumeEnemyStatus }) => {
      for (let i = 0; i < 3; i++) applyDamage(5)
      if (statuses.vulnerable) consumeEnemyStatus('vulnerable')
    },
  },
  siphonPatch: {
    name: 'Siphon Patch',
    type: '지원',
    rarity: 'uncommon',
    energy: 1,
    desc: 'HP 6 회복, 실드 4',
    play: ({ heal, addBlock }) => {
      heal(6)
      addBlock(4)
    },
  },
}

export const initialDeck = [
  'rustSlice',
  'rustSlice',
  'rustSlice',
  'rustSlice',
  'makeshiftGuard',
  'makeshiftGuard',
  'makeshiftGuard',
  'pulseWeak',
  'pulseWeak',
  'pulseWeak',
]

export const rewardPool = ['overclock', 'empLance', 'coolantFlush', 'scrapstorm', 'siphonPatch']

// Fusion-only specials (20종)
export const fusionRecipes = {
  // 기본+기본 (10)
  'makeshiftGuard+makeshiftGuard': 'heavyShield',
  'makeshiftGuard+overclock': 'ventedWall',
  'makeshiftGuard+pulseWeak': 'anchoredShot',
  'makeshiftGuard+rustSlice': 'shockGuard',
  'overclock+overclock': 'chainDrive',
  'overclock+pulseWeak': 'pulseNova',
  'overclock+rustSlice': 'railOver',
  'pulseWeak+pulseWeak': 'stackVuln',
  'pulseWeak+rustSlice': 'vulnStrike',
  'rustSlice+rustSlice': 'doubleCut',
  // 융합+기본 (4)
  'doubleCut+rustSlice': 'tripleCut',
  'heavyShield+makeshiftGuard': 'bulwark',
  'pulseNova+pulseWeak': 'stormTag',
  'railOver+overclock': 'railLoop',
  // 융합+융합 (4)
  'doubleCut+chainDrive': 'overdriveSpin',
  'heavyShield+ventedWall': 'cryoshield',
  'pulseNova+stackVuln': 'doomSignal',
  'shockGuard+anchoredShot': 'ionAnchor',
  // (융합+기본)+(융합+융합) (1)
  'tripleCut+overdriveSpin': 'bladeSymphony',
  // (융합+융합)+(융합+융합) (1)
  'cryoshield+doomSignal': 'entropyCore',
}

export const fusionCards = {
  shockGuard: {
    name: 'Shock Guard',
    type: '융합',
    rarity: 'rare',
    energy: 2,
    desc: '피해 10\n실드 8\n방해 1',
    play: ({ applyDamage, addBlock, applyStatus }) => {
      applyDamage(10)
      addBlock(8)
      applyStatus('jammed', 1)
    },
  },
  vulnStrike: {
    name: 'Vuln Strike',
    type: '융합',
    rarity: 'rare',
    energy: 1,
    desc: '피해 9\n취약 2',
    play: ({ applyDamage, applyStatus }) => {
      applyDamage(9)
      applyStatus('vulnerable', 2)
    },
  },
  railOver: {
    name: 'Rail Over',
    type: '융합',
    rarity: 'rare',
    energy: 2,
    desc: '피해 12\n다음 공격 피해 +50%',
    play: ({ applyDamage, addStatus }) => {
      applyDamage(12)
      addStatus('boost', 1)
    },
  },
  anchoredShot: {
    name: 'Anchored Shot',
    type: '융합',
    rarity: 'rare',
    energy: 2,
    desc: '피해 10\n실드 6',
    play: ({ applyDamage, addBlock }) => {
      applyDamage(10)
      addBlock(6)
    },
  },
  ventedWall: {
    name: 'Vented Wall',
    type: '융합',
    rarity: 'rare',
    energy: 1,
    desc: '실드 10\n열 2 제거',
    play: ({ addBlock, clearStatus }) => {
      addBlock(10)
      clearStatus('heat', 2)
    },
  },
  pulseNova: {
    name: 'Pulse Nova',
    type: '융합',
    rarity: 'rare',
    energy: 2,
    desc: '피해 6x2\n취약 1\n방해 1',
    play: ({ applyDamage, applyStatus }) => {
      applyDamage(6)
      applyDamage(6)
      applyStatus('vulnerable', 1)
      applyStatus('jammed', 1)
    },
  },
  doubleCut: {
    name: 'Double Cut',
    type: '융합',
    rarity: 'rare',
    energy: 1,
    desc: '피해 7x2',
    play: ({ applyDamage }) => {
      applyDamage(7)
      applyDamage(7)
    },
  },
  heavyShield: {
    name: 'Heavy Shield',
    type: '융합',
    rarity: 'rare',
    energy: 1,
    desc: '실드 14',
    play: ({ addBlock }) => addBlock(14),
  },
  stackVuln: {
    name: 'Stack Vuln',
    type: '융합',
    rarity: 'rare',
    energy: 1,
    desc: '취약 3\n피해 4',
    play: ({ applyStatus, applyDamage }) => {
      applyStatus('vulnerable', 3)
      applyDamage(4)
    },
  },
  chainDrive: {
    name: 'Chain Drive',
    type: '융합',
    rarity: 'rare',
    energy: 0,
    desc: '피해 5\n다음 턴 드로우 +1',
    play: ({ applyDamage, addStatus }) => {
      applyDamage(5)
      addStatus('drawNext', 1)
    },
  },
  // 융합+기본
  tripleCut: {
    name: 'Triple Cut',
    type: '융합',
    rarity: 'rare',
    energy: 1,
    desc: '피해 5x3',
    play: ({ applyDamage }) => {
      applyDamage(5)
      applyDamage(5)
      applyDamage(5)
    },
  },
  bulwark: {
    name: 'Bulwark',
    type: '융합',
    rarity: 'rare',
    energy: 1,
    desc: '실드 16\n방해 1',
    play: ({ addBlock, applyStatus }) => {
      addBlock(16)
      applyStatus('jammed', 1)
    },
  },
  stormTag: {
    name: 'Storm Tag',
    type: '융합',
    rarity: 'rare',
    energy: 2,
    desc: '피해 8x2\n취약 1',
    play: ({ applyDamage, applyStatus }) => {
      applyDamage(8)
      applyDamage(8)
      applyStatus('vulnerable', 1)
    },
  },
  railLoop: {
    name: 'Rail Loop',
    type: '융합',
    rarity: 'rare',
    energy: 1,
    desc: '피해 10\n다음 공격 피해 +50%\n드로우 1',
    play: ({ applyDamage, addStatus, drawCard }) => {
      applyDamage(10)
      addStatus('boost', 1)
      drawCard?.(1)
    },
  },
  // 융합+융합
  overdriveSpin: {
    name: 'Overdrive Spin',
    type: '융합',
    rarity: 'rare',
    energy: 2,
    desc: '피해 6x3\n다음 턴 드로우 +1',
    play: ({ applyDamage, addStatus }) => {
      applyDamage(6)
      applyDamage(6)
      applyDamage(6)
      addStatus('drawNext', 1)
    },
  },
  cryoshield: {
    name: 'Cryoshield',
    type: '융합',
    rarity: 'rare',
    energy: 1,
    desc: '실드 12\n방해 1\n열 1 제거',
    play: ({ addBlock, applyStatus, clearStatus }) => {
      addBlock(12)
      applyStatus('jammed', 1)
      clearStatus('heat', 1)
    },
  },
  doomSignal: {
    name: 'Doom Signal',
    type: '융합',
    rarity: 'rare',
    energy: 2,
    desc: '취약 3\n피해 8',
    play: ({ applyStatus, applyDamage }) => {
      applyStatus('vulnerable', 3)
      applyDamage(8)
    },
  },
  ionAnchor: {
    name: 'Ion Anchor',
    type: '융합',
    rarity: 'rare',
    energy: 1,
    desc: '피해 9\n실드 9',
    play: ({ applyDamage, addBlock }) => {
      applyDamage(9)
      addBlock(9)
    },
  },
  // 복합
  bladeSymphony: {
    name: 'Blade Symphony',
    type: '융합',
    rarity: 'rare',
    energy: 2,
    desc: '피해 5x4\n다음 공격 피해 +50%',
    play: ({ applyDamage, addStatus }) => {
      for (let i = 0; i < 4; i++) applyDamage(5)
      addStatus('boost', 1)
    },
  },
  entropyCore: {
    name: 'Entropy Core',
    type: '융합',
    rarity: 'rare',
    energy: 2,
    desc: '피해 14\n취약 2\n방해 2',
    play: ({ applyDamage, applyStatus }) => {
      applyDamage(14)
      applyStatus('vulnerable', 2)
      applyStatus('jammed', 2)
    },
  },
}
