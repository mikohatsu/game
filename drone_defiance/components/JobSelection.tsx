
import React, { useRef, useEffect } from 'react';
import { JOBS, WEAPONS } from '../constants';
import { JobDef, Player } from '../types';
import { RenderService } from '../services/RenderService';

interface Props {
  onSelect: (jobId: string) => void;
  availableJobs: string[];
}

// Sub-component for rendering the live preview
const DronePreview: React.FC<{ jobId: string }> = ({ jobId }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const renderer = new RenderService(ctx);
        let animationFrameId: number;
        
        // Create a mock player object for rendering
        const mockPlayer: any = {
            pos: { x: 0, y: 0 },
            angle: -Math.PI / 2, // Facing Up
            jobId: jobId,
            iframe: 0,
            hitFlash: 0,
            shieldHitFlash: 0,
            activeEffects: {},
            // Add other required props with dummy values if RenderService needs them
            level: 1, xp: 0, stats: { maxHp: 100, hp: 100 } 
        };

        const render = () => {
            // Clear transparently
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Slow rotation for display
            mockPlayer.angle += 0.02;

            // Draw centered
            renderer.drawPlayer(mockPlayer as Player, canvas.width / 2, canvas.height / 2);

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [jobId]);

    return <canvas ref={canvasRef} width={120} height={120} className="w-24 h-24" />;
};

const JobSelection: React.FC<Props> = ({ onSelect, availableJobs }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
      <div className="text-center mb-10">
          <h2 className="text-4xl font-tech text-cyan-400 mb-2 animate-pulse tracking-widest">SYSTEM UPGRADE AVAILABLE</h2>
          <p className="text-slate-400 font-mono">SELECT NEW CHASSIS CONFIGURATION</p>
      </div>
      
      <div className="flex gap-8 flex-wrap justify-center max-w-6xl">
        {availableJobs.map(jobId => {
          const job: JobDef = JOBS[jobId];
          const weapon = WEAPONS[job.weapon];

          return (
            <div 
              key={jobId}
              onClick={() => onSelect(jobId)}
              className="w-72 glass-panel p-0 rounded-xl flex flex-col items-center text-center cursor-pointer hover:scale-105 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300 group overflow-hidden bg-slate-900"
            >
              {/* Header / Icon Area */}
              <div className="w-full bg-slate-950/50 p-6 flex flex-col items-center justify-center border-b border-slate-700 group-hover:bg-cyan-950/30 transition-colors relative">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                  
                  {/* Live Preview Canvas */}
                  <div className="relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
                      <DronePreview jobId={jobId} />
                  </div>
                  
                  {/* Skill Icon Badge */}
                  <div className="absolute top-2 right-2 bg-slate-900 border border-slate-600 rounded p-1 text-xs text-slate-400" title="Unlock Level">
                      LV {job.unlockLv}
                  </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col w-full">
                  <h3 className="text-2xl font-bold font-tech text-white mb-1 group-hover:text-cyan-300 transition-colors">{job.name}</h3>
                  <div className="text-xs text-slate-500 font-bold mb-4 tracking-widest uppercase">{job.desc}</div>
                  
                  {/* Stats Grid */}
                  <div className="w-full bg-slate-950/80 p-3 rounded border border-slate-800 text-xs text-left space-y-1.5 font-mono mb-4">
                    <div className="flex justify-between">
                        <span className="text-slate-500">WEAPON</span>
                        <span className="text-cyan-300 font-bold">{job.weapon.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">DAMAGE</span>
                        <span className="text-white">{weapon?.dmg}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">RANGE</span>
                        <span className="text-white">{weapon?.range}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-slate-500">SKILL</span>
                        <span className="text-yellow-300">{job.skill?.name}</span>
                    </div>
                  </div>

                  <div className="mt-auto w-full py-2 bg-cyan-900/40 border border-cyan-500/30 rounded text-xs text-cyan-200 font-bold uppercase tracking-widest group-hover:bg-cyan-600 group-hover:text-white transition-all">
                    INSTALL MODULE
                  </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobSelection;
