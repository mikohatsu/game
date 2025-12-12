
import React from 'react';
import { Skull, Clock, Crosshair, Trophy, ChevronRight, RotateCcw } from 'lucide-react';

interface Props {
  stats: {
    score: number;
    wave: number;
    kills: number;
    level: number;
    time: number; // in frames
    credits: number;
    cores: number;
  };
  onReturn: () => void;
  onRetry: () => void;
}

const GameOver: React.FC<Props> = ({ stats, onReturn, onRetry }) => {
  const formatTime = (frames: number) => {
    const totalSeconds = Math.floor(frames / 60);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-red-950/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="glass-panel w-full max-w-lg p-8 rounded-2xl border-red-500/30 flex flex-col items-center shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        
        <div className="mb-6 relative">
             <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
             <Skull size={64} className="text-red-500 relative z-10" />
        </div>

        <h1 className="text-5xl font-black font-tech text-red-500 mb-2 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
            MISSION FAILED
        </h1>
        <p className="text-red-300/60 font-mono text-sm mb-8 tracking-[0.3em]">SIGNAL LOST</p>

        <div className="w-full space-y-3 mb-8">
            <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded border border-slate-700">
                <div className="flex items-center gap-3 text-slate-400">
                    <Trophy size={20} className="text-yellow-500" />
                    <span className="font-bold text-sm">TOTAL SCORE</span>
                </div>
                <div className="text-2xl font-mono font-bold text-white text-shadow">{stats.score.toLocaleString()}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/60 p-3 rounded border border-slate-700 flex flex-col items-center">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                        <Clock size={14} /> SURVIVED
                    </div>
                    <div className="text-xl font-mono text-white">{formatTime(stats.time)}</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded border border-slate-700 flex flex-col items-center">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                        <Crosshair size={14} /> KILLS
                    </div>
                    <div className="text-xl font-mono text-white">{stats.kills}</div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded border border-yellow-500/30 flex justify-between items-center mt-4">
                <span className="text-xs font-bold text-yellow-500 tracking-widest">REWARDS ACQUIRED</span>
                <div className="text-right">
                    <div className="text-yellow-400 font-mono font-bold flex items-center justify-end gap-2">
                        +{stats.credits} <span className="text-[10px] text-slate-500">CHIPS</span>
                    </div>
                    {stats.cores > 0 && (
                        <div className="text-fuchsia-400 font-mono font-bold flex items-center justify-end gap-2">
                             +{stats.cores} <span className="text-[10px] text-slate-500">CORES</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="flex gap-4 w-full">
            <button 
                onClick={onReturn}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-bold rounded flex items-center justify-center gap-2 transition-all"
            >
                <ChevronRight size={18} /> MENU
            </button>
            <button 
                onClick={onRetry}
                className="flex-[1.5] py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 transition-all"
            >
                <RotateCcw size={18} /> RETRY
            </button>
        </div>

      </div>
    </div>
  );
};

export default GameOver;
