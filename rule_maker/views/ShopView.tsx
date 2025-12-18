import React, { useState, useEffect } from 'react';
import { Artifact, PlayerState } from '../types';
import { ARTIFACTS, REROLL_COST } from '../constants';
import { ArtifactCard } from '../components/ArtifactCard';
import { Button } from '../components/Button';

interface ShopViewProps {
  playerState: PlayerState;
  onPurchase: (artifact: Artifact, discountedPrice: number) => void;
  onReroll: () => void;
  onNext: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ playerState, onPurchase, onReroll, onNext }) => {
  const [shopItems, setShopItems] = useState<Artifact[]>([]);

  const refreshShop = () => {
     const shuffled = [...ARTIFACTS].filter(a => a.rarity !== 'CURSED').sort(() => 0.5 - Math.random());
     setShopItems(shuffled.slice(0, 3));
  };

  useEffect(() => {
    refreshShop();
  }, []);

  const handleRerollClick = () => {
    if (playerState.money >= REROLL_COST) {
      onReroll();
      refreshShop();
    }
  };

  return (
    <div className="w-full h-full flex flex-row overflow-hidden relative shadow-inner">
      
      {/* LEFT: Shop Shelf Area (Takes up majority of space) */}
      <div className="flex-1 flex flex-col p-6 relative z-10 h-full">
        {/* Header */}
        <header className="shrink-0 flex justify-between items-end border-b-4 border-black/20 pb-4 mb-4">
            <div>
            <h2 className="text-5xl font-display text-black mb-0 uppercase tracking-tighter drop-shadow-sm">
                암시장 <span className="text-2xl text-red-800 font-serif italic ml-2">Black Market</span>
            </h2>
            <p className="text-gray-600 font-serif text-sm mt-1">
                {playerState.shopDiscount > 0 && <span className="text-emerald-700 font-bold underline decoration-wavy decoration-emerald-500">(VIP -{Math.round(playerState.shopDiscount * 100)}% 할인)</span>}
            </p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
                <Button 
                    variant="secondary" 
                    size="md" 
                    onClick={handleRerollClick}
                    disabled={playerState.money < REROLL_COST}
                    className="font-mono text-xs shadow-md"
                >
                    [물건 갱신] ₩ {REROLL_COST.toLocaleString()}
                </Button>
            </div>
        </header>

        {/* Shelf Grid - Fills remaining height */}
        <div className="flex-1 min-h-0 pb-16"> {/* pb-16 for next button space */}
            <div className="h-full bg-felt shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] border-8 border-[#3d2b1f] p-8 rounded-xl flex items-center justify-center">
                <div className="w-full h-full grid grid-cols-3 gap-6">
                    {shopItems.map((item) => {
                        const discountedPrice = Math.floor(item.price * (1 - playerState.shopDiscount));
                        const canAfford = playerState.money >= discountedPrice;
                        const alreadyOwned = playerState.inventory.some(i => i.id === item.id);
                        
                        return (
                        <div key={item.id} className="relative group w-full h-full">
                            <ArtifactCard
                                artifact={{...item, price: discountedPrice}}
                                showPrice
                                variant="default" // Large card
                                disabled={!canAfford || alreadyOwned}
                                onClick={() => {
                                    if(canAfford && !alreadyOwned) onPurchase(item, discountedPrice);
                                }}
                            />
                            {alreadyOwned && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 font-display text-red-500 text-4xl -rotate-12 border-4 border-red-500 p-4 m-8 pointer-events-none box-shadow-hard">
                                    SOLD OUT
                                </div>
                            )}
                        </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>

      {/* RIGHT: Inventory Sidebar (Hearthstone style) */}
      <div className="w-80 bg-[#1a1a1a] border-l-4 border-[#333] flex flex-col shadow-2xl z-20">
        <div className="p-4 bg-[#222] border-b border-[#444] shrink-0">
             <h3 className="text-lg font-display text-[#e5e5e5] flex items-center gap-2 uppercase tracking-wider">
               <span>💼</span> 내 가방
             </h3>
             <div className="text-xs text-gray-500 mt-1">
                보유한 유물 ({playerState.inventory.length})
             </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-[#111]">
            {playerState.inventory.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-[#444] text-xs font-mono border-2 border-dashed border-[#333] m-2">
                    [가방이 비어있습니다]
                </div>
            ) : (
                playerState.inventory.map(item => (
                    <ArtifactCard key={item.id} artifact={item} variant="list" />
                ))
            )}
        </div>
      </div>

      {/* Floating Next Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <Button variant="gold" size="lg" onClick={onNext} className="shadow-2xl text-xl px-12 py-4 border-4">
          패독으로 이동 &gt;
        </Button>
      </div>

    </div>
  );
};