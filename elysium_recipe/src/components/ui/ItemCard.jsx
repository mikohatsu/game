import { useCallback, useEffect, useRef, useState } from 'react';

export function ItemCard({ item, count, onSell, canSell }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSellPopup, setShowSellPopup] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const cardRef = useRef(null);

  const getAnchorPosition = useCallback(() => {
    if (!cardRef.current) return null;
    const rect = cardRef.current.getBoundingClientRect();
    return {
      x: rect.left + (rect.width / 2),
      y: Math.max(rect.top, 12)
    };
  }, []);

  const handleMouseEnter = () => {
    const anchor = getAnchorPosition();
    if (anchor) {
      setTooltipPosition(anchor);
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleClick = (e) => {
    if (canSell && onSell) {
      e.stopPropagation();
      const anchor = getAnchorPosition();
      setPopupPosition(anchor || { x: e.clientX, y: e.clientY });
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

  useEffect(() => {
    if (!showTooltip && !showSellPopup) return;

    const handleReposition = () => {
      const anchor = getAnchorPosition();
      if (!anchor) return;

      if (showTooltip) {
        setTooltipPosition(anchor);
      }
      if (showSellPopup) {
        setPopupPosition(anchor);
      }
    };

    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);

    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [getAnchorPosition, showTooltip, showSellPopup]);

  // ?愲Г 臧€瓴?瓿勳偘 (tier???半澕)
  const getSellPrice = () => {
    if (!item.tier) return 0;
    return item.tier * 10;
  };

  return (
    <>
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

        {/* ?愲Г 臧€???滌嫓 */}
        {canSell && (
          <div className="sell-badge">
            ?挵
          </div>
        )}

        {/* ?错寔 (旃措摐 ?措???absolute positioning) */}
        {showTooltip && tooltipPosition && (
          <div
            className="item-tooltip"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`
            }}
          >
            <div className="tooltip-header">
              <span className="tooltip-icon">{item.icon}</span>
              <span className="tooltip-title">{item.name}</span>
            </div>
            <div className="tooltip-divider"></div>
            <div className="tooltip-description">{item.description}</div>
            {item.tier && (
              <div className="tooltip-tier">?办柎: {item.tier}</div>
            )}
            {canSell && (
              <>
                <div className="tooltip-divider"></div>
                <div className="tooltip-sell-price">
                  ?挵 ?愲Г 臧€瓴? {getSellPrice()}G
                </div>
              </>
            )}
          </div>
        )}

        {/* ?愲Г ?濎梾 */}
        {showSellPopup && popupPosition && (
          <div
            className="sell-popup"
            style={{
              left: `${popupPosition.x}px`,
              top: `${popupPosition.y}px`
            }}
          >
            <div className="sell-popup-content">
              <div className="sell-popup-title">
                {item.icon} {item.name}
              </div>
              <div className="sell-popup-price">
                ?挵 {getSellPrice()}G
              </div>
              <div className="sell-popup-buttons">
                <button onClick={handleSell} className="btn-sell">
                  ?愲Г
                </button>
                <button onClick={handleCancel} className="btn-cancel">
                  旆唽
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
