import React from 'react';
import * as Icons from 'lucide-react';
import { SymbolDef, Rarity } from '../types';

interface Props {
  symbol: SymbolDef;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const SymbolCard: React.FC<Props> = ({ symbol, onClick, className = '', size = 'md', showDetails = true }) => {
  const IconComponent = (Icons as any)[symbol.icon] || Icons.HelpCircle;

  // Visual styles per rarity
  const rarityStyles = {
    [Rarity.COMMON]: 'border-gray-600 bg-gray-900 text-gray-400 shadow-[0_0_5px_rgba(255,255,255,0.1)]',
    [Rarity.UNCOMMON]: 'border-green-500 bg-green-950/40 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]',
    [Rarity.RARE]: 'border-blue-500 bg-blue-950/40 text-cyan-300 shadow-[0_0_15px_rgba(59,130,246,0.4)]',
    [Rarity.LEGENDARY]: 'border-amber-400 bg-amber-950/40 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.5)] animate-pulse',
  };

  const glowClass = {
    [Rarity.COMMON]: '',
    [Rarity.UNCOMMON]: 'shadow-[inset_0_0_10px_rgba(34,197,94,0.2)]',
    [Rarity.RARE]: 'shadow-[inset_0_0_15px_rgba(6,182,212,0.3)]',
    [Rarity.LEGENDARY]: 'shadow-[inset_0_0_20px_rgba(251,191,36,0.4)]',
  };

  const sizeClasses = {
    sm: 'w-16 h-16 text-[10px]',
    md: 'w-24 h-32 text-xs',
    lg: 'w-32 h-40 text-sm',
  };

  return (
    <div 
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center 
        border rounded-lg backdrop-blur-sm
        transition-all duration-200 
        ${rarityStyles[symbol.rarity]} 
        ${glowClass[symbol.rarity]}
        ${sizeClasses[size]}
        ${onClick ? 'cursor-pointer hover:scale-105 hover:brightness-125 hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {/* Background Pattern for visuals */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
      
      <div className={`
        mb-1 p-2 rounded-full bg-black/50 border border-white/10
        ${symbol.rarity === Rarity.LEGENDARY ? 'animate-spin-slow' : ''}
      `}>
        <IconComponent className={size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'} />
      </div>
      
      <div className="font-bold text-center leading-tight px-1 w-full truncate font-display tracking-wider">
        {symbol.name}
      </div>
      
      {showDetails && size !== 'sm' && (
        <div className="mt-2 text-[9px] text-center opacity-70 px-1 leading-tight line-clamp-3 font-mono">
            {symbol.description}
        </div>
      )}
      
      {/* Value Badge */}
      <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
        <div className="bg-black border border-gray-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            ${symbol.baseValue}
        </div>
      </div>
    </div>
  );
};

export default SymbolCard;