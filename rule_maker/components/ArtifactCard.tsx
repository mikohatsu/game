import React from 'react';
import { Artifact } from '../types';

interface ArtifactCardProps {
  artifact: Artifact;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  showPrice?: boolean;
  variant?: 'default' | 'list'; // Removed compact/mini, added list
  className?: string;
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ 
  artifact, 
  onClick, 
  selected = false,
  disabled = false,
  showPrice = false,
  variant = 'default',
  className = ''
}) => {
  
  // Rarity Styling
  const styles = {
    COMMON: { border: 'border-slate-500', bg: 'bg-[#e5e5e5]', text: 'text-slate-800', accent: 'bg-slate-500' },
    RARE: { border: 'border-blue-700', bg: 'bg-[#dbeafe]', text: 'text-blue-900', accent: 'bg-blue-700' },
    LEGENDARY: { border: 'border-yellow-600', bg: 'bg-[#fefce8]', text: 'text-yellow-900', accent: 'bg-yellow-600' },
    CURSED: { border: 'border-red-800', bg: 'bg-[#fee2e2]', text: 'text-red-900', accent: 'bg-red-800' }
  };

  const style = styles[artifact.rarity];

  const categoryIcon = 
    artifact.category === 'NUMBER' ? '🔢' : 
    artifact.category === 'PHYSICS' ? '⚛️' : 
    artifact.category === 'DOPAMINE' ? '💉' : 
    artifact.category === 'STRATEGY' ? '♟️' : '☠️';

  // --- LIST VARIANT (Hearthstone Decklist Style) ---
  if (variant === 'list') {
    return (
      <div 
        onClick={!disabled ? onClick : undefined}
        className={`
          relative w-full h-10 mb-1 flex items-center justify-between px-2 cursor-pointer transition-all select-none overflow-hidden
          border-l-4 shadow-sm bg-gradient-to-r from-[#e5e5e5] to-white
          ${selected ? 'border-l-yellow-400 bg-yellow-50 translate-x-2' : style.border.replace('border', 'border-l')}
          ${disabled ? 'opacity-50 grayscale' : 'hover:brightness-105 hover:shadow-md'}
          ${className}
        `}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs shadow-inner bg-white/50`}>
            {categoryIcon}
          </div>
          <span className={`font-display text-sm truncate ${style.text} ${selected ? 'font-black' : 'font-bold'}`}>
            {artifact.name}
          </span>
        </div>

        {/* Price or Rarity Indicator for List */}
        {showPrice ? (
           <span className="font-mono text-xs font-bold text-black bg-white/50 px-1 rounded">
             {artifact.price >= 10000 ? `${artifact.price/10000}만` : artifact.price}
           </span>
        ) : (
           <div className={`w-2 h-2 rounded-full ${style.accent}`} />
        )}
      </div>
    );
  }

  // --- DEFAULT VARIANT (Full Card) ---
  const selectedClass = selected 
    ? 'ring-4 ring-yellow-400 ring-offset-2 transform -translate-y-2 shadow-2xl z-10' 
    : 'hover:-translate-y-1 hover:shadow-xl hover:z-10';

  return (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`
        relative w-full h-full rounded-lg border-4 flex flex-col transition-all cursor-pointer select-none overflow-hidden group
        ${style.border} ${style.bg}
        ${selectedClass}
        ${disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'shadow-md'}
        ${className}
      `}
      style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cardboard-flat.png')" }}
    >
      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>

      {/* Header */}
      <div className={`px-3 py-2 border-b-2 ${style.border} flex justify-between items-center bg-white/40 shrink-0`}>
        <span className="text-sm md:text-base font-black font-display truncate leading-tight flex-1 text-shadow-sm">
          {artifact.name}
        </span>
        <span className="text-lg drop-shadow-md ml-1">{categoryIcon}</span>
      </div>
      
      {/* Content (Expands to fill) */}
      <div className="flex-grow p-3 flex flex-col justify-center items-center text-center relative overflow-hidden">
         {/* Decoration Icon Faint */}
         <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none text-6xl grayscale">
            {categoryIcon}
         </div>
         
         <p className={`font-serif text-xs md:text-sm font-bold leading-relaxed break-keep relative z-10 ${style.text}`}>
          {artifact.description}
        </p>
      </div>

      {/* Footer info */}
      <div className="shrink-0 flex justify-between items-center px-2 py-1 bg-black/10">
          <span className={`text-[10px] font-black uppercase tracking-widest ${style.text}`}>
            {artifact.rarity}
          </span>
          {showPrice && (
            <span className="font-mono font-bold text-xs bg-white/80 px-1 rounded border border-black/10">
                ₩ {artifact.price.toLocaleString()}
            </span>
          )}
      </div>
    </div>
  );
};