export function GameOverScreen({ gameState, onResetGame }) {
  const getEndingContent = () => {
    const endingTypes = {
      true_ending: {
        color: 'var(--color-ancient-gold)',
        bgGradient: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(184, 148, 31, 0.2) 100%)',
        borderColor: 'var(--color-ancient-gold)',
        title: '✨ True Ending: 진리 ✨',
        messages: [
          '"당신은 우주의 섭리를 이해했습니다."',
          '"빚도, 오염도 더 이상 의미가 없습니다."',
          '"당신은 새로운 신이 되었습니다."',
        ],
      },
      normal_a: {
        color: '#22C55E',
        bgGradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.15) 100%)',
        borderColor: '#22C55E',
        title: '🧬 Normal Ending A: 생명',
        messages: [
          '"작은 생명체를 만들었지만,"',
          '"그것은 당신을 아버지라 부르지 않았습니다."',
        ],
      },
      normal_b: {
        color: '#EAB308',
        bgGradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(202, 138, 4, 0.15) 100%)',
        borderColor: '#EAB308',
        title: '👑 Normal Ending B: 부',
        messages: [
          '"당신은 거부가 되었지만,"',
          '"연금술의 진리에는 도달하지 못했습니다."',
        ],
      },
      bankruptcy: {
        color: '#DC2626',
        bgGradient: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(185, 28, 28, 0.15) 100%)',
        borderColor: '#DC2626',
        title: '💸 Bad Ending: 파산',
        messages: [
          '"실험실은 압류되었고,"',
          '"당신은 거리로 나앉았습니다."',
        ],
      },
    };

    return endingTypes[gameState.endingType] || endingTypes.bankruptcy;
  };

  const ending = getEndingContent();

  return (
    <div className="modal-overlay">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1
          className="text-5xl md:text-6xl font-bold"
          style={{
            color: ending.color,
            textShadow: `0 4px 16px ${ending.color}80`,
            filter: `drop-shadow(0 0 20px ${ending.color}60)`
          }}
        >
          {gameState.gameWon ? '🎉 승리!' : '💀 게임오버'}
        </h1>

        <div className="game-card" style={{
          background: ending.bgGradient,
          borderColor: ending.borderColor,
          borderWidth: '3px',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.6), 0 0 40px ${ending.color}30`
        }}>
          <div className="text-2xl md:text-3xl space-y-6 py-4">
            <p
              style={{
                color: ending.color,
                textShadow: `0 2px 8px ${ending.color}60`,
                fontWeight: 'bold',
                fontSize: '1.8rem'
              }}
            >
              {ending.title}
            </p>
            {ending.messages.map((msg, idx) => (
              <p
                key={idx}
                style={{
                  color: 'var(--color-parchment)',
                  lineHeight: '1.8',
                  fontSize: '1.2rem'
                }}
              >
                {msg}
              </p>
            ))}
          </div>
        </div>

        <div className="game-card space-y-3" style={{
          background: 'linear-gradient(135deg, rgba(92, 81, 71, 0.3) 0%, rgba(61, 50, 41, 0.3) 100%)'
        }}>
          <p style={{
            color: 'var(--color-parchment)',
            fontSize: '1.1rem'
          }}>
            최종 날짜: <strong style={{ color: 'var(--color-copper)' }}>{gameState.day}일</strong> ({gameState.week}주차)
          </p>
          <p style={{
            color: 'var(--color-parchment)',
            fontSize: '1.1rem'
          }}>
            총 시도 횟수: <strong style={{ color: 'var(--color-copper)' }}>{gameState.attemptCount}</strong>
          </p>
        </div>

        <button
          onClick={onResetGame}
          className="btn-primary px-12 py-4 text-lg animate-pulse-glow"
        >
          다시 시작하기
        </button>
      </div>
    </div>
  );
}
