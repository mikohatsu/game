import { useEffect } from 'react';
import { useGame } from './hooks/useGame';
import EnemyDisplay from './components/EnemyDisplay';
import PlayerStats from './components/PlayerStats';
import Equipment from './components/Equipment';
import Inventory from './components/Inventory';
import GameControls from './components/GameControls';
import GameLog from './components/GameLog';
import ArtifactModal from './components/ArtifactModal';
import { Layers } from 'lucide-react';

function App() {
  const {
    floor,
    player,
    equipSlots,
    inventory,
    artifacts,
    enemy,
    selectedIdx,
    gameLog,
    showArtifactModal,
    artifactChoices,
    animations,
    actions
  } = useGame();

  const stats = {
    atk: player.baseAtk + (equipSlots.weapon?.val || 0),
    def: player.baseDef + (equipSlots.armor?.val || 0),
    crit: player.critChance,
    lifesteal: player.lifesteal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dungeon-dark via-dungeon-darker to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 animate-slide-up">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-dungeon-accent via-yellow-500 to-orange-600 mb-2">
            Text Dungeon
          </h1>
          <div className="flex items-center justify-center gap-4 text-lg">
            <span className="flex items-center gap-2 px-4 py-2 bg-dungeon-panel rounded-lg border border-dungeon-border">
              <Layers className="w-5 h-5 text-dungeon-accent" />
              <span className="font-bold text-dungeon-accent">{floor}</span>층
            </span>
            {artifacts.length > 0 && (
              <span className="px-4 py-2 bg-dungeon-panel rounded-lg border border-dungeon-legend text-dungeon-legend">
                유물 x{artifacts.length}
              </span>
            )}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <PlayerStats
              player={player}
              stats={stats}
              damage={animations.playerDamage}
              heal={animations.playerHeal}
            />
            <Equipment
              weapon={equipSlots.weapon}
              armor={equipSlots.armor}
              onUnequip={actions.unequip}
            />
          </div>

          {/* Center Column */}
          <div className="space-y-6">
            <EnemyDisplay
              enemy={enemy}
              damage={animations.enemyDamage}
              shake={animations.enemyShake}
            />
            <GameControls
              enemy={enemy}
              player={player}
              onBattle={actions.battle}
              onNext={actions.spawnEnemy}
              onRest={actions.rest}
            />
            <GameLog logs={gameLog} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Inventory
              inventory={inventory}
              selectedIdx={selectedIdx}
              onSelect={actions.setSelectedIdx}
              onEquip={() => {
                if (selectedIdx !== -1) {
                  actions.equip(inventory[selectedIdx]);
                }
              }}
              onMerge={actions.merge}
              onTrash={actions.trash}
            />
          </div>
        </div>

        {/* Artifact Selection Modal */}
        <ArtifactModal
          show={showArtifactModal}
          choices={artifactChoices}
          onSelect={actions.selectArtifact}
          onClose={() => actions.setShowArtifactModal(false)}
        />
      </div>
    </div>
  );
}

export default App;
