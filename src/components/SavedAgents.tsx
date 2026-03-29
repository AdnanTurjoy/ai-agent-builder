import type { SavedAgent, AgentProfile } from '../types/agent'

interface SavedAgentsProps {
  savedAgents: SavedAgent[]
  profileById: Map<string, AgentProfile>
  onLoadAgent: (agent: SavedAgent) => void
  onDeleteAgent: (agentId: string) => void
  onClearAll: () => void
}

export function SavedAgents({
  savedAgents,
  profileById,
  onLoadAgent,
  onDeleteAgent,
  onClearAll,
}: SavedAgentsProps) {
  if (savedAgents.length === 0) {
    return (
      <section className="card saved-panel">
        <div className="saved-header">
          <h2>Saved Agents (0)</h2>
        </div>
        <p className="muted">No saved agents yet. Build one and hit save.</p>
      </section>
    )
  }

  return (
    <section className="card saved-panel">
      <div className="saved-header">
        <h2>Saved Agents ({savedAgents.length})</h2>
        <button className="btn btn-danger" onClick={onClearAll}>
          Clear All
        </button>
      </div>

      <div className="saved-grid">
        {savedAgents.map((agent) => (
          <article key={agent.id} className="saved-card">
            <h3>{agent.name}</h3>
            <p>
              <strong>Profile:</strong> {profileById.get(agent.profileId)?.name ?? 'None'}
            </p>
            <p>
              <strong>Skills:</strong> {agent.skillIds.length}
            </p>
            <p>
              <strong>Layers:</strong> {agent.layerIds.length}
            </p>
            <p>
              <strong>Provider:</strong> {agent.provider || 'None'}
            </p>
            <div className="saved-actions">
              <button className="btn btn-secondary" onClick={() => onLoadAgent(agent)}>
                Load
              </button>
              <button className="btn btn-danger" onClick={() => onDeleteAgent(agent.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
