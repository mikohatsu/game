import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils';

export const BattleScreen: React.FC = () => {
  const { enemy, player, clickAttack, isGeneratingImage, backgroundImage, combo, isFever, lastDamage, activeMissions, bossTimeLeft, stage, retryBoss, claimMission, abandonMission, likes, addLike, allies, upgrades, isRankingOpen, toggleRanking, rankingList, activateDevMode } = useGameStore();
  const [popups, setPopups] = useState<{id: number, x: number, y: number, val: number, isAuto: boolean, isCrit: boolean}[]>([]);

  useEffect(() => {
    if (lastDamage && lastDamage.isAuto) {
        addPopup(window.innerWidth / 2 + (Math.random() - 0.5) * 200, window.innerHeight / 2 + (Math.random() - 0.5) * 150, lastDamage.val, true, lastDamage.isCrit);
    }
  }, [lastDamage]);

  useEffect(() => {
    const timer = setInterval(() => setPopups(prev => prev.filter(e => Date.now() - e.id < 1000)), 100);
    return () => clearInterval(timer);
  }, []);

  const addPopup = (x: number, y: number, val: number, isAuto: boolean, isCrit: boolean) => {
      setPopups(prev => [...prev, { id: Date.now(), x, y, val, isAuto, isCrit }]);
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (isGeneratingImage || isRankingOpen) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('.mission-card')) return;
    
    let clientX, clientY;
    if ('touches' in e) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; } 
    else { clientX = (e as React.MouseEvent).clientX; clientY = (e as React.MouseEvent).clientY; }
    
    clickAttack();
    const subMult = (1 + player.subscribers / 500);
    addPopup(clientX, clientY, Math.floor(player.clickDamage * subMult * (isFever ? 4 : 1)), false, Math.random() < player.critChance);
  };

  const hpPercentage = Math.max(0, (enemy.currentHp / enemy.maxHp) * 100);
  const subBonus = (player.subscribers / 500 * 100).toFixed(0);
  const viewerBonus = (player.viewers / 2000 * 100).toFixed(0);
  
  const isRankingUnlocked = (upgrades.find(u => u.id === 's_rank_1')?.level || 0) > 0;
  
  // =========================================================================================
  // RANKING CALCULATION LOGIC
  // =========================================================================================
  let displayRanking = [...rankingList];
  let myCurrentRank = 0;
  
  if (rankingList.length > 0) {
      const rank100Subs = rankingList[99].subscribers;
      
      // Check if Player is within Top 100 Subs
      if (player.subscribers > rank100Subs) {
          // Player is in Top 100. Insert and sort.
          const playerRanker = { rank: 0, name: `나 (${player.streamerName})`, subscribers: player.subscribers };
          const combined = [...rankingList, playerRanker];
          combined.sort((a, b) => b.subscribers - a.subscribers);
          
          // Re-assign ranks 1..100
          displayRanking = combined.slice(0, 100).map((r, idx) => ({
              ...r,
              rank: idx + 1
          }));
          
          // Find player's new rank
          const found = displayRanking.find(r => r.name === `나 (${player.streamerName})`);
          if (found) myCurrentRank = found.rank;
          else myCurrentRank = 101; // Fallback
      } else {
          // Player is outside Top 100.
          // Logic: "100등의 구독자 수를 10,000,000으로 나눠서 세분화"
          const unit = Math.max(1, Math.floor(rank100Subs / 10000000));
          const diff = Math.max(0, rank100Subs - player.subscribers);
          const extraRank = Math.ceil(diff / unit);
          
          myCurrentRank = 100 + extraRank;
      }
  }

  return (
    <div className={`relative w-full h-full bg-black overflow-hidden cursor-pointer select-none transition-all duration-500 ${isFever ? 'ring-inset ring-[10px] ring-red-600 shadow-[0_0_100px_rgba(255,0,0,0.5)]' : ''}`} onClick={handleInteraction}>
        {backgroundImage && <motion.img key={backgroundImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={backgroundImage} className="absolute inset-0 w-full h-full object-cover z-0" />}
        <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

        {/* Artifact Showcase */}
        <div className="absolute left-6 bottom-24 flex gap-2 z-20 pointer-events-none">
            {player.artifacts.map(art => (
                <motion.div 
                    key={art} 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="w-10 h-10 bg-black/80 border border-yellow-400 rounded-lg flex items-center justify-center text-xl shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                    title={art}
                >
                    {art === 'SILVER_BUTTON' ? '🥈' : art === 'GOLD_BUTTON' ? '🥇' : art === 'DIAMOND_BUTTON' ? '💎' : art === 'RUBY_BUTTON' ? '🔴' : '⚫'}
                </motion.div>
            ))}
        </div>

        {/* Top UI Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 z-20 pointer-events-none flex justify-between items-start">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded flex items-center gap-1 shadow-lg">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping"></span> LIVE
                    </div>
                    {/* Map Info Badge */}
                    <div className="bg-black/60 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded border border-white/20 shadow-lg flex items-center gap-2">
                         <span className="text-[#00FFA3]">STAGE {stage.chapter}-{stage.level}</span>
                         <span className="w-px h-3 bg-white/20"></span>
                         <span className="text-gray-300">{stage.arcName}</span>
                    </div>
                    
                    {/* Ranking Button (Unlocked) */}
                    {isRankingUnlocked && (
                         <button onClick={(e) => { e.stopPropagation(); toggleRanking(); }} className="pointer-events-auto bg-black/60 hover:bg-yellow-500/20 backdrop-blur text-yellow-400 text-[10px] font-black px-3 py-1 rounded border border-yellow-400/50 shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                             <span>👑 랭킹</span>
                             <span className="bg-yellow-400 text-black px-1 rounded text-[9px]">{myCurrentRank}위</span>
                         </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {/* Subscriber Box with Hover Tooltip */}
                    <div className="group relative pointer-events-auto cursor-help bg-black/80 backdrop-blur px-4 py-1.5 rounded-xl border border-white/20 hover:border-[#00FFA3] transition-colors">
                        <span className="text-white font-black text-2xl">{formatNumber(player.subscribers)}</span>
                        <span className="text-white/60 text-[10px] ml-2 font-black uppercase tracking-widest">구독자 수</span>
                        
                        <div className="absolute top-full left-0 mt-3 bg-black/95 border border-[#00FFA3]/50 p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none backdrop-blur-md">
                            <div className="text-[11px] font-black text-[#00FFA3] mb-1">📈 구독자 보너스</div>
                            <div className="text-[10px] text-white">클릭 및 모든 데미지: <span className="text-[#00FFA3] font-bold">+{subBonus}%</span> 증폭</div>
                        </div>
                    </div>
                </div>
                {/* Viewer Box with Hover Tooltip */}
                <div className="group relative pointer-events-auto cursor-help bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] text-white/80 font-bold border border-white/10 w-fit hover:border-[#00FFA3] transition-colors">
                    👥 {formatNumber(player.viewers)} 명 시청중
                    
                    <div className="absolute top-full left-0 mt-3 bg-black/95 border border-[#00FFA3]/50 p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none backdrop-blur-md">
                        <div className="text-[11px] font-black text-[#00FFA3] mb-1">🔥 시청자 화력</div>
                        <div className="text-[10px] text-white">자동 공격 데미지: <span className="text-[#00FFA3] font-bold">+{viewerBonus}%</span> 증폭</div>
                    </div>
                </div>
            </div>

            {/* Missions Stack */}
            <div className="flex flex-col gap-3">
                <AnimatePresence>
                    {activeMissions.map((m) => (
                        <motion.div key={m.id} initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className={`mission-card pointer-events-auto w-64 p-4 rounded-2xl border-2 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all ${m.status === 'SUCCESS' ? 'bg-[#00FFA3]/10 border-[#00FFA3] animate-pulse' : 'bg-black/80 border-white/10'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black text-[#00FFA3] uppercase tracking-tighter">{m.sender} 님의 특수 미션</span>
                                <button onClick={() => abandonMission(m.id)} className="text-[10px] text-white/30 hover:text-red-500 font-bold">포기</button>
                            </div>
                            <div className="text-[13px] font-black text-white mb-1 leading-tight line-clamp-1">{m.title}</div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-3 border border-white/5">
                                <motion.div className="h-full bg-[#00FFA3]" animate={{ width: `${(m.currentValue / m.targetValue) * 100}%` }} />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-white/60 font-black">💰 {formatNumber(m.rewardValue)}</span>
                                {m.status === 'SUCCESS' && <button onClick={() => claimMission(m.id)} className="bg-[#00FFA3] text-black text-[10px] font-black px-4 py-1.5 rounded-full hover:brightness-110 shadow-lg">성공! 수령</button>}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Inconspicuous DEV Button */}
            <button 
                onClick={(e) => { e.stopPropagation(); activateDevMode(); }}
                className="pointer-events-auto text-[8px] font-black text-white/10 hover:text-red-500 hover:bg-black/50 px-2 py-1 rounded transition-colors absolute top-0 right-0 z-50 uppercase tracking-widest"
                title="DEV MODE: MAX RESOURCES"
            >
                DEV
            </button>
        </div>
        
        {/* Ranking Modal */}
        <AnimatePresence>
            {isRankingOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pointer-events-auto" onClick={(e) => { e.stopPropagation(); toggleRanking(); }}>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-[#141517] w-full max-w-md h-[80vh] rounded-2xl border border-yellow-400/30 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(250,204,21,0.2)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-white/10 bg-[#1a1b20] flex justify-between items-center">
                            <h2 className="text-xl font-black text-yellow-400 italic">🏆 UNIVERSAL RANKINGS</h2>
                            <button onClick={toggleRanking} className="text-white/50 hover:text-white">✕</button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-black/40 text-[10px] text-gray-400 font-black sticky top-0 backdrop-blur-md">
                                    <tr>
                                        <th className="p-3 w-12 text-center">RANK</th>
                                        <th className="p-3">STREAMER</th>
                                        <th className="p-3 text-right">SUBSCRIBERS</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {displayRanking.map((r) => {
                                        const isMe = r.name === `나 (${player.streamerName})`;
                                        return (
                                            <tr key={r.rank} className={`border-b border-white/5 ${isMe ? 'bg-yellow-400/10' : ''}`}>
                                                <td className="p-3 text-center font-black">
                                                    {r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : r.rank}
                                                </td>
                                                <td className={`p-3 font-bold ${isMe ? 'text-[#00FFA3]' : 'text-gray-300'}`}>{r.name}</td>
                                                <td className="p-3 text-right font-mono text-xs text-white/80">{formatNumber(r.subscribers)}</td>
                                            </tr>
                                        );
                                    })}
                                    
                                    {/* Show Player at bottom with VIRTUAL RANK if not in top 100 */}
                                    {myCurrentRank > 100 && (
                                        <>
                                            <tr><td colSpan={3} className="text-center text-gray-600 py-2">...</td></tr>
                                            <tr className="bg-yellow-400/10 border-t border-yellow-400/30">
                                                <td className="p-3 text-center font-black text-white">{myCurrentRank}</td>
                                                <td className="p-3 font-bold text-[#00FFA3]">나 ({player.streamerName})</td>
                                                <td className="p-3 text-right font-mono text-xs text-white/80">{formatNumber(player.subscribers)}</td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Floating Allies */}
        <div className="absolute inset-0 pointer-events-none z-10">
            {allies.map((ally, idx) => (
                <motion.div
                  key={ally.id}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    y: [0, -20, 0],
                    x: Math.sin(idx * 45) * 140 
                  }}
                  transition={{ 
                    y: { duration: 3 + Math.random(), repeat: Infinity, ease: "easeInOut" },
                    duration: 0.8 
                  }}
                  className="absolute bottom-[42%] left-1/2 -translate-x-1/2"
                >
                    <img src={ally.image} className="w-20 h-20 object-contain pixelated drop-shadow-2xl" style={{ imageRendering: 'pixelated' }} alt={ally.name} />
                    <div className="text-[9px] font-black text-[#00FFA3] text-center mt-2 bg-black/60 px-2 py-0.5 rounded-full border border-[#00FFA3]/20 backdrop-blur-sm">{ally.name}</div>
                </motion.div>
            ))}
        </div>

        {/* Combat Display Area */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            {!stage.isBossMode && (
                <button onClick={retryBoss} className="pointer-events-auto bg-[#00FFA3] text-black font-black text-xs px-8 py-3 rounded-full hover:brightness-110 shadow-[0_0_20px_#00FFA3]/30 mb-8 transition-transform active:scale-95 uppercase tracking-widest">
                    ⚔️ 보스전 다시 도전 (수련 종료)
                </button>
            )}

            {enemy.isBoss && bossTimeLeft !== null && (
                <div className="w-[320px] mb-6">
                    <div className="text-red-500 font-black text-xs mb-2 text-center animate-pulse drop-shadow-lg tracking-widest">BOSS ENCOUNTER: {bossTimeLeft}s</div>
                    <div className="w-full h-2.5 bg-black/80 border-2 border-red-500/30 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-red-600 to-red-400" animate={{ width: `${(bossTimeLeft / 40) * 100}%` }} transition={{ duration: 1, ease: 'linear' }} />
                    </div>
                </div>
            )}

            <div className="relative w-[420px] h-8 bg-black/80 rounded-full mb-12 border-2 border-white/10 overflow-hidden shadow-2xl backdrop-blur-md">
                <motion.div className="h-full bg-gradient-to-r from-red-600 to-red-500" animate={{ width: `${hpPercentage}%` }} transition={{ duration: 0.1 }} />
                <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black italic text-white drop-shadow-md tracking-[0.3em] uppercase">
                    {enemy.name} {enemy.isViral ? '🔥역대급 바이럴🔥' : `Lv.${enemy.level}`}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={enemy.name + enemy.level} initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 1.6, opacity: 0, filter: 'brightness(3)' }} className="relative">
                    {isGeneratingImage ? (
                        <div className="w-64 h-64 flex flex-col items-center justify-center bg-black/60 rounded-full border-4 border-dashed border-[#00FFA3] animate-spin-slow">
                            <span className="text-[#00FFA3] font-black text-xs animate-pulse tracking-[0.4em]">RENDERING...</span>
                        </div>
                    ) : (
                        <div className="relative group">
                            <img src={enemy.image} className={`w-[340px] h-[340px] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)] pixelated transition-transform duration-500 ${enemy.isBoss ? 'scale-125' : ''}`} style={{ imageRendering: 'pixelated' }} />
                            {enemy.isBoss && <div className="absolute inset-0 bg-red-600/10 blur-[100px] -z-10 animate-pulse rounded-full" />}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Combo Tracker */}
        <AnimatePresence>
          {combo > 0 && (
              <motion.div initial={{ scale: 0.5, opacity: 0, x: -50 }} animate={{ scale: 1, opacity: 1, x: 0 }} className="absolute left-14 bottom-[38%] z-30 pointer-events-none">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.1 }} className="text-9xl font-black italic text-[#00FFA3] drop-shadow-[0_0_40px_#00FFA3] leading-none">{combo}</motion.div>
                  <div className="text-sm font-black text-white/30 tracking-[0.8em] uppercase mt-6 ml-3 italic">STREAK</div>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Side Controls */}
        <div className="absolute right-8 bottom-10 flex flex-col gap-6 z-20 items-center">
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={addLike} className="w-16 h-16 bg-black/70 border-2 border-white/10 rounded-full flex flex-col items-center justify-center backdrop-blur shadow-2xl group hover:border-[#00FFA3] transition-all">
                <span className="text-3xl group-hover:animate-bounce">👍</span>
                <span className="text-[10px] font-black text-[#00FFA3] mt-1">{likes}</span>
            </motion.button>
            <motion.button whileHover={{ rotate: 15 }} className="w-16 h-16 bg-black/70 border-2 border-white/10 rounded-full flex items-center justify-center backdrop-blur shadow-2xl hover:border-red-600 transition-all">
                <span className="text-3xl">🔔</span>
            </motion.button>
        </div>

        {/* Popups */}
        <AnimatePresence>
            {popups.map((p) => (
                <motion.div key={p.id} initial={{ opacity: 1, scale: p.isCrit ? 1.5 : 1, y: p.y }} animate={{ opacity: 0, scale: p.isCrit ? 4 : 2.5, y: p.y - 280 }} className={`absolute font-black italic pointer-events-none z-50 text-shadow-2xl ${p.isCrit ? 'text-yellow-400' : p.isAuto ? 'text-[#00FFA3]' : 'text-white'}`} style={{ left: p.x, top: p.y }}>
                    {formatNumber(p.val)}
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
  );
};
