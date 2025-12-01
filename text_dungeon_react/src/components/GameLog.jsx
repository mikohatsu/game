import React, { useEffect, useRef } from 'react';
import { ScrollText } from 'lucide-react';

const LOG_TYPE_STYLES = {
  attack: 'text-red-400',
  danger: 'text-red-500 font-bold',
  heal: 'text-green-400',
  success: 'text-green-500',
  legend: 'text-yellow-400 font-bold',
  system: 'text-blue-400 font-bold',
  normal: 'text-gray-300'
};

const GameLog = ({ logs }) => {
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="panel">
      <h3 className="text-xl font-bold mb-4 text-dungeon-accent flex items-center gap-2">
        <ScrollText className="w-6 h-6" />
        전투 로그
      </h3>
      <div className="bg-black/50 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm border border-gray-700">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">로그가 없습니다...</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`mb-1 ${LOG_TYPE_STYLES[log.type]} animate-slide-up`}
            >
              &gt; {log.message}
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default GameLog;
