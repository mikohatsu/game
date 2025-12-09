export function RecipeCard({ recipe, onViewDetails }) {
  return (
    <div className="relic-panel">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{recipe.icon}</span>
        <div>
          <div className="font-bold">{recipe.name}</div>
          <div className="text-xs text-gray-400">Tier {recipe.tier}</div>
        </div>
      </div>
      <div className="relic-divider" />
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="btn-secondary w-full text-xs"
        >
          단서 보기
        </button>
      )}
    </div>
  );
}
