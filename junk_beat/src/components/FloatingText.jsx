export default function FloatingText({ children, tone = 'damage' }) {
  return <div className={`float ${tone}`}>{children}</div>
}
