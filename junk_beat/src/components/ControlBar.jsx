export default function ControlBar({ onEndTurn, onRestart, onSwitchEnemy }) {
  return (
    <div className="controls">
      <button className="btn" onClick={onEndTurn}>턴 종료 / 적 행동</button>
      <button className="btn secondary" onClick={onRestart}>전투 재시작</button>
      <button className="btn secondary" onClick={onSwitchEnemy}>적 교체</button>
    </div>
  )
}
