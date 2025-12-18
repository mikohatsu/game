import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Upgrade } from '../types';
import { formatNumber } from '../utils';

export const ControlPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'EQUIP' | 'ALLY' | 'UTILITY' | 'STAR'>('EQUIP');
  const { upgrades, buyUpgrade, player, resetBroadcast, isReincarnationModalOpen, setReincarnationModal } = useGameStore();

  const getCost = (u: Upgrade) => Math.floor(u.baseCost * Math.pow(u.costMultiplier, u.level));
  
  const filteredUpgrades = upgrades.filter(u => {
      if (activeTab === 'EQUIP') return u.category === 'CLICK';
      if (activeTab === 'ALLY') return u.category === 'AUTO';
      if (activeTab === 'UTILITY') return u.category === 'UTILITY';
      if (activeTab === 'STAR') return u.category === 'STAR';
      return false;
  });

  const showStarTab = player.reincarnationCount > 0 || player.starPoints > 0;
  const canReincarnate = player.subscribers >= 100000;
  const earnedStars = Math.floor(Math.pow(player.subscribers / 400, 0.7));

  const getCurrencyLabel = (currency: string) => {
      if (currency === 'GOLD') return '골드';
      if (currency === 'VIEWERS') return '시청자';
      if (currency === 'STAR') return '스타 포인트';
      return currency;
  };

  const getEffectDisplay = (u: Upgrade) => {
      if (u.category === 'CLICK') return `⚔️ 클릭 공격력 +${formatNumber(u.effectValue)}`;
      if (u.category === 'AUTO') return `🤖 초당 공격력 +${formatNumber(u.effectValue)}`;
      // UTILITY and STAR usually have the effect described in the description text in constants.ts
      // But we can add styling or prefixes here if needed.
      return null; 
  };

  return (
    <div className="h-full flex flex-col bg-[#141517] relative">
      {/* Tabs */}
      <div className={`grid ${showStarTab ? 'grid-cols-4' : 'grid-cols-3'} text-[10px] font-black border-b border-[#272727] bg-[#1a1b20]`}>
        {[
          { id: 'EQUIP', label: '장비 상점', icon: '⚔️' },
          { id: 'ALLY', label: '동료 영입', icon: '🤝' },
          { id: 'UTILITY', label: '방송 세팅', icon: '📽️' },
          ...(showStarTab ? [{ id: 'STAR', label: '차원 돌파', icon: '🌌' }] : [])
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-4 flex flex-col items-center justify-center transition-all relative ${activeTab === tab.id ? 'text-[#00FFA3] bg-black/30' : 'text-gray-500 hover:text-white'}`}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00FFA3]" />}
          </button>
        ))}
      </div>

      {/* Currency Status */}
      <div className="flex justify-between items-center bg-black/40 py-2.5 px-4 border-b border-[#272727] gap-2">
        <div className="flex flex-col min-w-0">
            <span className="text-[8px] text-gray-500 font-black uppercase">골드</span>
            <span className="text-yellow-400 font-black text-xs truncate">💰 {formatNumber(player.gold)}</span>
        </div>
        
        <div className="flex flex-col min-w-0 items-center">
             <span className="text-[8px] text-gray-500 font-black uppercase">시청자</span>
             <span className="text-[#00FFA3] font-black text-xs truncate">👥 {formatNumber(player.viewers)}</span>
        </div>

        {showStarTab ? (
            <div className="flex flex-col items-end min-w-0">
                <span className="text-[8px] text-gray-500 font-black uppercase">스타 포인트</span>
                <span className="text-pink-400 font-black text-xs truncate">⭐ {formatNumber(player.starPoints)}</span>
            </div>
        ) : (
             <div className="w-16"></div> /* Spacer to keep layout balanced if Star Points hidden */
        )}
      </div>

      {/* Upgrade List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-[#141517]">
        {filteredUpgrades.map((u) => {
          const cost = getCost(u);
          let canAfford = false;
          if (u.currency === 'GOLD') canAfford = player.gold >= cost;
          else if (u.currency === 'VIEWERS') canAfford = player.viewers >= cost;
          else if (u.currency === 'STAR') canAfford = player.starPoints >= cost;

          const effectText = getEffectDisplay(u);

          return (
            <div key={u.id} className={`p-4 rounded-xl border transition-all duration-200 ${canAfford ? 'bg-[#1e2024] border-[#2e3035] hover:border-[#00FFA3]/50 shadow-lg' : 'bg-[#181a1d] border-transparent opacity-40'}`}>
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-gray-100 text-xs leading-none">{u.name}</h4>
                      <span className="text-[#00FFA3] text-[9px] font-black bg-[#00FFA3]/10 px-1.5 py-0.5 rounded">Lv.{u.level}</span>
                  </div>
                  
                  {/* Explicit Effect Stat for Weapons/Allies */}
                  {effectText && (
                      <p className="text-[10px] text-[#00FFA3] font-bold mb-0.5">{effectText}</p>
                  )}
                  
                  {/* Description / Flavor Text */}
                  <p className="text-[9px] text-gray-500 leading-tight">
                    {u.description}
                  </p>
                </div>
                <div className="text-right">
                    <div className={`text-[10px] font-black ${u.currency === 'GOLD' ? 'text-yellow-400' : u.currency === 'VIEWERS' ? 'text-[#00FFA3]' : 'text-pink-400'}`}>
                        {formatNumber(cost)}
                    </div>
                    <div className="text-[8px] text-gray-600 font-bold uppercase">{getCurrencyLabel(u.currency)}</div>
                </div>
              </div>
              <button 
                onClick={() => buyUpgrade(u.id)}
                disabled={!canAfford}
                className={`w-full py-2 rounded-lg text-[10px] font-black transition-all ${canAfford ? 'bg-[#00FFA3] text-black hover:scale-[1.02] active:scale-95' : 'bg-[#272727] text-gray-600 cursor-not-allowed'}`}
              >
                고용 및 구매하기
              </button>
            </div>
          );
        })}
        
        {/* Season Reset Button */}
        <div className="pt-8 pb-4 border-t border-[#272727] mt-4 flex flex-col items-center">
            {canReincarnate ? (
                <button 
                    onClick={() => setReincarnationModal(true)}
                    className="w-full bg-[#ff0033] hover:bg-[#d0002a] text-white font-black py-4 rounded-xl text-xs shadow-xl shadow-red-900/20 transition-all active:scale-95"
                >
                    🎬 방송 종료 및 시즌 정산하기
                </button>
            ) : (
                <div className="text-center">
                   <p className="text-[9px] text-gray-500 mb-2 font-black uppercase tracking-widest">Reincarnation Locked</p>
                   <p className="text-[10px] text-gray-400 font-bold">구독자 10만명(실버 버튼) 달성 시 해금</p>
                </div>
            )}
        </div>
      </div>

      {/* Reincarnation Modal */}
      <AnimatePresence>
          {isReincarnationModalOpen && (
              <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setReincarnationModal(false)}>
                  <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-[#1a1b20] w-full max-w-sm rounded-2xl border border-red-500/50 p-6 shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                  >
                      <h3 className="text-xl font-black text-red-500 mb-2 text-center">⚠ 방송 종료 경고</h3>
                      <p className="text-gray-300 text-xs text-center mb-6 leading-relaxed">
                          이번 시즌을 종료하고 정산하시겠습니까?<br/>
                          모은 구독자와 골드는 <span className="text-white font-bold">초기화</span>되지만,<br/>
                          <span className="text-pink-400 font-bold">별사탕</span>과 <span className="text-yellow-400 font-bold">업적</span>은 유지됩니다.
                      </p>
                      
                      <div className="bg-black/40 rounded-lg p-4 mb-6 text-center border border-white/5">
                          <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">획득 예정 별사탕</p>
                          <p className="text-2xl font-black text-pink-400 animate-pulse">⭐ {formatNumber(earnedStars)}</p>
                      </div>

                      <div className="flex gap-3">
                          <button onClick={() => setReincarnationModal(false)} className="flex-1 bg-[#272727] text-white font-bold py-3 rounded-lg hover:bg-[#353535] transition-colors text-xs">
                              취소
                          </button>
                          <button onClick={resetBroadcast} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 text-xs">
                              확인 (시즌 종료)
                          </button>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </div>
  );
};
