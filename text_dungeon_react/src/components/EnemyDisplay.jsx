import React from 'react';
import { Skull, Ghost, Flame, Crown } from 'lucide-react';
import FloatingNumber from './FloatingNumber';

const ENEMY_ICONS = {
  demon: <Flame className="w-24 h-24 text-red-500" />,
  undead: <Skull className="w-24 h-24 text-purple-500" />,
  beast: <Ghost className="w-24 h-24 text-orange-500" />,
  dragon: <Flame className="w-24 h-24 text-orange-600" />,
  boss: <Crown className="w-24 h-24 text-yellow-400" />
};

const EnemyDisplay = ({ enemy, damage, shake }) => {
  if (!enemy) {
    return (
      <div className="panel text-center">
        <p className="text-gray-400 text-lg">다음 층으로 이동하세요...</p>
      </div>
    );
  }

  const hpPercent = (enemy.hp / enemy.maxHp) * 100;
  const isBoss = enemy.isBoss;

  return (
    <div className={`panel ${isBoss ? 'border-dungeon-boss shadow-red-900/50 shadow-2xl' : ''} relative`}>
      {damage && <FloatingNumber value={damage} type="damage" />}
      <div className="text-center">
        <div className={`mb-6 flex justify-center ${shake ? 'animate-enemy-hit' : 'animate-bounce-item'}`}>
          {ENEMY_ICONS[enemy.type] || ENEMY_ICONS.demon}
        </div>
        <h2 className={`text-3xl font-bold mb-3 ${isBoss ? 'text-dungeon-boss animate-pulse-glow' : 'text-dungeon-accent'}`}>
          {enemy.name}
        </h2>
        <div className="w-full bg-gray-800 rounded-full h-8 mb-3 relative overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 h-full transition-all duration-500 flex items-center justify-center text-sm font-bold shadow-lg"
            style={{ width: `${hpPercent}%` }}
          >
            {enemy.hp > 0 && `${Math.floor(hpPercent)}%`}
          </div>
          {/* Glow effect */}
          {enemy.hp > 0 && (
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"
              style={{ width: `${hpPercent}%` }}
            />
          )}
        </div>
        <div className="flex justify-center gap-4 text-sm">
          <span className="stat-badge bg-red-900/50 border border-red-700">
            HP {enemy.hp}/{enemy.maxHp}
          </span>
          <span className="stat-badge bg-orange-900/50 border border-orange-700">
            공격력 {enemy.atk}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnemyDisplay;
