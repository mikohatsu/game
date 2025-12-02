import EnemyPanel from './components/EnemyPanel'
import PlayerPanel from './components/PlayerPanel'
import Hand from './components/Hand'
import { Timeline, Log } from './components/TimelineLog'
import DeckPanel from './components/DeckPanel'
import ControlBar from './components/ControlBar'
import RewardModal from './components/RewardModal'
import { useGameEngine } from './hooks/useGameEngine'
import './App.css'

export default function App() {
  const {
    cardLibrary,
    deckList,
    reward,
    hand,
    energy,
    turn,
    player,
    enemy,
    log,
    floating,
    currentIntent,
    timeline,
    onPlayCard,
    endTurn,
    restart,
    switchEnemy,
    handleRewardChoice,
    addCardToCollection,
    fuseCard,
  } = useGameEngine()

  return (
    <div className="app-shell">
      <div className="hero">
        <div>
          <h1>Junk Beat</h1>
          <div className="badge">디스토피아 스크랩 필드 · 기계 반란 생존</div>
        </div>
        <div className="badge">Turn {turn}</div>
      </div>

      <div className="grid">
        <EnemyPanel enemy={enemy} currentIntent={currentIntent} intentStep={timeline.findIndex((t) => t.active)} floating={floating} />
        <PlayerPanel player={player} energy={energy} floating={floating} />
      </div>

      <Hand hand={hand} cardLibrary={cardLibrary} energy={energy} onPlayCard={onPlayCard} />
      <ControlBar onEndTurn={endTurn} onRestart={restart} onSwitchEnemy={switchEnemy} />

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="panel">
          <Timeline timeline={timeline} />
          <Log log={log} />
        </div>
        <DeckPanel deckList={deckList} cardLibrary={cardLibrary} />
      </div>

      <RewardModal
        reward={reward}
        deckList={deckList}
        onChoice={handleRewardChoice}
        onSelectCard={addCardToCollection}
        onFuse={fuseCard}
      />
    </div>
  )
}
