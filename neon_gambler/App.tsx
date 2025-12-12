import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Terminal, Coins, RotateCw, Play, SkipForward, ShoppingBag, Plus, Sparkles } from 'lucide-react';
import { GameState, SymbolDef, GRID_TOTAL, LogMessage, GRID_SIZE } from './types';
import { INITIAL_DECK, SYMBOLS, ARTIFACTS } from './constants';
import { calculateSpinScore, getRandomSymbol, getSymbol, generateShopOptions } from './utils/gameLogic';
import { generateDealerCommentary } from './services/geminiService';
import Grid from './components/Grid';
import SymbolCard from './components/SymbolCard';

const BASE_TARGET = 25;
const TARGET_SCALING = 1.5;
const INITIAL_SPINS = 5;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    credits: 0,
    round: 1,
    targetScore: BASE_TARGET,
    currentRoundScore: 0,
    spinsLeft: INITIAL_SPINS,
    inventory: INITIAL_DECK.map(id => getSymbol(id)),
    artifacts: [],
    status: 'menu',
    grid: Array(GRID_TOTAL).fill(null),
    messages: [],
    dealerMood: "Waiting for player..."
  });

  const [spinResult, setSpinResult] = useState<{score: number, animations: any[]} | null>(null);
  const [shopOptions, setShopOptions] = useState<SymbolDef[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (text: string, type: LogMessage['type'] = 'info') => {
    setGameState(prev => ({
      ...prev,
      messages: [...prev.messages, { id: Date.now().toString() + Math.random(), text, type }]
    }));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameState.messages]);

  const startGame = () => {
    setGameState({
      credits: 0,
      round: 1,
      targetScore: BASE_TARGET,
      currentRoundScore: 0,
      spinsLeft: INITIAL_SPINS,
      inventory: INITIAL_DECK.map(id => getSymbol(id)),
      artifacts: [],
      status: 'playing',
      grid: Array(GRID_TOTAL).fill(null),
      messages: [{ id: 'init', text: 'System initialized. Good luck, Operator.', type: 'info' }],
      dealerMood: "Welcome to the Neon Casino."
    });
    triggerDealerCommentary('round_start');
  };

  const triggerDealerCommentary = async (event: 'round_start' | 'big_win' | 'loss' | 'shop', score?: number) => {
    if (Math.random() > 0.7 || event === 'round_start') {
        const comment = await generateDealerCommentary(gameState, score || 0, event);
        setGameState(prev => ({ ...prev, dealerMood: comment }));
        addLog(`Dealer: "${comment}"`, 'dealer');
    }
  };

  const handleSpin = () => {
    if (gameState.spinsLeft <= 0) return;

    setGameState(prev => ({ ...prev, status: 'spinning', spinsLeft: prev.spinsLeft - 1 }));

    setTimeout(() => {
        const newGrid = Array(GRID_TOTAL).fill(null).map(() => getRandomSymbol(gameState.inventory));
        const result = calculateSpinScore(newGrid);
        
        setSpinResult(result);
        setGameState(prev => ({ ...prev, grid: newGrid }));

        setTimeout(() => {
            const totalScore = result.score;
            let finalScore = totalScore;
            gameState.artifacts.forEach(art => {
                if (art.effectType === 'multiply_all' && art.value) {
                    finalScore = Math.floor(finalScore * art.value);
                }
            });

            setGameState(prev => {
                const newScore = prev.currentRoundScore + finalScore;
                const newCredits = prev.credits + Math.floor(finalScore / 10);
                return { ...prev, currentRoundScore: newScore, credits: newCredits, status: 'playing' };
            });

            addLog(`Spin Result: +${finalScore} Score`, 'score');
            if (finalScore > 20) triggerDealerCommentary('big_win', finalScore);
            else if (finalScore < 5) triggerDealerCommentary('loss', finalScore);
        }, 600);
    }, 300);
  };

  const endRound = () => {
      if (gameState.currentRoundScore >= gameState.targetScore) {
          addLog(`Round ${gameState.round} Cleared!`, 'info');
          setShopOptions(generateShopOptions());
          setGameState(prev => ({ ...prev, status: 'shop' }));
          triggerDealerCommentary('shop');
      } else {
          setGameState(prev => ({ ...prev, status: 'gameover' }));
          addLog('Target missed. Contract terminated.', 'danger');
      }
  };

  useEffect(() => {
      if (gameState.status === 'playing' && gameState.spinsLeft === 0 && !spinResult) {
         setTimeout(() => endRound(), 1500);
      }
  }, [gameState.spinsLeft, gameState.status]);


  const buySymbol = (symbol: SymbolDef) => {
      setGameState(prev => ({
          ...prev,
          inventory: [...prev.inventory, symbol],
          status: 'playing',
          round: prev.round + 1,
          targetScore: Math.floor(prev.targetScore * TARGET_SCALING),
          currentRoundScore: 0,
          spinsLeft: INITIAL_SPINS + (prev.artifacts.find(a => a.id === 'battery') ? 1 : 0),
          grid: Array(GRID_TOTAL).fill(null)
      }));
      setSpinResult(null);
      addLog(`Acquired ${symbol.name}`, 'info');
      triggerDealerCommentary('round_start');
  };
  
  const skipShop = () => {
       const skipBonus = 5;
       setGameState(prev => ({
          ...prev,
          credits: prev.credits + skipBonus,
          status: 'playing',
          round: prev.round + 1,
          targetScore: Math.floor(prev.targetScore * TARGET_SCALING),
          currentRoundScore: 0,
          spinsLeft: INITIAL_SPINS,
          grid: Array(GRID_TOTAL).fill(null)
      }));
      setSpinResult(null);
      addLog(`Shop Skipped. +${skipBonus} Credits`, 'info');
      triggerDealerCommentary('round_start');
  };

  if (gameState.status === 'menu') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black bg-[url('https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="relative z-10 text-center p-12 border-4 border-cyan-500 rounded-2xl bg-black/90 shadow-[0_0_50px_#06b6d4]">
            <h1 className="text-6xl md:text-8xl font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 mb-4 animate-pulse">
            NEON<br/>GAMBLER
            </h1>
            <p className="text-xl text-cyan-200 mb-8 font-mono tracking-widest">CYBERPUNK SLOTS ROGUELITE</p>
            <button 
            onClick={startGame}
            className="group relative px-12 py-4 bg-cyan-600 overflow-hidden rounded shadow-[0_0_20px_#06b6d4] transition-all hover:scale-105"
            >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
            <span className="relative font-bold text-2xl text-black font-display">INSERT COIN</span>
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black text-gray-200 flex flex-col md:flex-row overflow-hidden relative">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=2098&auto=format&fit=crop')] bg-cover opacity-20 pointer-events-none" />

      {/* --- LEFT: HUD --- */}
      <div className="w-full md:w-80 p-2 md:p-4 z-10 flex flex-col bg-gray-950/90 border-r border-gray-800 backdrop-blur">
        
        {/* Stats Panel */}
        <div className="mb-4 p-4 neon-box rounded-lg bg-black/50">
            <h2 className="text-cyan-400 font-display text-lg mb-4 flex items-center gap-2 border-b border-cyan-900 pb-2">
                <Terminal size={18} /> OPERATOR_HUD
            </h2>
            <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">CYCLE</span> 
                    <span className="text-2xl font-display text-white">{gameState.round.toString().padStart(2, '0')}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">CREDITS</span> 
                    <span className="text-2xl font-display text-yellow-400 tracking-wider">${gameState.credits}</span>
                </div>
                
                <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">QUOTA PROGRESS</span>
                        <span className={gameState.currentRoundScore >= gameState.targetScore ? "text-green-400 animate-pulse" : "text-red-400"}>
                            {gameState.currentRoundScore} / {gameState.targetScore}
                        </span>
                    </div>
                    <div className="w-full h-3 bg-gray-900 rounded-full border border-gray-700 overflow-hidden">
                        <div 
                           className={`h-full transition-all duration-500 ${gameState.currentRoundScore >= gameState.targetScore ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-gradient-to-r from-red-900 to-red-500'}`}
                           style={{ width: `${Math.min(100, (gameState.currentRoundScore / gameState.targetScore) * 100)}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Deck/Inventory */}
        <div className="flex-1 overflow-hidden flex flex-col neon-box rounded-lg bg-black/50 p-2">
            <h3 className="text-gray-500 font-bold text-xs mb-2 px-2">INSTALLED MODULES ({gameState.inventory.length})</h3>
            <div className="flex-1 overflow-y-auto hud-scroll grid grid-cols-3 gap-1 content-start pr-1">
                {gameState.inventory.map((sym, i) => (
                    <div key={i} title={sym.name} className="aspect-square">
                        <SymbolCard symbol={sym} size="sm" showDetails={false} className="w-full h-full scale-90 border-none bg-transparent shadow-none" />
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* --- CENTER: GAME MACHINE --- */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center relative z-10">
        
        {/* Dealer Message */}
        <div className="absolute top-4 w-full max-w-xl text-center">
             <div className="inline-block bg-black/80 border border-purple-500/50 px-6 py-2 rounded-full backdrop-blur">
                <span className="text-xs text-purple-400 font-bold mr-2">AI DEALER:</span>
                <span className="text-gray-200 italic font-mono animate-pulse">"{gameState.dealerMood}"</span>
             </div>
        </div>

        {gameState.status === 'gameover' ? (
            <div className="bg-black/90 p-12 rounded-2xl border-2 border-red-600 text-center shadow-[0_0_50px_red]">
                <h2 className="text-6xl font-display text-red-600 mb-4 animate-bounce">TERMINATED</h2>
                <p className="mb-8 text-gray-400 font-mono">INSUFFICIENT FUNDS FOR RENT.</p>
                <button onClick={startGame} className="px-8 py-3 bg-red-600 hover:bg-red-500 text-black font-bold rounded">SYSTEM REBOOT</button>
            </div>
        ) : gameState.status === 'shop' ? (
             <div className="bg-gray-900/95 p-8 rounded-3xl border-4 border-yellow-500/30 max-w-4xl w-full flex flex-col items-center shadow-2xl backdrop-blur-md">
                <h2 className="text-4xl font-display text-yellow-400 mb-2 flex items-center gap-2 drop-shadow-lg">
                    <ShoppingBag className="mb-1" /> BLACK MARKET
                </h2>
                <div className="w-full h-px bg-yellow-500/30 mb-8" />
                
                <div className="flex flex-wrap justify-center gap-8 mb-8">
                    {shopOptions.map((opt, i) => (
                        <div key={i} className="group relative">
                             <SymbolCard 
                                symbol={opt} 
                                size="lg" 
                                className="transform group-hover:-translate-y-2 transition-transform duration-300 shadow-2xl"
                                onClick={() => buySymbol(opt)}
                            />
                            <button 
                                onClick={() => buySymbol(opt)} 
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-600 text-black font-bold text-xs rounded-full shadow-lg hover:bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                            >
                                ACQUIRE
                            </button>
                        </div>
                    ))}
                </div>

                <button onClick={skipShop} className="mt-4 text-gray-500 hover:text-white font-mono text-sm border-b border-transparent hover:border-white transition-colors">
                    [ SKIP MARKET PROTOCOL ]
                </button>
             </div>
        ) : (
            <div className="flex flex-col items-center gap-8 transform scale-100 md:scale-110">
                <Grid grid={gameState.grid} animations={spinResult?.animations || []} />

                {/* Control Panel */}
                <div className="flex items-center gap-6 bg-gray-900/80 p-4 rounded-full border border-gray-700 shadow-2xl backdrop-blur">
                    <div className="text-cyan-400 font-mono font-bold px-4 border-r border-gray-700">
                        <div className="text-[10px] text-gray-500">ENERGY</div>
                        <div className="text-2xl">{gameState.spinsLeft}</div>
                    </div>
                    
                    <button 
                        onClick={handleSpin}
                        disabled={gameState.status === 'spinning' || gameState.spinsLeft <= 0}
                        className={`
                            w-24 h-24 rounded-full font-display text-xl font-black tracking-wider
                            flex items-center justify-center
                            shadow-[0_5px_0_#000] active:shadow-none active:translate-y-[5px]
                            transition-all
                            ${gameState.spinsLeft > 0 
                                ? 'bg-gradient-to-b from-cyan-400 to-blue-600 text-white border-4 border-cyan-300 shadow-[0_0_30px_#06b6d4]' 
                                : 'bg-gray-800 text-gray-600 border-4 border-gray-700 cursor-not-allowed'}
                        `}
                    >
                        {gameState.status === 'spinning' ? <RotateCw className="animate-spin w-8 h-8" /> : "SPIN"}
                    </button>

                    <div className="text-purple-400 font-mono font-bold px-4 border-l border-gray-700">
                        <div className="text-[10px] text-gray-500">MULTIPLIER</div>
                        <div className="text-2xl">x1</div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- RIGHT: LOGS --- */}
      <div className="hidden md:flex w-72 p-4 z-10 flex-col bg-gray-950/90 border-l border-gray-800 backdrop-blur font-mono">
        <div className="text-green-500 text-xs mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> SYSTEM_LOG
        </div>
        <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto hud-scroll space-y-2 p-2 bg-black/60 rounded border border-green-900/30 font-mono text-[11px]"
        >
            {gameState.messages.map((msg) => (
                <div key={msg.id} className={`
                    p-2 border-l-2 leading-tight
                    ${msg.type === 'info' ? 'border-gray-600 text-gray-400' : ''}
                    ${msg.type === 'score' ? 'border-yellow-500 text-yellow-200 bg-yellow-900/10' : ''}
                    ${msg.type === 'danger' ? 'border-red-500 text-red-400 bg-red-900/10' : ''}
                    ${msg.type === 'dealer' ? 'border-purple-500 text-purple-300 bg-purple-900/10' : ''}
                `}>
                    <span className="opacity-50 mr-1">[{new Date().toLocaleTimeString().slice(0,5)}]</span>
                    {msg.text}
                </div>
            ))}
        </div>
        
        {/* Quick Guide */}
        <div className="mt-4 pt-4 border-t border-gray-800">
             <h4 className="text-gray-500 text-[10px] font-bold mb-2 tracking-widest">CHEAT SHEET</h4>
             <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400">
                 <div className="bg-gray-900 p-1 rounded border border-gray-800 text-center">Miner + Ore</div>
                 <div className="bg-gray-900 p-1 rounded border border-gray-800 text-center">Wolf + Moon</div>
                 <div className="bg-gray-900 p-1 rounded border border-gray-800 text-center">Sun + Flower</div>
                 <div className="bg-gray-900 p-1 rounded border border-gray-800 text-center">Hacker + Gem</div>
             </div>
        </div>
      </div>

    </div>
  );
};

export default App;