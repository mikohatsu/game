
export interface Player {
  streamerName: string; 
  clickDamage: number;
  autoDamage: number;
  gold: number;
  viewers: number;
  subscribers: number;
  starPoints: number; 
  reincarnationCount: number;
  level: number;
  critChance: number;
  autoClickRate: number;
  viralChance: number;
  ttsChance: number;
  viewerInflowRate: number;
  artifacts: string[]; // ['SILVER_BUTTON', 'GOLD_BUTTON', etc.]
}

export interface Ally {
  id: string;
  name: string;
  image: string;
}

export interface Enemy {
  currentHp: number;
  maxHp: number;
  name: string;
  image: string;
  isBoss: boolean;
  isViral: boolean;
  level: number;
}

export interface Mission {
  id: string;
  sender: string;
  title: string;
  description: string;
  type: 'KILL' | 'COMBO' | 'GOLD' | 'STORY';
  targetValue: number;
  currentValue: number;
  rewardType: 'GOLD' | 'SUBS' | 'FEVER' | 'STAR';
  rewardValue: number;
  status: 'ACTIVE' | 'SUCCESS' | 'CLAIMED';
}

export interface Upgrade {
  id: string;
  name: string;
  category: 'CLICK' | 'AUTO' | 'UTILITY' | 'STAR';
  type: 'WEAPON' | 'CAMERA' | 'MIC' | 'ALLY' | 'PERK' | 'SYSTEM';
  baseCost: number;
  costMultiplier: number;
  level: number;
  effectValue: number;
  currency: 'GOLD' | 'VIEWERS' | 'STAR';
  description: string;
  persistent: boolean;
}

export interface ChatMessage {
  id: number;
  user: string;
  text: string;
  color: string;
}

export interface Ranker {
  rank: number;
  name: string;
  subscribers: number;
}

export interface GameState {
  player: Player;
  enemy: Enemy;
  stage: {
    chapter: number;
    level: number;
    arcName: string;
    isBossMode: boolean;
  };
  backgroundImage: string;
  upgrades: Upgrade[];
  allies: Ally[];
  chatMessages: ChatMessage[];
  activeMissions: Mission[];
  combo: number;
  isFever: boolean;
  isTTSTime: boolean;
  bossTimeLeft: number | null;
  likes: number; 
  
  // Game Flow
  isGameStarted: boolean;
  startGame: (name: string) => void;
  hardResetGame: () => Promise<void>;
  activateDevMode: () => void;

  // Ranking
  rankingList: Ranker[];
  isRankingOpen: boolean;
  toggleRanking: () => void;
  
  // Reincarnation Modal
  isReincarnationModalOpen: boolean;
  setReincarnationModal: (isOpen: boolean) => void;
  
  // Actions
  clickAttack: () => void;
  autoTick: () => void;
  buyUpgrade: (upgradeId: string) => void;
  addChatMessage: (text: string, user?: string) => void;
  generateNextEnemy: () => Promise<void>;
  resetBroadcast: () => void;
  claimMission: (missionId: string) => void;
  abandonMission: (missionId: string) => void;
  retryBoss: () => void;
  generateMission: () => void;
  checkMissionProgress: (type: Mission['type'], value: number) => void;
  onEnemyDefeated: () => void;
  addLike: () => void;
  
  // UI State
  lastDamage: { id: number, val: number, isAuto: boolean, isCrit: boolean } | null;
  isGeneratingImage: boolean;
}
