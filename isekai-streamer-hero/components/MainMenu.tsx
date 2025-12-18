
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export const MainMenu: React.FC = () => {
  const [name, setName] = useState('');
  const [savedName, setSavedName] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { startGame, hardResetGame } = useGameStore();

  useEffect(() => {
    const stored = localStorage.getItem('isekai_streamer_name');
    if (stored) {
        setSavedName(stored);
        setName(stored);
    }
  }, []);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    startGame(name);
  };

  const handleHardReset = () => {
      if (window.confirm("정말로 모든 데이터를 삭제하고 처음부터 시작하시겠습니까?\n생성된 몬스터/동료 이미지와 저장된 닉네임이 모두 삭제됩니다.")) {
          hardResetGame();
      }
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#141517] flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://api.dicebear.com/9.x/shapes/svg?seed=bg&backgroundColor=000000')] opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
        <div className="text-center space-y-2 animate-bounce-slow">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00FFA3] to-blue-500 italic tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,163,0.5)]">
                이세계 관종 용사
            </h1>
            <p className="text-gray-400 text-sm md:text-base font-bold tracking-widest uppercase">Streamer Hero RPG</p>
        </div>

        {savedName && !isEditing ? (
             <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                <div className="bg-[#1e2024] border-2 border-[#00FFA3] rounded-xl px-8 py-6 w-full text-center relative overflow-hidden shadow-[0_0_30px_rgba(0,255,163,0.1)]">
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">저장된 채널</div>
                    <div className="text-2xl font-black text-white">{savedName}</div>
                    <div className="absolute top-0 right-0 bg-[#00FFA3] text-black text-[9px] font-black px-2 py-1">SELECTED</div>
                </div>

                <button 
                    onClick={() => startGame(savedName)}
                    className="w-full py-4 rounded-xl font-black text-lg bg-[#00FFA3] text-black hover:scale-105 hover:shadow-[0_0_30px_#00FFA3] transition-all"
                >
                    방송 이어하기 (ON AIR)
                </button>

                <div className="flex gap-3 w-full">
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex-1 py-3 bg-[#272727] text-gray-400 text-xs font-bold rounded-lg hover:bg-[#353535] hover:text-white transition-all"
                    >
                        채널명 변경
                    </button>
                    <button 
                        onClick={handleHardReset}
                        className="flex-1 py-3 bg-red-900/30 text-red-500 text-xs font-bold rounded-lg hover:bg-red-900/50 hover:text-red-400 transition-all border border-red-900/50"
                    >
                        새로 하기 (초기화)
                    </button>
                </div>
             </div>
        ) : (
            <form onSubmit={handleStart} className="flex flex-col items-center gap-4 w-full max-w-sm">
                <div className="w-full relative">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="스트리머 닉네임을 입력하세요"
                        className="w-full bg-black/50 border-2 border-white/10 rounded-xl px-6 py-4 text-center text-xl font-bold text-white focus:outline-none focus:border-[#00FFA3] focus:shadow-[0_0_20px_rgba(0,255,163,0.2)] transition-all placeholder:text-gray-600"
                        maxLength={12}
                        autoFocus
                    />
                </div>
                <button 
                    type="submit"
                    disabled={!name.trim()}
                    className={`w-full py-4 rounded-xl font-black text-lg transition-all transform ${name.trim() ? 'bg-[#00FFA3] text-black hover:scale-105 hover:shadow-[0_0_30px_#00FFA3]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                >
                    {isEditing ? '채널명 변경 후 시작' : '방송 시작하기 (ON AIR)'}
                </button>
                
                {isEditing && (
                     <button 
                        type="button" 
                        onClick={() => { setIsEditing(false); setName(savedName || ''); }}
                        className="text-gray-500 text-xs underline hover:text-white"
                     >
                         취소하고 이전 채널로 돌아가기
                     </button>
                )}
            </form>
        )}

        <div className="text-xs text-gray-600 mt-8 font-mono">
            v1.1.0 • POWERED BY GEMINI • CLICKER RPG
        </div>
      </div>
    </div>
  );
};
