export function ThermometerControl({ label, value, min, max, step, unit, onChange }) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="thermo-wrapper">
      <div className="thermo-label-row">
        <span className="thermo-label">{label}</span>
        <span className="thermo-value">{Math.round(value)}{unit}</span>
      </div>
      <div className="thermo-body">
        <div className="thermo-glass">
          <div className="thermo-mercury" style={{ height: `${percent}%` }} />
          <div className="thermo-bulb" />
          <div className="thermo-ticks">
            {[0, 25, 50, 75, 100].map(mark => (
              <span key={mark} style={{ bottom: `${mark}%` }} className="thermo-tick">
                <span className="thermo-tick-label">
                  {Math.round(min + ((max - min) * mark) / 100)}
                </span>
              </span>
            ))}
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="thermo-input"
            aria-label={label}
          />
        </div>
      </div>
    </div>
  );
}
