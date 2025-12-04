import { RecipeCard } from '../ui/RecipeCard';
import { RecipeDetail } from '../ui/RecipeDetail';
import { recipes } from '../../data/recipes';

export function Archive({ gameState, onExploration, selectedRecipe, onSelectRecipe }) {
  const explorationCost = gameState.purchasedUpgrades.includes('arc_lv3') ? 2 : 3;
  const canExplore = gameState.ap >= explorationCost;
  const currentTier = gameState.week >= 3 ? 3 : gameState.week >= 2 ? 2 : 1;

  const discoveredRecipes = recipes.filter(r => gameState.discoveredRecipes[r.id]);

  return (
    <div className="game-card">
      <h2 className="text-xl font-bold mb-4">📚 고대 도서관</h2>
      <div className="space-y-4">
        {/* 탐사 인터페이스 */}
        <div className="p-4 bg-gray-800/50 rounded">
          <p className="mb-3">새로운 레시피의 단서를 찾기 위해 도서관을 탐색합니다.</p>
          <p className="text-sm text-gray-400 mb-3">
            • 현재 주차: {gameState.week}주차 (Tier {currentTier} 레시피 발견 가능)
          </p>
          <button
            onClick={onExploration}
            disabled={!canExplore}
            className="btn-primary"
          >
            🔍 탐사하기 ({explorationCost} AP)
          </button>
        </div>

        {/* 선택된 레시피 상세정보 */}
        {selectedRecipe && (
          <RecipeDetail recipe={selectedRecipe} />
        )}

        {/* 발견한 레시피 목록 */}
        <div>
          <h3 className="text-lg font-bold mb-3">발견한 레시피</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {discoveredRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onViewDetails={() => onSelectRecipe(recipe)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
