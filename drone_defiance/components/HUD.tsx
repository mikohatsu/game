
import React from 'react';
import { Player } from '../types';
import { JOBS } from '../constants';
import { Shield, Zap, Menu, HelpCircle } from 'lucide-react';
import * as Icons from 'lucide-react';

interface Props {
  player: Player;
  score: number;
  wave: number;
  onOpenSkills: () => void;
}

const HUD: React.FC<Props> = ({ player, score, wave, onOpenSkills }) => {
  const hpPercent = (player.stats.hp / player.stats.maxHp) * 100;
  const xpPercent = (player.xp / player.nextXp) * 100;

  // Helper to trace skill path
  const getUnlockedSkills = () => {
    const skills = [
        { key: 'RMB', id: 'base_rail', name: 'ION CANNON', icon: 'Zap', cd: 0, maxCd: 180, locked: true },
        { key: 'Q', id: null, name: 'LOCKED', icon: 'Lock', cd: 0, maxCd: 0, locked: true },
        { key: 'SPACE', id: null, name: 'LOCKED', icon: 'Lock', cd: 0, maxCd: 0, locked: true },
        { key: 'R', id: null, name: 'LOCKED', icon: 'Lock', cd: 0, maxCd: 0, locked: true },
        { key: 'F', id: null, name: 'LOCKED', icon: 'Lock', cd: 0, maxCd: 0, locked: true },
    ];

    // 0. Base Skill (RMB) - Checks if node unlocked in tree
    if (player.skillTree['base_rail']) {
        skills[0].locked = false;
        skills[0].cd = player.activeSkills['RMB'] || 0;
        // Base cooldown is defined in code or constants, let's assume 180 for UI visual
    }

    // 1. Job Skills - We need to traverse the Job Path manually or just check current Job + Parents
    // Since we don't have a full parent array, let's traverse up from current jobId
    let currentJobId = player.jobId;
    const jobPath: string[] = [];
    
    while (currentJobId) {
        jobPath.unshift(currentJobId); // Add to front
        currentJobId = JOBS[currentJobId].parent;
    }

    // Map jobs to slots based on unlock level
    // 1st Job (Lv10) -> Q
    // 2nd Job (Lv30) -> SPACE
    // 3rd Job (Lv60) -> R
    // 4th Job (Lv100) -> F

    jobPath.forEach(jid => {
        const job = JOBS[jid];
        let slotIndex = -1;
        if (job.unlockLv === 10) slotIndex = 1;
        if (job.unlockLv === 30) slotIndex = 2;
        if (job.unlockLv === 60) slotIndex = 3;
        if (job.unlockLv === 100) slotIndex = 4;

        if (slotIndex !== -1 && job.skill) {
            skills[slotIndex] = {
                key: job.skill.key,
                // @ts-ignore
                id: job.skill.id,
                name: job.skill.name.toUpperCase(),
                icon: job.skill.icon,
                locked: false,
                cd: player.activeSkills[job.skill.key] || 0,
                maxCd: job.skill.cd * (1 - player.stats.cdr)
            };
        }
    });

    return skills;
  };

  const skillSlots = getUnlockedSkills();

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end">
      
      {/* Top Info (Minimal) */}
      <div className="absolute top-0 w-full flex justify-between p-4 text-white/50 font-tech text-sm">
        <div>WAVE: <span className="text-white font-bold">{wave}</span></div>
        <div>SCORE: <span className="text-cyan-400 font-bold font-mono">{score.toLocaleString()}</span></div>
      </div>

      {/* Diablo-style Bottom Panel */}
      <div className="relative w-full h-32 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent flex items-end justify-center pb-4 pointer-events-auto">
        
        {/* Decor Lines */}
        <div className="absolute bottom-0 w-full h-1 bg-cyan-900/50"></div>
        <div className="absolute bottom-0 w-full h-24 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

        {/* Left Orb: Health */}
        <div className="absolute left-4 bottom-4 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-700 bg-slate-900 overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <div className="absolute inset-0 flex items-center justify-center z-10">
             <div className="text-center">
                <span className="block text-xs text-red-300 font-bold tracking-widest">HULL</span>
                <span className="text-xl md:text-2xl font-mono text-white font-bold drop-shadow-md">
                  {Math.ceil(player.stats.hp)}
                </span>
             </div>
          </div>
          <div 
            className="absolute bottom-0 w-full bg-gradient-to-t from-red-900 via-red-600 to-red-500 transition-all duration-300 ease-out opacity-90"
            style={{ height: `${hpPercent}%`, boxShadow: '0 0 20px #ef4444' }}
          >
            <div className="w-full h-2 bg-red-400 opacity-50 animate-pulse"></div>
          </div>
        </div>

        {/* Center Console: Dynamic Skill Slots */}
        <div className="flex items-end gap-3 mb-2 z-10 mx-auto transform translate-y-2">
            
            {/* Module Button (E) */}
            <div className="flex flex-col items-center gap-1 group relative mr-4">
                <button 
                    onClick={onOpenSkills}
                    className={`w-14 h-14 bg-slate-800 border-2 rounded-lg flex items-center justify-center relative shadow-xl transition-all active:scale-95
                        ${player.sp > 0 ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'border-slate-600 hover:border-cyan-500'}
                    `}
                >
                    <Icons.Cpu size={28} className={player.sp > 0 ? 'text-yellow-400 animate-pulse' : 'text-slate-400'} />
                    <span className="absolute top-0.5 right-1 text-[8px] text-slate-500 font-bold">E</span>
                    {player.sp > 0 && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center justify-center border-2 border-slate-900 z-20">
                            {player.sp}
                        </div>
                    )}
                </button>
                <span className="text-[10px] text-slate-400 tracking-wider font-bold">MODULES</span>
            </div>

            {/* Skill Slots */}
            {skillSlots.map((slot, idx) => {
                // @ts-ignore
                const Icon = Icons[slot.icon] || Icons.HelpCircle;
                const onCooldown = slot.cd > 0;
                const cdPercent = slot.maxCd > 0 ? (slot.cd / slot.maxCd) * 100 : 0;
                
                // Larger size for RMB and F (Ultimate)
                const isBig = slot.key === 'RMB' || slot.key === 'F';
                const sizeClass = isBig ? 'w-16 h-16' : 'w-14 h-14';
                const iconSize = isBig ? 32 : 24;

                return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                        <div className={`${sizeClass} bg-slate-800 border-2 ${slot.locked ? 'border-slate-700 opacity-50' : 'border-slate-600'} rounded-lg flex items-center justify-center relative shadow-lg overflow-hidden`}>
                            
                            {!slot.locked && (
                                <Icon size={iconSize} className={`${onCooldown ? 'text-slate-500' : 'text-cyan-400'} transition-colors`} />
                            )}
                            
                            {/* Key Bind */}
                            <span className="absolute bottom-1 right-1 text-[10px] text-slate-500 font-bold bg-slate-900/80 px-1 rounded">
                                {slot.key}
                            </span>

                            {/* Cooldown Overlay */}
                            {onCooldown && (
                                <div 
                                    className="absolute bottom-0 w-full bg-black/60 transition-all duration-100 ease-linear flex items-center justify-center"
                                    style={{ height: `${cdPercent}%` }}
                                >
                                </div>
                            )}
                            
                            {/* CD Text */}
                            {onCooldown && (
                                <span className="absolute inset-0 flex items-center justify-center text-white font-bold font-mono text-shadow">
                                    {(slot.cd / 60).toFixed(1)}
                                </span>
                            )}
                        </div>
                        <span className="text-[9px] text-slate-400 tracking-wider font-bold max-w-[4rem] truncate">{slot.name}</span>
                    </div>
                );
            })}

        </div>

        {/* Right Orb: XP */}
        <div className="absolute right-4 bottom-4 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-700 bg-slate-900 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <div className="absolute inset-0 flex items-center justify-center z-10">
             <div className="text-center">
                <span className="block text-xs text-cyan-300 font-bold tracking-widest">REACTOR</span>
                <span className="text-xl md:text-2xl font-mono text-white font-bold drop-shadow-md">
                    LVL {player.level}
                </span>
             </div>
          </div>
          <div 
            className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-900 via-cyan-600 to-cyan-400 transition-all duration-500 ease-out opacity-90"
            style={{ height: `${xpPercent}%`, boxShadow: '0 0 20px #22d3ee' }}
          >
             <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-30"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HUD;
