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
      <div className="energy-row">
        <div style={{ fontWeight: 700, color: 'var(--energy)' }}>에너지</div>
        {new Array(3).fill(0).map((_, idx) => (
          <div key={idx} className={`energy-orb ${idx < energy ? '' : 'off'}`} />
        ))}
        <div className="badge">HP {player.hp}/{player.maxHp}</div>
        <div className="badge">실드 {player.block}</div>
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
