import React, { useEffect } from 'react';
import { BattleScreen } from './components/BattleScreen';
import { ChatBox } from './components/ChatBox';
import { ControlPanel } from './components/ControlPanel';
import { MainMenu } from './components/MainMenu';
import { useGameStore } from './store/gameStore';

const App: React.FC = () => {
  const { autoTick, generateNextEnemy, stage, player, isGameStarted } = useGameStore();

  useEffect(() => {
    if (isGameStarted) {
        generateNextEnemy();
        const interval = setInterval(() => autoTick(), 1000);
        return () => clearInterval(interval);
    }
  }, [autoTick, generateNextEnemy, isGameStarted]);

  if (!isGameStarted) {
      return <MainMenu />;
  }

  return (
    <div className="w-full h-screen bg-[#141517] text-white font-sans flex overflow-hidden">
      
      {/* Left Column: Video Player & Stream Info */}
      <div className="flex-1 flex flex-col min-w-0 relative">
         {/* Video Area */}
         <div className="flex-1 bg-black relative overflow-hidden">
            <BattleScreen />
         </div>
         
         {/* Stream Info Area (Below Video) */}
         <div className="h-24 bg-[#141517] px-6 py-4 border-t border-[#272727] flex items-center justify-between shrink-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden border-2 border-[#00FFA3] p-0.5 shadow-[0_0_15px_#00FFA3]/30">
                   <img 
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${player.streamerName}_${player.reincarnationCount}&backgroundColor=b6e3f4`} 
                    alt="Streamer Avatar" 
                    className="w-full h-full rounded-full"
                   />
                </div>
                <div>
                    <h1 className="text-lg font-black text-gray-100 line-clamp-1 leading-tight tracking-tight">
                        <span className="text-[#00FFA3]">[시즌 {player.reincarnationCount + 1}]</span> [{stage.chapter}-{stage.level}] {player.streamerName}의 방송 ⚔️
                    </h1>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1.5 font-bold uppercase tracking-widest">
                        <span className="text-[#00FFA3]">GAME</span>
                        <span className="opacity-30">|</span>
                        <span>{player.streamerName}</span>
                        <span className="opacity-30">|</span>
                        <span className="text-yellow-400">LIVE NOW</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
               <button className="px-5 py-2 bg-[#ff0033] text-white font-black rounded-lg hover:brightness-110 transition-all flex items-center gap-2 shadow-lg text-xs">
                  <span className="text-base">🔔</span> 구독하기
               </button>
               <button className="px-5 py-2 bg-[#272727] text-gray-200 font-black rounded-lg hover:bg-[#353535] transition-all flex items-center gap-2 text-xs">
                  <span className="text-base">🧀</span> 후원
               </button>
            </div>
         </div>
      </div>

      {/* Right Column: Sidebar (Chat & Controls) */}
      <div className="w-[360px] 2xl:w-[420px] bg-[#141517] border-l border-[#272727] flex flex-col shrink-0 z-30 shadow-2xl">
        <div className="flex-1 min-h-0 flex flex-col border-b border-[#272727]">
           <ChatBox />
        </div>
        <div className="h-[48%] min-h-[350px] bg-[#141517]">
          <ControlPanel />
        </div>
      </div>
    </div>
  );
};

export default App;
