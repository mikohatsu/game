import { useEffect, useMemo, useState } from 'react'
import Card from './Card'

export default function RewardModal({ reward, onChoice, onSelectCard, onFuseTwo, onUpgrade, onRelic, deckList, cards }) {
  const [fusionPick, setFusionPick] = useState([])
  const [upgradePick, setUpgradePick] = useState(null)

  useEffect(() => {
    setFusionPick([])
    setUpgradePick(null)
  }, [reward?.stage])

  const options = useMemo(() => {
    if (!reward) return []
    return [
      { key: 'card', label: '카드 추가', available: (reward.cardOffers || []).length > 0 },
      { key: 'fusion', label: '융합', available: reward.fusionReady && deckList.length > 1 },
      { key: 'upgrade', label: '강화', available: reward.upgradeReady && deckList.length > 0 },
      { key: 'relic', label: '유물 획득', available: (reward.relicOptions || []).length > 0 },
    ]
  }, [deckList.length, reward])

  if (!reward) return null

  const renderChoice = () => (
    <div className="reward-grid">
      {options.map((opt) => (
        <button key={opt.key} className="btn reward-choice" disabled={!opt.available} onClick={() => opt.available && onChoice(opt.key)}>
          <div className="choice-title">{opt.label}</div>
          {!opt.available ? <div className="choice-help">지금은 선택할 수 없습니다</div> : null}
        </button>
      ))}
    </div>
  )

  const renderAdd = () => (
    <div className="reward-grid">
      {(reward.cardOffers || []).map((id) => (
        <div key={id} className="card-offer" onClick={() => onSelectCard(id)}>
          <Card cardId={id} card={cards[id]} disabled={false} onPlay={() => onSelectCard(id)} />
        </div>
      ))}
    </div>
  )

  const renderFusion = () => {
    const selectedCards = fusionPick.map((idx) => deckList[idx]).map((id) => cards[id]?.name || id)
    const handlePick = (idx) => {
      if (fusionPick.includes(idx)) {
        setFusionPick((prev) => prev.filter((i) => i !== idx))
        return
      }
      if (fusionPick.length < 2) {
        const next = [...fusionPick, idx]
        setFusionPick(next)
      }
    }

    const confirm = () => {
      if (fusionPick.length === 2) {
        const [aIdx, bIdx] = fusionPick
        onFuseTwo(deckList[aIdx], deckList[bIdx])
        setFusionPick([])
      }
    }

    return (
      <div className="fusion-zone">
        <div className="fusion-slots">
          <div className="fusion-slot">
            <div className="slot-label">재료 1</div>
            <div className="slot-body">{selectedCards[0] || '비어 있음'}</div>
          </div>
          <div className="fusion-plus">+</div>
          <div className="fusion-slot">
            <div className="slot-label">재료 2</div>
            <div className="slot-body">{selectedCards[1] || '비어 있음'}</div>
          </div>
          <div className="fusion-arrow">→ 합성</div>
          <button className="btn fusion-confirm" disabled={fusionPick.length !== 2} onClick={confirm}>확인</button>
        </div>
        <div className="hint">동일 이름 카드도 각 장을 따로 선택할 수 있습니다.</div>
        <div className="fusion-list">
          {deckList.map((id, idx) => (
            <div
              key={`${id}-${idx}`}
              className={`fusion-item ${fusionPick.includes(idx) ? 'active' : ''}`}
              onClick={() => handlePick(idx)}
            >
              <span className="fusion-name">{cards[id]?.name || id}</span>
              <span className="fusion-copy">#{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderUpgrade = () => (
    <div className="fusion-list">
      <div className="hint">강화할 카드를 선택하세요.</div>
      {deckList.map((id, idx) => (
        <div
          key={`${id}-${idx}`}
          className={`fusion-item ${upgradePick === id ? 'active' : ''}`}
          onClick={() => {
            setUpgradePick(id)
            onUpgrade(id)
            setUpgradePick(null)
          }}
        >
          <span>{cards[id]?.name || id}</span>
        </div>
      ))}
    </div>
  )

  const renderRelic = () => (
    <div className="reward-grid">
      {(reward.relicOptions || []).map((rel) => (
        <button key={rel.id} className="btn" onClick={() => onRelic(rel.id)}>
          {rel.name} — {rel.desc}
        </button>
      ))}
    </div>
  )

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>전투 보상</h3>
        <p className="section-title">카드/융합/강화/유물 중 선택</p>
        {reward.stage === 'choice' && renderChoice()}
        {reward.stage === 'card' && renderAdd()}
        {reward.stage === 'fusion' && renderFusion()}
        {reward.stage === 'upgrade' && renderUpgrade()}
        {reward.stage === 'relic' && renderRelic()}
      </div>
    </div>
  )
}
