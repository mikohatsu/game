import { materials } from '../../data/materials';

export function Shop({ gameState, onBuyMaterial }) {
  const shopMaterials = materials.filter(m => m.tier <= 2);

  const canAfford = (price) => gameState.gold >= price;

  return (
    <div className="game-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">🛒 암시장</h2>
          <p className="text-xs text-gray-400">청동 상인들이 들고 온 잔뜩 먼지 쌓인 재료 상자</p>
        </div>
        <span className="relic-note">Click = 구매</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopMaterials.map(mat => (
          <div key={mat.id} className="relic-panel">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{mat.icon}</span>
              <div>
                <div className="font-bold">{mat.name}</div>
                <div className="text-sm relic-price">{mat.basePrice}G</div>
              </div>
            </div>
            <div className="relic-divider" />
            <p className="text-xs text-gray-300 mb-3 leading-relaxed">{mat.description}</p>
            <button
              onClick={() => onBuyMaterial(mat.id)}
              disabled={!canAfford(mat.basePrice)}
              className="btn-primary w-full text-sm"
            >
              구매
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
