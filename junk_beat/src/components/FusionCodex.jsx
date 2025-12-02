export default function FusionCodex({ open, onClose, recipes, discovered, cards }) {
  if (!open) return null
  const entries = Object.entries(recipes).map(([key, result]) => {
    const [a, b] = key.split('+')
    const unlocked = discovered.includes(key)
    return {
      key,
      a,
      b,
      result,
      unlocked,
    }
  })
  return (
    <div className="modal-backdrop">
      <div className="modal codex-modal">
        <div className="codex-head">
          <h3>조합표 도감</h3>
          <button className="btn secondary" onClick={onClose}>닫기</button>
        </div>
        <p className="section-title">발견한 조합은 활성화, 미발견은 ? 로 표시됩니다.</p>
        <div className="codex-grid">
          {entries.map((entry) => (
            <div key={entry.key} className={`codex-cell ${entry.unlocked ? '' : 'locked'}`}>
              <div className="codex-pair">
                <span>{entry.unlocked ? (cards[entry.a]?.name || entry.a) : '???'}</span>
                <span className="codex-plus">+</span>
                <span>{entry.unlocked ? (cards[entry.b]?.name || entry.b) : '???'}</span>
              </div>
              <div className="codex-result">
                {entry.unlocked ? (cards[entry.result]?.name || entry.result) : '???'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
