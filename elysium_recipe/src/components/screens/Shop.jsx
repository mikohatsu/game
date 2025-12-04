import { materials } from '../../data/materials';

export function Shop({ gameState, onBuyMaterial }) {
  const shopMaterials = materials.filter(m => m.tier <= 2);

  const canAfford = (price) => gameState.gold >= price;

  return (
    <div className="game-card">
      <h2 className="text-xl font-bold mb-4">🛒 암시장</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopMaterials.map(mat => (
          <div key={mat.id} className="p-4 bg-gray-700/50 rounded">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{mat.icon}</span>
              <div>
                <div className="font-bold">{mat.name}</div>
                <div className="text-sm text-yellow-400">{mat.basePrice}G</div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-3">{mat.description}</p>
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
