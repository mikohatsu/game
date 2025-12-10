import { useRef } from 'react';

export function PressureGaugeControl({ label, value, min, max, step, unit, onChange }) {
  const percent = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const angle = -120 + percent * 240;
  const unitLabel = (unit || '').trim() || unit;
  const dialRef = useRef(null);
  const snapStep = step || 0.1;

  const ticks = Array.from({ length: 11 }).map((_, i) => {
    const tickPercent = i / 10;
    const tickAngle = -120 + tickPercent * 240;
    const tickValue = (min + (max - min) * tickPercent).toFixed(1);
    return { tickAngle, tickValue, heavy: i % 2 === 0 };
  });

  const quickSet = (val) => onChange(Number(val.toFixed(1)));

  const handlePointerValue = (clientX, clientY) => {
    const rect = dialRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.62;
    const dx = clientX - cx;
    const dy = clientY - cy;
    let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (deg > 180) deg -= 360;
    const clamped = Math.min(120, Math.max(-120, deg));
    const ratio = (clamped + 120) / 240;
    const rawValue = min + ratio * (max - min);
    const snapped = Math.round(rawValue / snapStep) * snapStep;
    onChange(Number(snapped.toFixed(2)));
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    handlePointerValue(e.clientX, e.clientY);
    const move = (ev) => handlePointerValue(ev.clientX, ev.clientY);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <div className="instrument-card">
      <div className="instrument-head">
        <span className="instrument-title">{label}</span>
        <span className="instrument-value">
          {value.toFixed(1)}
          <span className="instrument-unit">{unitLabel}</span>
        </span>
      </div>

      <div className="dial-wrap">
        <div
          ref={dialRef}
          className="dial"
          style={{ '--dial-percent': `${percent * 100}%` }}
          onPointerDown={handlePointerDown}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
        >
          <div className="dial-face">
            <div className="dial-gradient" />
            <div className="dial-safe" />
            <div className="dial-hot" />

            {ticks.map((tick, idx) => (
              <div
                key={idx}
                className={`dial-tick ${tick.heavy ? 'dial-tick-strong' : ''}`}
                style={{ transform: `rotate(${tick.tickAngle}deg)` }}
              >
                {tick.heavy && (
                  <span className="dial-tick-label" style={{ transform: `rotate(${-tick.tickAngle}deg)` }}>
                    {tick.tickValue}
                  </span>
                )}
              </div>
            ))}

            <div className="dial-needle" style={{ transform: `rotate(${angle}deg)` }}>
              <div className="dial-needle-base" />
              <div className="dial-needle-body" />
            </div>
            <div className="dial-center-cap" />
          </div>

          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="instrument-input"
            aria-label={label}
          />
        </div>
      </div>

      <div className="instrument-foot">
        <div className="chip-row">
          {[1, 2.5, 5, 7.5, 10].map((preset) => (
            <button
              key={preset}
              type="button"
              className={`chip ${Math.abs(value - preset) < 0.11 ? 'chip-active' : ''}`}
              onClick={() => quickSet(preset)}
            >
              {preset}{unitLabel}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
