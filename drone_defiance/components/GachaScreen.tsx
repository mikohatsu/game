
import React, { useState } from 'react';
import { Box, Sparkles, X, HelpCircle, Diamond, Package, PackageOpen } from 'lucide-react';
import * as Icons from 'lucide-react';
import { RELIC_TYPES, RARITY } from '../constants';

interface Props {
  credits: number;
  cores: number;
  hasUnlockedCores: boolean;
  // returns an array of pulls
  onPull: (amount: number, currency: 'chips' | 'cores') => Array<{ id: string; rarity: string }> | null;
  onClose: () => void;
  inventory: Record<string, number>;
}

const COST_CHIP = 1000;
const COST_CORE = 1;

const GachaScreen: React.FC<Props> = ({ credits, cores, hasUnlockedCores, onPull, onClose, inventory }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastPulls, setLastPulls] = useState<Array<{ id: string; rarity: string }> | null>(null);
  const [pullAmount, setPullAmount] = useState<1 | 10 | 100>(1);

  const handlePull = (currency: 'chips' | 'cores') => {
    // Logic check for costs
    if (currency === 'chips' && credits < COST_CHIP * pullAmount) return;
    if (currency === 'cores' && cores < COST_CORE) return; // Core pull is fixed to 10 items for 1 core
    
    // Core pull forces 10 items
    const actualAmount = currency === 'cores' ? 10 : pullAmount;

    setIsAnimating(true);
    setLastPulls(null);

    // Animation delay
    setTimeout(() => {
        const results = onPull(actualAmount, currency);
        setLastPulls(results);
        setIsAnimating(false);
    }, 1500);
  };

  const getRarityColor = (r: string) => {
      // @ts-ignore
      return RARITY[r]?.color || '#fff';
  };

  const getIcon = (iconName: string) => {
      // @ts-ignore
      return Icons[iconName] || HelpCircle;
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md">
       <button 
         onClick={onClose} 
         className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
       >
         <X size={32} />
       </button>

       <div className="w-full max-w-7xl h-[90vh] grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 p-8">
           
           {/* Left Panel: Gacha Machine */}
           <div className="glass-panel p-8 rounded-2xl flex flex-col items-center relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                
                <h2 className="text-3xl font-tech text-cyan-400 mb-2">SUPPLY DROP</h2>
                
                {/* Control Panel */}
                <div className="flex gap-4 mb-6">
                    {[1, 10, 100].map(amt => (
                        <button
                            key={amt}
                            onClick={() => setPullAmount(amt as any)}
                            disabled={isAnimating}
                            className={`px-6 py-2 rounded font-bold transition-all border
                                ${pullAmount === amt 
                                    ? 'bg-cyan-900 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
                                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-white'}
                            `}
                        >
                            x{amt}
                        </button>
                    ))}
                </div>

                {/* Display Area */}
                <div className="flex-1 w-full flex items-center justify-center overflow-y-auto mb-6 relative">
                    {/* Idle State / Animation State */}
                    {(!lastPulls || isAnimating) && (
                        <div className={`relative transition-all duration-500 ${isAnimating ? 'scale-110 animate-pulse' : ''}`}>
                             <Box size={120} className={`text-slate-700 ${isAnimating ? 'text-yellow-200 animate-bounce' : ''}`} />
                             {isAnimating && <div className="absolute inset-0 bg-yellow-500/30 blur-3xl animate-pulse"></div>}
                        </div>
                    )}

                    {/* Results Grid */}
                    {lastPulls && !isAnimating && (
                        <div className={`w-full max-h-full overflow-y-auto p-4
                            ${lastPulls.length === 1 ? 'flex items-center justify-center' : 'grid grid-cols-4 md:grid-cols-5 gap-4 content-start'}
                        `}>
                            {lastPulls.map((pull, idx) => {
                                const relic = RELIC_TYPES.find(r => r.id === pull.id);
                                const Icon = relic ? getIcon(relic.icon) : HelpCircle;
                                const color = getRarityColor(pull.rarity);
                                const isEpic = pull.rarity === 'epic';
                                const isUnique = pull.rarity === 'unique';

                                return (
                                    <div 
                                        key={idx} 
                                        className={`relative bg-slate-900 border rounded-xl flex flex-col items-center justify-center p-4 animate-in zoom-in duration-300 group
                                            ${lastPulls.length === 1 ? 'w-64 h-64 border-4 scale-110' : 'aspect-square'}
                                            ${isEpic ? 'border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.5)]' : 
                                              isUnique ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'border-slate-700'}
                                        `}
                                        style={{ borderColor: color, animationDelay: `${idx * 0.03}s` }}
                                    >
                                        {/* Glow BG for high rarity */}
                                        {(isEpic || isUnique) && (
                                            <div className={`absolute inset-0 blur-xl opacity-30 ${isEpic ? 'bg-fuchsia-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                                        )}

                                        <Icon 
                                            size={lastPulls.length === 1 ? 80 : 32} 
                                            style={{ color }} 
                                            className={`relative z-10 mb-2 ${isEpic ? 'animate-bounce' : ''}`} 
                                        />
                                        
                                        <div className={`text-center relative z-10 font-bold ${lastPulls.length === 1 ? 'text-xl' : 'text-[10px] leading-tight'}`} style={{ color }}>
                                            {relic?.name}
                                        </div>
                                        
                                        {lastPulls.length === 1 && (
                                            <div className="mt-2 text-xs font-mono uppercase tracking-widest text-slate-400">
                                                {pull.rarity} CLASS
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Buttons Area */}
                <div className="w-full flex gap-4">
                    {/* Chip Pull Button */}
                    <button
                        onClick={() => handlePull('chips')}
                        disabled={credits < COST_CHIP * pullAmount || isAnimating}
                        className={`flex-[7] py-4 font-bold rounded flex flex-col items-center justify-center gap-1 transition-all
                            ${credits >= COST_CHIP * pullAmount && !isAnimating 
                                ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg' 
                                : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
                        `}
                    >
                        <div className="flex items-center gap-2 text-lg">
                            <Package size={20} />
                            <span>OPEN x{pullAmount}</span>
                        </div>
                        <span className="text-xs font-mono opacity-80">{pullAmount * COST_CHIP} CHIPS</span>
                    </button>

                    {/* Core Pull Button (Special) - Only show if cores unlocked */}
                    {hasUnlockedCores && (
                        <button
                            onClick={() => handlePull('cores')}
                            disabled={cores < 1 || isAnimating}
                            className={`flex-[3] py-4 font-bold rounded flex flex-col items-center justify-center gap-1 transition-all border
                                ${cores >= 1 && !isAnimating 
                                    ? 'bg-fuchsia-900 hover:bg-fuchsia-800 text-white border-fuchsia-900 shadow-[0_0_20px_rgba(217,70,239,0.3)]' 
                                    : 'bg-slate-900 text-slate-600 border-slate-700 cursor-not-allowed'}
                            `}
                        >
                            <div className="flex items-center gap-2 text-lg text-fuchsia-300">
                                <PackageOpen size={20} />
                                <span>ELITE</span>
                            </div>
                            <span className="text-xs font-mono opacity-80 flex items-center gap-1">
                                <Diamond size={10} /> 1 CORE
                            </span>
                        </button>
                    )}
                </div>

                <div className="mt-4 flex gap-8 text-sm font-mono">
                    <div className="text-slate-400">CHIPS: <span className="text-yellow-400">{credits.toLocaleString()}</span></div>
                    {hasUnlockedCores && (
                        <div className="text-slate-400">CORES: <span className="text-fuchsia-400">{cores.toLocaleString()}</span></div>
                    )}
                </div>
           </div>

           {/* Right Panel: Inventory */}
           <div className="glass-panel p-6 rounded-2xl flex flex-col h-full">
               <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                   <Box size={20} className="text-yellow-500" />
                   RELIC STORAGE
               </h3>
               
               <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 gap-2 content-start">
                   {Object.entries(inventory).map(([key, count]) => {
                       const [id, rarity] = key.split('_');
                       const relicDef = RELIC_TYPES.find(r => r.id === id);
                       // @ts-ignore
                       const rarityDef = RARITY[rarity];

                       if (!relicDef) return null;
                       const Icon = getIcon(relicDef.icon);

                       return (
                           <div key={key} className="bg-slate-900/50 border border-slate-700 p-3 rounded flex justify-between items-center group hover:bg-slate-800 transition-colors">
                               <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded flex items-center justify-center bg-slate-800 border group-hover:border-cyan-400 transition-colors" style={{ borderColor: rarityDef.color }}>
                                       <Icon size={16} color={rarityDef.color} />
                                   </div>
                                   <div>
                                       <div className="text-sm font-bold text-slate-200">{relicDef.name}</div>
                                       <div className="text-[10px] font-mono uppercase" style={{ color: rarityDef.color }}>
                                           {rarityDef.name}
                                       </div>
                                   </div>
                               </div>
                               <div className="text-xl font-bold font-mono text-slate-500">
                                   x{count}
                               </div>
                           </div>
                       );
                   })}
               </div>
           </div>

       </div>
    </div>
  );
};

export default GachaScreen;
