import { cardLibrary } from '../data/cards'
import { glossary } from '../data/glossary'
import { useMemo, useState } from 'react'
import Card from './Card'

export default function RewardModal({ reward, onChoice, onSelectCard, onFuseTwo, onUpgrade, onRelic, deckList, cards }) {
  const [fusionPick, setFusionPick] = useState([])
  const [upgradePick, setUpgradePick] = useState(null)

  const options = useMemo(() => {
    if (!reward) return []
    const arr = [{ key: 'card', label: '카드 추가' }]
    if (reward.fusionReady) arr.push({ key: 'fusion', label: '융합 (4턴마다)' })
    if (reward.upgradeReady) arr.push({ key: 'upgrade', label: '강화 (3턴마다)' })
    if (reward.relicOptions?.length) arr.push({ key: 'relic', label: '유물 획득' })
    return arr
  }, [reward])

  if (!reward) return null

  const renderChoice = () => (
    <div className="reward-grid">
      {options.map((opt) => (
        <button key={opt.key} className="btn" onClick={() => onChoice(opt.key)}>
          {opt.label}
        </button>
      ))}
    </div>
  )

  const renderAdd = () => (
    <div className="reward-grid">
      {(reward.cardOffers || []).map((id) => (
        <div key={id} className="card-offer" onClick={() => onSelectCard(id)}>
          <Card card={cards[id]} disabled={false} onPlay={() => onSelectCard(id)} />
        </div>
      ))}
    </div>
  )

  const renderFusion = () => (
    <div className="fusion-list">
      <div className="hint">두 장을 선택해 하나로 융합합니다. 왼쪽 카드 이름이 상속됩니다.</div>
      <div className="hint">선택: {fusionPick.map((id) => cards[id]?.name).join(' / ') || '없음'}</div>
      {deckList.map((id, idx) => (
        <div
          key={`${id}-${idx}`}
          className={`fusion-item ${fusionPick.includes(id) ? 'active' : ''}`}
          onClick={() => {
            if (fusionPick.length === 0) setFusionPick([id])
            else if (fusionPick.length === 1) {
              onFuseTwo(fusionPick[0], id)
              setFusionPick([])
            }
          }}
        >
          <span>{cards[id]?.name || id}</span>
        </div>
      ))}
    </div>
  )

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
