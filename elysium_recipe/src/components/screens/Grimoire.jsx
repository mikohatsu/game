import { recipes } from '../../data/recipes';
import { getGradeColor } from '../../utils/gameLogic';

export function Grimoire({ gameState, onLoadParams }) {
  const grimoireEntries = Object.values(gameState.grimoire);

  const getRecipeById = (id) => recipes.find(r => r.id === id);

  return (
    <div className="game-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">📖 연금술 비망록</h2>
          <p className="text-xs text-gray-400">성공한 조합을 석판 위에 새기고, 다시 불러옵니다.</p>
        </div>
        <span className="relic-note">Click = 설정 로드</span>
      </div>
      <div className="space-y-3">
        {grimoireEntries.map(entry => {
          const recipe = getRecipeById(entry.recipeId);
          if (!recipe) return null;

          return (
            <div key={entry.recipeId} className="relic-panel">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{recipe.icon}</span>
                  <div>
                    <div className="font-bold">{recipe.name}</div>
                    <div className="text-xs text-gray-400">Tier {recipe.tier}</div>
                  </div>
                </div>
                <div className={`grade-badge ${getGradeColor(entry.bestGrade)}`}>
                  {entry.bestGrade}
                </div>
              </div>
              <div className="relic-divider" />

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="text-gray-400">온도</div>
                  <div className="font-mono">{entry.bestParams.temperature}°C</div>
                </div>
                <div>
                  <div className="text-gray-400">압력</div>
                  <div className="font-mono">{entry.bestParams.pressure.toFixed(1)} atm</div>
                </div>
                <div>
                  <div className="text-gray-400">농도</div>
                  <div className="font-mono">{entry.bestParams.concentration}%</div>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-400">
                편차율: {entry.bestDeviation.toFixed(2)}%
              </div>

              <button
                onClick={() => onLoadParams(entry.bestParams)}
                className="btn-secondary w-full mt-3 text-sm"
              >
                이 설정으로 조합하기
              </button>
            </div>
          );
        })}
        {grimoireEntries.length === 0 && (
          <p className="text-center text-gray-400 py-8">아직 성공한 레시피가 없습니다</p>
        )}
      </div>
    </div>
  );
}
