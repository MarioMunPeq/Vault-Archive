import './StatusBar.css'

export function StatusBar() {
  return (
    <div className="statusbar" role="status">
      <span className="statusbar__field">
        <span className="statusbar__label">HP</span>
        <span className="statusbar__value">115/115</span>
      </span>
      <span className="statusbar__field">
        <span className="statusbar__label">NIVEL</span>
        <span className="statusbar__value">6</span>
      </span>
      <span className="statusbar__field">
        <span className="statusbar__label">AP</span>
        <span className="statusbar__value">90/90</span>
      </span>
    </div>
  )
}