import { useCallback, useEffect, useRef, useState } from 'react';

export function ItemCard({ item, count, onSell, canSell }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSellPopup, setShowSellPopup] = useState(false);
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleClick = (e) => {
    if (canSell && onSell) {
      e.stopPropagation();
      setShowSellPopup((prev) => !prev);
    }
  };

  const handleSell = (e) => {
    e.stopPropagation();
    onSell();
    setShowSellPopup(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setShowSellPopup(false);
  };

  // 판매 단가 (tier 기반)
  const getSellPrice = () => {
    if (!item.tier) return 0;
    return item.tier * 10;
  };

  return (
    <div className="item-card-wrapper">
      <div
        ref={cardRef}
        className={`item-card ${canSell ? 'item-sellable' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="item-icon">{item.icon}</div>
        <div className="item-name">{item.name}</div>
        <div className="item-count">x{count}</div>

        {/* 판매 가능 뱃지 */}
        {canSell && (
          <div className="sell-badge">
            판매
          </div>
        )}
      </div>

      {/* 툴팁 (뷰포트 기준 고정 좌표) */}
      {showTooltip && (
        <div className="item-tooltip floating-tooltip">
          <div className="tooltip-header">
            <span className="tooltip-icon">{item.icon}</span>
            <span className="tooltip-title">{item.name}</span>
          </div>
          <div className="tooltip-divider"></div>
          <div className="tooltip-description">{item.description}</div>
          {item.tier && (
            <div className="tooltip-tier">티어: {item.tier}</div>
          )}
          {canSell && (
            <>
              <div className="tooltip-divider"></div>
              <div className="tooltip-sell-price">
                판매 단가 {getSellPrice()}G
              </div>
            </>
          )}
        </div>
      )}

      {/* 판매 팝업 */}
      {showSellPopup && (
        <div className="sell-popup floating-popup">
          <div className="sell-popup-content">
            <div className="sell-popup-title">
              {item.icon} {item.name}
            </div>
            <div className="sell-popup-price">
              판매 {getSellPrice()}G
            </div>
            <div className="sell-popup-buttons">
              <button onClick={handleSell} className="btn-sell">
                판매
              </button>
              <button onClick={handleCancel} className="btn-cancel">
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
