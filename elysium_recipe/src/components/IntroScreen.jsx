import { useState } from 'react';

export function IntroScreen({ onComplete }) {
  const [page, setPage] = useState(0);

  const pages = [
    {
      title: '엘리시움의 레시피',
      subtitle: '잊혀진 실험실의 유산',
      content: [
        '번영했던 연금술 도시 "엘리시움"이',
        '알 수 없는 대재앙으로 몰락한 지 수백 년...',
        '',
        '당신은 폐허 깊은 곳에서',
        '고대 연금술 실험실을 발견했습니다.',
      ],
    },
    {
      title: '오염된 유산',
      content: [
        '이 실험실은 완벽한 물질을 만들 수 있는',
        '정교함을 가졌으나...',
        '',
        '대재앙의 잔재인 알 수 없는 "오염 물질"이',
        '공기 중에 퍼져 있어',
        '모든 실험 결과에 예측 불가능한 변수를 만듭니다.',
      ],
    },
    {
      title: '빚쟁이의 편지',
      content: [
        '실험실을 탐험하던 중,',
        '낡은 편지 한 통을 발견합니다.',
        '',
        '"매주 500골드씩 임대료를 보내라."',
        '"납부하지 않으면 압류한다."',
        '',
        '...이미 시작된 게임입니다.',
      ],
    },
    {
      title: '연금술의 정점을 향해',
      content: [
        '오염을 제어하거나, 역으로 활용하여',
        '기성 레시피에는 없는 "돌연변이" 물질을',
        '만들어낼 수도 있습니다.',
        '',
        '빚의 압박 속에서',
        '당신은 연금술의 정점',
        '"아테리우스(Aetherius)"에 도달할 수 있을까요?',
      ],
    },
  ];

  const currentPage = pages[page];

  return (
    <div className="modal-overlay">
      <div className="max-w-3xl w-full space-y-8">
        {/* 제목 */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl md:text-6xl font-bold" style={{
            color: 'var(--color-ancient-gold)',
            textShadow: '0 4px 12px rgba(212, 175, 55, 0.6)'
          }}>
            {currentPage.title}
          </h1>
          {currentPage.subtitle && (
            <p className="text-2xl" style={{ color: 'var(--color-parchment-dark)' }}>
              {currentPage.subtitle}
            </p>
          )}
        </div>

        {/* 내용 */}
        <div className="game-card min-h-[350px] flex items-center justify-center">
          <div className="text-center space-y-5 text-lg md:text-xl leading-relaxed" style={{
            color: 'var(--color-parchment)'
          }}>
            {currentPage.content.map((line, i) => (
              <p key={i} className={line === '' ? 'h-6' : ''} style={{
                lineHeight: '1.8'
              }}>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* 페이지 인디케이터 */}
        <div className="flex justify-center gap-3">
          {pages.map((_, i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all ${
                i === page ? 'w-12' : 'w-2.5'
              }`}
              style={{
                backgroundColor: i === page ? 'var(--color-bronze)' : 'var(--color-sand-mid)',
                boxShadow: i === page ? '0 0 10px rgba(184, 115, 51, 0.6)' : 'none'
              }}
            />
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex justify-between gap-4">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="btn-secondary px-6 py-3"
          >
            ← 이전
          </button>

          {page < pages.length - 1 ? (
            <button
              onClick={() => setPage(page + 1)}
              className="btn-primary px-6 py-3"
            >
              다음 →
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="btn-primary px-8 py-3 animate-pulse-glow"
            >
              게임 시작 ⚗️
            </button>
          )}
        </div>

        {/* 스킵 버튼 */}
        <div className="text-center">
          <button
            onClick={onComplete}
            className="transition-all"
            style={{
              color: 'var(--color-sand-light)',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-parchment)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--color-sand-light)'}
          >
            스킵 (Space)
          </button>
        </div>
      </div>
    </div>
  );
}
