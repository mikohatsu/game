import Card from './Card'

export default function Hand({ hand, cardLibrary, energy, onPlayCard }) {
  return (
    <div className="panel" style={{ marginTop: 16 }}>
      <p className="section-title">핸드</p>
      <div className="hand">
        {hand.length === 0 && <div style={{ color: 'var(--text-sub)' }}>카드를 뽑아 플레이하세요.</div>}
        {hand.map((cardId, idx) => {
          const card = cardLibrary[cardId]
          const blocked = energy < card.energy
          return <Card key={`${cardId}-${idx}`} cardId={cardId} card={card} disabled={blocked} onPlay={() => onPlayCard(cardId, idx)} />
        })}
      </div>
    </div>
  )
}
