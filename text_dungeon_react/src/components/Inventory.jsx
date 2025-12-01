import React from 'react';
import { Backpack, Sparkles, Trash2 } from 'lucide-react';
import ItemIcon from './ItemIcon';

const TIER_COLORS = [
  'border-gray-500 bg-gray-900/50',
  'border-blue-500 bg-blue-900/30 shadow-blue-500/20',
  'border-purple-500 bg-purple-900/30 shadow-purple-500/20',
  'border-yellow-500 bg-yellow-900/30 shadow-yellow-500/30',
  'border-pink-500 bg-pink-900/30 shadow-pink-500/40'
];

const TIER_NAMES = ["일반", "희귀", "영웅", "전설", "신화"];

const Inventory = ({ inventory, selectedIdx, onSelect, onEquip, onMerge, onTrash }) => {
  const canMerge = selectedIdx !== -1 && inventory.findIndex((item, i) =>
    i !== selectedIdx &&
    item.name === inventory[selectedIdx]?.name &&
    item.tier === inventory[selectedIdx]?.tier
  ) !== -1;

  return (
    <div className="panel">
      <h3 className="text-xl font-bold mb-4 text-dungeon-accent flex items-center gap-2">
        <Backpack className="w-6 h-6" />
        인벤토리 <span className="text-sm text-gray-400">({inventory.length}/16)</span>
      </h3>

      {/* Inventory Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[...Array(16)].map((_, idx) => {
          const item = inventory[idx];
          if (!item) {
            return (
              <div
                key={idx}
                className="aspect-square border-2 border-dashed border-gray-700 rounded-lg bg-gray-900/30 hover:bg-gray-900/50 transition-colors"
              />
            );
          }

          const isSelected = idx === selectedIdx;
          return (
            <div
              key={item.id}
              onClick={() => onSelect(idx)}
              className={`aspect-square border-2 rounded-lg cursor-pointer
                transition-all duration-200 hover:scale-105 relative
                ${TIER_COLORS[item.tier - 1]}
                ${isSelected ? 'ring-4 ring-dungeon-accent scale-110 z-10' : ''}
              `}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                <ItemIcon type={item.iconType} tier={item.tier} size={36} />
                <span className="text-xs font-bold text-white bg-black/70 px-2 py-0.5 rounded mt-1">
                  +{item.val}
                </span>
              </div>
              <div className="absolute top-1 left-1 text-[10px] font-bold bg-black/50 px-1 rounded">
                {TIER_NAMES[item.tier - 1][0]}
              </div>
              {/* Sparkle effect for high tier items */}
              {item.tier >= 3 && (
                <div className="absolute top-1 right-1">
                  <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onEquip}
          disabled={selectedIdx === -1}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          <Sparkles className="w-4 h-4" />
          장착
        </button>
        <button
          onClick={onMerge}
          disabled={!canMerge}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          <Sparkles className="w-4 h-4" />
          합치기
        </button>
        <button
          onClick={onTrash}
          disabled={selectedIdx === -1}
          className="btn-secondary bg-red-900 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          버리기
        </button>
      </div>

      {selectedIdx !== -1 && inventory[selectedIdx] && (
        <div className="mt-4 p-4 bg-dungeon-darker rounded-lg border-2 border-dungeon-accent animate-slide-up">
          <div className="flex items-start gap-3">
            <ItemIcon type={inventory[selectedIdx].iconType} tier={inventory[selectedIdx].tier} size={48} />
            <div className="flex-1">
              <p className="font-bold text-lg text-dungeon-accent mb-1">
                {inventory[selectedIdx].name}
              </p>
              <div className="flex gap-3 text-sm">
                <span className="text-gray-400">
                  등급: <span className="text-dungeon-legend">{TIER_NAMES[inventory[selectedIdx].tier - 1]}</span>
                </span>
                <span className="text-gray-400">
                  능력치: <span className="text-green-400 font-bold">+{inventory[selectedIdx].val}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
