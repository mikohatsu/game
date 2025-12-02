import { intentGlossary } from '../data/glossary'

export function Timeline({ timeline }) {
  return (
    <div>
      <p className="section-title">패턴</p>
      <div className="timeline">
        {timeline.map((item, idx) => (
          <div key={idx} className="timeline-chip" title={item.detail || intentGlossary[item.intent]?.desc}>
            {item.active ? '▶ ' : ''}
            {item.label}
            <div className="timeline-sub">
              {item.detail || intentGlossary[item.intent]?.desc || '행동 정보 없음'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Log({ log }) {
  return (
    <div>
      <p className="section-title" style={{ marginTop: 12 }}>전투 로그</p>
      <div className="log">
        {log.map((entry, idx) => (
          <div key={idx} className="log-entry">{entry}</div>
        ))}
      </div>
    </div>
  )
}
