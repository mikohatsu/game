
import React, { useState, useRef, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import MainMenu from './components/MainMenu';
import HUD from './components/HUD';
import SkillTree from './components/SkillTree';
import JobSelection from './components/JobSelection';
import GachaScreen from './components/GachaScreen';
import Codex from './components/Codex';
import GameOver from './components/GameOver';
import { GameState, PermanentUpgrades, Player } from './types';
import { TREES, JOBS, DIFFICULTIES, RELIC_TYPES, RARITY, SHOP_DATA, SPECIAL_SHOP_DATA } from './constants';
import { Database, Unlock } from 'lucide-react';

const DEFAULT_UPGRADES: PermanentUpgrades = {
  start_dmg: 0,
  start_hp: 0,
  chip_gain: 0,
  start_crit: 0,
  start_speed: 0,
  xp_gain: 0,
  start_regen: 0,
  start_range: 0,
};

const INITIAL_PLAYER: Player = {
  pos: { x: 0, y: 0 },
  angle: 0,
  stats: {
    hp: 100, maxHp: 100, dmg: 10, spd: 4, range: 1, fireRate: 15, crit: 5, regen: 0.1, dmgMult: 1, cdr: 0, vamp: 0, chipMult: 1
  },
  level: 1, xp: 0, nextXp: 100, sp: 0,
  jobId: null, weapon: 'basic',
  activeSkills: {}, activeEffects: {},
  skillTree: {}, relics: {},
  kills: 0, combo: 0, comboTimer: 0, hitFlash: 0, iframe: 0, shieldHitFlash: 0
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  
  // Persistence
  const [credits, setCredits] = useState(0);
  const [cores, setCores] = useState(0); // New Special Currency
  const [hasUnlockedCores, setHasUnlockedCores] = useState(false); // To hide spoilers
  const [upgrades, setUpgrades] = useState<PermanentUpgrades>(DEFAULT_UPGRADES);
  const [relicInventory, setRelicInventory] = useState<Record<string, number>>({}); // Key: "id_rarity"

  // Game Stats for Game Over Screen
  const [gameResult, setGameResult] = useState({ score: 0, wave: 0, kills: 0, level: 0, time: 0, credits: 0, cores: 0 });

  const playerRef = useRef<Player>(JSON.parse(JSON.stringify(INITIAL_PLAYER)));
  const scoreRef = useRef(0);
  const waveRef = useRef(1);
  const [currentDifficulty, setCurrentDifficulty] = useState<keyof typeof DIFFICULTIES>('normal');
  const [_, setTick] = useState(0); // Force re-render for HUD

  // Job Selection State
  const [availableJobs, setAvailableJobs] = useState<string[]>([]);

  // Load Data
  useEffect(() => {
    const savedCredits = localStorage.getItem('DRONE_CREDITS');
    if (savedCredits) setCredits(parseInt(savedCredits));
    
    const savedCores = localStorage.getItem('DRONE_CORES');
    if (savedCores) setCores(parseInt(savedCores));

    const savedCoreUnlock = localStorage.getItem('DRONE_CORES_UNLOCKED');
    if (savedCoreUnlock === 'true' || (savedCores && parseInt(savedCores) > 0)) {
        setHasUnlockedCores(true);
    }

    const savedUpgrades = localStorage.getItem('DRONE_UPGRADES');
    if (savedUpgrades) setUpgrades(JSON.parse(savedUpgrades));

    const savedRelics = localStorage.getItem('DRONE_RELICS');
    if (savedRelics) setRelicInventory(JSON.parse(savedRelics));

    const interval = setInterval(() => {
        if (gameState === 'PLAYING') {
            const p = playerRef.current;
            // Check for Job Unlock
            if (p.level >= 10 && !p.jobId) {
                setAvailableJobs(['tactician', 'berserker', 'guardian']);
                setGameState('JOB_SELECT');
            } else if (p.level >= 30 && p.jobId && JOBS[p.jobId].unlockLv === 10) {
                 const nextJobs = Object.keys(JOBS).filter(k => JOBS[k].unlockLv === 30);
                 setAvailableJobs(nextJobs);
                 setGameState('JOB_SELECT');
            } else if (p.level >= 60 && p.jobId && JOBS[p.jobId].unlockLv === 30) {
                 const nextJobs = Object.keys(JOBS).filter(k => JOBS[k].parent === p.jobId);
                 setAvailableJobs(nextJobs);
                 setGameState('JOB_SELECT');
            } else if (p.level >= 100 && p.jobId && JOBS[p.jobId].unlockLv === 60) {
                 const nextJobs = Object.keys(JOBS).filter(k => JOBS[k].parent === p.jobId);
                 setAvailableJobs(nextJobs);
                 setGameState('JOB_SELECT');
            }

            setTick(t => t + 1);
        }
    }, 100);
    return () => clearInterval(interval);
  }, [gameState]);

  const saveProgress = (newCredits: number, newCores: number) => {
      setCredits(newCredits);
      setCores(newCores);
      localStorage.setItem('DRONE_CREDITS', newCredits.toString());
      localStorage.setItem('DRONE_CORES', newCores.toString());
  };

  const unlockCores = () => {
      if (!hasUnlockedCores) {
          setHasUnlockedCores(true);
          localStorage.setItem('DRONE_CORES_UNLOCKED', 'true');
      }
  };

  const saveUpgrades = (newUpgrades: PermanentUpgrades) => {
      setUpgrades(newUpgrades);
      localStorage.setItem('DRONE_UPGRADES', JSON.stringify(newUpgrades));
  };

  const saveRelics = (newRelics: Record<string, number>) => {
      setRelicInventory(newRelics);
      localStorage.setItem('DRONE_RELICS', JSON.stringify(newRelics));
  };

  // --- DEVELOPER CHEAT ---
  const handleUnlockAll = () => {
      unlockCores();
      saveProgress(9999999, 999);
      
      const maxUpgrades: any = {};
      SHOP_DATA.forEach(u => maxUpgrades[u.id] = u.max);
      SPECIAL_SHOP_DATA.forEach(u => maxUpgrades[u.id] = u.max);
      saveUpgrades(maxUpgrades);

      const allRelics: Record<string, number> = {};
      RELIC_TYPES.forEach(r => {
          allRelics[`${r.id}_common`] = 10;
          allRelics[`${r.id}_rare`] = 5;
          allRelics[`${r.id}_unique`] = 2;
          allRelics[`${r.id}_epic`] = 1;
      });
      saveRelics(allRelics);

      alert("DEV MODE ENABLED: ALL SYSTEMS UNLOCKED");
  };

  const handleBuyUpgrade = (type: keyof PermanentUpgrades, cost: number, currency: 'chips' | 'cores') => {
      const level = upgrades[type] || 0;
      if (currency === 'chips') {
          if (credits >= cost) {
              saveProgress(credits - cost, cores);
              saveUpgrades({ ...upgrades, [type]: level + 1 });
          }
      } else {
          if (cores >= cost) {
              saveProgress(credits, cores - cost);
              saveUpgrades({ ...upgrades, [type]: level + 1 });
          }
      }
  };

  const handleGachaPull = (amount: number, currency: 'chips' | 'cores') => {
      const costChip = 1000 * amount;
      const costCore = 1; // 1 Core = 10 items (fixed logic in GachaScreen)

      if (currency === 'chips') {
          if (credits < costChip) return null;
          saveProgress(credits - costChip, cores);
      } else {
          if (cores < costCore) return null;
          saveProgress(credits, cores - costCore);
      }
      
      const results: Array<{ id: string; rarity: string }> = [];

      for(let i=0; i<amount; i++) {
        const rand = Math.random();
        let rarity = 'common';
        let cumulative = 0;
        
        // @ts-ignore
        for (const [rKey, rVal] of Object.entries(RARITY)) {
            cumulative += rVal.chance;
            if (rand < cumulative) {
                rarity = rKey;
                break;
            }
        }

        const type = RELIC_TYPES[Math.floor(Math.random() * RELIC_TYPES.length)];
        results.push({ id: type.id, rarity });
      }
      
      // Update Inventory Bulk
      const newInv = { ...relicInventory };
      results.forEach(r => {
          const key = `${r.id}_${r.rarity}`;
          newInv[key] = (newInv[key] || 0) + 1;
      });
      saveRelics(newInv);

      return results;
  };

  const startGame = (difficulty: keyof typeof DIFFICULTIES) => {
    const p = JSON.parse(JSON.stringify(INITIAL_PLAYER));
    
    // Apply Permanent Upgrades
    p.stats.maxHp += upgrades.start_hp * 20;
    p.stats.dmg += upgrades.start_dmg * 2;
    p.stats.spd *= (1 + upgrades.start_speed * 0.1);
    p.stats.crit += upgrades.start_crit * 5;
    p.stats.regen += upgrades.start_regen * 0.2;
    p.stats.range *= (1 + upgrades.start_range * 0.15);
    p.stats.chipMult = 1 + upgrades.chip_gain * 0.1;
    p.nextXp = 100 / (1 + upgrades.xp_gain * 0.15); 
    
    // Apply Elite Upgrades (Cores)
    if (upgrades.core_start_lv) {
        p.level += upgrades.core_start_lv;
        p.sp += upgrades.core_start_lv; // Grant SP for extra levels
    }
    if (upgrades.core_mastery) {
        p.stats.dmgMult += upgrades.core_mastery * 0.05;
    }

    // Apply Relics (Inventory -> Stats)
    Object.entries(relicInventory).forEach(([key, count]) => {
        const [id, rarity] = key.split('_');
        const relic = RELIC_TYPES.find(r => r.id === id);
        // @ts-ignore
        const rarityData = RARITY[rarity];
        
        if (relic && rarityData) {
            const totalBonus = relic.value * rarityData.mult * count;
            if (id === 'dmg') p.stats.dmgMult += totalBonus;
            if (id === 'hp') p.stats.maxHp *= (1 + totalBonus);
            if (id === 'spd') p.stats.spd *= (1 + totalBonus);
            if (id === 'crit') p.stats.crit += totalBonus * 100;
            if (id === 'range') p.stats.range += totalBonus;
            if (id === 'cdr') p.stats.cdr += totalBonus; 
            if (id === 'chip_gain') p.stats.chipMult += totalBonus;
            if (id === 'regen') p.stats.regen += totalBonus;
            if (id === 'xp_gain') p.nextXp /= (1 + totalBonus); 
        }
    });

    p.stats.hp = p.stats.maxHp;

    playerRef.current = p;
    scoreRef.current = 0;
    waveRef.current = 1;
    setCurrentDifficulty(difficulty);
    setGameState('PLAYING');
  };

  const handleGameOver = (finalScore: number, finalTime: number) => {
    const earnedCredits = Math.floor(finalScore / 10 * playerRef.current.stats.chipMult); 
    
    // Calculate new total
    const newCredits = credits + earnedCredits;
    saveProgress(newCredits, cores);

    // Set Game Result for UI
    setGameResult({
        score: finalScore,
        wave: waveRef.current,
        kills: playerRef.current.kills || 0, // Fallback if kills not tracked yet in App
        level: playerRef.current.level,
        time: finalTime,
        credits: earnedCredits,
        cores: 0
    });

    setGameState('GAME_OVER');
  };

  const handleBossDefeat = () => {
     // Boss killed in Hard+ grants 1 core
     unlockCores();
     const newCores = cores + 1;
     saveProgress(credits, newCores);
     
     // Update current game result potential as well (if needed visually immediately)
     setGameResult(prev => ({ ...prev, cores: prev.cores + 1 }));
  };

  const handleSkillUpgrade = (nodeId: string) => {
    const player = playerRef.current;
    const allNodes = Object.values(TREES).flat();
    const node = allNodes.find(n => n.id === nodeId);
    
    if (node && player.sp > 0) {
        player.sp--;
        player.skillTree[nodeId] = (player.skillTree[nodeId] || 0) + 1;
        
        if (node.type === 'passive' && node.stat) {
            if (node.stat === 'all') {
                player.stats.dmg += node.val!;
                player.stats.maxHp += node.val!;
                player.stats.hp += node.val!;
            } else {
                // @ts-ignore
                player.stats[node.stat] += node.val!;
                if (node.stat === 'hp') {
                    player.stats.maxHp += node.val!;
                    player.stats.hp += node.val!;
                }
            }
        }
        setTick(t => t + 1);
    }
  };

  const handleJobSelect = (jobId: string) => {
      const p = playerRef.current;
      p.prevJobId = p.jobId || undefined;
      p.jobId = jobId;
      const job = JOBS[jobId];
      p.weapon = job.weapon;
      if (job.passive) {
          if (job.passive.hp) { p.stats.maxHp += job.passive.hp; p.stats.hp = p.stats.maxHp; }
          if (job.passive.dmg) p.stats.dmg += job.passive.dmg;
          if (job.passive.dmgMult) p.stats.dmgMult += job.passive.dmgMult;
          if (job.passive.cdr) p.stats.cdr += job.passive.cdr;
          if (job.passive.regen) p.stats.regen += job.passive.regen;
      }
      setGameState('PLAYING');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-white">
      {/* DEVELOPER BUTTON */}
      <button 
          onClick={handleUnlockAll}
          className="fixed top-0 right-0 w-8 h-8 bg-slate-950 hover:bg-slate-800 text-slate-950 hover:text-cyan-500 z-[100] flex items-center justify-center transition-colors"
          title="DEV UNLOCK"
      >
          <Database size={16} />
      </button>

      {gameState === 'MENU' && (
        <MainMenu 
            onStart={startGame} 
            credits={credits} 
            cores={cores}
            hasUnlockedCores={hasUnlockedCores}
            upgrades={upgrades}
            onBuyUpgrade={handleBuyUpgrade}
            onGacha={() => setGameState('GACHA')}
            onOpenCodex={() => setGameState('CODEX')}
        />
      )}

      {gameState === 'GACHA' && (
          <GachaScreen 
             credits={credits}
             cores={cores}
             hasUnlockedCores={hasUnlockedCores}
             inventory={relicInventory}
             onPull={handleGachaPull}
             onClose={() => setGameState('MENU')}
          />
      )}

      {gameState === 'CODEX' && (
          <Codex 
             inventory={relicInventory}
             onClose={() => setGameState('MENU')}
          />
      )}
      
      {gameState === 'JOB_SELECT' && (
          <JobSelection 
            availableJobs={availableJobs}
            onSelect={handleJobSelect}
          />
      )}
      
      {gameState === 'GAME_OVER' && (
          <GameOver 
            stats={gameResult}
            onReturn={() => setGameState('MENU')}
            onRetry={() => startGame(currentDifficulty)}
          />
      )}
      
      {(gameState === 'PLAYING' || gameState === 'SKILL_TREE' || gameState === 'JOB_SELECT') && (
        <>
            <GameCanvas 
                gameState={gameState === 'SKILL_TREE' || gameState === 'JOB_SELECT' ? 'PAUSED' : gameState}
                onGameOver={handleGameOver}
                playerRef={playerRef}
                scoreRef={scoreRef}
                waveRef={waveRef}
                difficulty={DIFFICULTIES[currentDifficulty]}
                onBossDefeat={handleBossDefeat}
                onOpenSkills={() => setGameState('SKILL_TREE')}
            />
            
            {gameState === 'PLAYING' && (
                <HUD 
                    player={playerRef.current} 
                    score={scoreRef.current} 
                    wave={waveRef.current}
                    onOpenSkills={() => setGameState('SKILL_TREE')}
                />
            )}

            {gameState === 'SKILL_TREE' && (
                <SkillTree 
                    player={playerRef.current}
                    onUpgrade={handleSkillUpgrade}
                    onClose={() => setGameState('PLAYING')}
                />
            )}
        </>
      )}
    </div>
  );
};

export default App;
