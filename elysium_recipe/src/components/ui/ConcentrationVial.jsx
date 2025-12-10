export function ConcentrationVial({ label, value, min, max, step, unit, onChange }) {
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="vial-wrapper">
      <div className="vial-label-row">
        <span className="vial-label">{label}</span>
        <span className="vial-value">{Math.round(value)}{unit}</span>
      </div>
      <div className="vial-body">
        <div className="vial-fill" style={{ width: `${percent}%` }} />
        <div className="vial-bubbles">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="vial-bubble"
              style={{
                left: `${10 + i * 14}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="vial-input"
          aria-label={label}
        />
      </div>
      <div className="vial-scale">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
