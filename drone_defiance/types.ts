
export interface Vector2 {
  x: number;
  y: number;
}

export interface Stats {
  hp: number;
  maxHp: number;
  dmg: number;
  spd: number;
  range: number;
  fireRate: number; // Attack speed (lower is faster or higher is faster depending on logic, normalized to ticks)
  crit: number;
  regen: number;
  dmgMult: number;
  cdr: number;
  vamp: number;
  chipMult: number;
}

// Matches SHOP_DATA ids and SPECIAL_SHOP_DATA ids
export interface PermanentUpgrades {
  start_dmg: number;
  start_hp: number;
  chip_gain: number;
  start_crit: number;
  start_speed: number;
  xp_gain: number;
  start_regen: number;
  start_range: number;
  // Special
  core_reroll?: number;
  core_banish?: number;
  core_start_lv?: number;
  core_mastery?: number;
}

export interface Player {
  pos: Vector2;
  angle: number;
  stats: Stats;
  level: number;
  xp: number;
  nextXp: number;
  sp: number;
  jobId: string | null;
  weapon: string;
  activeSkills: { [key: string]: number }; // SkillKey (Q, R, Space...) -> Cooldown Timer
  activeEffects: { [key: string]: number }; // EffectID -> Duration Timer
  skillTree: Record<string, number>; // NodeID -> Level
  relics: Record<string, number>; // RelicID_Rarity -> Count
  kills: number;
  combo: number;
  comboTimer: number;
  hitFlash: number;
  iframe: number; // Invulnerability frames
  shieldHitFlash: number;
  // Job Unlock Tracking
  prevJobId?: string;
}

export interface WeaponDef {
  rate: number;
  dmg: number;
  range: number;
  spread: number;
  bullets: number;
  speed: number;
  homing?: boolean;
  aoe?: number;
  pierce?: boolean;
  drone?: boolean;
  critBonus?: number;
  chain?: number;
}

export interface JobDef {
  name: string;
  desc: string;
  icon: string;
  weapon: string;
  unlockLv: number;
  parent?: string;
  skill: {
    id: string;
    name: string;
    desc: string;
    cd: number; // Frames
    duration?: number;
    key: 'Q' | 'SPACE' | 'R' | 'F'; // Assigned Key
    icon: string;
    type: 'buff' | 'attack' | 'summon' | 'defense';
    val?: number; // Effect value (e.g. shield amount, speed mult)
  };
  passive?: Partial<Stats>;
}

export interface Enemy {
  id: string;
  type: 'scout' | 'shooter' | 'dasher' | 'sniper' | 'tank' | 'splitter' | 'boss' | 'finalboss' | 'turret';
  pos: Vector2;
  velocity: Vector2;
  hp: number;
  maxHp: number;
  speed: number;
  angle: number;
  iframe: number;
  cd: number; // Attack cooldown
  phase?: number; // For bosses
  isMini?: boolean; // For splitter
  radius: number;
  owner?: 'player' | 'enemy'; // For summoned turrets
}

export interface Projectile {
  id: string;
  pos: Vector2;
  velocity: Vector2;
  dmg: number;
  life: number;
  color: string;
  isEnemy: boolean;
  radius: number;
  // Special properties
  range?: number;
  angle?: number; // Current angle for homing
  type: 'shot' | 'missile' | 'beam' | 'aoe' | 'nuke';
  homing?: boolean;
  crit?: boolean;
  pierce?: boolean;
}

export interface Particle {
  id: string;
  pos: Vector2;
  velocity: Vector2;
  life: number;
  maxLife: number;
  color: string;
  type: 'spark' | 'beam' | 'nova' | 'smoke' | 'missile';
  size: number;
  angle?: number;
  range?: number;
  decay?: boolean;
  // For missile particles logic
  vx?: number;
  vy?: number;
  dmg?: number;
  crit?: number;
}

export interface FloatingText {
  id: string;
  pos: Vector2;
  text: string;
  color: string;
  life: number;
  velocity: Vector2;
}

export interface SkillNode {
    id: string;
    x: number;
    y: number;
    name: string;
    desc: string;
    // 'active' unlocks skills, 'passive' adds stats
    type: 'active' | 'passive';
    stat?: keyof Stats | 'all';
    val?: number;
    maxLevel: number; 
    tier?: number;
    icon?: string;
    parentId?: string;
    reqJob?: string; // If present, only visible to this job (or its children)
}

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'SKILL_TREE' | 'GAME_OVER' | 'JOB_SELECT' | 'GACHA' | 'CODEX';
