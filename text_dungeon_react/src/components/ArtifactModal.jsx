import React from 'react';
import { Sparkles, Heart, Droplets, Zap, Flame, Coins, Shield } from 'lucide-react';
import { X } from 'lucide-react';

const ARTIFACT_ICONS = {
  lifesteal: <Droplets className="w-16 h-16 text-purple-400" />,
  health: <Heart className="w-16 h-16 text-red-400" />,
  crit: <Zap className="w-16 h-16 text-yellow-400" />,
  berserker: <Flame className="w-16 h-16 text-orange-400" />,
  coin: <Coins className="w-16 h-16 text-yellow-400" />,
  defense: <Shield className="w-16 h-16 text-blue-400" />
};

const ArtifactModal = ({ show, choices, onSelect, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-dungeon-panel border-2 border-dungeon-legend rounded-2xl p-8 max-w-4xl w-full shadow-2xl shadow-yellow-500/20 animate-slide-up">
        <div className="text-center mb-8">
          <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
          <h2 className="text-4xl font-bold text-dungeon-legend mb-2">보스 승리!</h2>
          <p className="text-gray-300 text-lg">유물을 하나 선택하세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {choices.map((artifact, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(artifact)}
              className="p-6 bg-dungeon-darker border-2 border-dungeon-accent rounded-xl
                hover:border-dungeon-legend hover:scale-105 transition-all duration-200
                hover:shadow-xl hover:shadow-yellow-500/30"
            >
              <div className="flex justify-center mb-4">
                {ARTIFACT_ICONS[artifact.type] || <Sparkles className="w-16 h-16 text-gray-400" />}
              </div>
              <h3 className="text-xl font-bold text-dungeon-legend mb-2">
                {artifact.name}
              </h3>
              <p className="text-sm text-gray-400">
                {artifact.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtifactModal;
