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

export default function PlayerPanel({ player, energy, floating }) {
  return (
    <div className="panel">
      <p className="section-title">오퍼레이터</p>
      <div className="hp-bar" aria-label="player-hp">
        <div className="hp-fill" style={{ width: `${(player.hp / player.maxHp) * 100}%`, background: 'linear-gradient(90deg, #6ae4ff, #53f29d)' }} />
      </div>
      <div className="shield-overlay">
        <span className="hp-label">HP {player.hp}/{player.maxHp}</span>
        <span className="shield-label">실드 {player.block}</span>
      </div>
      <div className="energy-row">
        <div style={{ fontWeight: 700, color: 'var(--energy)' }}>에너지</div>
        {new Array(3).fill(0).map((_, idx) => (
          <div key={idx} className={`energy-orb ${idx < energy ? '' : 'off'}`} />
        ))}
      </div>
      <StatusPills statuses={player.statuses} />
      <div className="float-container">
        {floating
          .filter((f) => f.side === 'player')
          .map((f) => (
            <FloatingText key={f.id} tone={f.tone}>
              {f.value}
            </FloatingText>
          ))}
      </div>
    </div>
  )
}
