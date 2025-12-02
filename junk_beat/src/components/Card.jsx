import { glossary } from '../data/glossary'

const extractKeywords = (desc) => {
  const pairs = []
  if (desc.includes('방해')) pairs.push('jammed')
  if (desc.includes('취약')) pairs.push('vulnerable')
  if (desc.includes('열')) pairs.push('heat')
  if (desc.includes('실드')) pairs.push('block')
  if (desc.includes('부스트')) pairs.push('boost')
  return pairs
}

const rarityClass = (rarity) => {
  if (rarity === 'rare') return 'card-rare'
  if (rarity === 'uncommon') return 'card-uncommon'
  if (rarity === 'upgrade') return 'card-upgrade'
  return 'card-common'
}

export default function Card({ card, disabled, onPlay }) {
  const keywords = extractKeywords(card.desc || '')
  const lines = (card.desc || '').split(/\n|,/).map((t) => t.trim())
  return (
    <div className={`card ${disabled ? 'disabled' : ''} ${rarityClass(card.rarity)}`} onClick={!disabled ? onPlay : undefined}>
      <div className="card-energy">{card.energy}</div>
      <div className={`card-type ${card.type === '공격' ? 'type-attack' : card.type === '방어' ? 'type-방어' : 'type-부스트'}`}>
        {card.type}
      </div>
      <div className="card-title">{card.name}</div>
      <div className="card-desc">{lines.map((line, idx) => <div key={idx}>{line}</div>)}</div>
      <div className="card-tooltip">
        {keywords.length === 0 && <span>효과를 확인하세요</span>}
        {keywords.map((key) => (
          <div key={key} className="keyword-row">
            <span style={{ color: glossary[key]?.color || '#fff' }}>{glossary[key]?.label || key}</span> · {glossary[key]?.desc}
          </div>
        ))}
      </div>
      <div className="card-surface" />
    </div>
  )
}
