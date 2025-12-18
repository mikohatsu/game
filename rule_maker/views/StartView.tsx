
import React from 'react';
import { Button } from '../components/Button';
import { HorseSprite } from '../components/HorseSprite';

interface StartViewProps {
  onNewGame: () => void;
  onContinue: () => void;
  hasSaveData: boolean;
}

export const StartView: React.FC<StartViewProps> = ({ onNewGame, onContinue, hasSaveData }) => {
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-80 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 z-10"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-1/3 left-0 w-full h-32 opacity-20 pointer-events-none z-0">
         <div className="absolute animate-marquee whitespace-nowrap">
            {Array.from({length: 10}).map((_, i) => (
               <div key={i} className="inline-block mx-12 transform scale-75">
                  <HorseSprite color={i % 2 === 0 ? '#d4af37' : '#555'} isMoving={true} animationSpeed={0.8} />
               </div>
            ))}
         </div>
      </div>

      <div className="relative z-20 text-center flex flex-col items-center p-8 border-y-8 border-double border-yellow-700 bg-black/40 backdrop-blur-sm w-full max-w-4xl">
        
        {/* Title Section */}
        <div className="mb-2 text-yellow-600 font-serif text-lg tracking-[0.5em] uppercase">
            Roguelike Deck-Building Racing
        </div>
        
        <h1 className="text-7xl md:text-9xl font-display text-white mb-4 tracking-tighter drop-shadow-[0_5px_5px_rgba(255,215,0,0.3)]">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-800">
            룰 메이커
          </span>
        </h1>
        
        <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-gray-500"></div>
            <h2 className="text-3xl md:text-4xl font-serif text-gray-300 font-bold italic">
                배팅의 신
            </h2>
            <div className="h-px w-12 bg-gray-500"></div>
        </div>

        <p className="text-gray-400 font-serif text-sm mb-12 opacity-80">
          "승부는 운이 아니다. <span className="text-white font-bold border-b border-white">설계다.</span>"
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-xs animate-fade-in-up">
            {hasSaveData && (
                <Button 
                    variant="gold" 
                    size="lg" 
                    onClick={onContinue}
                    className="w-full py-4 text-xl shadow-[0_0_20px_rgba(212,175,55,0.4)] border-2 border-yellow-200"
                >
                    이어 하기 (CONTINUE)
                </Button>
            )}

            <Button 
                variant={hasSaveData ? "secondary" : "gold"} 
                size="lg" 
                onClick={onNewGame}
                className="w-full py-4 text-lg"
            >
                새로 하기 (NEW GAME)
            </Button>
            
            <div className="mt-4 text-[10px] text-gray-600 font-mono text-center">
                V 1.2.0 | AUTO-SAVE ENABLED
            </div>
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-yellow-800 z-20"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-yellow-800 z-20"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-yellow-800 z-20"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-yellow-800 z-20"></div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
