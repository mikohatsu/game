export function RecipeCard({ recipe, onViewDetails }) {
  return (
    <div className="p-3 bg-gray-700/50 rounded">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{recipe.icon}</span>
        <div>
          <div className="font-bold">{recipe.name}</div>
          <div className="text-xs text-gray-400">Tier {recipe.tier}</div>
        </div>
      </div>
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
