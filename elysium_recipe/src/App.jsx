import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { IntroScreen } from './components/IntroScreen';
import { TutorialModal } from './components/TutorialModal';
import { SynthesisAnimationModal } from './components/SynthesisAnimationModal';
import { Header } from './components/layout/Header';
import { MessageBanner } from './components/layout/MessageBanner';
import { TabNavigation } from './components/layout/TabNavigation';
import { Laboratory } from './components/screens/Laboratory';
import { Shop } from './components/screens/Shop';
import { Archive } from './components/screens/Archive';
import { Grimoire } from './components/screens/Grimoire';
import { Upgrades } from './components/screens/Upgrades';
import { GameOverScreen } from './components/screens/GameOverScreen';

function App() {
  const { gameState, actions } = useGameState();
  const [selectedMat1, setSelectedMat1] = useState(null);
  const [selectedMat2, setSelectedMat2] = useState(null);
  const [temperature, setTemperature] = useState(500);
  const [pressure, setPressure] = useState(5.0);
  const [concentration, setConcentration] = useState(50);
  const [currentTab, setCurrentTab] = useState('lab');
  const [message, setMessage] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [synthesisResult, setSynthesisResult] = useState(null);

  // 스페이스바로 인트로 스킵
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && !gameState.hasSeenIntro) {
        actions.markIntroSeen();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.hasSeenIntro, actions]);

  // 튜토리얼 모달 자동 표시
  useEffect(() => {
    if (gameState.hasSeenIntro && !gameState.hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, [gameState.hasSeenIntro, gameState.hasSeenTutorial]);

  // 인트로 화면
  if (!gameState.hasSeenIntro) {
    return <IntroScreen onComplete={actions.markIntroSeen} />;
  }

  // 게임오버 화면
  if (gameState.gameOver) {
    return <GameOverScreen gameState={gameState} onResetGame={actions.resetGame} />;
  }

  // Event Handlers
  const handleSynthesis = () => {
    if (!selectedMat1 || !selectedMat2) {
      setMessage({ type: 'error', text: '재료 2개를 선택하세요!' });
      return;
    }

    const result = actions.performSynthesis(
      selectedMat1,
      selectedMat2,
      { temperature, pressure, concentration }
    );

    if (result.success) {
      // 애니메이션 모달 표시
      setSynthesisResult(result.result.grade);

      // 티어 5 체크
      if (result.recipe.tier === 5) {
        actions.checkEnding(result.recipe.id);
      }
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const handleSynthesisComplete = () => {
    setSynthesisResult(null);
    // 애니메이션 완료 후 메시지 표시
    setMessage({
      type: 'success',
      text: '합성이 완료되었습니다!'
    });
  };

  const handleBuyMaterial = (materialId) => {
    if (actions.buyMaterial(materialId)) {
      setMessage({ type: 'success', text: '구매 완료!' });
    } else {
      setMessage({ type: 'error', text: '골드가 부족합니다!' });
    }
  };

  const handleExploration = () => {
    const result = actions.performExploration();
    if (result.success && result.type !== 'fail') {
      setSelectedRecipe(result.recipe);
    }
    setMessage({
      type: result.success ? (result.type === 'fail' ? 'error' : 'success') : 'error',
      text: result.message
    });
  };

  const handleLoadParams = (params) => {
    setTemperature(params.temperature);
    setPressure(params.pressure);
    setConcentration(params.concentration);
    setCurrentTab('lab');
    setMessage({ type: 'success', text: '파라미터를 불러왔습니다!' });
  };

  const handleUpgrade = (upgradeId) => {
    const result = actions.purchaseUpgrade(upgradeId);
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message
    });
  };

  return (
    <div className="min-h-screen p-4 lab-ambient">
      {/* 합성 애니메이션 모달 */}
      {synthesisResult && (
        <SynthesisAnimationModal
          grade={synthesisResult}
          onComplete={handleSynthesisComplete}
        />
      )}

      {/* 튜토리얼 모달 */}
      {showTutorial && (
        <TutorialModal onClose={() => {
          setShowTutorial(false);
          actions.markTutorialSeen();
        }} />
      )}

      {/* 헤더 */}
      <div className="max-w-7xl mx-auto mb-4">
        <Header gameState={gameState} />
      </div>

      {/* 메시지 */}
      {message && (
        <div className="max-w-7xl mx-auto mb-4">
          <MessageBanner message={message} onClose={() => setMessage(null)} />
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="max-w-7xl mx-auto mb-4">
        <TabNavigation
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onShowTutorial={() => setShowTutorial(true)}
          onEndDay={actions.endDay}
        />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto">
        {currentTab === 'lab' && (
          <Laboratory
            gameState={gameState}
            selectedMat1={selectedMat1}
            selectedMat2={selectedMat2}
            temperature={temperature}
            pressure={pressure}
            concentration={concentration}
            onMat1Change={setSelectedMat1}
            onMat2Change={setSelectedMat2}
            onTemperatureChange={setTemperature}
            onPressureChange={setPressure}
            onConcentrationChange={setConcentration}
            onSynthesis={handleSynthesis}
            onSellItem={actions.sellItem}
          />
        )}

        {currentTab === 'shop' && (
          <Shop gameState={gameState} onBuyMaterial={handleBuyMaterial} />
        )}

        {currentTab === 'archive' && (
          <Archive
            gameState={gameState}
            onExploration={handleExploration}
            selectedRecipe={selectedRecipe}
            onSelectRecipe={setSelectedRecipe}
          />
        )}

        {currentTab === 'grimoire' && (
          <Grimoire gameState={gameState} onLoadParams={handleLoadParams} />
        )}

        {currentTab === 'upgrades' && (
          <Upgrades gameState={gameState} onPurchaseUpgrade={handleUpgrade} />
        )}
      </div>
    </div>
  );
}

export default App;
