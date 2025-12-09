export function UpgradeCard({ upgrade, isPurchased, canAfford, onPurchase }) {
  return (
    <div className={`relic-panel upgrade-panel ${isPurchased ? 'upgrade-purchased' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{upgrade.icon}</span>
        <div>
          <div className="font-bold">{upgrade.name}</div>
          <div className="text-sm relic-price">{upgrade.cost}G</div>
        </div>
      </div>

      <div className="relic-divider" />

      <p className="text-xs text-gray-300 mb-2 leading-relaxed">{upgrade.description}</p>
      <p className="text-sm mb-3 text-gray-200">
        <strong>효과:</strong> {upgrade.effect}
      </p>

      {isPurchased ? (
        <div className="upgrade-state">✓ 구매 완료</div>
      ) : (
        <button
          onClick={onPurchase}
          disabled={!canAfford}
          className="btn-primary w-full text-sm"
        >
          구매하기
        </button>
      )}
    </div>
  );
}
