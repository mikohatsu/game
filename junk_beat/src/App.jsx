import EnemyPanel from './components/EnemyPanel'
import PlayerPanel from './components/PlayerPanel'
import Hand from './components/Hand'
import { Timeline, Log } from './components/TimelineLog'
import DeckPanel from './components/DeckPanel'
import RewardModal from './components/RewardModal'
import { useGameEngine } from './hooks/useGameEngine'
import './App.css'

export default function App() {
  const {
    cards,
    deckList,
    fusionSources,
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
    nextEnemy,
    handleRewardChoice,
    addCardToCollection,
    fuseTwoCards,
    upgradeCard,
    gainArtifact,
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

      <Hand hand={hand} cardLibrary={cards} energy={energy} onPlayCard={onPlayCard} />
      <div className="controls">
        <button className="btn" onClick={endTurn}>턴 종료 / 적 행동</button>
        <button className="btn secondary" onClick={restart}>전투 재시작</button>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="panel">
          <Timeline timeline={timeline} />
          <Log log={log} />
        </div>
        <DeckPanel deckList={deckList} cardLibrary={cards} fusionSources={fusionSources} />
      </div>

      <RewardModal
        reward={reward}
        deckList={deckList}
        onChoice={handleRewardChoice}
        onSelectCard={addCardToCollection}
        onFuseTwo={fuseTwoCards}
        onUpgrade={upgradeCard}
        onRelic={gainArtifact}
        cards={cards}
      />
    </div>
  )
}
