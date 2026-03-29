import '../App.css'

interface HeaderProps {
  loading: boolean
  sessionTime: number
  onReload: () => void
}

export function Header({ loading, sessionTime, onReload }: HeaderProps) {
  return (
    <header className="top-bar">
      <div>
        <p className="eyebrow">AI Agent Builder</p>
        <h1>Compose your agent with drag-and-drop</h1>
        <p className="subtitle">
          Drag capabilities from the left palette into the build canvas. No dropdown hunting, just flow.
        </p>
      </div>

      <div className="header-actions">
        <button className="btn btn-secondary" onClick={onReload} disabled={loading}>
          {loading ? 'Loading…' : 'Reload Data'}
        </button>
        <span className="session-chip">Session: {sessionTime}s</span>
      </div>
    </header>
  )
}
