import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const MainMenu: React.FC = () => {
  const [name, setName] = useState('');
  const { startGame } = useGameStore();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    startGame(name);
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
                방송 시작하기 (ON AIR)
            </button>
        </form>

        <div className="text-xs text-gray-600 mt-8 font-mono">
            v1.0.0 • POWERED BY GEMINI • CLICKER RPG
        </div>
      </div>
    </div>
  );
};
