export default function DeckPanel({ deckList, cardLibrary, fusionSources }) {
  return (
    <div className="panel">
      <p className="section-title">덱 구성</p>
      <div className="deck-list">
        {deckList.map((cardId, idx) => (
          <div
            key={`${cardId}-${idx}`}
            className="deck-item"
            title={
              fusionSources?.[cardId]
                ? `재료: ${fusionSources[cardId].map((c) => cardLibrary[c]?.name || c).join(' + ')}`
                : ''
            }
          >
            <span><strong>{cardLibrary[cardId]?.name || cardId}</strong> · {cardLibrary[cardId]?.type}</span>
            <span>{cardLibrary[cardId]?.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
