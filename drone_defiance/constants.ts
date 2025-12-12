

import { JobDef, WeaponDef, SkillNode } from './types';

export const CANVAS_WIDTH = window.innerWidth;
export const CANVAS_HEIGHT = window.innerHeight;

export const COLORS = {
  player: '#06b6d4',
  playerBullet: '#67e8f9',
  enemyBullet: '#f87171',
  xp: '#facc15',
  grid: '#1e293b',
};

// --- ENEMY DATA ---
export const ENEMY_STATS = {
  scout: { radius: 15, score: 10, color: '#a35' },
  shooter: { radius: 15, score: 20, color: '#a0f' },
  dasher: { radius: 12, score: 30, color: '#f0f' },
  sniper: { radius: 20, score: 40, color: '#f80' },
  tank: { radius: 25, score: 50, color: '#666' },
  splitter: { radius: 18, score: 60, color: '#0af' },
  boss: { radius: 40, score: 500, color: '#f04' },
  finalboss: { radius: 80, score: 5000, color: '#f00' },
  turret: { radius: 15, score: 0, color: '#22d3ee' } // Friendly unit
};

export const WEAPONS: Record<string, WeaponDef> = {
    // TIER 0-1
    basic: { rate: 15, dmg: 1, range: 350, spread: 0, bullets: 1, speed: 12 },

    // TIER 2
    minigun: { rate: 5, dmg: 0.6, range: 300, spread: 0.15, bullets: 1, speed: 14 },
    missile: { rate: 30, dmg: 1.5, range: 500, spread: 0, bullets: 1, speed: 10, homing: true },
    sniper: { rate: 40, dmg: 3, range: 600, spread: 0, bullets: 1, speed: 25 },

    // TIER 3 - Gunner Line
    shotgun: { rate: 25, dmg: 0.8, range: 200, spread: 0.4, bullets: 6, speed: 14 },
    heavy: { rate: 8, dmg: 0.7, range: 400, spread: 0.1, bullets: 2, speed: 12, aoe: 80 },
    cannon: { rate: 60, dmg: 5, range: 450, spread: 0, bullets: 1, speed: 9, aoe: 150 },

    // TIER 3 - Lancer Line
    multi_missile: { rate: 20, dmg: 1.2, range: 500, spread: 0.2, bullets: 3, speed: 10, homing: true },
    rocket: { rate: 50, dmg: 4, range: 600, spread: 0, bullets: 1, speed: 9, aoe: 200 },
    drones: { rate: 10, dmg: 0.5, range: 400, spread: 0, bullets: 1, speed: 12, drone: true },

    // TIER 3 - Marksman Line
    railgun: { rate: 80, dmg: 8, range: 800, spread: 0, bullets: 1, speed: 30, pierce: true },
    precision: { rate: 30, dmg: 2.5, range: 700, spread: 0, bullets: 1, speed: 25, critBonus: 50 },
    piercer: { rate: 35, dmg: 2, range: 700, spread: 0, bullets: 1, speed: 18, pierce: true, chain: 3 }
};

export const JOBS: Record<string, JobDef> = {
    // --- 1차 전직 (Lv 10) ---
    tactician: { name: 'Tactician', desc: 'Skill Specialist', icon: '🧠', weapon: 'basic', unlockLv: 10,
        skill: { id: 'tac_strike', name: 'Tactical Strike', desc: 'Precision Burst Fire', cd: 180, key: 'Q', icon: 'Crosshair', type: 'attack' },
        passive: { cdr: 0.1, dmgMult: 0.2 } },
    
    berserker: { name: 'Berserker', desc: 'Speed & Power', icon: '⚔️', weapon: 'basic', unlockLv: 10,
        skill: { id: 'rage', name: 'Rage Mode', desc: 'Fire Rate x2 (2.5s)', cd: 300, duration: 150, key: 'Q', icon: 'Flame', type: 'buff' },
        passive: { dmg: 3, dmgMult: 0.15 } },

    guardian: { name: 'Guardian', desc: 'Defense Core', icon: '🛡️', weapon: 'basic', unlockLv: 10,
        skill: { id: 'shield_dome', name: 'Shield Dome', desc: 'Heal & 80% Dmg Reduc', cd: 240, duration: 180, key: 'Q', icon: 'Shield', type: 'defense' },
        passive: { hp: 50, regen: 1 } },

    // --- 2차 전직 (Lv 30) : Weapon Choice (Available to ALL Tier 1) ---
    // Note: 'parent' is omitted to allow global selection in logic, or we handle logic in App.tsx
    gunner: { name: 'Gunner', desc: 'High Rate of Fire', icon: '🔫', weapon: 'minigun', unlockLv: 30,
        skill: { id: 'dash_shoot', name: 'Combat Roll', desc: 'Dash while firing', cd: 180, key: 'SPACE', icon: 'ChevronsRight', type: 'defense' } },

    lancer: { name: 'Lancer', desc: 'Homing Tech', icon: '🚀', weapon: 'missile', unlockLv: 30,
        skill: { id: 'warp', name: 'Warp Jump', desc: 'Teleport forward', cd: 120, key: 'SPACE', icon: 'Zap', type: 'defense' } },

    marksman: { name: 'Marksman', desc: 'Long Range', icon: '🎯', weapon: 'sniper', unlockLv: 30,
        skill: { id: 'evade', name: 'Disengage', desc: 'Jump back', cd: 180, key: 'SPACE', icon: 'MoveDown', type: 'defense' } },

    // --- 3차 전직 (Lv 60) : Specialization ---
    
    // GUNNER LINE
    assault: { name: 'Assault', desc: 'Shotgun CQC', icon: '💥', weapon: 'shotgun', parent: 'gunner', unlockLv: 60,
        skill: { id: 'buckshot', name: 'Buckshot', desc: 'Massive Cone Dmg', cd: 300, key: 'R', icon: 'LayoutGrid', type: 'attack' } },
    
    suppressor: { name: 'Suppressor', desc: 'Area Suppression', icon: '🌪️', weapon: 'heavy', parent: 'gunner', unlockLv: 60,
        skill: { id: 'suppress', name: 'Suppression', desc: 'Slow + Dmg Aura', cd: 600, duration: 300, key: 'R', icon: 'Anchor', type: 'buff' } },
    
    juggernaut: { name: 'Juggernaut', desc: 'Tank Buster', icon: '🛡️', weapon: 'cannon', parent: 'gunner', unlockLv: 60,
        skill: { id: 'siege', name: 'Siege Mode', desc: 'Immobile, 2x Dmg', cd: 600, duration: 300, key: 'R', icon: 'Castle', type: 'buff' } },

    // LANCER LINE
    striker: { name: 'Striker', desc: 'Missile Swarm', icon: '⚡', weapon: 'multi_missile', parent: 'lancer', unlockLv: 60,
        skill: { id: 'swarm', name: 'Missile Swarm', desc: 'Fire 20 missiles', cd: 600, key: 'R', icon: 'Wind', type: 'attack' } },
    
    artillery: { name: 'Artillery', desc: 'Bombardment', icon: '💣', weapon: 'rocket', parent: 'lancer', unlockLv: 60,
        skill: { id: 'nuke', name: 'Tac Nuke', desc: 'Huge Explosion', cd: 900, key: 'R', icon: 'Radiation', type: 'attack' } },
    
    commander: { name: 'Commander', desc: 'Drone Controller', icon: '👑', weapon: 'drones', parent: 'lancer', unlockLv: 60,
        skill: { id: 'deploy', name: 'Deploy Squad', desc: 'Summon 3 Drones', cd: 900, duration: 600, key: 'R', icon: 'Users', type: 'summon' } },

    // MARKSMAN LINE
    job_sniper: { name: 'Sniper', desc: 'One Shot', icon: '🔭', weapon: 'railgun', parent: 'marksman', unlockLv: 60,
        skill: { id: 'headshot', name: 'Headshot', desc: 'Next shot 500% Dmg', cd: 600, key: 'R', icon: 'Crosshair', type: 'buff' } },
    
    hunter: { name: 'Hunter', desc: 'Crit Master', icon: '🎯', weapon: 'precision', parent: 'marksman', unlockLv: 60,
        skill: { id: 'mark', name: 'Hunter\'s Mark', desc: '100% Crit for 5s', cd: 600, duration: 300, key: 'R', icon: 'Eye', type: 'buff' } },
    
    reaper: { name: 'Reaper', desc: 'Chain Killer', icon: '💀', weapon: 'piercer', parent: 'marksman', unlockLv: 60,
        skill: { id: 'harvest', name: 'Grim Harvest', desc: 'Dmg + on Kill', cd: 600, duration: 300, key: 'R', icon: 'Scissors', type: 'buff' } },

    // --- 4차 전직 (Lv 100) : Ultimate Evolution ---

    // Gunner Line Ultimates
    warmonger: { name: 'Warmonger', desc: 'Endless Fire', icon: '🔥', weapon: 'shotgun', parent: 'assault', unlockLv: 100,
        skill: { id: 'inferno', name: 'Inferno', desc: 'No Reload / Max Speed', cd: 1800, duration: 400, key: 'F', icon: 'Flame', type: 'buff' } },
    
    warlord: { name: 'Warlord', desc: 'Battlefield God', icon: '👹', weapon: 'heavy', parent: 'suppressor', unlockLv: 100,
        skill: { id: 'dominate', name: 'Domination', desc: 'Screen Stun + Dmg', cd: 1200, key: 'F', icon: 'Crown', type: 'attack' } },
    
    titan: { name: 'Titan', desc: 'Unstoppable', icon: '⚙️', weapon: 'cannon', parent: 'juggernaut', unlockLv: 100,
        skill: { id: 'quake', name: 'Earthquake', desc: 'Massive AOE Shock', cd: 900, key: 'F', icon: 'Activity', type: 'attack' } },

    // Lancer Line Ultimates
    devastator: { name: 'Devastator', desc: 'Missile Storm', icon: '🌪️', weapon: 'multi_missile', parent: 'striker', unlockLv: 100,
        skill: { id: 'rain', name: 'Missile Rain', desc: 'Global Bombardment', cd: 1800, key: 'F', icon: 'CloudRain', type: 'attack' } },
    
    apocalypse: { name: 'Apocalypse', desc: 'World Ender', icon: '💀', weapon: 'rocket', parent: 'artillery', unlockLv: 100,
        skill: { id: 'doomsday', name: 'Doomsday', desc: 'Screen Wipe Nuke', cd: 3600, key: 'F', icon: 'Skull', type: 'attack' } },
    
    overlord: { name: 'Overlord', desc: 'Legion Commander', icon: '👑', weapon: 'drones', parent: 'commander', unlockLv: 100,
        skill: { id: 'legion', name: 'Legion', desc: 'Summon 10 Drones', cd: 1800, duration: 900, key: 'F', icon: 'Grid', type: 'summon' } },

    // Marksman Line Ultimates
    mastermind: { name: 'Mastermind', desc: 'Perfect Execution', icon: '🌟', weapon: 'railgun', parent: 'job_sniper', unlockLv: 100,
        skill: { id: 'calc', name: 'Calculated', desc: 'Auto-Aim Weakspots', cd: 1800, duration: 600, key: 'F', icon: 'Cpu', type: 'buff' } },
    
    executioner: { name: 'Executioner', desc: 'Instant Death', icon: '⚰️', weapon: 'precision', parent: 'hunter', unlockLv: 100,
        skill: { id: 'guillotine', name: 'Guillotine', desc: 'Kill Low HP', cd: 1200, duration: 0, key: 'F', icon: 'MoveDown', type: 'attack' } },
    
    annihilator: { name: 'Annihilator', desc: 'Total Oblivion', icon: '☠️', weapon: 'piercer', parent: 'reaper', unlockLv: 100,
        skill: { id: 'void', name: 'Void Core', desc: 'Black Hole', cd: 1500, key: 'F', icon: 'CircleDot', type: 'attack' } },
};

// Skill Tree - Mapped to match the 27 class variations
// Simplified for generic access per tier
export const TREES: Record<number, SkillNode[]> = {
    // TIER 1: BASE
    1: [ 
        { id: 'base_core', x: 450, y: 300, name: 'Core Processing', desc: 'Dmg +1', type: 'passive', stat: 'dmg', val: 1, maxLevel: 5 },
        { id: 'base_rail', parentId: 'base_core', x: 450, y: 150, name: 'Ion Cannon', desc: '[R-Click] Charge Shot', type: 'active', tier: 0, icon: 'Zap', maxLevel: 1 },
        { id: 'base_hull', parentId: 'base_core', x: 250, y: 400, name: 'Hull Plating', desc: 'HP +20', type: 'passive', stat: 'hp', val: 20, maxLevel: 5 },
        { id: 'base_eng', parentId: 'base_core', x: 650, y: 400, name: 'Thrusters', desc: 'Speed +5%', type: 'passive', stat: 'spd', val: 0.05, maxLevel: 5 },
    ],

    // TIER 2: Lv10+ (Class Specifics)
    2: [
        { id: 't2_gen_dmg', x: 450, y: 300, name: 'Adv. Weaponry', desc: 'Dmg +10%', type: 'passive', stat: 'dmgMult', val: 0.1, maxLevel: 5 },
        // Tactician
        { id: 'tac_up', parentId: 't2_gen_dmg', x: 200, y: 200, name: 'Tactical OS', desc: 'CDR -5%', type: 'passive', stat: 'cdr', val: 0.05, maxLevel: 5, reqJob: 'tactician' },
        { id: 'tac_skill', parentId: 'tac_up', x: 100, y: 150, name: 'Strike Mastery', desc: 'Q Skill Upgrade', type: 'active', icon: 'Crosshair', val: 1, maxLevel: 5, reqJob: 'tactician' },
        // Berserker
        { id: 'ber_up', parentId: 't2_gen_dmg', x: 450, y: 100, name: 'Adrenaline', desc: 'Fire Rate +5%', type: 'passive', stat: 'fireRate', val: -1, maxLevel: 5, reqJob: 'berserker' },
        { id: 'ber_skill', parentId: 'ber_up', x: 450, y: 20, name: 'Rage Mastery', desc: 'Q Skill Upgrade', type: 'active', icon: 'Flame', val: 1, maxLevel: 5, reqJob: 'berserker' },
        // Guardian
        { id: 'grd_up', parentId: 't2_gen_dmg', x: 700, y: 200, name: 'Alloy Plate', desc: 'HP +50', type: 'passive', stat: 'hp', val: 50, maxLevel: 5, reqJob: 'guardian' },
        { id: 'grd_skill', parentId: 'grd_up', x: 800, y: 150, name: 'Shield Mastery', desc: 'Q Skill Upgrade', type: 'active', icon: 'Shield', val: 1, maxLevel: 5, reqJob: 'guardian' },
    ],

    // TIER 3: Lv30+ (Weapon Specifics)
    3: [
        { id: 't3_crit', x: 450, y: 300, name: 'Targeting Matrix', desc: 'Crit +5%', type: 'passive', stat: 'crit', val: 5, maxLevel: 5 },
        // Gunner
        { id: 'gun_up', parentId: 't3_crit', x: 250, y: 200, name: 'Rotary Motor', desc: 'Fire Rate +10%', type: 'passive', stat: 'fireRate', val: -2, maxLevel: 5, reqJob: 'gunner' },
        { id: 'gun_skill', parentId: 'gun_up', x: 150, y: 150, name: 'Dash Mastery', desc: 'Space Skill CD -10%', type: 'active', icon: 'ChevronsRight', val: 1, maxLevel: 5, reqJob: 'gunner' },
        // Lancer
        { id: 'lan_up', parentId: 't3_crit', x: 450, y: 100, name: 'Guidance Sys', desc: 'Range +15%', type: 'passive', stat: 'range', val: 0.15, maxLevel: 5, reqJob: 'lancer' },
        { id: 'lan_skill', parentId: 'lan_up', x: 450, y: 20, name: 'Warp Mastery', desc: 'Space Skill CD -10%', type: 'active', icon: 'Zap', val: 1, maxLevel: 5, reqJob: 'lancer' },
        // Marksman
        { id: 'mar_up', parentId: 't3_crit', x: 650, y: 200, name: 'Stabilizer', desc: 'Dmg +15%', type: 'passive', stat: 'dmgMult', val: 0.15, maxLevel: 5, reqJob: 'marksman' },
        { id: 'mar_skill', parentId: 'mar_up', x: 750, y: 150, name: 'Evade Mastery', desc: 'Space Skill CD -10%', type: 'active', icon: 'MoveDown', val: 1, maxLevel: 5, reqJob: 'marksman' },
    ],

    // TIER 4: Lv60+ (Archetype Mastery)
    4: [
        { id: 't4_ult', x: 450, y: 300, name: 'Core Overload', desc: 'All Stats +5%', type: 'passive', stat: 'all', val: 5, maxLevel: 5 },
        // Gunner Line
        { id: 'ass_mst', parentId: 't4_ult', x: 200, y: 400, name: 'Close Quarters', desc: 'Shotgun Spread -10%', type: 'active', icon: 'LayoutGrid', val: 1, maxLevel: 3, reqJob: 'assault' },
        { id: 'sup_mst', parentId: 't4_ult', x: 100, y: 300, name: 'Suppressor', desc: 'Fire Rate +5%', type: 'passive', stat: 'fireRate', val: -1, maxLevel: 3, reqJob: 'suppressor' },
        { id: 'jug_mst', parentId: 't4_ult', x: 200, y: 200, name: 'Heavy Plating', desc: 'Dmg Reduc +5%', type: 'passive', stat: 'hp', val: 100, maxLevel: 3, reqJob: 'juggernaut' },
        // Lancer Line
        { id: 'str_mst', parentId: 't4_ult', x: 450, y: 100, name: 'Swarm Tech', desc: 'Missile Count +1', type: 'active', icon: 'Wind', val: 1, maxLevel: 3, reqJob: 'striker' },
        { id: 'art_mst', parentId: 't4_ult', x: 450, y: 500, name: 'Blast Radius', desc: 'AOE +20%', type: 'active', icon: 'Radiation', val: 1, maxLevel: 3, reqJob: 'artillery' },
        { id: 'com_mst', parentId: 't4_ult', x: 550, y: 100, name: 'Drone Uplink', desc: 'Drone Dmg +20%', type: 'passive', stat: 'dmgMult', val: 0.2, maxLevel: 3, reqJob: 'commander' },
        // Marksman Line
        { id: 'snp_mst', parentId: 't4_ult', x: 700, y: 200, name: 'Kill Zone', desc: 'Range +30%', type: 'passive', stat: 'range', val: 0.3, maxLevel: 3, reqJob: 'job_sniper' },
        { id: 'hun_mst', parentId: 't4_ult', x: 800, y: 300, name: 'Vital Point', desc: 'Crit Dmg +50% (sim)', type: 'passive', stat: 'dmgMult', val: 0.2, maxLevel: 3, reqJob: 'hunter' },
        { id: 'rea_mst', parentId: 't4_ult', x: 700, y: 400, name: 'Soul Harvest', desc: 'Vamp +2%', type: 'passive', stat: 'vamp', val: 0.02, maxLevel: 3, reqJob: 'reaper' },
    ],

    // TIER 5: Lv100+ (Limit Break)
    5: [
        { id: 't5_gen', x: 450, y: 300, name: 'LIMIT BREAK', desc: 'Dmg +50%', type: 'passive', stat: 'dmgMult', val: 0.5, maxLevel: 10 },
        // Ultimates - Reduced CD
        { id: 'ult_cd', parentId: 't5_gen', x: 450, y: 150, name: 'Ultimate Efficiency', desc: 'F Skill CD -10%', type: 'active', icon: 'Zap', val: 1, maxLevel: 5 },
    ]
};

export const DIFFICULTIES = {
  normal: { name: 'NORMAL', hpMult: 1, dmgMult: 1, chipColor: '#facc15', chipType: 'Standard' },
  hard: { name: 'HARD', hpMult: 1.5, dmgMult: 1.5, chipColor: '#f97316', chipType: 'High Density' },
  expert: { name: 'EXPERT', hpMult: 2.5, dmgMult: 2.5, chipColor: '#ef4444', chipType: 'Pure Data' },
  chaos: { name: 'CHAOS', hpMult: 5.0, dmgMult: 5.0, chipColor: '#a855f7', chipType: 'Corrupted' }
};

export const SHOP_DATA = [
  { id: 'start_dmg', name: 'Weapon Caliber', desc: 'Increases base damage.', cost: 100, max: 10 },
  { id: 'start_hp', name: 'Hull Reinforcement', desc: 'Increases max HP.', cost: 100, max: 10 },
  { id: 'start_speed', name: 'Thruster Output', desc: 'Increases movement speed.', cost: 150, max: 5 },
  { id: 'start_crit', name: 'Targeting System', desc: 'Increases crit chance.', cost: 200, max: 5 },
  { id: 'start_range', name: 'Optics Package', desc: 'Increases weapon range.', cost: 150, max: 5 },
  { id: 'start_regen', name: 'Nanite Repair', desc: 'Passive HP regeneration.', cost: 250, max: 5 },
  { id: 'chip_gain', name: 'Data Miner', desc: 'Increase data chip gain.', cost: 300, max: 5 },
  { id: 'xp_gain', name: 'Learning AI', desc: 'Gain XP faster.', cost: 300, max: 5 },
];

export const SPECIAL_SHOP_DATA = [
  { id: 'core_reroll', name: 'Reroll Protocol', desc: 'Allow rerolling upgrades (Not Implemented).', cost: 1, max: 3 },
  { id: 'core_banish', name: 'Banish Protocol', desc: 'Banish unwanted upgrades (Not Implemented).', cost: 2, max: 3 },
  { id: 'core_start_lv', name: 'Overclock Start', desc: 'Start at higher level.', cost: 5, max: 3 },
  { id: 'core_mastery', name: 'Combat Mastery', desc: 'Global Damage Multiplier.', cost: 10, max: 5 },
];

export const RELIC_TYPES = [
    { id: 'dmg', name: 'Thermal Rounds', desc: 'Increases damage output.', icon: 'Flame', value: 0.1 },
    { id: 'hp', name: 'Titanium Plating', desc: 'Increases hull integrity.', icon: 'Shield', value: 0.1 },
    { id: 'spd', name: 'Gravitic Engine', desc: 'Increases flight speed.', icon: 'Wind', value: 0.05 },
    { id: 'crit', name: 'Laser Sight', desc: 'Increases critical hit probability.', icon: 'Crosshair', value: 0.05 },
    { id: 'range', name: 'Sniper Lens', desc: 'Increases weapon effective range.', icon: 'Maximize', value: 0.1 },
    { id: 'cdr', name: 'Quantum Processor', desc: 'Reduces skill cooldowns.', icon: 'Cpu', value: 0.05 },
    { id: 'chip_gain', name: 'Golden Algorithm', desc: 'Increases currency acquisition.', icon: 'Database', value: 0.1 },
    { id: 'regen', name: 'Repair Drones', desc: 'Passive hull repair.', icon: 'Activity', value: 0.2 },
    { id: 'xp_gain', name: 'Neural Link', desc: 'Increases experience gain.', icon: 'Zap', value: 0.1 },
    { id: 'lifesteal', name: 'Vampire Module', desc: 'Chance to heal on hit.', icon: 'Heart', value: 0.01 },
    { id: 'revive', name: 'Phoenix Core', desc: 'Revive upon death (Unique/Epic only).', icon: 'Ghost', value: 1 }
];

export const RARITY = {
    common: { name: 'Common', color: '#94a3b8', chance: 0.6, mult: 1 },
    rare: { name: 'Rare', color: '#3b82f6', chance: 0.25, mult: 2 },
    unique: { name: 'Unique', color: '#eab308', chance: 0.1, mult: 4 },
    epic: { name: 'Epic', color: '#d946ef', chance: 0.05, mult: 8 }
};
