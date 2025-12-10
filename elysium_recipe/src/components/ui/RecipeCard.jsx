const tierClassMap = {
  1: 'tome-tier-1',
  2: 'tome-tier-2',
  3: 'tome-tier-3',
  4: 'tome-tier-4',
  5: 'tome-tier-5',
};

export function RecipeCard({ recipe, onViewDetails }) {
  const tierClass = tierClassMap[recipe.tier] || 'tome-tier-1';

  return (
    <div className={`tome-card ${tierClass}`} onClick={onViewDetails}>
      <div className="tome-icon">📖</div>
      <div className="tome-info">
        <div className="tome-name">{recipe.name}</div>
        <div className="tome-tier-label">Tier {recipe.tier}</div>
      </div>
      <div className="tome-arrow">→</div>
    </div>
  );
}
