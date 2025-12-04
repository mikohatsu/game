import { UpgradeCard } from '../ui/UpgradeCard';
import { getUpgradesByCategory } from '../../data/upgrades';

export function Upgrades({ gameState, onPurchaseUpgrade }) {
  const categories = [
    { id: 'equipment', title: '🔧 실험 장비' },
    { id: 'archive', title: '📚 도서관' },
    { id: 'environment', title: '🌱 실험실 환경' },
  ];

  const isUpgradePurchased = (upgradeId) => {
    return gameState.purchasedUpgrades.includes(upgradeId);
  };

  const canAffordUpgrade = (cost) => {
    return gameState.gold >= cost;
  };

  return (
    <div className="space-y-4">
      {categories.map(category => (
        <div key={category.id} className="game-card">
          <h2 className="text-xl font-bold mb-4">{category.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getUpgradesByCategory(category.id).map(upgrade => (
              <UpgradeCard
                key={upgrade.id}
                upgrade={upgrade}
                isPurchased={isUpgradePurchased(upgrade.id)}
                canAfford={canAffordUpgrade(upgrade.cost)}
                onPurchase={() => onPurchaseUpgrade(upgrade.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
