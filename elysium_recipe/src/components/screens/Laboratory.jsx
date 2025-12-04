import { ParameterSlider } from '../ui/ParameterSlider';
import { ItemCard } from '../ui/ItemCard';
import { materials } from '../../data/materials';
import { recipes } from '../../data/recipes';
import { mutations } from '../../data/mutations';

export function Laboratory({
  gameState,
  selectedMat1,
  selectedMat2,
  temperature,
  pressure,
  concentration,
  onMat1Change,
  onMat2Change,
  onTemperatureChange,
  onPressureChange,
  onConcentrationChange,
  onSynthesis,
  onSellItem,
}) {
  const getInventoryItems = () => {
    return Object.entries(gameState.inventory)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => {
        const item = materials.find(m => m.id === id)
          || recipes.find(r => r.id === id)
          || mutations.find(m => m.id === id);
        return { id, count, item };
      });
  };

  const inventoryItems = getInventoryItems();
  const canSynthesis = gameState.ap >= 2 && selectedMat1 && selectedMat2;

  const getMaterial = (id) => {
    if (!id) return null;
    return inventoryItems.find(item => item.id === id);
  };

  const mat1Data = getMaterial(selectedMat1);
  const mat2Data = getMaterial(selectedMat2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 조합 인터페이스 */}
      <div className="game-card space-y-4">
        <h2 className="text-xl font-bold text-center">🧪 연금술 조합</h2>

        {/* 가로 레이아웃: 재료 선택 + 화로 */}
        <div className="flex items-center justify-center gap-4 py-6">
          {/* 재료 1 */}
          <div className="flex-1 max-w-[200px]">
            <label className="text-xs text-gray-400 block mb-2 text-center">재료 1</label>
            <div className="relative">
              <select
                value={selectedMat1 || ''}
                onChange={(e) => onMat1Change(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
              >
                <option value="">선택</option>
                {inventoryItems.map(({ id, count, item }) => (
                  <option key={id} value={id}>
                    {item?.icon} {item?.name} (x{count})
                  </option>
                ))}
              </select>
              {mat1Data && (
                <div className="mt-2 p-3 bg-gray-800 rounded-lg border-2 border-copper text-center material-selected">
                  <div className="text-3xl mb-1">{mat1Data.item?.icon}</div>
                  <div className="text-xs text-gray-300">{mat1Data.item?.name}</div>
                </div>
              )}
            </div>
          </div>

          {/* 화로 중앙 */}
          <div className="flex flex-col items-center gap-2">
            <div className="furnace-container">
              <svg width="80" height="100" viewBox="0 0 80 100" className="furnace-svg">
                {/* 화로 몸체 */}
                <defs>
                  <linearGradient id="furnaceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B4513" />
                    <stop offset="100%" stopColor="#5C3317" />
                  </linearGradient>
                  <radialGradient id="fireGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="50%" stopColor="#FF8C00" />
                    <stop offset="100%" stopColor="#FF4500" />
                  </radialGradient>
                </defs>

                {/* 화로 받침 */}
                <rect x="10" y="80" width="60" height="15" fill="#3D2817" rx="2" />

                {/* 화로 몸체 */}
                <path
                  d="M 15 80 L 20 35 L 60 35 L 65 80 Z"
                  fill="url(#furnaceGradient)"
                  stroke="#2A1810"
                  strokeWidth="2"
                />

                {/* 화로 문 */}
                <rect x="25" y="50" width="30" height="25" fill="#1A0F0A" rx="3" />
                <rect x="27" y="52" width="26" height="21" fill="#000" rx="2" />

                {/* 불꽃 효과 */}
                {(selectedMat1 && selectedMat2) && (
                  <>
                    <ellipse cx="40" cy="63" rx="10" ry="8" fill="url(#fireGradient)" className="flame flame-1" />
                    <ellipse cx="40" cy="60" rx="8" ry="10" fill="url(#fireGradient)" className="flame flame-2" opacity="0.8" />
                    <ellipse cx="40" cy="57" rx="5" ry="7" fill="#FFD700" className="flame flame-3" opacity="0.9" />
                  </>
                )}

                {/* 화로 테두리 장식 */}
                <circle cx="40" cy="30" r="3" fill="#B87333" />
                <rect x="37" y="25" width="6" height="5" fill="#B87333" />
              </svg>
            </div>
            <div className="text-xs text-center text-copper font-bold">
              {(selectedMat1 && selectedMat2) ? '🔥 준비 완료!' : '재료를 선택하세요'}
            </div>
          </div>

          {/* 재료 2 */}
          <div className="flex-1 max-w-[200px]">
            <label className="text-xs text-gray-400 block mb-2 text-center">재료 2</label>
            <div className="relative">
              <select
                value={selectedMat2 || ''}
                onChange={(e) => onMat2Change(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
              >
                <option value="">선택</option>
                {inventoryItems.map(({ id, count, item }) => (
                  <option key={id} value={id}>
                    {item?.icon} {item?.name} (x{count})
                  </option>
                ))}
              </select>
              {mat2Data && (
                <div className="mt-2 p-3 bg-gray-800 rounded-lg border-2 border-copper text-center material-selected">
                  <div className="text-3xl mb-1">{mat2Data.item?.icon}</div>
                  <div className="text-xs text-gray-300">{mat2Data.item?.name}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 파라미터 조절 */}
        <div className="space-y-4 pt-4 border-t border-gray-700">
          <ParameterSlider
            label="온도 (Temperature)"
            value={temperature}
            min={0}
            max={1000}
            step={1}
            unit="°C"
            onChange={onTemperatureChange}
          />
          <ParameterSlider
            label="압력 (Pressure)"
            value={pressure}
            min={0.1}
            max={10}
            step={0.1}
            unit=" atm"
            onChange={onPressureChange}
          />
          <ParameterSlider
            label="농도 (Concentration)"
            value={concentration}
            min={0}
            max={100}
            step={1}
            unit="%"
            onChange={onConcentrationChange}
          />
        </div>

        <button
          onClick={onSynthesis}
          disabled={!canSynthesis}
          className="btn-primary w-full mt-4"
        >
          ⚗️ 조합 실행 (2 AP)
        </button>
      </div>

      {/* 인벤토리 */}
      <div className="game-card">
        <h2 className="text-xl font-bold mb-4">📦 인벤토리</h2>
        <div className="inventory-wrapper">
          <div className="inventory-grid">
            {inventoryItems.map(({ id, count, item }) => {
              const canSell = recipes.find(r => r.id === id) || mutations.find(m => m.id === id);
              return (
                <ItemCard
                  key={id}
                  item={item}
                  count={count}
                  canSell={!!canSell}
                  onSell={() => onSellItem(id, 1)}
                />
              );
            })}
            {inventoryItems.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-8">
                인벤토리가 비어있습니다
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
