export function PressureGaugeControl({ label, value, min, max, step, unit, onChange }) {
  const percent = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const angle = -120 + percent * 240; // gauge sweep

  const ticks = Array.from({ length: 6 }).map((_, i) => {
    const tickPercent = i / 5;
    const tickAngle = -120 + tickPercent * 240;
    const tickValue = (min + (max - min) * tickPercent).toFixed(1);
    return { tickAngle, tickValue };
  });

  return (
    <div className="gauge-wrapper">
      <div className="gauge-label-row">
        <span className="gauge-label">{label}</span>
        <span className="gauge-value">{value.toFixed(1)}{unit}</span>
      </div>
      <div className="gauge-face">
        <div className="gauge-outer" />
        <div className="gauge-inner" />
        {ticks.map((tick, idx) => (
          <div
            key={idx}
            className="gauge-tick"
            style={{ transform: `rotate(${tick.tickAngle}deg) translateY(-62%)` }}
          >
            <span
              className="gauge-tick-label"
              style={{ transform: `rotate(${-tick.tickAngle}deg)` }}
            >
              {tick.tickValue}
            </span>
          </div>
        ))}
        <div className="gauge-needle" style={{ transform: `rotate(${angle}deg)` }} />
        <div className="gauge-center">
          <span className="gauge-center-dot" />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="gauge-input"
          aria-label={label}
        />
      </div>
    </div>
  );
}
