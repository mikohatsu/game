import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils';

export const ChatBox: React.FC = () => {
  const { chatMessages, player } = useGameStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="w-full h-full flex flex-col bg-[#141517] overflow-hidden">
      {/* Chat Header */}
      <div className="h-12 border-b border-[#272727] flex items-center justify-between px-4 bg-[#141517] shrink-0">
         <h2 className="font-bold text-gray-200 text-base">실시간 채팅</h2>
         <span className="text-xs text-[#00FFA3] font-black">👥 {formatNumber(player.viewers)}</span>
      </div>

      {/* Messages List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-sm scrollbar-hide bg-[#141517]"
      >
        {chatMessages.map((msg) => (
          <div key={msg.id} className="break-words leading-relaxed">
            {msg.user === '시스템' || msg.user === '알림봇' ? (
                <div className="bg-[#00FFA3]/5 p-2 rounded text-center text-[11px] text-[#00FFA3] font-bold border border-[#00FFA3]/20 my-2">
                    📢 {msg.text}
                </div>
            ) : (
                <>
                    <span className={`font-bold mr-2 ${msg.color} cursor-pointer hover:underline`}>{msg.user}</span>
                    <span className="text-gray-300">{msg.text}</span>
                </>
            )}
          </div>
        ))}
      </div>

      {/* Chat Input Area */}
      <div className="p-4 bg-[#141517] border-t border-[#272727]">
        <div className="relative">
            <input 
                type="text" 
                placeholder="채팅에 참여하려면 로그인이 필요합니다." 
                disabled
                className="w-full bg-[#1e2024] text-gray-400 text-xs px-4 py-3 rounded-full border border-[#2e3035] focus:outline-none cursor-not-allowed"
            />
        </div>
      </div>
    </div>
  );
};
