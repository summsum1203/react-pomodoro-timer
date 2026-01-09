export default function DurationInput({ label, value, onChange }) {
  return (
    <div className="duration-input">
      <label>{label} (minutes)</label>
      <input
        type="number"
        min="1"
        max="120"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}