import type { AgentProfile, Skill, Layer, DropZoneType, DragPayload } from '../types/agent'

interface CanvasProps {
  selectedProfile: AgentProfile | null
  selectedSkills: Skill[]
  selectedLayers: Layer[]
  selectedProvider: string
  agentName: string
  dragOverZone: DropZoneType | null
  onDragOver: (zone: DropZoneType) => void
  onDragLeave: () => void
  onDrop: (zone: DropZoneType, event: React.DragEvent<HTMLElement>) => void
  onDragStart: (payload: DragPayload, event: React.DragEvent<HTMLElement>) => void
  onNameChange: (name: string) => void
  onSaveAgent: () => void
  onRemoveSkill: (skillId: string) => void
  onRemoveLayer: (layerId: string) => void
}

export function Canvas({
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
  agentName,
  dragOverZone,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onNameChange,
  onSaveAgent,
  onRemoveSkill,
  onRemoveLayer,
}: CanvasProps) {
  return (
    <section className="card canvas">
      <div className="canvas-head">
        <h2>Build Canvas</h2>
        <p className="muted">Drop cards onto zones below. Drag selected skill/layer chips to Trash to remove.</p>
      </div>

      <div className="canvas-grid">
        <div
          className={`drop-zone ${dragOverZone === 'profile' ? 'active' : ''}`}
          onDragOver={(event) => {
            event.preventDefault()
            onDragOver('profile')
          }}
          onDragLeave={onDragLeave}
          onDrop={(event) => onDrop('profile', event)}
        >
          <p className="zone-title">Base Profile</p>
          {selectedProfile ? (
            <article className="selection-card">
              <h4>{selectedProfile.name}</h4>
              <p>{selectedProfile.description}</p>
            </article>
          ) : (
            <p className="placeholder">Drop one profile here</p>
          )}
        </div>

        <div
          className={`drop-zone ${dragOverZone === 'provider' ? 'active' : ''}`}
          onDragOver={(event) => {
            event.preventDefault()
            onDragOver('provider')
          }}
          onDragLeave={onDragLeave}
          onDrop={(event) => onDrop('provider', event)}
        >
          <p className="zone-title">Provider</p>
          {selectedProvider ? (
            <p className="provider-selected">{selectedProvider}</p>
          ) : (
            <p className="placeholder">Drop a provider here</p>
          )}
        </div>

        <div
          className={`drop-zone ${dragOverZone === 'skill' ? 'active' : ''}`}
          onDragOver={(event) => {
            event.preventDefault()
            onDragOver('skill')
          }}
          onDragLeave={onDragLeave}
          onDrop={(event) => onDrop('skill', event)}
        >
          <p className="zone-title">Skills</p>
          <div className="chip-wrap">
            {selectedSkills.map((skill) => (
              <span
                key={skill.id}
                className="chip"
                draggable
                onDragStart={(event) => onDragStart({ type: 'selected-skill', id: skill.id }, event)}
              >
                {skill.name}
                <button onClick={() => onRemoveSkill(skill.id)} aria-label={`Remove ${skill.name}`}>
                  ×
                </button>
              </span>
            ))}
            {selectedSkills.length === 0 && <p className="placeholder">Drop skills here</p>}
          </div>
        </div>

        <div
          className={`drop-zone ${dragOverZone === 'layer' ? 'active' : ''}`}
          onDragOver={(event) => {
            event.preventDefault()
            onDragOver('layer')
          }}
          onDragLeave={onDragLeave}
          onDrop={(event) => onDrop('layer', event)}
        >
          <p className="zone-title">Personality Layers</p>
          <div className="chip-wrap">
            {selectedLayers.map((layer) => (
              <span
                key={layer.id}
                className="chip chip-layer"
                draggable
                onDragStart={(event) => onDragStart({ type: 'selected-layer', id: layer.id }, event)}
              >
                {layer.name}
                <button onClick={() => onRemoveLayer(layer.id)} aria-label={`Remove ${layer.name}`}>
                  ×
                </button>
              </span>
            ))}
            {selectedLayers.length === 0 && <p className="placeholder">Drop layers here</p>}
          </div>
        </div>
      </div>

      <div
        className={`trash-zone ${dragOverZone === 'trash' ? 'active' : ''}`}
        onDragOver={(event) => {
          event.preventDefault()
          onDragOver('trash')
        }}
        onDragLeave={onDragLeave}
        onDrop={(event) => onDrop('trash', event)}
      >
        🗑️ Drag selected skill/layer chips here to remove
      </div>

      <div className="save-row">
        <input
          className="name-input"
          type="text"
          placeholder="Name this agent"
          value={agentName}
          onChange={(event) => onNameChange(event.target.value)}
        />
        <button className="btn btn-primary" onClick={onSaveAgent}>
          Save Agent
        </button>
      </div>
    </section>
  )
}
