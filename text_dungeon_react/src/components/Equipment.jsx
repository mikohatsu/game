import React from 'react';
import { Swords, Shield, X } from 'lucide-react';
import ItemIcon from './ItemIcon';

const TIER_COLORS = [
  'border-gray-500 bg-gray-900/50',
  'border-blue-500 bg-blue-900/30',
  'border-purple-500 bg-purple-900/30',
  'border-yellow-500 bg-yellow-900/30',
  'border-pink-500 bg-pink-900/30'
];

const Equipment = ({ weapon, armor, onUnequip }) => {
  return (
    <div className="panel">
      <h3 className="text-xl font-bold mb-4 text-dungeon-accent flex items-center gap-2">
        <Swords className="w-6 h-6" />
        장착 장비
      </h3>

      <div className="space-y-3">
        {/* Weapon Slot */}
        <div>
          <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
            <Swords className="w-4 h-4" />
            무기
          </p>
          {weapon ? (
            <div className={`p-3 rounded-lg border-2 ${TIER_COLORS[weapon.tier - 1]} relative group`}>
              <button
                onClick={() => onUnequip('weapon')}
                className="absolute top-2 right-2 p-1 bg-red-900/80 rounded hover:bg-red-800 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <ItemIcon type={weapon.iconType} tier={weapon.tier} size={32} />
                <div>
                  <p className="font-bold">{weapon.name}</p>
                  <p className="text-sm text-green-400">공격력 +{weapon.val}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg border-2 border-dashed border-gray-700 bg-gray-900/30 text-center text-gray-500">
              장착된 무기 없음
            </div>
          )}
        </div>

        {/* Armor Slot */}
        <div>
          <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
            <Shield className="w-4 h-4" />
            방어구
          </p>
          {armor ? (
            <div className={`p-3 rounded-lg border-2 ${TIER_COLORS[armor.tier - 1]} relative group`}>
              <button
                onClick={() => onUnequip('armor')}
                className="absolute top-2 right-2 p-1 bg-red-900/80 rounded hover:bg-red-800 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <ItemIcon type={armor.iconType} tier={armor.tier} size={32} />
                <div>
                  <p className="font-bold">{armor.name}</p>
                  <p className="text-sm text-blue-400">방어력 +{armor.val}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg border-2 border-dashed border-gray-700 bg-gray-900/30 text-center text-gray-500">
              장착된 방어구 없음
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Equipment;
