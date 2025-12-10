import { useRef } from 'react';

export function ThermometerControl({ label, value, min, max, step, unit, onChange }) {
  const percent = ((value - min) / (max - min)) * 100;
  const tubeRef = useRef(null);
  const snapStep = step || 1;

  const handlePointerValue = (clientY) => {
    const rect = tubeRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = 1 - ((clientY - rect.top) / rect.height);
    const clamped = Math.min(1, Math.max(0, ratio));
    const rawValue = min + clamped * (max - min);
    const snapped = Math.round(rawValue / snapStep) * snapStep;
    onChange(Number(snapped.toFixed(2)));
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    handlePointerValue(e.clientY);
    const move = (ev) => handlePointerValue(ev.clientY);
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
          {Math.round(value)}
          <span className="instrument-unit">{unit}</span>
        </span>
      </div>

      <div className="thermo-wrap">
        <div className="thermo-scale thermo-scale-overlay">
          {[0, 25, 50, 75, 100].map((mark) => (
            <div key={mark} className="thermo-scale-mark" style={{ bottom: `${mark}%` }}>
              <span className="thermo-scale-label">
                {Math.round(min + ((max - min) * mark) / 100)}
              </span>
            </div>
          ))}
        </div>

        <div
          ref={tubeRef}
          className="thermo-rail"
          onPointerDown={handlePointerDown}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
        >
          <div className="thermo-rail-face">
            <div className="thermo-fill" style={{ height: `${percent}%` }} />
            <div className="thermo-highlight" />
          </div>
          <div className="thermo-bulb" />

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
        <span className="instrument-minmax">{min}{unit}</span>
        <span className="instrument-minmax">{max}{unit}</span>
      </div>
    </div>
  );
}
