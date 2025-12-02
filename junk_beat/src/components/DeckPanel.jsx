export default function DeckPanel({ deckList, cardLibrary }) {
  return (
    <div className="panel">
      <p className="section-title">덱 구성</p>
      <div className="deck-list">
        {deckList.map((cardId, idx) => (
          <div key={`${cardId}-${idx}`} className="deck-item">
            <span><strong>{cardLibrary[cardId].name}</strong> · {cardLibrary[cardId].type}</span>
            <span>{cardLibrary[cardId].desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
