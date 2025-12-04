export function TutorialModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-4xl w-full">
        {/* 헤더 */}
        <div className="flex justify-between items-center border-b pb-4 mb-6" style={{
          borderColor: 'var(--color-sand-mid)'
        }}>
          <h2 className="text-3xl font-bold" style={{
            color: 'var(--color-ancient-gold)'
          }}>
            📖 게임 가이드
          </h2>
          <button
            onClick={onClose}
            className="text-3xl transition-colors hover:scale-110"
            style={{ color: 'var(--color-rust)' }}
            onMouseEnter={(e) => e.target.style.color = '#DC2626'}
            onMouseLeave={(e) => e.target.style.color = 'var(--color-rust)'}
          >
            ✕
          </button>
        </div>

        {/* 스크롤 가능한 컨텐츠 */}
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* 게임 목표 */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-bronze)' }}>
              🎯 게임 목표
            </h3>
            <div className="p-4 rounded" style={{
              background: 'linear-gradient(135deg, rgba(92, 81, 71, 0.3) 0%, rgba(61, 50, 41, 0.3) 100%)',
              border: '2px solid var(--color-sand-mid)'
            }}>
              <p style={{ color: 'var(--color-parchment)' }}>
                매주 임대료를 납부하면서 Tier 5 레시피{' '}
                <span style={{
                  color: 'var(--color-ancient-gold)',
                  fontWeight: 'bold'
                }}>"아테리우스"</span>를 제작하세요!
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-sand-light)' }}>
                • 임대료는 매 7일마다 납부하며, 금액이 점점 증가합니다.
              </p>
              <p className="text-sm" style={{ color: 'var(--color-sand-light)' }}>
                • 납부하지 못하면 파산으로 게임오버됩니다.
              </p>
            </div>
          </section>

          {/* 조합 시스템 */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-bronze)' }}>
              ⚗️ 조합 시스템
            </h3>
            <div className="p-4 rounded space-y-2" style={{
              background: 'linear-gradient(135deg, rgba(92, 81, 71, 0.3) 0%, rgba(61, 50, 41, 0.3) 100%)',
              border: '2px solid var(--color-sand-mid)'
            }}>
              <p><strong style={{ color: 'var(--color-copper)' }}>1. 재료 선택:</strong> 인벤토리에서 재료 2개를 선택합니다.</p>
              <p><strong style={{ color: 'var(--color-copper)' }}>2. 파라미터 조절:</strong> 온도(T), 압력(P), 농도(C)를 슬라이더로 조절합니다.</p>
              <p><strong style={{ color: 'var(--color-copper)' }}>3. 조합 실행:</strong> 2 AP를 소모하여 조합을 실행합니다.</p>
              <p className="text-sm mt-2" style={{
                color: 'var(--color-ancient-gold)',
                background: 'rgba(212, 175, 55, 0.1)',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid var(--color-ancient-gold-dark)'
              }}>
                💡 목표값에 가까울수록 높은 등급(S→A→B→C)을 받습니다!
              </p>
            </div>
          </section>

          {/* 등급 시스템 */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-bronze)' }}>
              🏆 등급 시스템
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <div className="p-3 rounded text-center" style={{
                background: 'linear-gradient(135deg, #D4AF37 10%, rgba(212, 175, 55, 0.2) 100%)',
                border: '2px solid var(--color-ancient-gold)'
              }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--color-ancient-gold)' }}>S</div>
                <div className="text-xs">편차 &lt;1%</div>
                <div className="text-xs font-bold">가격 2.0배</div>
              </div>
              <div className="p-3 rounded text-center" style={{
                background: 'linear-gradient(135deg, #4ADE80 10%, rgba(74, 222, 128, 0.2) 100%)',
                border: '2px solid #22C55E'
              }}>
                <div className="text-2xl font-bold text-green-400">A</div>
                <div className="text-xs">편차 &lt;3%</div>
                <div className="text-xs font-bold">가격 1.5배</div>
              </div>
              <div className="p-3 rounded text-center" style={{
                background: 'linear-gradient(135deg, #60A5FA 10%, rgba(96, 165, 250, 0.2) 100%)',
                border: '2px solid #3B82F6'
              }}>
                <div className="text-2xl font-bold text-blue-400">B</div>
                <div className="text-xs">편차 &lt;6%</div>
                <div className="text-xs font-bold">가격 1.0배</div>
              </div>
              <div className="p-3 rounded text-center" style={{
                background: 'linear-gradient(135deg, #FB923C 10%, rgba(251, 146, 60, 0.2) 100%)',
                border: '2px solid #F97316'
              }}>
                <div className="text-2xl font-bold text-orange-400">C</div>
                <div className="text-xs">편차 &lt;10%</div>
                <div className="text-xs font-bold">가격 0.5배</div>
              </div>
              <div className="p-3 rounded text-center" style={{
                background: 'linear-gradient(135deg, #EF4444 10%, rgba(239, 68, 68, 0.2) 100%)',
                border: '2px solid #DC2626'
              }}>
                <div className="text-2xl font-bold text-red-400">F</div>
                <div className="text-xs">편차 ≥10%</div>
                <div className="text-xs font-bold">실패</div>
              </div>
            </div>
          </section>

          {/* 오염도 시스템 */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-bronze)' }}>
              ☢️ 오염도 시스템
            </h3>
            <div className="p-4 rounded space-y-2" style={{
              background: 'linear-gradient(135deg, rgba(92, 81, 71, 0.3) 0%, rgba(61, 50, 41, 0.3) 100%)',
              border: '2px solid var(--color-sand-mid)'
            }}>
              <p style={{ color: 'var(--color-parchment)' }}>
                실험을 할 때마다 오염도가 증가합니다. 등급이 낮을수록 더 많이 증가합니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                <div className="p-2 rounded" style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '2px solid rgba(34, 197, 94, 0.4)'
                }}>
                  <strong className="text-green-400">Lv.0 (0~49):</strong> 안정 상태
                </div>
                <div className="p-2 rounded" style={{
                  background: 'rgba(234, 179, 8, 0.1)',
                  border: '2px solid rgba(234, 179, 8, 0.4)'
                }}>
                  <strong className="text-yellow-400">Lv.1 (50~99):</strong> 경고
                </div>
                <div className="p-2 rounded" style={{
                  background: 'rgba(249, 115, 22, 0.1)',
                  border: '2px solid rgba(249, 115, 22, 0.4)'
                }}>
                  <strong className="text-orange-400">Lv.2 (100~149):</strong> 위험 - 슬라이더 노이즈 발생
                </div>
                <div className="p-2 rounded" style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '2px solid rgba(220, 38, 38, 0.4)'
                }}>
                  <strong className="text-red-400">Lv.3 (150~200):</strong> 돌연변이 활성화 (5% 확률)
                </div>
              </div>
              <p className="text-sm mt-2" style={{
                color: 'var(--color-bronze-light)',
                background: 'rgba(184, 115, 51, 0.15)',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid var(--color-copper)'
              }}>
                💎 돌연변이 아이템은 일반 아이템보다 훨씬 비싸게 팔립니다!
              </p>
            </div>
          </section>

          {/* 도서관 탐사 */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-bronze)' }}>
              📚 도서관 탐사
            </h3>
            <div className="p-4 rounded space-y-2" style={{
              background: 'linear-gradient(135deg, rgba(92, 81, 71, 0.3) 0%, rgba(61, 50, 41, 0.3) 100%)',
              border: '2px solid var(--color-sand-mid)'
            }}>
              <p style={{ color: 'var(--color-parchment)' }}>
                3 AP를 소모하여 새로운 레시피의 단서를 찾을 수 있습니다.
              </p>
              <p><strong style={{ color: 'var(--color-copper)' }}>• 성공 (40%):</strong> 레시피의 단서를 획득합니다.</p>
              <p><strong style={{ color: 'var(--color-copper)' }}>• 대성공 (10%):</strong> 레시피의 정확한 목표값을 획득합니다!</p>
              <p><strong style={{ color: 'var(--color-copper)' }}>• 실패 (50%):</strong> 아무것도 얻지 못합니다.</p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-sand-light)' }}>
                현재 주차에 따라 발견할 수 있는 Tier가 결정됩니다.
              </p>
            </div>
          </section>

          {/* 업그레이드 */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-bronze)' }}>
              🔧 시설 업그레이드
            </h3>
            <div className="p-4 rounded space-y-2" style={{
              background: 'linear-gradient(135deg, rgba(92, 81, 71, 0.3) 0%, rgba(61, 50, 41, 0.3) 100%)',
              border: '2px solid var(--color-sand-mid)'
            }}>
              <p style={{ color: 'var(--color-parchment)' }}>
                골드를 소모하여 실험실을 업그레이드할 수 있습니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                <div className="p-2 rounded" style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '2px solid rgba(168, 85, 247, 0.3)'
                }}>
                  <strong style={{ color: 'var(--color-bronze-light)' }}>장비:</strong> 정밀도 향상
                </div>
                <div className="p-2 rounded" style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '2px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <strong style={{ color: 'var(--color-bronze-light)' }}>도서관:</strong> 탐사 효율 증가
                </div>
                <div className="p-2 rounded" style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '2px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <strong style={{ color: 'var(--color-bronze-light)' }}>환경:</strong> 오염도 감소
                </div>
              </div>
            </div>
          </section>

          {/* 비망록 */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-bronze)' }}>
              📖 비망록
            </h3>
            <div className="p-4 rounded" style={{
              background: 'linear-gradient(135deg, rgba(92, 81, 71, 0.3) 0%, rgba(61, 50, 41, 0.3) 100%)',
              border: '2px solid var(--color-sand-mid)'
            }}>
              <p style={{ color: 'var(--color-parchment)' }}>
                성공한 레시피는 자동으로 비망록에 기록됩니다.
              </p>
              <p style={{ color: 'var(--color-parchment)' }}>
                최고 기록의 파라미터를 불러와서 빠르게 재조합할 수 있습니다!
              </p>
            </div>
          </section>

          {/* 팁 */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-ancient-gold)' }}>
              💡 게임 팁
            </h3>
            <div className="p-4 rounded space-y-1 text-sm" style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '2px solid var(--color-ancient-gold-dark)',
              color: 'var(--color-parchment)'
            }}>
              <p>• 레시피 단서를 잘 읽고 목표값을 추리하세요!</p>
              <p>• 높은 등급으로 제작하면 더 비싸게 팔 수 있습니다.</p>
              <p>• 오염도가 높으면 돌연변이 아이템을 노려볼 수 있습니다.</p>
              <p>• AP는 하루가 끝나면 10으로 회복됩니다.</p>
              <p>• 업그레이드는 영구적이므로 전략적으로 구매하세요.</p>
              <p>• 일부 레시피는 다른 레시피의 결과물을 재료로 사용합니다.</p>
            </div>
          </section>
        </div>

        {/* 닫기 버튼 */}
        <div className="text-center pt-6 border-t mt-6" style={{
          borderColor: 'var(--color-sand-mid)'
        }}>
          <button onClick={onClose} className="btn-primary px-10 py-3 text-lg">
            시작하기 →
          </button>
        </div>
      </div>
    </div>
  );
}
