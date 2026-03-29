import type { AgentData, DragPayload } from '../types/agent'

const PROVIDERS = ['Gemini', 'ChatGPT', 'Kimi', 'Claude', 'DeepSeek'] as const

interface PaletteProps {
  data: AgentData | null
  loading: boolean
  onDragStart: (payload: DragPayload, event: React.DragEvent<HTMLElement>) => void
  onProfileClick: (id: string) => void
  onSkillClick: (id: string) => void
  onLayerClick: (id: string) => void
  onProviderClick: (provider: string) => void
  selectedProfileId: string
  selectedSkillIds: string[]
  selectedLayerIds: string[]
  selectedProvider: string
}

export function Palette({
  data,
  loading,
  onDragStart,
  onProfileClick,
  onSkillClick,
  onLayerClick,
  onProviderClick,
  selectedProfileId,
  selectedSkillIds,
  selectedLayerIds,
  selectedProvider,
}: PaletteProps) {
  if (loading) {
    return (
      <section className="card palette">
        <h2>Component Palette</h2>
        <p className="muted">Drag cards into the drop zones on the right.</p>
        <div className="loading">Loading configuration…</div>
      </section>
    )
  }

  if (!data) {
    return (
      <section className="card palette">
        <h2>Component Palette</h2>
        <p className="muted">No data available.</p>
      </section>
    )
  }

  return (
    <section className="card palette">
      <h2>Component Palette</h2>
      <p className="muted">Drag cards into the drop zones on the right.</p>

      <div className="group">
        <h3>Profiles (single select)</h3>
        <div className="item-grid">
          {data.agentProfiles.map((profile) => (
            <button
              key={profile.id}
              className={`pill-card ${selectedProfileId === profile.id ? 'active' : ''}`}
              draggable
              onDragStart={(event) => onDragStart({ type: 'profile', id: profile.id }, event as React.DragEvent<HTMLElement>)}
              onClick={() => onProfileClick(profile.id)}
              title={profile.description}
            >
              <strong>{profile.name}</strong>
              <span>{profile.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="group">
        <h3>Skills (multi select)</h3>
        <div className="item-grid compact">
          {data.skills.map((skill) => (
            <button
              key={skill.id}
              className={`pill-card compact ${selectedSkillIds.includes(skill.id) ? 'active' : ''}`}
              draggable
              onDragStart={(event) => onDragStart({ type: 'skill', id: skill.id }, event as React.DragEvent<HTMLElement>)}
              onClick={() => onSkillClick(skill.id)}
              title={skill.description}
            >
              <strong>{skill.name}</strong>
              <span>{skill.category}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="group">
        <h3>Layers (multi select)</h3>
        <div className="item-grid compact">
          {data.layers.map((layer) => (
            <button
              key={layer.id}
              className={`pill-card compact ${selectedLayerIds.includes(layer.id) ? 'active' : ''}`}
              draggable
              onDragStart={(event) => onDragStart({ type: 'layer', id: layer.id }, event as React.DragEvent<HTMLElement>)}
              onClick={() => onLayerClick(layer.id)}
              title={layer.description}
            >
              <strong>{layer.name}</strong>
              <span>{layer.type}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="group">
        <h3>Providers (single select)</h3>
        <div className="provider-row">
          {PROVIDERS.map((provider) => (
            <button
              key={provider}
              className={`provider-tag ${selectedProvider === provider ? 'active' : ''}`}
              draggable
              onDragStart={(event) => onDragStart({ type: 'provider', id: provider }, event as React.DragEvent<HTMLElement>)}
              onClick={() => onProviderClick(provider)}
            >
              {provider}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
