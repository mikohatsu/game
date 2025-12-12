
import React, { useState, useEffect } from 'react';
import { Player, SkillNode } from '../types';
import { TREES, JOBS } from '../constants';
import * as Icons from 'lucide-react';

interface Props {
  player: Player;
  onUpgrade: (nodeId: string) => void;
  onClose: () => void;
}

const SkillTree: React.FC<Props> = ({ player, onUpgrade, onClose }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  // Close on Escape or E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key.toLowerCase() === 'e') {
            onClose();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const getTierName = (t: number) => {
      switch(t) {
          case 1: return 'CORE SYSTEMS';
          case 2: return 'COMBAT SPECS';
          case 3: return 'ADVANCED TECH';
          case 4: return 'ELITE MASTERY';
          case 5: return 'OVERCLOCK';
          default: return 'UNKNOWN';
      }
  };

  const isTabLocked = (t: number) => {
      if (t === 1) return false;
      if (t === 2 && player.level < 10) return true;
      if (t === 3 && player.level < 30) return true;
      if (t === 4 && player.level < 60) return true;
      if (t === 5 && player.level < 100) return true;
      return false;
  };

  // Helper to check if a node belongs to the player's job path
  const isNodeVisible = (node: SkillNode) => {
      if (!node.reqJob) return true;
      
      // Check if player.jobId matches reqJob or is a child of reqJob
      // OR check if player.jobId is in the lineage
      
      if (!player.jobId) return false;

      // Simple check: Is reqJob in current job's history?
      let current = player.jobId;
      while(current) {
          if (current === node.reqJob) return true;
          // @ts-ignore
          current = JOBS[current]?.parent;
      }
      return false;
  };

  const currentNodes = (TREES[activeTab] || []).filter(isNodeVisible);

  const getNodeState = (node: SkillNode) => {
    const level = player.skillTree[node.id] || 0;
    const isMaxed = level >= node.maxLevel;
    
    let isUnlocked = !node.parentId;
    // If it has a parent, check if parent is active (level > 0)
    // BUT also check if parent is in the previous tier. 
    // Simplify: If parentId exists, parent must be > 0. 
    // For cross-tier connections (implied), we might need logic, 
    // but current data structure usually keeps parents within tier or assumes unlock by tier.
    
    if (node.parentId) {
        // Check current tier first
        if ((player.skillTree[node.parentId] || 0) > 0) {
            isUnlocked = true;
        } else {
            // Check if parent is from previous tier (pseudo-parenting for visual continuity)
            // Ideally we'd look up the node in all trees, but for optimization we assume
            // within-tier parenting for unlocking logic unless specific "reqJob" logic applies.
            isUnlocked = false; 
        }
    } else {
        // If no parent, it's a root node for this tier. 
        // Root nodes are unlocked if the Tab is unlocked.
        isUnlocked = true;
    }
    
    return { level, isMaxed, isUnlocked };
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-6xl h-[85vh] flex flex-col glass-panel rounded-2xl overflow-hidden relative shadow-2xl border border-cyan-500/30">
        
        {/* Header / Tabs */}
        <div className="flex bg-slate-900/80 border-b border-cyan-500/30 overflow-x-auto">
            {[1, 2, 3, 4, 5].map(t => (
                <button
                    key={t}
                    onClick={() => !isTabLocked(t) && setActiveTab(t)}
                    className={`flex-1 min-w-[120px] py-4 font-tech font-bold text-sm tracking-widest transition-all duration-300 relative overflow-hidden group
                        ${activeTab === t ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-500 hover:text-cyan-200 hover:bg-slate-800'}
                        ${isTabLocked(t) ? 'opacity-40 cursor-not-allowed bg-slate-950' : ''}
                    `}
                >
                    <span className="relative z-10">{isTabLocked(t) ? `LV ${[1,10,30,60,100][t-1]} LOCK` : getTierName(t)}</span>
                    {activeTab === t && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>}
                </button>
            ))}
            <div className="px-6 flex items-center justify-center bg-slate-900 border-l border-cyan-900 sticky right-0">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors">
                    <Icons.X size={24} />
                </button>
            </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative bg-[#050b14] overflow-hidden cursor-grab active:cursor-grabbing">
             {/* Background Grid */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
             </div>
             
             {/* Animated Connection Lines */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                {currentNodes.map(node => {
                    if (!node.parentId) return null;
                    const parent = currentNodes.find(p => p.id === node.parentId);
                    if (!parent) return null;
                    
                    const state = getNodeState(node);
                    const parentState = getNodeState(parent);
                    const isActive = parentState.level > 0;
                    const isFullyActive = state.level > 0;

                    return (
                        <g key={`${parent.id}-${node.id}`}>
                            {/* Background Line */}
                            <line 
                                x1={parent.x} y1={parent.y}
                                x2={node.x} y2={node.y}
                                stroke="#1e293b"
                                strokeWidth={4}
                            />
                            {/* Active Line */}
                            <line 
                                x1={parent.x} y1={parent.y}
                                x2={node.x} y2={node.y}
                                stroke={isFullyActive ? '#22d3ee' : (isActive ? '#0e7490' : 'transparent')}
                                strokeWidth={isFullyActive ? 2 : 2}
                                strokeDasharray={isActive && !isFullyActive ? "5,5" : "none"}
                                filter={isFullyActive ? "url(#glow)" : ""}
                                opacity={isActive ? 1 : 0}
                            />
                        </g>
                    );
                })}
             </svg>

             {/* Hexagon Nodes */}
             {currentNodes.map(node => {
                 const { level, isMaxed, isUnlocked } = getNodeState(node);
                 // @ts-ignore
                 const Icon = Icons[node.icon] || (node.type === 'active' ? Icons.Zap : Icons.Cpu);

                 return (
                     <div
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 group
                            ${selectedNode?.id === node.id ? 'scale-110' : 'hover:scale-105'}
                        `}
                        style={{ left: node.x, top: node.y }}
                     >
                        {/* Hexagon Shape Container */}
                        <div className={`w-full h-full flex items-center justify-center absolute clip-path-hexagon transition-all duration-300
                             ${isMaxed ? 'bg-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 
                               isUnlocked ? (level > 0 ? 'bg-cyan-900 border-2 border-cyan-400' : 'bg-slate-800 border-2 border-slate-600 hover:border-cyan-500/50') : 
                               'bg-slate-950 border-2 border-slate-800 opacity-60'}
                        `}>
                             {/* Inner Hexagon Detail */}
                             <div className={`w-[90%] h-[90%] clip-path-hexagon flex items-center justify-center
                                 ${isMaxed ? 'bg-cyan-950' : 'bg-slate-900'}
                             `}>
                                 <Icon size={24} className={`
                                     ${isMaxed ? 'text-cyan-400 drop-shadow-[0_0_5px_cyan]' : 
                                       level > 0 ? 'text-cyan-200' : 'text-slate-600 group-hover:text-slate-400'}
                                 `} />
                             </div>
                        </div>

                        {/* Level Indicator Badge */}
                        {level > 0 && (
                            <div className="absolute -bottom-6 bg-slate-900 border border-cyan-900 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400 shadow-lg z-20 whitespace-nowrap">
                                {level}/{node.maxLevel}
                            </div>
                        )}
                        
                        {/* Name on hover if not selected */}
                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap pointer-events-none border border-slate-700">
                            {node.name}
                        </div>

                        {/* Selection Ring */}
                        {selectedNode?.id === node.id && (
                             <div className="absolute inset-[-10px] border-2 border-dashed border-cyan-400 rounded-full animate-spin-slow pointer-events-none opacity-50"></div>
                        )}
                     </div>
                 );
             })}

             {/* SP Counter */}
             <div className="absolute bottom-8 right-8 text-right pointer-events-none bg-slate-900/80 p-4 rounded-xl border border-slate-700 backdrop-blur z-30">
                 <div className="text-xs text-slate-400 tracking-widest mb-1">MODULE POINTS</div>
                 <div className="text-5xl font-bold text-yellow-400 font-mono drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">{player.sp}</div>
             </div>
        </div>

        {/* Info Panel Side/Bottom */}
        {selectedNode && (
            <div className="absolute bottom-8 left-8 w-80 bg-slate-900/95 border border-cyan-500/30 p-6 rounded-xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 z-30">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-800">
                    <div className={`w-12 h-12 flex items-center justify-center rounded bg-slate-800 border border-slate-700
                        ${getNodeState(selectedNode).isMaxed ? 'text-cyan-400 border-cyan-500' : 'text-slate-400'}
                    `}>
                        {/* @ts-ignore */}
                         {React.createElement(Icons[selectedNode.icon] || Icons.Cpu, {size: 24})}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-cyan-100 font-tech">{selectedNode.name}</h3>
                        <span className="text-xs font-mono text-cyan-600">
                            TIER {activeTab} // {selectedNode.type.toUpperCase()}
                        </span>
                    </div>
                </div>
                
                <p className="text-sm text-slate-300 mb-6 leading-relaxed min-h-[3em]">{selectedNode.desc}</p>
                
                <div className="flex justify-between items-center mb-4 text-xs font-mono text-slate-500">
                    <span>CURRENT: {player.skillTree[selectedNode.id]||0}</span>
                    <span>MAX: {selectedNode.maxLevel}</span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full mb-6 overflow-hidden">
                    <div 
                        className="h-full bg-cyan-500 transition-all duration-300"
                        style={{ width: `${((player.skillTree[selectedNode.id]||0) / selectedNode.maxLevel) * 100}%` }}
                    ></div>
                </div>

                <button
                    onClick={() => {
                        const { isMaxed, isUnlocked } = getNodeState(selectedNode);
                        if (!isMaxed && isUnlocked && player.sp > 0) {
                            onUpgrade(selectedNode.id);
                        }
                    }}
                    disabled={player.sp === 0 || getNodeState(selectedNode).isMaxed || !getNodeState(selectedNode).isUnlocked}
                    className={`w-full py-3 text-sm font-bold rounded-lg uppercase tracking-widest transition-all
                        ${player.sp > 0 && !getNodeState(selectedNode).isMaxed && getNodeState(selectedNode).isUnlocked 
                            ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:shadow-[0_0_20px_rgba(8,145,178,0.6)]' 
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'}
                    `}
                >
                    {getNodeState(selectedNode).isMaxed ? 'SYSTEM MAXED' : 
                     !getNodeState(selectedNode).isUnlocked ? 'LOCKED' : 
                     'INSTALL UPGRADE'}
                </button>
            </div>
        )}

      </div>
      <style>{`
        .clip-path-hexagon {
            clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
        }
        .animate-spin-slow {
            animation: spin 8s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SkillTree;
