import React, { useState } from 'react';
import { Horse, BettingType } from '../types';

interface BettingTicketProps {
  horses: Horse[];
  bettingType: BettingType;
  selectedHorseId: number | null;
  secondHorseId: number | null;
  onSelectHorse: (id: number) => void;
  onSelectSecondHorse: (id: number) => void;
  onSelectType: (type: BettingType) => void;
  amount: number;
}

export const BettingTicket: React.FC<BettingTicketProps> = ({ 
  horses, 
  bettingType,
  selectedHorseId, 
  secondHorseId,
  onSelectHorse, 
  onSelectSecondHorse,
  onSelectType,
  amount 
}) => {
  const [isHorseDropdownOpen, setIsHorseDropdownOpen] = useState(false);
  const [isSecondHorseDropdownOpen, setIsSecondHorseDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  
  const selectedHorse = horses.find(h => h.id === selectedHorseId);
  const secondHorse = horses.find(h => h.id === secondHorseId);

  // Approximate Odds Calculation for Display
  let displayOdds = 0;
  if (bettingType === BettingType.WIN && selectedHorse) {
    displayOdds = selectedHorse.odds;
  } else if (bettingType === BettingType.PLACE && selectedHorse) {
    displayOdds = Math.round(selectedHorse.odds / 3 * 10) / 10;
  } else if (bettingType === BettingType.QUINELLA && selectedHorse && secondHorse) {
    // Averaged odds with a multiplier bonus for difficulty
    displayOdds = Math.round(((selectedHorse.odds + secondHorse.odds) / 2 * 1.5) * 10) / 10;
  }

  const potentialWin = Math.floor(amount * (displayOdds || 0));
  const isComplete = bettingType === BettingType.QUINELLA ? (selectedHorse && secondHorse) : !!selectedHorse;

  return (
    <div className="bg-white text-black p-5 rounded-sm shadow-xl relative rotate-1 max-w-sm mx-auto border-t-8 border-pink-500 font-mono select-none">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-50 pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-end border-b-2 border-dashed border-black pb-4 mb-4">
        <div>
          <h2 className="text-xl font-black tracking-tighter">SEOUL RACECOURSE</h2>
          <p className="text-[10px] text-gray-600">OFFICIAL BETTING SLIP</p>
        </div>
        <div className="text-right">
          <div className={`border-2 px-2 py-1 font-bold text-sm transform -rotate-6 
            ${isComplete ? 'text-red-600 border-red-600' : 'text-gray-400 border-gray-400'}`}>
            {isComplete ? "승인 완료" : "작성 중"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 mb-6 relative">
        
        {/* Type Selector */}
        <div>
          <span className="text-xs font-bold text-gray-500 block mb-1">GAME TYPE</span>
          <div 
             className="border-2 border-black p-2 font-bold cursor-pointer hover:bg-gray-100 flex justify-between"
             onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
          >
            {bettingType}
            <span>▼</span>
          </div>
          {isTypeDropdownOpen && (
             <div className="absolute left-0 right-0 bg-white border-2 border-black z-50 mt-1 shadow-lg">
                {Object.values(BettingType).map(t => (
                  <div key={t} className="p-2 hover:bg-pink-100 cursor-pointer" 
                       onClick={() => { onSelectType(t); setIsTypeDropdownOpen(false); }}>
                    {t}
                  </div>
                ))}
             </div>
          )}
        </div>
        
        {/* Horse 1 Selector */}
        <div className="relative">
          <span className="text-xs font-bold text-gray-500 block mb-1">
             {bettingType === BettingType.QUINELLA ? "1st HORSE" : "SELECT HORSE"}
          </span>
          <div 
            className="flex justify-between items-center bg-gray-100 p-2 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200"
            onClick={() => setIsHorseDropdownOpen(!isHorseDropdownOpen)}
          >
            {selectedHorse ? (
              <div className="flex items-center gap-2 w-full">
                <div className="w-5 h-5 rounded-full text-white flex items-center justify-center font-bold text-xs" style={{backgroundColor: selectedHorse.color}}>
                  {selectedHorse.number}
                </div>
                <span className="font-bold text-sm truncate">{selectedHorse.name}</span>
              </div>
            ) : (
              <span className="text-gray-400 text-sm">선택</span>
            )}
            <span className="text-xs">▼</span>
          </div>

          {isHorseDropdownOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-2 border-black z-40 max-h-48 overflow-y-auto shadow-xl">
              {horses.map(h => (
                <div 
                  key={h.id}
                  className={`flex items-center gap-2 p-2 hover:bg-pink-100 cursor-pointer border-b border-gray-100 ${h.id === secondHorseId ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => {
                    onSelectHorse(h.id);
                    setIsHorseDropdownOpen(false);
                  }}
                >
                   <div className="w-4 h-4 rounded-full text-white flex items-center justify-center font-bold text-[10px]" style={{backgroundColor: h.color}}>{h.number}</div>
                   <span className="text-sm font-bold">{h.name}</span>
                   <span className="ml-auto text-xs text-gray-500">x{h.odds}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Horse 2 Selector (Only for Quinella) */}
        {bettingType === BettingType.QUINELLA && (
          <div className="relative animate-fade-in">
            <span className="text-xs font-bold text-gray-500 block mb-1">2nd HORSE</span>
            <div 
              className="flex justify-between items-center bg-gray-100 p-2 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-200"
              onClick={() => setIsSecondHorseDropdownOpen(!isSecondHorseDropdownOpen)}
            >
              {secondHorse ? (
                <div className="flex items-center gap-2 w-full">
                  <div className="w-5 h-5 rounded-full text-white flex items-center justify-center font-bold text-xs" style={{backgroundColor: secondHorse.color}}>
                    {secondHorse.number}
                  </div>
                  <span className="font-bold text-sm truncate">{secondHorse.name}</span>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">선택</span>
              )}
              <span className="text-xs">▼</span>
            </div>

            {isSecondHorseDropdownOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-black z-40 max-h-48 overflow-y-auto shadow-xl">
                {horses.map(h => (
                  <div 
                    key={h.id}
                    className={`flex items-center gap-2 p-2 hover:bg-pink-100 cursor-pointer border-b border-gray-100 ${h.id === selectedHorseId ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => {
                      onSelectSecondHorse(h.id);
                      setIsSecondHorseDropdownOpen(false);
                    }}
                  >
                     <div className="w-4 h-4 rounded-full text-white flex items-center justify-center font-bold text-[10px]" style={{backgroundColor: h.color}}>{h.number}</div>
                     <span className="text-sm font-bold">{h.name}</span>
                     <span className="ml-auto text-xs text-gray-500">x{h.odds}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200">
          <span className="text-sm font-bold text-gray-500">BET</span>
          <span className="text-lg font-bold">₩ {amount.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-pink-600">
          <span className="text-sm font-bold">PAYOUT (x{displayOdds})</span>
          <span className="text-lg font-black">₩ {potentialWin.toLocaleString()}</span>
        </div>
      </div>

      <div className="absolute -left-3 top-1/2 w-6 h-6 bg-slate-900 rounded-full"></div>
      <div className="absolute -right-3 top-1/2 w-6 h-6 bg-slate-900 rounded-full"></div>
    </div>
  );
};