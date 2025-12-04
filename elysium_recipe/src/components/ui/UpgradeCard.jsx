export function UpgradeCard({ upgrade, isPurchased, canAfford, onPurchase }) {
  return (
    <div className={`p-4 rounded ${
      isPurchased
        ? 'bg-green-500/20 border border-green-500'
        : 'bg-gray-700/50'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{upgrade.icon}</span>
        <div>
          <div className="font-bold">{upgrade.name}</div>
          <div className="text-sm text-yellow-400">{upgrade.cost}G</div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-2">{upgrade.description}</p>
      <p className="text-sm mb-3">
        <strong>효과:</strong> {upgrade.effect}
      </p>

      {isPurchased ? (
        <div className="text-green-400 font-bold text-center">✓ 구매 완료</div>
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
