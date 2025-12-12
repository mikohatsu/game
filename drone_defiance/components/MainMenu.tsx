
import React, { useState } from 'react';
import { Play, Rocket, Cpu, Hammer, Shield, Zap, Crosshair, HardDrive, Skull, Box, BookOpen, Diamond } from 'lucide-react';
import { PermanentUpgrades } from '../types';
import { SHOP_DATA, SPECIAL_SHOP_DATA, DIFFICULTIES } from '../constants';

interface Props {
  onStart: (difficulty: keyof typeof DIFFICULTIES) => void;
  credits: number;
  cores: number;
  hasUnlockedCores: boolean;
  upgrades: PermanentUpgrades;
  onBuyUpgrade: (type: keyof PermanentUpgrades, cost: number, currency: 'chips' | 'cores') => void;
  onGacha: () => void;
  onOpenCodex: () => void;
}

const MainMenu: React.FC<Props> = ({ onStart, credits, cores, hasUnlockedCores, upgrades, onBuyUpgrade, onGacha, onOpenCodex }) => {
  const [view, setView] = useState<'MAIN' | 'UPGRADES' | 'DIFFICULTY'>('MAIN');
  const [selectedDiff, setSelectedDiff] = useState<keyof typeof DIFFICULTIES>('normal');
  const [upgradeTab, setUpgradeTab] = useState<'standard' | 'special'>('standard');

  if (view === 'UPGRADES') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/90 backdrop-blur-sm">
        <div className="glass-panel p-8 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col">
            
            {/* Header / Currency */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-tech text-cyan-400">DRONE HANGAR</h2>
                <div className="flex gap-6 text-right">
                    <div>
                        <div className="text-xs text-slate-400">DATA CHIPS</div>
                        <div className="text-2xl font-mono text-yellow-400">{credits.toLocaleString()}</div>
                    </div>
                    {hasUnlockedCores && (
                        <div>
                            <div className="text-xs text-slate-400">BOSS CORES</div>
                            <div className="text-2xl font-mono text-fuchsia-400 flex items-center justify-end gap-2">
                                <Diamond size={20} className="fill-fuchsia-400" />
                                {cores.toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700 mb-6">
                <button 
                    onClick={() => setUpgradeTab('standard')}
                    className={`px-8 py-4 font-bold tracking-widest transition-colors border-b-2
                        ${upgradeTab === 'standard' ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20' : 'border-transparent text-slate-500 hover:text-white'}
                    `}
                >
                    STANDARD MODULES
                </button>
                {hasUnlockedCores && (
                    <button 
                        onClick={() => setUpgradeTab('special')}
                        className={`px-8 py-4 font-bold tracking-widest transition-colors border-b-2
                            ${upgradeTab === 'special' ? 'border-fuchsia-400 text-fuchsia-400 bg-fuchsia-950/20' : 'border-transparent text-slate-500 hover:text-white'}
                        `}
                    >
                        ELITE PROTOCOLS
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pr-2">
                {upgradeTab === 'standard' ? (
                    SHOP_DATA.map(item => {
                        const id = item.id as keyof PermanentUpgrades;
                        const level = upgrades[id] || 0;
                        const canAfford = credits >= item.cost;
                        const isMaxed = level >= item.max;

                        return (
                            <div key={item.id} className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div className="text-cyan-400 font-bold text-sm">
                                        {item.name}
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded ${isMaxed ? 'bg-cyan-900 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                                        Lv {level}/{item.max}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 h-8">{item.desc}</p>
                                <button 
                                    onClick={() => onBuyUpgrade(id, item.cost, 'chips')}
                                    disabled={!canAfford || isMaxed}
                                    className={`mt-auto py-2 rounded text-xs font-bold flex justify-between px-3
                                        ${isMaxed ? 'bg-slate-800 text-cyan-500 border border-cyan-900' :
                                        canAfford ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
                                    `}
                                >
                                    <span>{isMaxed ? 'MAXED' : 'UPGRADE'}</span>
                                    {!isMaxed && <span>{item.cost}</span>}
                                </button>
                            </div>
                        );
                    })
                ) : (
                    SPECIAL_SHOP_DATA.map(item => {
                        const id = item.id as keyof PermanentUpgrades;
                        const level = upgrades[id] || 0;
                        const canAfford = cores >= item.cost;
                        const isMaxed = level >= item.max;

                        return (
                            <div key={item.id} className="bg-slate-900/50 border border-fuchsia-900 p-4 rounded-lg flex flex-col gap-2 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-fuchsia-900/10 group-hover:bg-fuchsia-900/20 transition-colors"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="text-fuchsia-400 font-bold text-sm">
                                        {item.name}
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded ${isMaxed ? 'bg-fuchsia-900 text-fuchsia-300' : 'bg-slate-800 text-slate-400'}`}>
                                        Lv {level}/{item.max}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 h-8 relative z-10">{item.desc}</p>
                                <button 
                                    onClick={() => onBuyUpgrade(id, item.cost, 'cores')}
                                    disabled={!canAfford || isMaxed}
                                    className={`mt-auto py-2 rounded text-xs font-bold flex justify-between px-3 relative z-10
                                        ${isMaxed ? 'bg-slate-800 text-fuchsia-500 border border-fuchsia-900' :
                                        canAfford ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_10px_rgba(217,70,239,0.4)]' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
                                    `}
                                >
                                    <span>{isMaxed ? 'MAXED' : 'EXCHANGE'}</span>
                                    {!isMaxed && <span className="flex items-center gap-1"><Diamond size={10} /> {item.cost}</span>}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            <button 
                onClick={() => setView('MAIN')}
                className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-bold rounded"
            >
                RETURN TO MENU
            </button>
        </div>
      </div>
    );
  }

  if (view === 'DIFFICULTY') {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/90 backdrop-blur-sm">
            <div className="glass-panel p-8 rounded-2xl w-full max-w-2xl flex flex-col animate-in zoom-in duration-300">
                <h2 className="text-3xl font-tech text-white mb-6 text-center">SELECT OPERATION DIFFICULTY</h2>
                
                <div className="grid grid-cols-1 gap-4 mb-8">
                    {Object.entries(DIFFICULTIES).map(([key, diff]) => {
                        const isSelected = selectedDiff === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedDiff(key as any)}
                                className={`flex items-center justify-between p-6 rounded-xl border transition-all duration-300
                                    ${isSelected ? 'bg-slate-800 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'}
                                `}
                            >
                                <div className="text-left">
                                    <div className={`text-xl font-bold font-tech mb-1 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}>
                                        {diff.name}
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono">
                                        ENEMY HP: x{diff.hpMult} | DMG: x{diff.dmgMult}
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <div className="flex items-center gap-2 justify-end mb-1">
                                        <div className="text-xs font-bold text-slate-400">REWARD:</div>
                                        <div className="px-2 py-0.5 rounded text-xs font-bold text-black" style={{ backgroundColor: diff.chipColor }}>
                                            {diff.chipType.toUpperCase()}
                                        </div>
                                    </div>
                                    {key !== 'normal' && (
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="text-xs text-yellow-500 flex items-center gap-1 justify-end">
                                                <HardDrive size={12} />
                                                <span>RELICS ENABLED</span>
                                            </div>
                                            {hasUnlockedCores && (
                                                <div className="text-xs text-fuchsia-400 flex items-center gap-1 justify-end animate-pulse">
                                                    <Diamond size={12} />
                                                    <span>BOSS CORES</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => setView('MAIN')}
                        className="flex-1 py-4 bg-slate-800 border border-slate-700 text-slate-400 font-bold rounded hover:bg-slate-700"
                    >
                        BACK
                    </button>
                    <button 
                        onClick={() => onStart(selectedDiff)}
                        className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-[0_0_20px_rgba(8,145,178,0.4)]"
                    >
                        DEPLOY
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel p-12 rounded-2xl flex flex-col items-center max-w-md w-full animate-in fade-in zoom-in duration-300">
        <div className="mb-8 relative">
          <div className="absolute -inset-4 bg-cyan-500/20 blur-xl rounded-full"></div>
          <Cpu size={64} className="text-cyan-400 relative z-10" />
        </div>
        
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2 font-tech tracking-wider">
          DRONE DEFIANCE
        </h1>
        <h2 className="text-xl text-slate-400 mb-8 font-light tracking-[0.2em]">REDUX EDITION</h2>

        <div className="space-y-4 w-full">
          <button 
            onClick={() => setView('DIFFICULTY')}
            className="w-full group relative px-6 py-4 bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-100 font-bold rounded flex items-center justify-center gap-3 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-cyan-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Play size={20} className="fill-cyan-100" />
            <span className="relative z-10 text-lg">INITIALIZE SYSTEM</span>
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => setView('UPGRADES')}
                className="w-full px-4 py-4 bg-slate-900/60 hover:bg-slate-800 border border-slate-700 hover:border-yellow-500 text-slate-300 hover:text-yellow-400 font-bold rounded flex flex-col items-center justify-center gap-2 transition-all"
            >
                <Hammer size={20} />
                <span className="text-xs">UPGRADES</span>
            </button>

            <button 
                onClick={onOpenCodex}
                className="w-full px-4 py-4 bg-slate-900/60 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 font-bold rounded flex flex-col items-center justify-center gap-2 transition-all"
            >
                <BookOpen size={20} />
                <span className="text-xs">ARCHIVES</span>
            </button>
          </div>

          <button 
            onClick={onGacha}
            className="w-full px-6 py-4 bg-slate-900/60 hover:bg-slate-800 border border-slate-700 hover:border-purple-500 text-slate-300 hover:text-purple-400 font-bold rounded flex items-center justify-center gap-3 transition-all"
          >
            <Box size={20} />
            <span>SUPPLY DROP (GACHA)</span>
          </button>
        </div>

        <div className="mt-8 text-center flex justify-center gap-6">
            <div>
                <p className="text-slate-500 text-[10px] uppercase">Data Chips</p>
                <p className="text-xl font-mono text-yellow-400">{credits.toLocaleString()}</p>
            </div>
            {hasUnlockedCores && (
                <div>
                    <p className="text-slate-500 text-[10px] uppercase">Boss Cores</p>
                    <p className="text-xl font-mono text-fuchsia-400">{cores.toLocaleString()}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
