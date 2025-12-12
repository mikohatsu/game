import React from 'react';
import { SymbolDef, GRID_SIZE } from '../types';
import SymbolCard from './SymbolCard';

interface Props {
  grid: (SymbolDef | null)[];
  animations: { idx: number, type: string, value?: string | number }[];
}

const Grid: React.FC<Props> = ({ grid, animations }) => {
  return (
    <div className="relative p-6 bg-gray-900 rounded-3xl border-b-8 border-r-8 border-gray-950 shadow-2xl">
      {/* Machine Casing Decoration */}
      <div className="absolute inset-0 border-4 border-gray-700 rounded-3xl pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-2 bg-gray-800 rounded-b-xl border-b border-gray-600" />
      
      {/* The Screen/Glass */}
      <div className="grid grid-cols-3 gap-3 relative z-10 bg-black/50 p-2 rounded-xl border border-gray-800 shadow-[inset_0_0_50px_rgba(0,0,0,1)]">
        {grid.map((symbol, idx) => {
          const anim = animations.find(a => a.idx === idx);
          
          return (
            <div key={idx} className="relative w-24 h-24 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700/50 shadow-inner">
              {symbol ? (
                <SymbolCard 
                  symbol={symbol} 
                  size="sm" 
                  showDetails={false} 
                  className={`w-full h-full animate-spin-slot border-none bg-transparent shadow-none ${anim?.type === 'destroy' ? 'opacity-25 grayscale' : ''}`}
                />
              ) : (
                <div className="w-full h-full opacity-20 flex items-center justify-center">
                    <div className="w-16 h-1 rounded-full bg-gray-700"></div>
                </div>
              )}
              
              {/* Glossy reflection on the glass slot */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg pointer-events-none" />

              {/* Popups for scores/animations */}
              {anim && (
                <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap">
                   <div className={`
                      text-3xl font-black font-display stroke-black stroke-2
                      ${anim.type === 'destroy' ? 'text-red-500 scale-150 animate-ping' : 'text-yellow-400 scale-125 animate-pop'}
                      drop-shadow-[0_4px_4px_rgba(0,0,0,1)]
                      text-stroke-2
                   `} style={{ WebkitTextStroke: '1px black' }}>
                      {anim.value || (anim.type === 'destroy' ? 'CRUNCH' : '')}
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Decorative Lights */}
      <div className="flex justify-between mt-4 px-2">
         <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_red]"></div>
         <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse delay-75 shadow-[0_0_5px_yellow]"></div>
         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150 shadow-[0_0_5px_green]"></div>
      </div>
    </div>
  );
};

export default Grid;