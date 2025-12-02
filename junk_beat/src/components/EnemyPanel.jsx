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

const PatternList = ({ pattern, currentStep }) => (
  <div className="pattern-list">
    {pattern.map((step, idx) => (
      <div key={idx} className={`pattern-item ${idx === currentStep ? 'active' : ''}`}>
        <div className="pattern-title">
          {idx === currentStep && '▶ '} {step.note}
        </div>
        <div className="pattern-desc">{step.desc}</div>
      </div>
    ))}
    <div className="pattern-meta">패턴 단계 {currentStep + 1}/{pattern.length}</div>
  </div>
)

export default function EnemyPanel({ enemy, currentIntent, intentStep, floating }) {
  const currentSummary = (() => {
    if (!currentIntent) return ''
    if (currentIntent.intent === 'single') return `단일 피해 ${currentIntent.damage}`
    if (currentIntent.intent === 'multi') return `연속 ${currentIntent.hits}회 × ${currentIntent.damage} 피해`
    if (currentIntent.intent === 'buff') return `실드 ${currentIntent.block}`
    if (currentIntent.intent === 'charge') return `강력 단일 피해 ${currentIntent.damage}`
    if (currentIntent.intent === 'fortify') return `실드 대량 ${currentIntent.block}`
    if (currentIntent.intent === 'zap') return `감전 피해 ${currentIntent.damage}`
    if (currentIntent.intent === 'heal') return `자가 수복 ${currentIntent.heal}`
    return currentIntent.note
  })()

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
            <span className="hp-label">HP {enemy.hp}/{enemy.maxHp}</span>
            <span className="shield-label">실드 {enemy.block || 0}</span>
          </div>
          <div className="pattern-chip">다음 행동: {currentIntent.note} · {currentSummary}</div>
          <PatternList pattern={enemy.pattern} currentStep={intentStep} />
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
