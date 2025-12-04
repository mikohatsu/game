import { materials } from '../../data/materials';
import { recipes } from '../../data/recipes';

export function RecipeDetail({ recipe }) {
  const getIngredientName = (id) => {
    const item = materials.find(m => m.id === id) || recipes.find(r => r.id === id);
    return item ? `${item.icon} ${item.name}` : id;
  };

  return (
    <div className="p-4 bg-purple-500/20 border border-purple-500 rounded space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{recipe.icon}</span>
        <div>
          <h3 className="text-xl font-bold">{recipe.name}</h3>
          <p className="text-sm text-gray-400">Tier {recipe.tier}</p>
        </div>
      </div>

      <div>
        <strong>재료:</strong> {recipe.ingredients.map(getIngredientName).join(' + ')}
      </div>

      <div>
        <strong>단서:</strong>
        <div className="mt-2 p-3 bg-gray-900/50 rounded text-sm space-y-1">
          {recipe.clues.map((clue, i) => (
            <p key={i} className="italic">{clue}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
