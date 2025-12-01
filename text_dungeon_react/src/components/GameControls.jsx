import React from 'react';
import { Swords, ArrowUp, Coffee } from 'lucide-react';

const GameControls = ({ enemy, player, onBattle, onNext, onRest }) => {
  const isDead = player.hp <= 0;

  if (isDead) {
    return (
      <div className="panel text-center min-h-[140px] flex flex-col items-center justify-center">
        <p className="text-3xl mb-4">💀</p>
        <p className="text-xl font-bold text-red-500 mb-4">게임 오버</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          다시 시작
        </button>
      </div>
    );
  }

  return (
    <div className="panel min-h-[140px]">
      <h3 className="text-xl font-bold mb-4 text-dungeon-accent">행동</h3>
      <div className="grid grid-cols-3 gap-3">
        {enemy ? (
          <button
            onClick={onBattle}
            className="btn-primary col-span-3 flex items-center justify-center gap-2 py-4 text-lg"
          >
            <Swords className="w-6 h-6" />
            공격하기
          </button>
        ) : (
          <>
            <button
              onClick={onNext}
              className="btn-primary col-span-2 flex items-center justify-center gap-2"
            >
              <ArrowUp className="w-5 h-5" />
              다음 층
            </button>
            <button
              onClick={onRest}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Coffee className="w-5 h-5" />
              휴식
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GameControls;
