export const cardLibrary = {
  railStrike: {
    name: 'Rail Strike',
    type: '공격',
    energy: 1,
    desc: '기본 피해 8, 적에게 취약 1',
    play: ({ applyDamage, applyStatus }) => {
      applyDamage(8)
      applyStatus('vulnerable', 1)
    },
  },
  shieldWall: {
    name: 'Shield Wall',
    type: '방어',
    energy: 1,
    desc: '실드 9',
    play: ({ addBlock }) => addBlock(9),
  },
  overclock: {
    name: 'Overclock',
    type: '부스트',
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
    energy: 2,
    desc: '피해 12, 적 방해 2',
    play: ({ applyDamage, applyStatus }) => {
      applyDamage(12)
      applyStatus('jammed', 2)
    },
  },
  coolantFlush: {
    name: 'Coolant Flush',
    type: '지원',
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
    energy: 1,
    desc: 'HP 6 회복, 실드 4',
    play: ({ heal, addBlock }) => {
      heal(6)
      addBlock(4)
    },
  },
}

export const initialDeck = [
  'railStrike',
  'railStrike',
  'shieldWall',
  'shieldWall',
  'overclock',
  'empLance',
  'coolantFlush',
  'scrapstorm',
  'siphonPatch',
]
