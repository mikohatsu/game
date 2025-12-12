
import React, { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { RELIC_TYPES, RARITY, JOBS, WEAPONS } from '../constants';
import { X, Lock, HelpCircle, Cpu, HardDrive } from 'lucide-react';
import { RenderService } from '../services/RenderService';
import { Player, JobDef } from '../types';

interface Props {
  onClose: () => void;
  inventory: Record<string, number>;
}

// Reusing the Preview Component for Codex
const DronePreview: React.FC<{ jobId: string, size?: number, scale?: number }> = ({ jobId, size = 120, scale = 1 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const renderer = new RenderService(ctx);
        let animationFrameId: number;
        
        const mockPlayer: any = {
            pos: { x: 0, y: 0 },
            angle: -Math.PI / 2,
            jobId: jobId,
            iframe: 0,
            hitFlash: 0,
            shieldHitFlash: 0,
            activeEffects: {},
            level: 1, xp: 0, stats: { maxHp: 100, hp: 100 } 
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            mockPlayer.angle += 0.01; // Slower rotation
            
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.scale(scale, scale);
            ctx.translate(-canvas.width/2, -canvas.height/2);
            renderer.drawPlayer(mockPlayer as Player, canvas.width / 2, canvas.height / 2);
            ctx.restore();

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [jobId, scale]);

    return <canvas ref={canvasRef} width={size} height={size} />;
};

const Codex: React.FC<Props> = ({ onClose, inventory }) => {
  const [activeTab, setActiveTab] = useState<'RELICS' | 'DRONES'>('RELICS');
  const [selectedRelic, setSelectedRelic] = useState<typeof RELIC_TYPES[0] | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  // --- RELIC LOGIC ---
  const getRelicStatus = (relicId: string) => {
    let unlocked = false;
    let highestRarity = 'common';
    let count = 0;
    Object.entries(inventory).forEach(([key, qty]) => {
        const [id, rarity] = key.split('_');
        if (id === relicId && qty > 0) {
            unlocked = true;
            count += qty;
            const ranks = ['common', 'rare', 'unique', 'epic'];
            if (ranks.indexOf(rarity) > ranks.indexOf(highestRarity)) highestRarity = rarity;
        }
    });
    return { unlocked, highestRarity, count };
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md p-8">
       {/* Header */}
       <div className="w-full max-w-6xl flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
           <div className="flex items-center gap-8">
               <div>
                    <h2 className="text-4xl font-tech text-cyan-400 mb-1">ARCHIVES // CODEX</h2>
                    <p className="text-slate-400 font-mono text-sm">DATABASE ACCESS GRANTED</p>
               </div>
               
               {/* TABS */}
               <div className="flex bg-slate-900 rounded-lg p-1 gap-1">
                   <button 
                        onClick={() => setActiveTab('RELICS')}
                        className={`px-6 py-2 rounded font-bold text-sm transition-all flex items-center gap-2
                            ${activeTab === 'RELICS' ? 'bg-cyan-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}
                        `}
                   >
                       <HardDrive size={16} /> ARTIFACTS
                   </button>
                   <button 
                        onClick={() => setActiveTab('DRONES')}
                        className={`px-6 py-2 rounded font-bold text-sm transition-all flex items-center gap-2
                            ${activeTab === 'DRONES' ? 'bg-cyan-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}
                        `}
                   >
                       <Cpu size={16} /> DRONE MODELS
                   </button>
               </div>
           </div>

           <button 
             onClick={onClose} 
             className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
           >
             <X size={32} />
           </button>
       </div>

       {/* CONTENT AREA */}
       <div className="flex w-full max-w-6xl h-[75vh] gap-8">
           
           {/* === TAB: RELICS === */}
           {activeTab === 'RELICS' && (
               <>
                <div className="flex-1 glass-panel p-6 rounded-2xl overflow-y-auto pr-2">
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {RELIC_TYPES.map(relic => {
                            const { unlocked, highestRarity } = getRelicStatus(relic.id);
                            // @ts-ignore
                            const Icon = Icons[relic.icon] || Icons.HelpCircle;
                            // @ts-ignore
                            const rarityColor = RARITY[highestRarity].color;

                            return (
                                <button
                                    key={relic.id}
                                    onClick={() => setSelectedRelic(relic)}
                                    className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center relative group transition-all duration-300
                                        ${selectedRelic?.id === relic.id ? 'scale-110 z-10 shadow-[0_0_20px_rgba(0,0,0,0.8)]' : 'hover:scale-105'}
                                        ${unlocked 
                                            ? 'bg-slate-900 border-slate-700 hover:border-cyan-400' 
                                            : 'bg-slate-950 border-slate-900 opacity-60'}
                                    `}
                                    style={{ 
                                        borderColor: unlocked && selectedRelic?.id === relic.id ? rarityColor : undefined,
                                        boxShadow: unlocked && selectedRelic?.id === relic.id ? `0 0 15px ${rarityColor}40` : undefined
                                    }}
                                >
                                    {unlocked ? (
                                        <>
                                            <Icon size={28} style={{ color: rarityColor }} className="mb-1" />
                                        </>
                                    ) : (
                                        <Lock size={20} className="text-slate-700" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="w-96 glass-panel p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
                    {selectedRelic ? (
                        (() => {
                            const { unlocked, highestRarity, count } = getRelicStatus(selectedRelic.id);
                            // @ts-ignore
                            const Icon = Icons[selectedRelic.icon] || Icons.HelpCircle;
                            // @ts-ignore
                            const rarityInfo = RARITY[highestRarity];

                            if (!unlocked) return (
                                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                                    <Lock size={48} className="mb-4"/>
                                    <h3 className="text-2xl font-tech font-bold">LOCKED</h3>
                                    <p className="text-xs">ACQUIRE IN SUPPLY DROP</p>
                                </div>
                            );

                            return (
                                <div className="h-full flex flex-col w-full animate-in fade-in slide-in-from-right-4">
                                    <div className="flex justify-center mb-6 relative">
                                            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full"></div>
                                            <div className="w-32 h-32 rounded-xl border-2 flex items-center justify-center bg-slate-900 relative z-10" style={{ borderColor: rarityInfo.color }}>
                                                <Icon size={64} style={{ color: rarityInfo.color }} />
                                            </div>
                                    </div>
                                    <h3 className="text-2xl font-tech font-bold text-white mb-1">{selectedRelic.name}</h3>
                                    <div className="text-xs font-mono mb-6 uppercase tracking-widest" style={{ color: rarityInfo.color }}>
                                        MAX TIER: {rarityInfo.name}
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-6 text-left">
                                        <p className="text-slate-300 text-sm italic mb-2">"{selectedRelic.desc}"</p>
                                        <div className="h-px bg-slate-700 my-2"></div>
                                        <p className="text-cyan-400 font-bold text-sm">
                                            EFFECT: +{(selectedRelic.value * 100).toFixed(0)}% Base Stat
                                        </p>
                                    </div>
                                    <div className="mt-auto grid grid-cols-2 gap-2 text-left">
                                        <div className="bg-slate-800 p-2 rounded">
                                            <div className="text-[10px] text-slate-500">OWNED</div>
                                            <div className="text-lg font-mono text-white">{count}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <p>SELECT ARTIFACT</p>
                        </div>
                    )}
                </div>
               </>
           )}

           {/* === TAB: DRONES === */}
           {activeTab === 'DRONES' && (
               <>
                <div className="flex-1 glass-panel p-6 rounded-2xl overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(JOBS).map(([id, job]) => {
                            const isSelected = selectedJob === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => setSelectedJob(id)}
                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left relative overflow-hidden group
                                        ${isSelected 
                                            ? 'bg-slate-800 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                                            : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-600'}
                                    `}
                                >
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden">
                                            <DronePreview jobId={id} size={80} scale={0.7} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className={`font-tech font-bold text-lg ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                                            {job.name}
                                        </div>
                                        <div className="text-xs text-slate-500 font-mono">
                                            {job.desc}
                                        </div>
                                        <div className="text-[10px] text-slate-600 mt-1 bg-slate-950/50 inline-block px-2 py-0.5 rounded">
                                            UNLOCK LV: {job.unlockLv}
                                        </div>
                                    </div>
                                    {isSelected && <div className="absolute right-0 top-0 bottom-0 w-1 bg-cyan-400"></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="w-96 glass-panel p-0 rounded-2xl flex flex-col overflow-hidden bg-slate-900">
                    {selectedJob ? (
                        (() => {
                            const job = JOBS[selectedJob];
                            const weapon = WEAPONS[job.weapon];
                            // @ts-ignore
                            const SkillIcon = Icons[job.skill.icon] || Icons.Zap;

                            return (
                                <div className="h-full flex flex-col w-full animate-in fade-in slide-in-from-right-4">
                                    {/* Big Preview Area */}
                                    <div className="h-64 bg-slate-950 relative flex items-center justify-center border-b border-slate-800">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                                        
                                        <div className="relative z-10 drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                                            <DronePreview jobId={selectedJob} size={200} scale={1.5} />
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-3xl font-tech font-black text-white mb-1 uppercase tracking-wider">{job.name}</h3>
                                        <p className="text-cyan-500 font-mono text-sm mb-6">{job.desc.toUpperCase()}</p>

                                        <div className="space-y-4 mb-6">
                                            <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                                                <div className="text-[10px] text-slate-400 font-bold mb-1">PRIMARY WEAPON</div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-white font-bold">{job.weapon.toUpperCase()}</span>
                                                    <span className="text-xs text-slate-400">DMG: {weapon.dmg}</span>
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    Rate: {weapon.rate} | Range: {weapon.range}
                                                </div>
                                            </div>

                                            <div className="bg-slate-800/50 p-3 rounded border border-slate-700 flex gap-3">
                                                <div className="w-10 h-10 bg-slate-700 rounded flex items-center justify-center text-yellow-400">
                                                    <SkillIcon size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-slate-400 font-bold mb-0.5">ACTIVE SKILL ({job.skill.key})</div>
                                                    <div className="text-white font-bold text-sm">{job.skill.name}</div>
                                                    <div className="text-xs text-slate-500">{job.skill.desc}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <Cpu size={64} className="mb-4 opacity-50"/>
                            <p>SELECT CHASSIS MODEL</p>
                        </div>
                    )}
                </div>
               </>
           )}

       </div>
    </div>
  );
};

export default Codex;
