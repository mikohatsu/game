
import { Artifact, Horse, HorsePersonality, HorseStrategy, DistanceAptitude, TrackType, RaceConfig } from './types';

export const INITIAL_MONEY = 10000000; // 1,000만 원
export const INITIAL_DEBT = 100000000; // 1억 원
export const DEBT_INTEREST_RATE = 0.1; // 10%
export const DAYS_PER_CYCLE = 3;
// TRACK_LENGTH is removed in favor of dynamic race config
export const REROLL_COST = 500000; // 리롤 비용
export const EARLY_REPAYMENT_AMOUNT = 5000000; // 조기 상환 단위 (500만 원)
export const CREDIT_BONUS_PER_REPAYMENT = 0.02; // 조기 상환 시 할인율 증가 (2%)

// Helper to generate random integer
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const KEYWORD_DESCRIPTIONS: Record<string, string> = {
  // Personalities
  [HorsePersonality.COWARD]: "주변에 다른 말이 붙으면 겁을 먹어 속도가 줄어듭니다.",
  [HorsePersonality.FIGHTER]: "주변에 다른 말이 붙으면 투쟁심으로 속도가 빨라집니다.",
  [HorsePersonality.MYWAY]: "주변 환경에 영향을 받지 않고 꾸준히 달립니다.",
  [HorsePersonality.BOLD]: "선두(1등)에 서면 자신감이 붙어 더 빨라집니다.",
  [HorsePersonality.CALM]: "흥분하지 않아 경기 중 스태미너 소모가 적습니다.",

  // Strategies
  [HorseStrategy.RUNAWAY]: "초반부터 전력 질주하여 거리를 벌립니다. 후반에 지치기 쉽습니다.",
  [HorseStrategy.FRONT]: "선두 그룹을 유지하며 안정적으로 달립니다.",
  [HorseStrategy.STALKER]: "중위권에서 기회를 엿보다가 4코너 이후 승부를 봅니다.",
  [HorseStrategy.SWEEPER]: "맨 뒤에서 체력을 아끼다가 막판 직선주로에서 폭발합니다.",
  [HorseStrategy.CLOSER]: "추입보다 더 늦게 스퍼트를 시작하지만 폭발력은 가장 강합니다.",

  // Aptitudes
  [DistanceAptitude.SHORT]: "단거리(1400m 이하)에 강하며, 스태미너가 낮지만 순간 가속이 좋습니다.",
  [DistanceAptitude.MEDIUM]: "중거리(1500m~2200m)에 적합한 밸런스형입니다.",
  [DistanceAptitude.LONG]: "장거리(2300m 이상)에 강하며, 지치지 않는 스태미너를 가집니다.",
  
  // Track Preference
  [TrackType.TURF]: "잔디 트랙에 익숙합니다. 더트에서는 제 실력을 내지 못합니다.",
  [TrackType.DIRT]: "모래(더트) 트랙에 익숙합니다. 잔디에서는 속도가 나지 않습니다.",

  // Tags
  '짝수': '등번호가 짝수입니다. [짝수의 가호] 룰의 영향을 받습니다.',
  '홀수': '등번호가 홀수입니다. [홀수의 저주] 룰의 영향을 받습니다.',
  '소수': '등번호가 소수(2,3,5,7)입니다. [소수의 반란] 룰의 영향을 받습니다.',
  '7번': '행운의 숫자입니다. [럭키 세븐] 룰의 영향을 받습니다.',
};

const HORSE_NAMES = [
  '천둥번개', '적토마', '슈퍼노바', '황금날개', '질풍가도', '다크나이트', 
  '불꽃슈터', '새벽의별', '무적함대', '럭키세븐', '바람의아들', '그랜드슬램',
  '블랙홀', '코스믹댄서', '아이언하트', '스피드킹', '사일런스', '골드쉽',
  '딥임팩트', '오르페브르', '보드카', '다이와', '스페셜', '위크', '하루우라라', '킹카메'
];

const HORSE_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#64748b'  // Slate
];

// Artifact Database
export const ARTIFACTS: Artifact[] = [
  // --- NUMBER ---
  {
    id: 'even_blessing',
    name: '짝수의 가호',
    description: '등번호가 짝수인 말은 스피드 +15%',
    price: 2400000,
    rarity: 'COMMON',
    effectType: 'PASSIVE',
    category: 'NUMBER'
  },
  {
    id: 'odd_curse',
    name: '홀수의 저주',
    description: '등번호가 홀수인 말은 스피드 -10%',
    price: 2400000,
    rarity: 'COMMON',
    effectType: 'PASSIVE',
    category: 'NUMBER'
  },
  {
    id: 'prime_rebellion',
    name: '소수의 반란',
    description: '소수 번호(2,3,5,7)는 경기 후반 가속도 +50%',
    price: 4000000,
    rarity: 'RARE',
    effectType: 'TRIGGER',
    category: 'NUMBER'
  },
  {
    id: 'lucky_seven',
    name: '럭키 세븐',
    description: '7번 말은 경기 내내 스태미너 소모량 -30%',
    price: 3500000,
    rarity: 'RARE',
    effectType: 'PASSIVE',
    category: 'NUMBER'
  },
  // --- PHYSICS & GIMMICKS (New) ---
  {
    id: 'mud_fight',
    name: '진흙탕 싸움',
    description: '현재 1~3등 말의 속도 -20%',
    price: 3600000,
    rarity: 'RARE',
    effectType: 'PASSIVE',
    category: 'PHYSICS'
  },
  {
    id: 'zero_resistance',
    name: '공기 저항 제로',
    description: '현재 꼴찌인 말은 속도 +35%',
    price: 4800000,
    rarity: 'LEGENDARY',
    effectType: 'PASSIVE',
    category: 'PHYSICS'
  },
  {
    id: 'social_distance',
    name: '사회적 거리두기',
    description: '주변 5m 내에 아무도 없으면 속도 +20%',
    price: 3800000,
    rarity: 'RARE',
    effectType: 'PASSIVE',
    category: 'PHYSICS'
  },
  {
    id: 'wolf_pack',
    name: '늑대 무리',
    description: '주변 5m 내에 2마리 이상의 말이 있으면 가속 +25%',
    price: 3200000,
    rarity: 'COMMON',
    effectType: 'PASSIVE',
    category: 'PHYSICS'
  },
  {
    id: 'sniper_sight',
    name: '저격 조준경',
    description: '선두와 거리가 50m 이상 벌어지면 속도 +25%',
    price: 4500000,
    rarity: 'LEGENDARY',
    effectType: 'PASSIVE',
    category: 'PHYSICS'
  },
  // --- TRACK & FIELD (New) ---
  {
    id: 'offroad_tire',
    name: '오프로드 타이어',
    description: '모든 말이 [더트] 트랙에서의 속도 페널티를 무시',
    price: 5000000,
    rarity: 'LEGENDARY',
    effectType: 'PASSIVE',
    category: 'TRACK'
  },
  {
    id: 'marathon_runner',
    name: '마라토너',
    description: '2400m 이상 장거리 경기에서 모든 말의 스태미너 소모 -50%',
    price: 4200000,
    rarity: 'RARE',
    effectType: 'PASSIVE',
    category: 'TRACK'
  },
  // --- DOPAMINE ---
  {
    id: 'adrenaline',
    name: '아드레날린 주사',
    description: '남은 거리 600m 이하, 3등 밖이면 속도 +100%',
    price: 6400000,
    rarity: 'LEGENDARY',
    effectType: 'TRIGGER',
    category: 'DOPAMINE'
  },
  {
    id: 'finish_blow',
    name: '피니시 블로우',
    description: '결승선 300m 전, 모든 체력을 소모해 가속 폭발',
    price: 5600000,
    rarity: 'RARE',
    effectType: 'TRIGGER',
    category: 'DOPAMINE'
  },
  // --- STRATEGY ---
  {
    id: 'runaway_king',
    name: '도주의 신',
    description: "'도주' 각질 말의 초반 속도 +20% 증가",
    price: 3000000,
    rarity: 'COMMON',
    effectType: 'PASSIVE',
    category: 'STRATEGY'
  },
  {
    id: 'short_sprint',
    name: '단거리의 제왕',
    description: "'단거리' 적성 말의 가속력 +30%",
    price: 2800000,
    rarity: 'COMMON',
    effectType: 'PASSIVE',
    category: 'STRATEGY'
  },
  {
    id: 'infinite_stamina',
    name: '무한 동력',
    description: "'장거리' 적성 말의 스태미너 감소 없음",
    price: 7000000,
    rarity: 'LEGENDARY',
    effectType: 'PASSIVE',
    category: 'STRATEGY'
  },
  // --- CURSE ---
  {
    id: 'curse_lead',
    name: '납 구두',
    description: '내가 배팅한 말 속도 -5% (해제 불가)',
    price: 0,
    rarity: 'CURSED',
    effectType: 'PASSIVE',
    category: 'CURSE'
  }
];

export const generateRaceConfig = (day: number): RaceConfig => {
  // Distances: 1000, 1200, 1600 (Mile), 2000 (Medium), 2400 (Classic), 3200 (Stayer)
  const distances = [1000, 1200, 1600, 2000, 2400, 3200];
  // Weighted random for distance
  const roll = Math.random();
  let distance = 2000;
  if (roll < 0.2) distance = 1200;
  else if (roll < 0.4) distance = 1600;
  else if (roll < 0.7) distance = 2000;
  else if (roll < 0.9) distance = 2400;
  else distance = 3200;

  // Track Type: 70% Turf, 30% Dirt
  const trackType = Math.random() > 0.3 ? TrackType.TURF : TrackType.DIRT;

  // Name Generation
  const prefixes = ['제N회', '특별', '오픈', '기념'];
  const titles = ['스피드컵', '더비', '오크스', '챔피언십', '그랑프리', '배팅왕배', '스프린터즈', '스테이어즈'];
  const name = `${prefixes[randomInt(0, prefixes.length - 1)]} ${titles[randomInt(0, titles.length - 1)]}`;

  return {
    name,
    distance,
    trackType
  };
};

export const generateHorses = (): Horse[] => {
  const horses: Horse[] = [];
  const selectedNames = [...HORSE_NAMES].sort(() => 0.5 - Math.random()).slice(0, 8);

  for (let i = 0; i < 8; i++) {
    const number = i + 1;
    
    // Assign Distance Aptitude
    const distRoll = Math.random();
    let aptitude = DistanceAptitude.MEDIUM;
    if (distRoll < 0.3) aptitude = DistanceAptitude.SHORT;
    else if (distRoll > 0.7) aptitude = DistanceAptitude.LONG;

    // Assign Track Preference (70% match standard Turf)
    const prefRoll = Math.random();
    const trackPreference = prefRoll > 0.3 ? TrackType.TURF : TrackType.DIRT;

    // Assign Strategy
    const stratRoll = Math.random();
    let strategy = HorseStrategy.STALKER; // Default
    if (stratRoll < 0.2) strategy = HorseStrategy.RUNAWAY;
    else if (stratRoll < 0.4) strategy = HorseStrategy.FRONT;
    else if (stratRoll < 0.7) strategy = HorseStrategy.STALKER;
    else if (stratRoll < 0.9) strategy = HorseStrategy.SWEEPER;
    else strategy = HorseStrategy.CLOSER;

    // Base Stats based on Aptitude
    let baseSpeed = 100, stamina = 100, guts = 10, acceleration = 10;
    
    if (aptitude === DistanceAptitude.SHORT) {
      baseSpeed = randomInt(115, 135);
      stamina = randomInt(50, 80); // Low stamina
      acceleration = randomInt(12, 18); // High accel
      guts = randomInt(5, 10);
    } else if (aptitude === DistanceAptitude.MEDIUM) {
      baseSpeed = randomInt(100, 120);
      stamina = randomInt(90, 120);
      acceleration = randomInt(8, 14);
      guts = randomInt(8, 15);
    } else { // LONG
      baseSpeed = randomInt(90, 110);
      stamina = randomInt(140, 180); // Huge stamina
      acceleration = randomInt(5, 10);
      guts = randomInt(15, 25);
    }

    const tags: string[] = [];
    if (number % 2 === 0) tags.push('짝수');
    else tags.push('홀수');
    if ([2, 3, 5, 7].includes(number)) tags.push('소수');
    if (number === 7) tags.push('7번');

    const personality = Object.values(HorsePersonality)[randomInt(0, 4)];

    // Odds Calc
    const score = baseSpeed * 1.5 + stamina * 1.2 + acceleration * 1.5 + guts;
    let rawOdds = 1200 / score;
    
    // Adjust odds based on "meta"
    rawOdds = rawOdds * (Math.random() * 0.4 + 0.8);
    
    let odds = Math.round(rawOdds * 10) / 10; 
    if (odds < 1.1) odds = 1.1;
    if (odds > 99) odds = 99.9;

    const condition = Math.random() * 0.2 + 0.9;
    const calculatedBaseSpeed = (baseSpeed / 180) * condition;

    horses.push({
      id: i,
      name: selectedNames[i],
      number: number,
      color: HORSE_COLORS[i],
      stats: {
        speed: baseSpeed,
        acceleration: acceleration,
        stamina: stamina,
        guts: guts
      },
      personality,
      strategy,
      distanceAptitude: aptitude,
      trackPreference,
      tags,
      currentSpeed: 0,
      baseSpeed: calculatedBaseSpeed, 
      position: 0,
      staminaLeft: stamina,
      maxStamina: stamina,
      lane: i,
      condition,
      odds,
      activeBuffs: []
    });
  }
  return horses;
};
