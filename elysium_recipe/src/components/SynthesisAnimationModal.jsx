import { useEffect, useState } from 'react';

export function SynthesisAnimationModal({ grade, onComplete }) {
  const [phase, setPhase] = useState('mixing'); // mixing -> result

  useEffect(() => {
    // 1초 후 결과 표시
    const timer = setTimeout(() => {
      setPhase('result');
    }, 1000);

    // 2초 후 모달 닫기
    const closeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [onComplete]);

  const getGradeData = () => {
    switch (grade) {
      case 'S':
        return {
          title: '🌟 대성공! 🌟',
          message: '완벽한 연금술입니다!',
          color: 'from-yellow-400 via-amber-400 to-yellow-500',
          icon: '✨',
          glow: 'shadow-[0_0_60px_rgba(251,191,36,0.8)]'
        };
      case 'A':
        return {
          title: '🎉 훌륭합니다! 🎉',
          message: '매우 우수한 결과입니다!',
          color: 'from-purple-400 via-pink-400 to-purple-500',
          icon: '⭐',
          glow: 'shadow-[0_0_50px_rgba(192,132,252,0.7)]'
        };
      case 'B':
        return {
          title: '✅ 합성 성공!',
          message: '안정적인 합성입니다.',
          color: 'from-blue-400 via-cyan-400 to-blue-500',
          icon: '👍',
          glow: 'shadow-[0_0_40px_rgba(96,165,250,0.6)]'
        };
      case 'C':
        return {
          title: '🤔 합성 성공...?',
          message: '예상과 조금 다른 결과...',
          color: 'from-gray-400 via-slate-400 to-gray-500',
          icon: '😅',
          glow: 'shadow-[0_0_30px_rgba(148,163,184,0.5)]'
        };
      case 'F':
      default:
        return {
          title: '💥 실패... 💥',
          message: '실험이 실패했습니다...',
          color: 'from-red-500 via-orange-500 to-red-600',
          icon: '😱',
          glow: 'shadow-[0_0_50px_rgba(239,68,68,0.7)]'
        };
    }
  };

  const gradeData = getGradeData();

  return (
    <div className="modal-overlay synthesis-modal">
      <div className="synthesis-modal-content">
        {phase === 'mixing' ? (
          // 합성 중 애니메이션
          <div className="mixing-animation">
            <div className="alchemy-circle">
              <svg width="200" height="200" viewBox="0 0 200 200" className="alchemy-svg">
                <defs>
                  <linearGradient id="alchemyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#B87333" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#B87333" />
                  </linearGradient>
                </defs>

                {/* 외부 원 */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="url(#alchemyGradient)"
                  strokeWidth="3"
                  className="circle-rotate"
                />

                {/* 중간 원 */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="url(#alchemyGradient)"
                  strokeWidth="2"
                  className="circle-rotate-reverse"
                  opacity="0.7"
                />

                {/* 내부 원 */}
                <circle
                  cx="100"
                  cy="100"
                  r="50"
                  fill="none"
                  stroke="url(#alchemyGradient)"
                  strokeWidth="2"
                  className="circle-rotate"
                  opacity="0.5"
                />

                {/* 중앙 삼각형 */}
                <polygon
                  points="100,60 130,115 70,115"
                  fill="none"
                  stroke="url(#alchemyGradient)"
                  strokeWidth="2"
                  className="triangle-pulse"
                />

                {/* 역삼각형 */}
                <polygon
                  points="100,140 130,85 70,85"
                  fill="none"
                  stroke="url(#alchemyGradient)"
                  strokeWidth="2"
                  className="triangle-pulse-reverse"
                  opacity="0.6"
                />

                {/* 중앙 점들 */}
                <circle cx="100" cy="100" r="5" fill="#D4AF37" className="center-pulse" />
                <circle cx="100" cy="60" r="3" fill="#B87333" className="dot-pulse" />
                <circle cx="130" cy="115" r="3" fill="#B87333" className="dot-pulse" style={{ animationDelay: '0.2s' }} />
                <circle cx="70" cy="115" r="3" fill="#B87333" className="dot-pulse" style={{ animationDelay: '0.4s' }} />
              </svg>
            </div>
            <p className="text-xl text-center mt-4 text-bronze animate-pulse font-bold">
              ⚗️ 연금술 진행 중... ⚗️
            </p>
          </div>
        ) : (
          // 결과 표시
          <div className={`result-animation ${gradeData.glow}`}>
            <div className={`grade-result bg-gradient-to-br ${gradeData.color} text-white`}>
              <div className="result-icon text-6xl mb-4 animate-bounce">
                {gradeData.icon}
              </div>
              <h2 className="text-3xl font-bold mb-2 result-title">
                {gradeData.title}
              </h2>
              <p className="text-lg opacity-90">
                {gradeData.message}
              </p>
              <div className="grade-badge-large mt-4">
                {grade}
              </div>
            </div>

            {/* 파티클 효과 */}
            <div className="particles">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    '--angle': `${(360 / 12) * i}deg`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
