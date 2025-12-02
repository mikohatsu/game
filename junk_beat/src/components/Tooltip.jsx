export default function Tooltip({ title, color = '#fff', children }) {
  return (
    <div className="tooltip">
      <div className="tooltip-title" style={{ color }}>{title}</div>
      <div className="tooltip-body">{children}</div>
    </div>
  )
}
