export function ParameterSlider({ label, value, min, max, step, unit, onChange }) {
  const displayValue = step >= 1 ? value : value.toFixed(1);

  return (
    <div>
      <label className="text-sm text-gray-400">
        {label}: {displayValue}{unit}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
