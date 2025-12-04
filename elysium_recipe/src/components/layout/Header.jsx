import { getPollutionLevel, calculateRent } from '../../utils/gameLogic';

export function Header({ gameState }) {
  const pollutionLevel = getPollutionLevel(gameState.pollution);
  const nextRent = calculateRent(Math.ceil((gameState.day + 1) / 7));
  const isRentDay = gameState.day % 7 === 6;

  const getPollutionColor = (level) => {
    const colors = {
      0: '#22C55E',
      1: '#EAB308',
      2: '#F97316',
      3: '#DC2626',
    };
    return colors[level] || 'var(--color-sand-light)';
  };

  return (
    <div className="game-card">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2" style={{
            color: 'var(--color-ancient-gold)',
            textShadow: '0 2px 8px rgba(212, 175, 55, 0.5)'
          }}>
            <span style={{ filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))' }}>⚗️</span>
            엘리시움의 레시피
          </h1>
          <p className="text-sm mt-1" style={{
            color: 'var(--color-parchment-dark)',
            letterSpacing: '1px'
          }}>
            잊혀진 실험실의 유산
          </p>
        </div>

        <div className="stats-container">
          {/* Day/Week */}
          <div className="stat-box">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-label">Day / Week</div>
              <div className="stat-value">
                {gameState.day}일 / {gameState.week}주차
              </div>
            </div>
          </div>

          {/* Gold */}
          <div className="stat-box stat-gold">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-label">Gold</div>
              <div className="stat-value stat-value-gold">
                {gameState.gold}G
              </div>
            </div>
          </div>

          {/* AP with Progress Bar */}
          <div className="stat-box stat-ap">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-label">Action Points</div>
              <div className="stat-value stat-value-ap">
                {gameState.ap}/10
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill progress-ap"
                  style={{ width: `${(gameState.ap / 10) * 100}%` }}
                >
                  <div className="progress-glow"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Pollution with Progress Bar */}
          <div className="stat-box stat-pollution">
            <div className="stat-icon">☢️</div>
            <div className="stat-content">
              <div className="stat-label">오염도 (Lv.{pollutionLevel})</div>
              <div
                className="stat-value"
                style={{
                  color: getPollutionColor(pollutionLevel),
                  textShadow: `0 0 8px ${getPollutionColor(pollutionLevel)}80`
                }}
              >
                {gameState.pollution}/200
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill progress-pollution"
                  style={{
                    width: `${(gameState.pollution / 200) * 100}%`,
                    background: `linear-gradient(90deg, ${getPollutionColor(pollutionLevel)} 0%, ${getPollutionColor(pollutionLevel)}CC 100%)`
                  }}
                >
                  <div className="progress-glow"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isRentDay && (
        <div className="mt-4 p-4 rounded text-center" style={{
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(127, 29, 29, 0.15) 100%)',
          border: '2px solid #DC2626',
          boxShadow: '0 0 15px rgba(220, 38, 38, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
        }}>
          <span style={{
            color: '#FEE2E2',
            fontSize: '1.1rem',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
          }}>
            ⚠️ 내일 임대료 <strong style={{ color: 'var(--color-ancient-gold)' }}>{nextRent}G</strong> 납부일입니다!
          </span>
        </div>
      )}
    </div>
  );
}
