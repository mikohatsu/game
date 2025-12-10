import { useMemo, useState } from 'react';
import { materials } from '../../data/materials';

export function Shop({ gameState, onBuyMaterial, onBulkBuy }) {
  const shopMaterials = materials.filter(m => m.tier <= 2);
  const [selection, setSelection] = useState({});

  const toggleItem = (id) => {
    setSelection(prev => {
      const current = prev[id] || 0;
      if (current === 0) return { ...prev, [id]: 1 };
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const setQuantity = (id, quantity) => {
    const safeQty = Math.max(1, Math.min(99, Number(quantity) || 1));
    setSelection(prev => ({ ...prev, [id]: safeQty }));
  };

  const selectedList = useMemo(
    () => Object.entries(selection).map(([id, quantity]) => ({ id, quantity })),
    [selection]
  );

  const totalCost = useMemo(() => {
    return selectedList.reduce((sum, { id, quantity }) => {
      const mat = materials.find(m => m.id === id);
      return sum + (mat?.basePrice || 0) * quantity;
    }, 0);
  }, [selectedList]);

  const canAfford = (price) => gameState.gold >= price;
  const canBulkAfford = gameState.gold >= totalCost && selectedList.length > 0;

  const handleCheckout = () => {
    if (!canBulkAfford) return;
    onBulkBuy(selectedList);
    setSelection({});
  };

  return (
    <div className="game-card shop-layout">
      <div className="shop-hero">
        <div className="shop-merchant">
          <div className="merchant-glow" />
          <div className="merchant-figure">
            <div className="merchant-mask">🦂</div>
            <div className="merchant-body">
              <span>녹슨 상인</span>
              <small>“한 번에 담아가면 깎아주지.”</small>
            </div>
          </div>
        </div>
        <div className="shop-cart">
          <div className="shop-cart-header">
            <h2 className="text-lg font-bold">🛒 장바구니</h2>
            <span className="text-xs text-gray-400">선택한 재료를 한 번에 구매</span>
          </div>
          <div className="shop-cart-list">
            {selectedList.length === 0 && (
              <p className="text-sm text-gray-500">선택된 항목이 없습니다.</p>
            )}
            {selectedList.map(({ id, quantity }) => {
              const mat = materials.find(m => m.id === id);
              const itemCost = (mat?.basePrice || 0) * quantity;
              return (
                <div key={id} className="shop-cart-item">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{mat?.icon}</span>
                    <div>
                      <div className="font-bold text-sm">{mat?.name}</div>
                      <div className="text-xs text-gray-400">{quantity}개</div>
                    </div>
                  </div>
                  <div className="font-mono text-sm text-amber-300">{itemCost}G</div>
                </div>
              );
            })}
          </div>
          <div className="shop-cart-footer">
            <div className="text-sm text-gray-300">총액</div>
            <div className="shop-total">{totalCost}G</div>
          </div>
          <button
            className="btn-primary w-full"
            disabled={!canBulkAfford}
            onClick={handleCheckout}
          >
            선택한 것 구매하기
          </button>
        </div>
      </div>

      <div className="shop-grid">
        {shopMaterials.map(mat => {
          const selectedQty = selection[mat.id] || 0;
          const isSelected = selectedQty > 0;
          return (
            <div key={mat.id} className={`shop-card ${isSelected ? 'shop-card-selected' : ''}`}>
              <div className="shop-card-header">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{mat.icon}</span>
                  <div>
                    <div className="font-bold">{mat.name}</div>
                    <div className="text-sm relic-price">{mat.basePrice}G</div>
                  </div>
                </div>
                <button
                  className="shop-select"
                  onClick={() => toggleItem(mat.id)}
                >
                  {isSelected ? '해제' : '담기'}
                </button>
              </div>
              <div className="relic-divider" />
              <p className="text-xs text-gray-300 leading-relaxed mb-3">{mat.description}</p>
              {isSelected && (
                <div className="shop-qty">
                  <label className="text-xs text-gray-400">수량</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={selectedQty}
                    onChange={(e) => setQuantity(mat.id, e.target.value)}
                  />
                </div>
              )}
              <button
                onClick={() => onBuyMaterial(mat.id)}
                disabled={!canAfford(mat.basePrice)}
                className="btn-secondary w-full text-sm mt-2"
              >
                단일 구매
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
