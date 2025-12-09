export function ParameterSlider({ label, value, min, max, step, unit, onChange }) {
  const displayValue = step >= 1 ? value : value.toFixed(1);

  return (
    <div className="slider-field">
      <div className="slider-label">
        <span>{label}</span>
        <span className="slider-value">{displayValue}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-control"
      />
      <div className="slider-scale">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
