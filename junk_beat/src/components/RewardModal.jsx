import { cardLibrary } from '../data/cards'
import { glossary } from '../data/glossary'
import Card from './Card'

export default function RewardModal({ reward, onChoice, onSelectCard, onFuse, deckList }) {
  if (!reward) return null

  const renderChoice = () => (
    <div className="reward-grid">
      <button className="btn" onClick={() => onChoice('fusion')}>카드 융합</button>
      <button className="btn" onClick={() => onChoice('add')}>카드 추가</button>
      <button className="btn secondary" onClick={() => onChoice('rest')}>휴식</button>
    </div>
  )

  const renderAdd = () => (
    <div className="reward-grid">
      {reward.offers.map((id) => (
        <div key={id} className="card-offer" onClick={() => onSelectCard(id)}>
          <Card card={cardLibrary[id]} disabled={false} onPlay={() => onSelectCard(id)} />
        </div>
      ))}
    </div>
  )

  const renderFusion = () => (
    <div className="fusion-list">
      {deckList.map((id, idx) => (
        <div key={`${id}-${idx}`} className="fusion-item" onClick={() => onFuse(id)}>
          <span>{cardLibrary[id]?.name || id}</span>
        </div>
      ))}
      <div className="hint">업그레이드 가능한 기본 카드만 융합됩니다.</div>
    </div>
  )

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>전투 보상</h3>
        <p className="section-title">기계 잔해에서 선택</p>
        {reward.stage === 'choice' && renderChoice()}
        {reward.stage === 'add' && renderAdd()}
        {reward.stage === 'fusion' && renderFusion()}
        <div className="glossary-row">
          {Object.entries(glossary).map(([key, val]) => (
            <span key={key} className="glossary-chip" style={{ borderColor: val.color }}>
              {val.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
