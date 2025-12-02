import drone from '../assets/drone.svg'
import titan from '../assets/titan.svg'
import support from '../assets/support.svg'

export const enemies = [
  {
    name: 'Skull Drone v3',
    maxHp: 68,
    asset: drone,
    kind: 'normal',
    pattern: [
      { intent: 'single', damage: 10, note: '고출력 레이저', desc: '단일 대상 피해 10' },
      { intent: 'buff', block: 8, note: '자기장 차폐' },
      { intent: 'multi', hits: 3, damage: 4, note: '탄막' },
    ],
  },
  {
    name: 'Siege Titan',
    maxHp: 96,
    asset: titan,
    kind: 'normal',
    pattern: [
      { intent: 'charge', damage: 16, note: '압축 충격', desc: '단일 대상 큰 피해 16' },
      { intent: 'fortify', block: 14, note: '강철 껍데기' },
      { intent: 'multi', hits: 2, damage: 9, note: '양손 파쇄', desc: '2회 연속 피해 9' },
    ],
  },
  {
    name: 'Support Node',
    maxHp: 70,
    asset: support,
    kind: 'normal',
    pattern: [
      { intent: 'zap', damage: 7, note: '감전 펄스', desc: '단일 대상 피해 7' },
      { intent: 'heal', heal: 8, note: '자가 수복', desc: 'HP 회복 8' },
      { intent: 'buff', block: 10, note: '필드 방어막', desc: '실드 10' },
    ],
  },
]

// 특수(준보스) 4종
export const specialEnemies = [
  {
    name: 'Rift Reaver',
    maxHp: 120,
    asset: drone,
    kind: 'special',
    pattern: [
      { intent: 'multi', hits: 3, damage: 6, note: '균열 베기', desc: '3회 피해 6' },
      { intent: 'buff', block: 14, note: '공간 왜곡', desc: '실드 14' },
      { intent: 'zap', damage: 12, note: '차원 충격', desc: '피해 12' },
    ],
  },
  {
    name: 'Obsidian Core',
    maxHp: 135,
    asset: titan,
    kind: 'special',
    pattern: [
      { intent: 'charge', damage: 18, note: '코어 펄스', desc: '피해 18' },
      { intent: 'fortify', block: 18, note: '암석 장벽', desc: '실드 18' },
      { intent: 'heal', heal: 12, note: '암석 재생', desc: 'HP 회복 12' },
    ],
  },
  {
    name: 'Storm Lattice',
    maxHp: 110,
    asset: support,
    kind: 'special',
    pattern: [
      { intent: 'zap', damage: 9, note: '과충전', desc: '피해 9' },
      { intent: 'multi', hits: 4, damage: 4, note: '전기 폭풍', desc: '4회 피해 4' },
      { intent: 'buff', block: 12, note: '전계 증폭', desc: '실드 12' },
    ],
  },
  {
    name: 'Grim Machinist',
    maxHp: 125,
    asset: drone,
    kind: 'special',
    pattern: [
      { intent: 'single', damage: 20, note: '톱날 베기', desc: '피해 20' },
      { intent: 'multi', hits: 2, damage: 9, note: '톱날 연타', desc: '2회 피해 9' },
      { intent: 'buff', block: 10, note: '톱날 가드', desc: '실드 10' },
    ],
  },
]

// 보스 1종
export const bossEnemy = {
  name: 'Overlord Forge',
  maxHp: 200,
  asset: titan,
  kind: 'boss',
  pattern: [
    { intent: 'multi', hits: 3, damage: 10, note: '파편 폭발', desc: '3회 피해 10' },
    { intent: 'fortify', block: 24, note: '초합금 차폐', desc: '실드 24' },
    { intent: 'charge', damage: 28, note: '코어 대방출', desc: '피해 28' },
    { intent: 'heal', heal: 18, note: '재구성', desc: 'HP 회복 18' },
  ],
}
