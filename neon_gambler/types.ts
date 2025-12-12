export enum Rarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  LEGENDARY = 'Legendary',
}

export interface SymbolDef {
  id: string;
  name: string;
  icon: string; // Emoji or Lucide icon name
  description: string;
  baseValue: number;
  rarity: Rarity;
  type: 'resource' | 'animal' | 'person' | 'buff' | 'joker' | 'wild';
  // Mechanics
  destroys?: string[]; // IDs of symbols this destroys
  multiplies?: string[]; // IDs of symbols this multiplies adjacently
  transforms?: string; // ID of symbol it transforms into
  bonusPerAdjacent?: { target: string; amount: number };
}

export interface ArtifactDef {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  effectType: 'passive_income' | 'multiply_all' | 'extra_spin' | 'reroll_token';
  value?: number;
}

export interface GameState {
  credits: number;
  round: number;
  targetScore: number;
  currentRoundScore: number;
  spinsLeft: number;
  inventory: SymbolDef[];
  artifacts: ArtifactDef[];
  status: 'menu' | 'playing' | 'spinning' | 'shop' | 'gameover' | 'victory';
  grid: (SymbolDef | null)[];
  messages: LogMessage[];
  dealerMood: string;
}

export interface LogMessage {
  id: string;
  text: string;
  type: 'info' | 'score' | 'dealer' | 'danger';
}

export const GRID_SIZE = 3; // 3x3 grid
export const GRID_TOTAL = GRID_SIZE * GRID_SIZE;