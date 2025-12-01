import React, { useEffect, useState } from 'react';

const FloatingNumber = ({ value, type, onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onComplete) onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  const isDamage = type === 'damage';
  const isHeal = type === 'heal';

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none z-50 ${
        isDamage ? 'animate-damage-pop' : 'animate-heal-fade'
      }`}
    >
      <span
        className={`text-6xl font-black ${
          isDamage
            ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]'
            : 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]'
        }`}
        style={{
          textShadow: isDamage
            ? '0 0 20px rgba(239,68,68,1), 0 0 40px rgba(239,68,68,0.5)'
            : '0 0 15px rgba(74,222,128,0.8)'
        }}
      >
        {isDamage ? `-${value}` : `+${value}`}
      </span>
    </div>
  );
};

export default FloatingNumber;
