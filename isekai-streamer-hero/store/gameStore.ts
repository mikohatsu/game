import { create } from 'zustand';
import { GameState, Upgrade, Mission, Ally, Ranker } from '../types';
import { INITIAL_UPGRADES, STORY_ARCS, CHAT_MESSAGES_IDLE, CHAT_USERS, CHAT_COLORS, RANKER_NAMES } from '../constants';
import { generateMonsterImage, generateStageBackground, generateAllyImage } from '../services/geminiService';

const getInitialMonster = () => ({
  currentHp: 200,
  maxHp: 200,
  name: '입구의 슬라임',
  image: 'https://api.dicebear.com/9.x/bottts/svg?seed=slime&backgroundColor=transparent',
  isBoss: false,
  isViral: false,
  level: 1
});

interface GameStore extends GameState {
  comboTimer: number | null;
}

export const useGameStore = create<GameStore>((set, get) => ({
  player: {
    streamerName: '이세계 용사', // Default temp name
    clickDamage: 1, autoDamage: 0, gold: 0, viewers: 100, subscribers: 0, starPoints: 0,
    reincarnationCount: 0, level: 1, critChance: 0.05, autoClickRate: 0, viralChance: 0, ttsChance: 0,
    viewerInflowRate: 1.0, artifacts: [],
  },
  enemy: getInitialMonster(),
  stage: { chapter: 1, level: 1, arcName: '성장의 숲', isBossMode: true },
  backgroundImage: '',
  upgrades: INITIAL_UPGRADES,
  allies: [],
  chatMessages: [],
  activeMissions: [],
  lastDamage: null,
  isGeneratingImage: false,
  combo: 0,
  isFever: false,
  isTTSTime: false,
  bossTimeLeft: null,
  likes: 0,
  comboTimer: null,
  
  rankingList: [],
  isRankingOpen: false,
  isGameStarted: false,
  
  isReincarnationModalOpen: false,
  setReincarnationModal: (isOpen) => set({ isReincarnationModalOpen: isOpen }),

  startGame: (name: string) => {
    set(state => ({
        isGameStarted: true,
        player: { ...state.player, streamerName: name || '이세계 용사' }
    }));
    get().addChatMessage(`🎬 [시스템] '${name}'님의 방송이 시작되었습니다!`, "시스템");
  },

  activateDevMode: () => {
    set(state => {
        // Unlock/Max all upgrades visually and logic-wise
        const newUpgrades = state.upgrades.map(u => ({ ...u, level: Math.max(u.level, 100) }));
        
        // Explicitly set Rank Unlock to 1 (it's a single level toggle usually, but 100 is fine)
        // We ensure ranking list exists
        let newRankingList = state.rankingList;
        if (state.rankingList.length === 0) {
             const rankers: Ranker[] = [];
             rankers.push({ rank: 1, name: '창조주', subscribers: 1e100 });
             for (let i = 0; i < 99; i++) {
                 const name = RANKER_NAMES[Math.floor(Math.random() * RANKER_NAMES.length)];
                 const exponent = 10 + Math.random() * 40; 
                 const subs = Math.floor(Math.pow(10, exponent));
                 rankers.push({ rank: 0, name: name, subscribers: subs });
             }
             rankers.sort((a, b) => b.subscribers - a.subscribers);
             rankers.forEach((r, idx) => r.rank = idx + 1);
             newRankingList = rankers;
        }

        return {
            player: {
                ...state.player,
                gold: 1e100,
                viewers: 1e100,
                starPoints: 1e100,
                subscribers: 1e100, // Creator level
                clickDamage: 1e80, // Massive damage
                autoDamage: 1e80,
                critChance: 1.0,
                artifacts: ['SILVER_BUTTON', 'GOLD_BUTTON', 'DIAMOND_BUTTON', 'RUBY_BUTTON', 'OBSIDIAN_BUTTON']
            },
            upgrades: newUpgrades,
            rankingList: newRankingList
        };
    });
    get().addChatMessage("⚡ [시스템] 개발자 모드: 창조주의 권능이 활성화되었습니다.", "SYSTEM");
  },

  toggleRanking: () => set((state) => ({ isRankingOpen: !state.isRankingOpen })),

  addChatMessage: (text, user) => {
    const randomUser = user || CHAT_USERS[Math.floor(Math.random() * CHAT_USERS.length)];
    const randomColor = CHAT_COLORS[Math.floor(Math.random() * CHAT_COLORS.length)];
    set((state) => ({
      chatMessages: [...state.chatMessages.slice(-40), { id: Date.now(), user: randomUser, text, color: randomColor }]
    }));
  },

  addLike: () => set((state) => ({ 
    likes: state.likes + 1,
    player: { ...state.player, viewers: Math.floor(state.player.viewers + 10 * state.player.viewerInflowRate) }
  })),

  generateMission: () => {
    const { activeMissions, stage } = get();
    if (activeMissions.length >= 3 || Math.random() > 0.08) return; 

    const sender = CHAT_USERS[Math.floor(Math.random() * CHAT_USERS.length)];
    const missionTypes: Mission['type'][] = ['KILL', 'COMBO', 'GOLD'];
    const selectedType = missionTypes[Math.floor(Math.random() * missionTypes.length)];
    const missionId = 'm_' + Date.now();
    
    let mission: Mission;
    if (selectedType === 'KILL') mission = { id: missionId, sender, title: '몬스터 소탕', description: '15마리 처치', type: 'KILL', targetValue: 15, currentValue: 0, rewardType: 'SUBS', rewardValue: 2000 * stage.chapter, status: 'ACTIVE' };
    else if (selectedType === 'COMBO') mission = { id: missionId, sender, title: '화려한 퍼포먼스', description: '150 콤보 달성', type: 'COMBO', targetValue: 150, currentValue: 0, rewardType: 'FEVER', rewardValue: 0, status: 'ACTIVE' };
    else mission = { id: missionId, sender, title: '금빛 알고리즘', description: '골드 대량 획득', type: 'GOLD', targetValue: 150000 * stage.chapter, currentValue: 0, rewardType: 'GOLD', rewardValue: 80000 * stage.chapter, status: 'ACTIVE' };

    set((state) => ({ activeMissions: [...state.activeMissions, mission] }));
  },

  checkMissionProgress: (type, value) => {
    set((state) => ({
      activeMissions: state.activeMissions.map(m => (m.status === 'ACTIVE' && m.type === type) ? 
        { ...m, currentValue: Math.min(m.targetValue, m.currentValue + value), status: (m.currentValue + value >= m.targetValue) ? 'SUCCESS' : 'ACTIVE' } : m)
    }));
  },

  claimMission: (id) => {
    const { activeMissions, player } = get();
    const mission = activeMissions.find(m => m.id === id && m.status === 'SUCCESS');
    if (!mission) return;
    let np = { ...player };
    if (mission.rewardType === 'GOLD') np.gold += mission.rewardValue;
    if (mission.rewardType === 'SUBS') np.subscribers += mission.rewardValue;
    if (mission.rewardType === 'FEVER') set({ isFever: true });
    set({ player: np, activeMissions: activeMissions.filter(m => m.id !== id) });
    get().addChatMessage(`✅ [미션성공] 보상을 수령했습니다!`, "시스템");
  },

  abandonMission: (id) => set((state) => ({ activeMissions: state.activeMissions.filter(m => m.id !== id) })),

  clickAttack: () => {
    const { enemy, player, combo, isFever, isGeneratingImage, upgrades } = get();
    if (enemy.currentHp <= 0 || isGeneratingImage) return;

    const subMult = 1 + (player.subscribers / 500);
    const starMult = Math.pow(2.8, (upgrades.find(u => u.id === 's_dmg')?.level || 0));
    
    // New Star Shop Upgrades Logic
    const clickGod = upgrades.find(u => u.id === 's_click_god')?.level || 0;
    const veteran = upgrades.find(u => u.id === 's_veteran')?.level || 0;
    const w01 = upgrades.find(u => u.id === 'w_01');

    let damage = Math.floor(player.clickDamage * subMult * starMult * (isFever ? 4 : 1) * (Math.random() < player.critChance ? 3 : 1));

    // 'Click Becomes God' - 10,000x Multiplier
    if (clickGod > 0) damage *= 10000;

    // 'True Veteran' - Massive bonus from basic weapon
    if (veteran > 0 && w01) {
        // Add damage based on: (Basic Weapon Level * Effect * 1 Trillion)
        const veteranBonus = w01.level * w01.effectValue * 1000000000000;
        damage += veteranBonus;
    }

    const newHp = enemy.currentHp - damage;
    
    if (get().comboTimer) clearTimeout(get().comboTimer!);
    const timer = window.setTimeout(() => set({ combo: 0 }), 3000);
    
    set((state) => ({ 
      lastDamage: { id: Date.now(), val: damage, isAuto: false, isCrit: damage > player.clickDamage * subMult * starMult }, 
      combo: state.combo + 1, 
      isFever: state.isFever || state.combo + 1 >= 50, 
      comboTimer: timer,
      player: { ...state.player, viewers: Math.floor(state.player.viewers + (isFever ? 15 : 0) * state.player.viewerInflowRate) } 
    }));
    
    get().checkMissionProgress('COMBO', 1);
    if (newHp <= 0) get().onEnemyDefeated();
    else set((state) => ({ enemy: { ...state.enemy, currentHp: newHp } }));
  },

  onEnemyDefeated: () => {
    const { enemy, player, upgrades, generateNextEnemy } = get();
    
    // 'True Veteran' Logic for Gold (u_01)
    const veteran = upgrades.find(u => u.id === 's_veteran')?.level || 0;
    const u01 = upgrades.find(u => u.id === 'u_01');
    let camBonus = upgrades.filter(u => u.type === 'CAMERA').reduce((acc, u) => acc + (u.level * u.effectValue), 0);
    
    if (veteran > 0 && u01) {
        camBonus += u01.level * u01.effectValue * 1000000000000;
    }

    const goldBonus = 1 + camBonus;
    const viralMult = enemy.isViral ? 20 : 1;
    const goldReward = Math.floor(enemy.maxHp * 0.5 * goldBonus * viralMult);
    const subGain = (enemy.isBoss ? (Math.floor(Math.random() * 5000) + 2500) : (Math.random() < 0.2 ? Math.floor(Math.random()*80)+20 : 0)) * viralMult;

    // Artifact Checks
    let newArtifacts = [...player.artifacts];
    const newSubs = player.subscribers + subGain;
    if (newSubs >= 100000 && !newArtifacts.includes('SILVER_BUTTON')) {
        newArtifacts.push('SILVER_BUTTON');
        get().addChatMessage("⭐ [업적] 실버 버튼 획득! 스토리 아크: 실버 마운틴 해금!", "시스템");
    }
    if (newSubs >= 10000000 && !newArtifacts.includes('GOLD_BUTTON')) {
        newArtifacts.push('GOLD_BUTTON');
        get().addChatMessage("🏆 [업적] 골드 버튼 획득! 스토리 아크: 골드 시티 해금!", "시스템");
    }

    set((state) => ({
        player: { 
            ...state.player, 
            gold: state.player.gold + goldReward, 
            viewers: Math.floor(state.player.viewers + (enemy.isBoss ? 3000 : 200) * state.player.viewerInflowRate), 
            subscribers: newSubs,
            artifacts: newArtifacts
        },
        enemy: { ...state.enemy, currentHp: 0 }
    }));
    
    get().checkMissionProgress('KILL', 1);
    get().checkMissionProgress('GOLD', goldReward);
    generateNextEnemy();
  },

  autoTick: () => {
    const { player, enemy, isFever, upgrades, clickAttack, bossTimeLeft, isGeneratingImage, stage } = get();
    
    const flowBonus = 1 + (upgrades.filter(u => u.category === 'UTILITY' && u.type !== 'CAMERA').reduce((acc, u) => acc + (u.level * u.effectValue), 0));
    
    set((state) => ({
        player: { 
            ...state.player, 
            viewers: Math.floor(Math.max(10, state.player.viewers * (state.combo > 0 ? 0.99 : 0.965))), 
            viewerInflowRate: flowBonus 
        }
    }));

    if (enemy.isBoss && bossTimeLeft !== null && !isGeneratingImage) {
        if (bossTimeLeft <= 0) {
            set({ bossTimeLeft: null, stage: { ...stage, level: Math.max(1, stage.level - 1), isBossMode: false } });
            get().generateNextEnemy();
            return;
        } else set({ bossTimeLeft: bossTimeLeft - 1 });
    }

    if (player.autoClickRate > 0) {
        for (let i = 0; i < player.autoClickRate; i++) setTimeout(() => clickAttack(), i * (1000 / player.autoClickRate));
    }

    if (player.autoDamage > 0 && enemy.currentHp > 0) {
         const subMult = 1 + (player.subscribers / 500);
         const viewerMult = 1 + (player.viewers / 2000); 
         const starMult = Math.pow(2.8, (upgrades.find(u => u.id === 's_dmg')?.level || 0));
         
         // 'True Veteran' Logic for Auto Damage (a_01)
         const veteran = upgrades.find(u => u.id === 's_veteran')?.level || 0;
         const a01 = upgrades.find(u => u.id === 'a_01');
         
         let damage = Math.max(1, Math.floor(player.autoDamage * subMult * viewerMult * starMult * (isFever ? 4 : 1)));
         
         if (veteran > 0 && a01) {
             const veteranAutoBonus = a01.level * a01.effectValue * 1000000000000;
             damage += veteranAutoBonus;
         }

         const newHp = enemy.currentHp - damage;
         set({ lastDamage: { id: Date.now(), val: damage, isAuto: true, isCrit: false } });
         if (newHp <= 0) get().onEnemyDefeated();
         else set((state) => ({ enemy: { ...state.enemy, currentHp: newHp } }));
    }

    get().generateMission();
  },

  generateNextEnemy: async () => {
      const { stage, player, upgrades } = get();
      let nextLevel = stage.level;
      let nextChapter = stage.chapter;
      if (get().enemy.currentHp <= 0 && stage.isBossMode) {
          nextLevel += 1;
          if (nextLevel > 10) { nextLevel = 1; nextChapter += 1; }
      }

      // Determine Current Arc based on Subscribers
      const currentArc = [...STORY_ARCS].reverse().find(arc => player.subscribers >= arc.subLimit) || STORY_ARCS[0];
      
      // Update Background if Arc Changed or First Load
      if (stage.arcName !== currentArc.name || !get().backgroundImage) {
           const theme = currentArc.themes[Math.floor(Math.random() * currentArc.themes.length)];
           generateStageBackground(theme).then(bg => set({ backgroundImage: bg || '' }));
      }

      const isBoss = stage.isBossMode && (nextLevel % 5 === 0);
      const isViral = !isBoss && Math.random() < (0.05 + (upgrades.find(u => u.id === 's_gold')?.level || 0) * 0.15);
      
      const calculatedLevel = (nextChapter - 1) * 10 + nextLevel;
      
      // Pick Monster from CURRENT ARC POOL
      const monsterList = isBoss ? currentArc.bosses : currentArc.monsters;
      let name = monsterList[Math.floor(Math.random() * monsterList.length)];
      
      const hpFactor = 2.5;
      const maxHp = Math.floor(200 * Math.pow(hpFactor, calculatedLevel - 1) * (isBoss ? 20 : 1) * (isViral ? 4 : 1));

      set({ isGeneratingImage: true, bossTimeLeft: isBoss ? 40 : null, stage: { ...stage, level: nextLevel, chapter: nextChapter, arcName: currentArc.name } });
      let img = await generateMonsterImage(name, isBoss, calculatedLevel) || `https://api.dicebear.com/9.x/bottts/svg?seed=${name}&backgroundColor=transparent`;
      set({ enemy: { name: isViral ? `[실시간 떡상] ${name}` : name, maxHp, currentHp: maxHp, isBoss, isViral, image: img, level: calculatedLevel }, isGeneratingImage: false });
  },

  retryBoss: () => {
      set((state) => ({ stage: { ...state.stage, isBossMode: true } }));
      get().generateNextEnemy();
  },

  resetBroadcast: () => {
      const { player } = get();
      const earnedStars = Math.floor(Math.pow(player.subscribers / 400, 0.7));
      
      // Execute Reincarnation
      set((state) => ({
          player: { ...state.player, gold: 0, viewers: 100, starPoints: state.player.starPoints + earnedStars,
                    reincarnationCount: state.player.reincarnationCount + 1, clickDamage: 1, autoDamage: 0, subscribers: 0 },
          stage: { chapter: 1, level: 0, arcName: '성장의 숲', isBossMode: true },
          upgrades: [...INITIAL_UPGRADES.filter(u => !u.persistent), ...state.upgrades.filter(u => u.persistent)],
          enemy: getInitialMonster(), isFever: false, combo: 0, activeMissions: [], allies: [], likes: 0,
          rankingList: [], isRankingOpen: false, isReincarnationModalOpen: false // Close modal
      }));
      get().generateNextEnemy();
      get().addChatMessage(`🎬 시즌 ${get().player.reincarnationCount} 방송이 시작되었습니다!`, "시스템");
  },

  buyUpgrade: (id) => {
      set((state) => {
          const uIndex = state.upgrades.findIndex(u => u.id === id);
          if (uIndex === -1) return state;
          const u = state.upgrades[uIndex];
          const cost = Math.floor(u.baseCost * Math.pow(u.costMultiplier, u.level));

          let success = false;
          let np = { ...state.player };
          if (u.currency === 'GOLD' && state.player.gold >= cost) { np.gold -= cost; success = true; }
          else if (u.currency === 'VIEWERS' && state.player.viewers >= cost) { np.viewers -= cost; success = true; }
          else if (u.currency === 'STAR' && state.player.starPoints >= cost) { np.starPoints -= cost; success = true; }

          if (success) {
              if (u.type === 'WEAPON') np.clickDamage += u.effectValue;
              if (u.type === 'ALLY') np.autoDamage += u.effectValue;
              if (u.id === 's_auto') np.autoClickRate += u.effectValue;
              
              let newRankingList = state.rankingList;
              let msg = '';
              // Handle Ranking System Unlock
              if (u.id === 's_rank_1') {
                   // Generate Ranking Data immediately if not present
                   if (state.rankingList.length === 0) {
                        const rankers: Ranker[] = [];
                        rankers.push({ rank: 1, name: '창조주', subscribers: 1e100 }); // Googol
                        // Generate 99 other rankers
                        for (let i = 0; i < 99; i++) {
                            const name = RANKER_NAMES[Math.floor(Math.random() * RANKER_NAMES.length)];
                            // Subscribers must be greater than Diamond Dimension (10B = 1e10)
                            // We distribute them from 10e10 to 1e50
                            const exponent = 10 + Math.random() * 40; 
                            const subs = Math.floor(Math.pow(10, exponent));
                            rankers.push({ rank: 0, name: name, subscribers: subs });
                        }
                        // Sort by subscribers DESC
                        rankers.sort((a, b) => b.subscribers - a.subscribers);
                        // Assign Ranks
                        rankers.forEach((r, idx) => r.rank = idx + 1);
                        newRankingList = rankers;
                        msg = "🏆 [시스템] 우주 스트리머 랭킹 시스템이 해금되었습니다!";
                   }
              }

              const nus = [...state.upgrades];
              nus[uIndex] = { ...u, level: u.level + 1 };
              if (msg) get().addChatMessage(msg, '시스템');
              return { player: np, upgrades: nus, rankingList: newRankingList };
          }
          return state;
      });
  }
}));