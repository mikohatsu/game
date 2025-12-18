
import React, { useState, useEffect } from 'react';
import { Phase, PlayerState, Horse, Artifact, BettingType, RaceConfig, TrackType } from './types';
import { INITIAL_MONEY, INITIAL_DEBT, DAYS_PER_CYCLE, DEBT_INTEREST_RATE, generateHorses, generateRaceConfig, REROLL_COST, EARLY_REPAYMENT_AMOUNT, CREDIT_BONUS_PER_REPAYMENT, KEYWORD_DESCRIPTIONS } from './constants';
import { ShopView } from './views/ShopView';
import { RaceView } from './views/RaceView';
import { StartView } from './views/StartView';
import { Button } from './components/Button';
import { ArtifactCard } from './components/ArtifactCard';
import { BettingTicket } from './components/BettingTicket';
import { Modal } from './components/Modal';

const SAVE_KEY = 'ruleMakerSaveData_v1';

// Helper component for tooltips
const TooltipTag = ({ text, className }: { text: string, className: string }) => (
  <div className={`relative group/tooltip cursor-help inline-block ${className}`}>
     <span>{text}</span>
     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/95 text-white text-xs p-2 rounded border border-gray-600 shadow-xl z-50 hidden group-hover/tooltip:block pointer-events-none break-keep text-center leading-relaxed">
       {KEYWORD_DESCRIPTIONS[text] || "특수 정보입니다."}
       {/* Arrow */}
       <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/95"></div>
     </div>
  </div>
);

// Helper for formatted numbers
const Money = ({ amount, color = 'text-black' }: { amount: number, color?: string }) => (
  <span className={`font-mono font-bold ${color}`}>₩ {amount.toLocaleString()}</span>
);

const App = () => {
  // Global State
  const [phase, setPhase] = useState<Phase>(Phase.START);
  const [hasSaveData, setHasSaveData] = useState(false);
  
  const DEFAULT_PLAYER_STATE: PlayerState = {
    money: INITIAL_MONEY,
    debt: INITIAL_DEBT,
    day: 1,
    dDay: DAYS_PER_CYCLE,
    requiredPayment: 0,
    inventory: [],
    equippedArtifacts: [],
    shopDiscount: 0,
    betting: { 
      type: BettingType.WIN, 
      horseId: null, 
      secondHorseId: null,
      amount: 0 
    }
  };

  const [player, setPlayer] = useState<PlayerState>(DEFAULT_PLAYER_STATE);

  const [todaysHorses, setTodaysHorses] = useState<Horse[]>([]);
  const [todaysRaceConfig, setTodaysRaceConfig] = useState<RaceConfig | null>(null);
  const [raceResults, setRaceResults] = useState<number[] | null>(null);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
    type: 'alert' | 'confirm' | 'danger';
    onConfirm: () => void;
    onCancel?: () => void;
    confirmLabel?: string;
  }>({
    isOpen: false,
    title: '',
    content: null,
    type: 'alert',
    onConfirm: () => {},
  });

  // --- Persistence Logic ---
  useEffect(() => {
    // Check for save data on mount
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      setHasSaveData(true);
    }
  }, []);

  // Auto-save whenever player state changes (except in START/GAME_OVER phase)
  useEffect(() => {
    if (phase !== Phase.START && phase !== Phase.GAME_OVER && phase !== Phase.VICTORY) {
      const dataToSave = {
        player,
        phase: phase === Phase.RACE ? Phase.PREPARATION : phase, // If quit during race, restart at prep
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
      setHasSaveData(true);
    }
  }, [player, phase]);

  const handleNewGame = () => {
    // Clear save and reset
    localStorage.removeItem(SAVE_KEY);
    setPlayer(DEFAULT_PLAYER_STATE);
    setTodaysHorses([]);
    setTodaysRaceConfig(null);
    setPhase(Phase.PREPARATION);
  };

  const handleContinue = () => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.player) {
          setPlayer(parsed.player);
          // Always restart at PREPARATION or the saved phase, 
          // but regenerate horses to avoid stale state issues if updated
          setPhase(parsed.phase || Phase.PREPARATION);
          setTodaysHorses([]); // Will trigger generation in useEffect
        }
      } catch (e) {
        console.error("Failed to load save", e);
        handleNewGame();
      }
    }
  };

  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  const showModal = (
    title: string, 
    content: React.ReactNode, 
    onConfirm: () => void, 
    type: 'alert' | 'confirm' | 'danger' = 'alert',
    confirmLabel: string = '확인'
  ) => {
    setModalConfig({
      isOpen: true,
      title,
      content,
      type,
      onConfirm: () => {
        onConfirm();
        closeModal();
      },
      onCancel: closeModal,
      confirmLabel
    });
  };

  const showAlert = (title: string, message: string) => {
    showModal(title, <p>{message}</p>, () => {}, 'alert');
  };

  // Initialize Horses on Day Start or Mount
  useEffect(() => {
    if ((phase === Phase.PREPARATION || phase === Phase.ANALYSIS) && todaysHorses.length === 0) {
      setTodaysHorses(generateHorses());
      setTodaysRaceConfig(generateRaceConfig(player.day));
    }
  }, [phase, todaysHorses.length, player.day]);

  // Actions
  const handleBuyArtifact = (artifact: Artifact, price: number) => {
    if (player.money >= price) {
      setPlayer(prev => ({
        ...prev,
        money: prev.money - price,
        inventory: [...prev.inventory, artifact]
      }));
    }
  };

  const handleReroll = () => {
    if (player.money >= REROLL_COST) {
       setPlayer(prev => ({
         ...prev,
         money: prev.money - REROLL_COST
       }));
    }
  };

  const handleRepayment = () => {
    // 1. Mandatory Interest Payment (End of Cycle)
    if (player.requiredPayment > 0) {
      if (player.money >= player.requiredPayment) {
        showModal(
          "이자 상환일",
          <div className="text-center space-y-4">
            <p>약속된 이자 상환일입니다.</p>
            <div className="bg-red-50 border border-red-200 p-4 rounded text-lg">
              납부 금액: <Money amount={player.requiredPayment} color="text-red-700" />
            </div>
            <p className="text-sm text-gray-500">납부하시겠습니까?</p>
          </div>,
          () => {
            setPlayer(prev => ({
              ...prev,
              money: prev.money - prev.requiredPayment,
              dDay: DAYS_PER_CYCLE,
              requiredPayment: 0
            }));
            showAlert("납부 완료", "이자가 정상적으로 납부되었습니다. 다음 생존 주기가 시작됩니다.");
          },
          'danger',
          '납부하기'
        );
      } else {
        showAlert("자금 부족", "상환 자금이 부족합니다. (게임 오버)");
        setPhase(Phase.GAME_OVER);
        localStorage.removeItem(SAVE_KEY); // Roguelike: delete save on death
      }
      return;
    }

    // 2. Voluntary Early Repayment
    if (player.debt <= 0) return;

    if (player.money < EARLY_REPAYMENT_AMOUNT) {
      showAlert("자금 부족", `최소 ${EARLY_REPAYMENT_AMOUNT.toLocaleString()}원이 필요합니다.`);
      return;
    }

    const nextDiscount = Math.min(0.5, parseFloat((player.shopDiscount + CREDIT_BONUS_PER_REPAYMENT).toFixed(2)));

    showModal(
      "원금 조기 상환",
      <div className="space-y-6">
        <p className="text-center font-bold text-gray-600">
          빚을 일부 갚고 신용도를 회복하시겠습니까?
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
           <div className="bg-white p-3 border border-gray-300 shadow-sm text-center">
              <div className="text-xs text-gray-500 mb-1">상환 금액</div>
              <Money amount={EARLY_REPAYMENT_AMOUNT} color="text-red-600" />
           </div>
           <div className="bg-white p-3 border border-gray-300 shadow-sm text-center">
              <div className="text-xs text-gray-500 mb-1">상점 할인율</div>
              <div className="font-mono font-bold text-emerald-600">
                 +{Math.round(CREDIT_BONUS_PER_REPAYMENT * 100)}% UP
              </div>
           </div>
        </div>

        <div className="bg-gray-100 p-4 border-t-2 border-dashed border-gray-400 text-sm space-y-2">
           <div className="flex justify-between">
              <span>현재 부채:</span>
              <span className="text-gray-500 line-through">₩ {player.debt.toLocaleString()}</span>
           </div>
           <div className="flex justify-between font-bold text-black text-lg">
              <span>상환 후:</span>
              <span>₩ {Math.max(0, player.debt - EARLY_REPAYMENT_AMOUNT).toLocaleString()}</span>
           </div>
        </div>
      </div>,
      () => {
        setPlayer(prev => ({
          ...prev,
          money: prev.money - EARLY_REPAYMENT_AMOUNT,
          debt: Math.max(0, prev.debt - EARLY_REPAYMENT_AMOUNT),
          shopDiscount: nextDiscount
        }));
      },
      'confirm',
      '상환 및 혜택받기'
    );
  };

  const toggleEquipArtifact = (artifact: Artifact) => {
    const isEquipped = player.equippedArtifacts.some(a => a.id === artifact.id);
    if (isEquipped) {
      setPlayer(prev => ({
        ...prev,
        equippedArtifacts: prev.equippedArtifacts.filter(a => a.id !== artifact.id)
      }));
    } else {
      if (player.equippedArtifacts.length < 5) {
        setPlayer(prev => ({
          ...prev,
          equippedArtifacts: [...prev.equippedArtifacts, artifact]
        }));
      } else {
        showAlert("슬롯 초과", "유물은 최대 5개까지만 장착 가능합니다. 기존 유물을 해제해주세요.");
      }
    }
  };

  const handleStartRace = () => {
    if (player.requiredPayment > 0) {
      showAlert("출전 불가", "이자 상환이 필요합니다! 상단의 [🚨 이자 상환] 버튼을 눌러 빚을 갚아야 진행할 수 있습니다.");
      return;
    }

    if (player.betting.horseId === null) {
      showAlert("베팅 필요", "베팅할 말을 선택해주세요.");
      return;
    }
    if (player.betting.type === BettingType.QUINELLA && player.betting.secondHorseId === null) {
      showAlert("정보 부족", "복승식은 2마리의 말을 선택해야 합니다.");
      return;
    }
    if (player.betting.amount <= 0) {
      showAlert("금액 확인", "베팅 금액을 설정해주세요.");
      return;
    }
    if (player.betting.amount > player.money) {
      showAlert("잔고 부족", "보유 자금보다 많이 배팅할 수 없습니다.");
      return;
    }

    setPhase(Phase.RACE);
  };

  const handleRaceEnd = (rankings: number[]) => {
    setRaceResults(rankings);
    setPhase(Phase.SETTLEMENT);
  };

  const calculateWinnings = () => {
    if (!raceResults || player.betting.horseId === null) return 0;
    
    const firstPlaceId = raceResults[0];
    const secondPlaceId = raceResults[1];
    const thirdPlaceId = raceResults[2];
    
    const horse1 = todaysHorses.find(h => h.id === player.betting.horseId);
    const horse2 = player.betting.secondHorseId !== null ? todaysHorses.find(h => h.id === player.betting.secondHorseId) : null;

    if (!horse1) return 0;

    let winnings = 0;

    if (player.betting.type === BettingType.WIN) {
      if (player.betting.horseId === firstPlaceId) {
        winnings = Math.floor(player.betting.amount * horse1.odds);
      }
    } 
    else if (player.betting.type === BettingType.PLACE) {
      if ([firstPlaceId, secondPlaceId, thirdPlaceId].includes(player.betting.horseId)) {
        winnings = Math.floor(player.betting.amount * (horse1.odds / 3));
      }
    }
    else if (player.betting.type === BettingType.QUINELLA) {
      if (horse2) {
        const top2 = [firstPlaceId, secondPlaceId];
        if (top2.includes(player.betting.horseId) && player.betting.secondHorseId !== null && top2.includes(player.betting.secondHorseId)) {
           const combinedOdds = (horse1.odds + horse2.odds) / 2 * 1.5;
           winnings = Math.floor(player.betting.amount * combinedOdds);
        }
      }
    }

    return winnings;
  };

  const processSettlement = () => {
    const winnings = calculateWinnings();

    const nextDay = player.day + 1;
    let nextDDay = player.dDay - 1;
    
    let nextDebt = Math.floor(player.debt * (1 + DEBT_INTEREST_RATE));
    let nextMoney = player.money + winnings;

    let nextPhase = Phase.PREPARATION;
    let nextRequiredPayment = 0;
    
    if (nextDDay <= 0) {
      const interestDue = Math.floor(player.debt * 0.1); 
      
      if (nextMoney < interestDue) {
         setPhase(Phase.GAME_OVER);
         localStorage.removeItem(SAVE_KEY); // Delete save on Game Over
         return; 
      }

      nextRequiredPayment = interestDue;
      nextDDay = 0;
    }

    setPlayer(prev => ({
      ...prev,
      money: nextMoney,
      debt: nextDebt,
      day: nextDay,
      dDay: nextDDay,
      requiredPayment: nextRequiredPayment,
      betting: { type: BettingType.WIN, horseId: null, secondHorseId: null, amount: 0 },
      equippedArtifacts: [] 
    }));
    setTodaysHorses([]);
    // Race Config will be regenerated in useEffect when phase becomes PREPARATION
    setRaceResults(null);
    setPhase(nextPhase);
  };

  const handleRestart = () => {
    // Return to title screen
    setPhase(Phase.START);
    // Don't auto-continue, force new game start choice
  };

  // --- Navigation Helpers ---
  const isNavigablePhase = [Phase.PREPARATION, Phase.ANALYSIS, Phase.DESIGN].includes(phase);
  
  const renderTabs = () => (
    <div className="flex px-8 select-none relative z-20 top-[1px]">
       <button 
         onClick={() => setPhase(Phase.PREPARATION)}
         disabled={player.requiredPayment > 0}
         className={`px-6 py-2 rounded-t-lg font-display text-sm tracking-wide border-t-2 border-x-2 transition-all transform ml-0 relative
           ${phase === Phase.PREPARATION 
             ? 'bg-paper border-[#3d3d3d] text-black border-b-0 pb-3' 
             : 'bg-[#2a2a2a] border-[#1a1a1a] text-gray-500 hover:text-gray-300 translate-y-2'}`}
       >
         I. 암시장
         {phase === Phase.PREPARATION && <div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-paper"></div>}
       </button>
       <button 
         onClick={() => setPhase(Phase.ANALYSIS)}
         disabled={player.requiredPayment > 0}
         className={`px-6 py-2 rounded-t-lg font-display text-sm tracking-wide border-t-2 border-x-2 transition-all transform -ml-1 relative
           ${phase === Phase.ANALYSIS 
             ? 'bg-[#f0f0f0] border-[#3d3d3d] text-black border-b-0 pb-3 z-10' 
             : 'bg-[#262626] border-[#1a1a1a] text-gray-500 hover:text-gray-300 translate-y-2'}`}
       >
         II. 분석
         {phase === Phase.ANALYSIS && <div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-[#f0f0f0]"></div>}
       </button>
       <button 
         onClick={() => setPhase(Phase.DESIGN)}
         disabled={player.requiredPayment > 0}
         className={`px-6 py-2 rounded-t-lg font-display text-sm tracking-wide border-t-2 border-x-2 transition-all transform -ml-1 relative
           ${phase === Phase.DESIGN 
             ? 'bg-dark-wood border-[#3d3d3d] text-white border-b-0 pb-3 z-10' 
             : 'bg-[#1f1f1f] border-[#1a1a1a] text-gray-500 hover:text-gray-300 translate-y-2'}`}
       >
         III. 설계
         {phase === Phase.DESIGN && <div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-dark-wood"></div>}
       </button>
    </div>
  );

  return (
    <div className="w-full h-screen bg-[#1a1a1a] text-[#dcdcdc] flex flex-col font-sans overflow-hidden">
      
      {phase === Phase.START && (
        <StartView 
          onNewGame={handleNewGame} 
          onContinue={handleContinue}
          hasSaveData={hasSaveData}
        />
      )}

      {phase !== Phase.START && (
        <>
          <Modal 
            isOpen={modalConfig.isOpen}
            title={modalConfig.title}
            content={modalConfig.content}
            type={modalConfig.type}
            onConfirm={modalConfig.onConfirm}
            onCancel={modalConfig.onCancel}
            confirmLabel={modalConfig.confirmLabel}
          />

          {phase === Phase.GAME_OVER && (
            <div className="absolute inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-8">
              <div className="bg-paper text-black p-12 max-w-2xl w-full shadow-2xl relative rotate-1 border-4 border-[#333]">
                <div className="absolute top-4 left-4 w-16 h-16 border-4 border-red-800 rounded-full flex items-center justify-center opacity-50 rotate-[-20deg]">
                    <span className="text-red-800 font-black text-xs">VOID</span>
                </div>
                
                <h1 className="text-6xl font-display text-center mb-2 tracking-tighter">파산 선고</h1>
                <div className="w-full h-1 bg-black mb-8"></div>
                
                <p className="font-serif text-lg mb-8 leading-relaxed text-center">
                    귀하는 막대한 부채를 상환하지 못하여 파산 처리되었습니다.<br/>
                    모든 자산은 압류되며, 더 이상의 기회는 없습니다.
                </p>

                <div className="bg-gray-100 p-6 border-2 border-dashed border-gray-400 mb-8 font-mono text-sm">
                    <div className="flex justify-between mb-2">
                      <span>최종 부채:</span>
                      <span className="text-red-600 font-bold">₩ {player.debt.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>생존 기간:</span>
                      <span>{player.day} 일</span>
                    </div>
                </div>
                
                <div className="text-center">
                    <Button variant="danger" size="lg" onClick={handleRestart} className="shadow-lg">
                        타이틀로 돌아가기
                    </Button>
                </div>
              </div>
            </div>
          )}

          {phase === Phase.VICTORY && (
            <div className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-8">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 text-black p-12 max-w-2xl w-full shadow-[0_0_100px_rgba(255,215,0,0.5)] relative border-8 border-double border-black animate-bounce-in">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <span className="text-8xl">👑</span>
                </div>

                <h1 className="text-7xl font-display text-center mb-4 tracking-tighter drop-shadow-lg mt-8 text-yellow-900">
                    DEBT FREE
                </h1>
                <h2 className="text-3xl font-serif font-bold text-center mb-8 text-black/80">
                    채무 청산 완료
                </h2>
                
                <p className="font-serif text-lg mb-8 leading-relaxed text-center font-bold">
                    축하합니다! 모든 빚을 청산하고 자유의 몸이 되었습니다.<br/>
                    이제 당신은 진정한 <b>'배팅의 신'</b>입니다.
                </p>

                <div className="bg-white/50 p-6 border-2 border-black mb-8 font-mono text-sm">
                    <div className="flex justify-between items-center text-lg">
                      <span>최종 자산:</span>
                      <span className="text-emerald-800 font-black">₩ {player.money.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg mt-2">
                      <span>걸린 시간:</span>
                      <span className="font-bold">{player.day} 일</span>
                    </div>
                </div>
                
                <div className="text-center">
                    <Button variant="gold" size="lg" onClick={handleRestart} className="shadow-xl text-xl px-12 py-4">
                        전설로 남고 다시 시작하기
                    </Button>
                </div>
              </div>
              
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                      <div key={i} className="absolute text-4xl animate-spin" style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDuration: `${Math.random() * 5 + 2}s`
                      }}>🎉</div>
                  ))}
                  {[...Array(20)].map((_, i) => (
                      <div key={i} className="absolute text-4xl animate-bounce" style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDuration: `${Math.random() * 3 + 1}s`
                      }}>💸</div>
                  ))}
              </div>
            </div>
          )}

          {/* Header */}
          {phase !== Phase.GAME_OVER && phase !== Phase.VICTORY && (
          <div className="h-14 bg-dark-wood border-b-4 border-[#000] flex items-center justify-between px-6 shadow-xl z-50 relative shrink-0">
            <div className="flex flex-col">
              <h1 className="text-lg font-display text-[#e5e5e5] tracking-widest uppercase drop-shadow-md cursor-pointer" onClick={() => setPhase(Phase.START)}>
                Rule Maker
              </h1>
            </div>

            <div className="flex gap-4 items-center">
              {player.debt > 0 && (
                <Button 
                  size="sm" 
                  variant={player.requiredPayment > 0 ? "danger" : "secondary"}
                  onClick={handleRepayment}
                  disabled={player.requiredPayment === 0 && player.money < EARLY_REPAYMENT_AMOUNT}
                  className={`font-mono text-xs border-dashed transition-all duration-300
                      ${player.requiredPayment > 0 ? 'animate-pulse ring-2 ring-red-500 shadow-[0_0_15px_rgba(220,38,38,0.7)] font-bold' : ''}
                  `}
                >
                    {player.requiredPayment > 0 
                      ? `🚨 이자 납부 (₩ ${player.requiredPayment.toLocaleString()})` 
                      : `💵 빚 조기상환 (₩ ${EARLY_REPAYMENT_AMOUNT.toLocaleString()})`
                    }
                </Button>
              )}

              <div className="flex gap-2">
                <div className="bg-paper text-black px-2 py-1 shadow-md rotate-[-1deg] border border-gray-400">
                  <span className="block text-[8px] font-bold text-gray-500 uppercase">FUNDS</span>
                  <span className="font-mono font-bold text-sm text-emerald-800">₩ {player.money.toLocaleString()}</span>
                </div>
                <div className="bg-paper text-black px-2 py-1 shadow-md rotate-[1deg] border border-gray-400">
                  <span className="block text-[8px] font-bold text-gray-500 uppercase">DEBT</span>
                  <span className="font-mono font-bold text-sm text-red-800">₩ {player.debt.toLocaleString()}</span>
                </div>
                <div className={`text-white px-2 py-1 shadow-md border border-gray-600 flex flex-col items-center justify-center min-w-[50px] transition-colors
                  ${player.requiredPayment > 0 ? 'bg-red-700 animate-pulse border-red-900' : 'bg-[#333]'}
                `}>
                  <span className="text-[8px] text-gray-400">D-DAY</span>
                  <span className={`font-display text-md ${player.requiredPayment > 0 ? 'text-white' : 'text-yellow-500'}`}>
                    {player.requiredPayment > 0 ? 'DUE' : player.dDay}
                  </span>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Main Content Area */}
          <main className="flex-grow flex flex-col overflow-hidden relative bg-[#111]">
            
            {isNavigablePhase && phase !== Phase.VICTORY && (
              <div className="shrink-0 pt-4 bg-dark-wood shadow-inner border-b border-[#000]">
                  {renderTabs()}
              </div>
            )}

            <div className={`flex-grow relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] flex flex-col
              ${phase === Phase.PREPARATION ? 'bg-paper' : 
                phase === Phase.ANALYSIS ? 'bg-[#f0f0f0]' : 
                phase === Phase.DESIGN ? 'bg-dark-wood' : 'bg-black'}`}>
                
                {player.requiredPayment > 0 && isNavigablePhase && (
                  <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-white p-6 border-4 border-red-600 shadow-2xl max-w-md text-center transform rotate-1">
                        <h2 className="text-3xl font-black text-red-600 mb-2 uppercase tracking-tighter">상환 기일 도래</h2>
                        <p className="font-serif text-black mb-6">
                            약속된 이자 납부일입니다.<br/>
                            <b>₩ {player.requiredPayment.toLocaleString()}</b>을 즉시 상환하십시오.
                        </p>
                        <Button variant="danger" size="lg" onClick={handleRepayment} className="w-full animate-pulse">
                            즉시 납부하기
                        </Button>
                      </div>
                  </div>
                )}

                {(phase === Phase.PREPARATION || phase === Phase.ANALYSIS) && 
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-50 pointer-events-none z-0"></div>
                }
                {(phase === Phase.DESIGN) && 
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 pointer-events-none z-0"></div>
                }

                <div className="relative z-10 w-full h-full">
                  {phase === Phase.PREPARATION && (
                    <ShopView 
                      playerState={player} 
                      onPurchase={handleBuyArtifact} 
                      onReroll={handleReroll}
                      onNext={() => setPhase(Phase.ANALYSIS)}
                    />
                  )}

                  {phase === Phase.ANALYSIS && todaysRaceConfig && (
                    <div className="h-full p-6 flex flex-col animate-fade-in relative overflow-hidden">
                      <div className="absolute top-4 right-8 transform rotate-12 opacity-10 font-display text-9xl text-black pointer-events-none">PADDOCK</div>
                      
                      {/* Analysis Header: Race Info */}
                      <div className="shrink-0 text-center mb-6">
                        <div className="inline-block border-4 border-double border-black bg-white p-4 shadow-xl transform -rotate-1">
                            <h2 className="text-4xl font-display text-black mb-2 uppercase tracking-tight">
                              {todaysRaceConfig.name}
                            </h2>
                            <div className="flex justify-center gap-4 text-sm font-bold font-mono text-gray-700 uppercase border-t border-gray-300 pt-2">
                                <span className="flex items-center gap-1">
                                    🏁 {todaysRaceConfig.distance}m
                                </span>
                                <span className="w-px bg-gray-300"></span>
                                <span className={`flex items-center gap-1 ${todaysRaceConfig.trackType === TrackType.TURF ? 'text-green-700' : 'text-yellow-800'}`}>
                                    {todaysRaceConfig.trackType === TrackType.TURF ? '🌱 잔디 (TURF)' : '🏜️ 더트 (DIRT)'}
                                </span>
                            </div>
                        </div>
                      </div>

                      <div className="flex-grow overflow-y-auto pr-2 pb-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {todaysHorses.map(horse => {
                            // Highlight preference mismatch
                            const isMismatch = horse.trackPreference !== todaysRaceConfig.trackType;

                            return (
                            <div key={horse.id} className="bg-white text-black p-4 shadow-[3px_3px_5px_rgba(0,0,0,0.2)] border border-gray-300 relative group hover:shadow-lg transition-shadow">
                              <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-4 h-8 bg-red-800/20 rounded-sm"></div> 
                              
                              <div className="flex justify-between items-center mb-2 border-b border-gray-300 pb-1">
                                <span className="text-lg font-black font-display">{horse.number}. {horse.name}</span>
                                <span className="bg-black text-white px-1.5 text-sm font-mono font-bold">x{horse.odds}</span>
                              </div>
                              
                              <div className="space-y-2 text-xs font-mono mt-2 text-gray-700">
                                {['Speed', 'Stamina', 'Accel'].map((stat, idx) => {
                                    const val = idx === 0 ? horse.stats.speed : idx === 1 ? horse.stats.stamina : horse.stats.acceleration;
                                    const max = idx === 0 ? 150 : idx === 1 ? 200 : 20; 
                                    return (
                                      <div key={stat} className="flex items-center gap-1">
                                          <span className="w-16 font-bold uppercase text-[10px] tracking-tighter">{stat}</span>
                                          <div className="flex-1 h-1.5 bg-gray-200 border border-gray-400 overflow-hidden">
                                              <div className="h-full bg-black" style={{width: `${Math.min((val / max) * 100, 100)}%`}}></div>
                                          </div>
                                          <span className="w-5 text-right font-bold">{val}</span>
                                      </div>
                                    )
                                })}
                              </div>

                              <div className="mt-3 flex flex-wrap gap-1">
                                <TooltipTag text={horse.personality} className="bg-gray-100 border border-gray-300 px-1 text-[9px]" />
                                <TooltipTag text={horse.strategy} className="bg-gray-100 border border-gray-300 px-1 text-[9px]" />
                                <TooltipTag text={horse.distanceAptitude} className="bg-gray-100 border border-gray-300 px-1 text-[9px]" />
                                <TooltipTag 
                                    text={horse.trackPreference} 
                                    className={`${isMismatch ? 'bg-red-100 border-red-300 text-red-700' : 'bg-green-100 border-green-300 text-green-800'} border px-1 text-[9px] font-bold`} 
                                />
                                {horse.tags.map(t => (
                                  <TooltipTag key={t} text={t} className="bg-yellow-100 border border-yellow-300 px-1 text-[9px] font-bold" />
                                ))}
                              </div>
                              
                              {isMismatch && (
                                  <div className="absolute top-2 right-2 text-xl animate-pulse" title="트랙 적성 불일치 (속도 감소)">
                                      ⚠️
                                  </div>
                              )}
                            </div>
                          )})}
                          </div>
                      </div>
                      
                      <div className="shrink-0 mt-4 flex justify-end">
                          <Button 
                            variant="gold" 
                            size="lg" 
                            onClick={() => setPhase(Phase.DESIGN)}
                            disabled={player.requiredPayment > 0}
                            className={player.requiredPayment > 0 ? "opacity-50 grayscale cursor-not-allowed" : ""}
                          >
                            설계 단계로 &gt;
                          </Button>
                      </div>
                    </div>
                  )}

                  {phase === Phase.DESIGN && (
                    <div className="h-full flex animate-fade-in relative overflow-hidden">
                      
                      <div className="w-72 bg-[#1a1a1a] border-r-4 border-[#333] flex flex-col shadow-2xl z-20 shrink-0">
                        <div className="p-4 bg-[#222] border-b border-[#444] shrink-0">
                            <h3 className="text-lg font-display text-[#e5e5e5] flex items-center gap-2 uppercase tracking-wider">
                            <span>💼</span> 보관함
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 bg-[#111] space-y-1">
                            {player.inventory.length === 0 ? (
                                <div className="text-center text-gray-600 mt-10 text-xs">[비어있음]</div>
                            ) : (
                                player.inventory.map(item => (
                                    <ArtifactCard 
                                        key={item.id} 
                                        artifact={item} 
                                        variant="list"
                                        selected={player.equippedArtifacts.some(e => e.id === item.id)}
                                        onClick={() => toggleEquipArtifact(item)}
                                    />
                                ))
                            )}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col bg-dark-wood relative min-w-0 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] opacity-50 mix-blend-multiply pointer-events-none"></div>
                        
                        <div className="relative z-10 w-full h-full p-4 md:p-8 overflow-y-auto flex flex-col items-center">
                            <div className="w-full max-w-6xl my-auto">
                                <h3 className="text-center font-display text-white/40 text-2xl uppercase tracking-[0.5em] mb-8 border-b border-white/10 pb-4">
                                  Activated Rules
                                </h3>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 place-items-center mb-4">
                                    {[0, 1, 2, 3, 4].map(idx => {
                                        const item = player.equippedArtifacts[idx];
                                        return (
                                            <div key={idx} className="relative w-full aspect-[2/3] max-w-[240px] border-4 border-dashed border-white/20 rounded-xl flex items-center justify-center group bg-black/20 transition-all hover:border-white/40 shadow-inner">
                                                {item ? (
                                                    <div className="w-full h-full p-2">
                                                        <ArtifactCard 
                                                            artifact={item} 
                                                            variant="default" // Use BIG card
                                                            selected 
                                                            onClick={() => toggleEquipArtifact(item)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-white/10 group-hover:text-white/30 transition-colors">
                                                        <span className="font-bold text-6xl select-none">+</span>
                                                        <span className="text-xs font-mono mt-2 uppercase tracking-widest">Empty Slot</span>
                                                    </div>
                                                )}
                                                
                                                <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#222] rounded-full flex items-center justify-center border-2 border-[#444] text-sm font-black text-gray-500 shadow-md z-20">
                                                    {idx + 1}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                
                                <div className="mt-8 text-center text-white/30 text-sm font-serif italic">
                                  * 인벤토리(좌측)에서 유물을 클릭하여 이 슬롯에 장착하십시오.
                                </div>
                            </div>
                        </div>
                      </div>

                      <div className="w-[360px] shrink-0 p-4 border-l-4 border-black bg-[#111] flex flex-col z-10 shadow-xl overflow-y-auto">
                          <h3 className="text-gray-500 font-display uppercase tracking-widest mb-4 text-center">Betting Desk</h3>
                          
                          <div className="flex-grow flex flex-col gap-4">
                            <BettingTicket 
                                horses={todaysHorses}
                                bettingType={player.betting.type}
                                selectedHorseId={player.betting.horseId}
                                secondHorseId={player.betting.secondHorseId}
                                onSelectHorse={(id) => setPlayer(p => ({...p, betting: { ...p.betting, horseId: id }}))}
                                onSelectSecondHorse={(id) => setPlayer(p => ({...p, betting: { ...p.betting, secondHorseId: id }}))}
                                onSelectType={(type) => setPlayer(p => ({...p, betting: { ...p.betting, type, secondHorseId: null }}))}
                                amount={player.betting.amount}
                            />

                            <div className="bg-[#1a1a1a] p-3 rounded border border-[#333] mt-auto">
                                <label className="text-[10px] text-gray-500 mb-1 block font-mono uppercase">Wager Amount</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-black border border-[#444] rounded-none p-2 text-right font-mono text-lg text-emerald-400 outline-none mb-2 focus:border-emerald-500"
                                    value={player.betting.amount}
                                    max={player.money}
                                    step={100000}
                                    onChange={(e) => setPlayer(p => ({...p, betting: { ...p.betting, amount: Number(e.target.value) }}))}
                                />
                                <Button 
                                    variant="danger" 
                                    size="lg" 
                                    className={`w-full text-lg shadow-[0_0_10px_rgba(255,0,0,0.3)] mt-2 
                                      ${player.requiredPayment > 0 ? "opacity-50 grayscale cursor-not-allowed" : ""}
                                    `}
                                    onClick={handleStartRace}
                                >
                                    {player.requiredPayment > 0 ? "🔒 빚 상환 필요" : "경기 시작 (START)"}
                                </Button>
                            </div>
                          </div>
                      </div>

                    </div>
                  )}

                  {phase === Phase.RACE && todaysRaceConfig && (
                    <RaceView 
                      horses={todaysHorses} 
                      activeRules={player.equippedArtifacts} 
                      betting={player.betting}
                      raceConfig={todaysRaceConfig}
                      onRaceEnd={handleRaceEnd}
                    />
                  )}

                  {phase === Phase.SETTLEMENT && raceResults && (
                    <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                      <div className="max-w-md w-full bg-[#f3f0e6] text-black p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] transform rotate-1 border-8 border-double border-gray-300 relative">
                          <div className="absolute top-0 right-0 p-4 opacity-20">
                              <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center -rotate-12">
                                  <span className="font-black text-xl">CONFIRMED</span>
                              </div>
                          </div>

                          <h2 className="text-4xl font-display mb-8 text-center border-b-2 border-black pb-4">경기 결과 통지서</h2>
                          
                          <div className="mb-8 font-serif space-y-4">
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-gray-600">우승마:</span>
                                <span className="font-bold text-2xl border-b border-black">{todaysHorses.find(h => h.id === raceResults[0])?.name}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-gray-600">베팅 결과:</span>
                                <span className={`font-bold ${calculateWinnings() > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                  {calculateWinnings() > 0 ? '적중 (SUCCESS)' : '실패 (FAILURE)'}
                                </span>
                            </div>
                          </div>

                          {calculateWinnings() > 0 && (
                            <div className="text-3xl font-mono text-center mb-8 p-4 border-2 border-dashed border-green-700 text-green-800 bg-green-50">
                              + ₩ {calculateWinnings().toLocaleString()}
                            </div>
                          )}

                          <Button variant="primary" size="lg" className="w-full bg-black text-white hover:bg-gray-800 border-none" onClick={processSettlement}>
                            서명 후 다음 날로 진행
                          </Button>
                      </div>
                    </div>
                  )}
                </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default App;
