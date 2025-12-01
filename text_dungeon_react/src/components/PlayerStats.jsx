import React from 'react';
import { Swords, Shield, Zap, Heart, Droplets } from 'lucide-react';
import FloatingNumber from './FloatingNumber';

const PlayerStats = ({ player, stats, damage, heal }) => {
  const hpPercent = (player.hp / player.maxHp) * 100;
  const hpColor = hpPercent > 50 ? 'from-green-600 to-green-400' :
    hpPercent > 25 ? 'from-yellow-600 to-yellow-400' :
      'from-red-600 to-red-400';

  return (
    <div className="panel relative">
      {damage && <FloatingNumber value={damage} type="damage" />}
      {heal && <FloatingNumber value={heal} type="heal" />}
      <h3 className="text-xl font-bold mb-4 text-dungeon-accent flex items-center gap-2">
        <Heart className="w-6 h-6" />
        플레이어 상태
      </h3>

      {/* HP Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            체력
          </span>
          <span className="font-mono">{player.hp} / {player.maxHp}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-10 relative overflow-hidden shadow-inner">
          <div
            className={`bg-gradient-to-r ${hpColor} h-full transition-all duration-500 flex items-center justify-center text-sm font-bold shadow-lg`}
            style={{ width: `${hpPercent}%` }}
          >
            {Math.floor(hpPercent)}%
          </div>
          {/* Pulse effect on low HP */}
          {hpPercent <= 25 && (
            <div className="absolute inset-0 bg-red-500 opacity-30 animate-pulse" />
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="stat-badge bg-red-900/50 border-2 border-red-700/50 hover:border-red-600 transition-colors">
          <Swords className="w-6 h-6 text-red-400" />
          <div>
            <div className="text-xs text-gray-400">공격력</div>
            <div className="text-xl font-bold">{stats.atk}</div>
          </div>
        </div>

        <div className="stat-badge bg-blue-900/50 border-2 border-blue-700/50 hover:border-blue-600 transition-colors">
          <Shield className="w-6 h-6 text-blue-400" />
          <div>
            <div className="text-xs text-gray-400">방어력</div>
            <div className="text-xl font-bold">{stats.def}</div>
          </div>
        </div>

        <div className="stat-badge bg-yellow-900/50 border-2 border-yellow-700/50 hover:border-yellow-600 transition-colors">
          <Zap className="w-6 h-6 text-yellow-400" />
          <div>
            <div className="text-xs text-gray-400">치명타</div>
            <div className="text-xl font-bold">{(stats.crit * 100).toFixed(0)}%</div>
          </div>
        </div>

        {stats.lifesteal > 0 && (
          <div className="stat-badge bg-purple-900/50 border-2 border-purple-700/50 hover:border-purple-600 transition-colors">
            <Droplets className="w-6 h-6 text-purple-400" />
            <div>
              <div className="text-xs text-gray-400">흡혈</div>
              <div className="text-xl font-bold">{(stats.lifesteal * 100).toFixed(0)}%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerStats;
