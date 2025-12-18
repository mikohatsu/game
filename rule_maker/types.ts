
export enum Phase {
  START = 'START', // 타이틀 화면
  PREPARATION = 'PREPARATION', // 아지트 (상점)
  ANALYSIS = 'ANALYSIS', // 패독 (분석)
  DESIGN = 'DESIGN', // 설계 (베팅 및 룰 장착)
  RACE = 'RACE', // 경주
  SETTLEMENT = 'SETTLEMENT', // 정산
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum BettingType {
  WIN = '단승', // 1등 맞추기
  PLACE = '연승', // 3등 안에 들기 (배당 낮음)
  QUINELLA = '복승', // 1, 2등 순서 상관없이 맞추기
}

export enum HorsePersonality {
  COWARD = '겁쟁이', // 군중 속 감속
  FIGHTER = '싸움닭', // 군중 속 가속
  MYWAY = '마이웨이', // 영향 없음
  BOLD = '대담함', // 선두일 때 강함
  CALM = '냉철함' // 스태미너 소모 감소
}

export enum HorseStrategy {
  RUNAWAY = '도주', // 시작부터 전력 질주, 후반 급격한 체력 저하
  FRONT = '선행', // 선두 그룹 유지
  STALKER = '선입', // 중위권 유지 후 4코너 승부
  SWEEPER = '추입', // 최후방에서 막판 스퍼트
  CLOSER = '후입' // 추입보다 더 늦은 타이밍에 폭발
}

export enum DistanceAptitude {
  SHORT = '단거리', // 스태미너 낮음, 초반 가속 높음
  MEDIUM = '중거리', // 밸런스
  LONG = '장거리' // 스태미너 높음, 가속 낮음
}

export enum TrackType {
  TURF = '잔디',
  DIRT = '더트'
}

export interface Horse {
  id: number;
  name: string;
  number: number;
  color: string;
  stats: {
    speed: number; // 최고 속도
    acceleration: number; // 가속력
    stamina: number; // 거리 유지력
    guts: number; // 몸싸움 및 라스트 스퍼트 근성
  };
  personality: HorsePersonality;
  strategy: HorseStrategy;
  distanceAptitude: DistanceAptitude;
  trackPreference: TrackType; // New: 잔디/더트 적성
  tags: string[]; // '홀수', '짝수', '7번' 등
  currentSpeed: number;
  baseSpeed: number; 
  position: number; 
  staminaLeft: number;
  maxStamina: number; // For bar display
  lane: number;
  condition: number; // 0.8 ~ 1.2 random multiplier
  odds: number; // 배당률
  activeBuffs: string[]; 
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  price: number;
  rarity: 'COMMON' | 'RARE' | 'LEGENDARY' | 'CURSED';
  effectType: 'PASSIVE' | 'TRIGGER';
  triggerCondition?: (horse: Horse, raceState: RaceState) => boolean;
  category: 'NUMBER' | 'PHYSICS' | 'DOPAMINE' | 'CURSE' | 'STRATEGY' | 'TRACK';
}

export interface RaceConfig {
  name: string;
  distance: number;
  trackType: TrackType;
}

export interface RaceState {
  distance: number;
  horses: Horse[];
  elapsedTime: number;
  rankings: number[]; // horse IDs in order
  finishedHorses: number[]; // IDs of horses that finished
  activeEffects: { effectName: string; horseIds: number[] }[]; // Changed to support grouping
  triggeredSkills: string[]; 
}

export interface PlayerState {
  money: number;
  debt: number;
  day: number;
  dDay: number; 
  requiredPayment: number; // 0 if no payment required, otherwise amount needed to proceed
  inventory: Artifact[];
  equippedArtifacts: Artifact[];
  shopDiscount: number; // 0.0 to 0.5 (0% to 50%)
  betting: {
    type: BettingType;
    horseId: number | null;
    secondHorseId: number | null; 
    amount: number;
  };
}
