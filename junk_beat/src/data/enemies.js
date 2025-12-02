import drone from '../assets/drone.svg'
import titan from '../assets/titan.svg'
import support from '../assets/support.svg'

export const enemies = [
  {
    name: 'Skull Drone v3',
    maxHp: 68,
    asset: drone,
    pattern: [
      { intent: 'single', damage: 10, note: '고출력 레이저' },
      { intent: 'buff', block: 8, note: '자기장 차폐' },
      { intent: 'multi', hits: 3, damage: 4, note: '탄막' },
    ],
  },
  {
    name: 'Siege Titan',
    maxHp: 96,
    asset: titan,
    pattern: [
      { intent: 'charge', damage: 16, note: '압축 충격' },
      { intent: 'fortify', block: 14, note: '강철 껍데기' },
      { intent: 'multi', hits: 2, damage: 9, note: '양손 파쇄' },
    ],
  },
  {
    name: 'Support Node',
    maxHp: 70,
    asset: support,
    pattern: [
      { intent: 'zap', damage: 7, note: '감전 펄스' },
      { intent: 'heal', heal: 8, note: '자가 수복' },
      { intent: 'buff', block: 10, note: '필드 방어막' },
    ],
  },
]
