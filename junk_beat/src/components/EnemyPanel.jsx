import FloatingText from './FloatingText'

const StatusPills = ({ statuses }) => (
  <div className="status-row">
    {Object.entries(statuses)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => (
        <div className="status-pill" key={k}>
          <strong>{k}</strong> {v}
        </div>
      ))}
  </div>
)

const PatternBar = ({ currentStep, total }) => (
  <div className="pattern-bar">
    <div className="pattern-progress" style={{ width: `${((currentStep + 1) / total) * 100}%` }} />
  </div>
)

export default function EnemyPanel({ enemy, currentIntent, intentStep, floating }) {
  return (
    <div className="panel">
      <p className="section-title">적 위협</p>
      <div className="enemy-wrap">
        <div className="enemy-card pulse">
          <img src={enemy.asset} alt={enemy.name} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{enemy.name}</strong>
            <span style={{ color: '#ff8aa7' }}>{currentIntent.note}</span>
          </div>
          <div className="hp-bar" aria-label="enemy-hp">
            <div className="hp-fill" style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} />
          </div>
          <div className="shield-overlay">
            <span>HP {enemy.hp}/{enemy.maxHp}</span>
            <span>| 실드 {enemy.block || 0}</span>
          </div>
          <div className="pattern-chip">다음 행동: {currentIntent.intent}</div>
          <PatternBar currentStep={intentStep} total={enemy.pattern.length} />
          <StatusPills statuses={enemy.statuses} />
        </div>
      </div>
      <div className="float-container">
        {floating
          .filter((f) => f.side === 'enemy')
          .map((f) => (
            <FloatingText key={f.id} tone={f.tone}>
              {f.value}
            </FloatingText>
          ))}
      </div>
    </div>
  )
}
