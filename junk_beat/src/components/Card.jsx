export default function Card({ card, disabled, onPlay }) {
  return (
    <div className={`card ${disabled ? 'disabled' : ''}`} onClick={!disabled ? onPlay : undefined}>
      <div className="card-energy">{card.energy}</div>
      <div className="card-type">{card.type}</div>
      <div className="card-title">{card.name}</div>
      <div className="card-desc">{card.desc}</div>
      <div className="card-tooltip">호버 시 툴팁: 카드 효과 확인</div>
      <div className="card-surface" />
    </div>
  )
}
