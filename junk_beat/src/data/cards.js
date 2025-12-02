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
