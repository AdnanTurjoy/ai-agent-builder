import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import type {
  AgentData,
  AgentDraft,
  DragPayload,
  DropZoneType,
  Layer,
  SavedAgent,
  Skill,
} from './types/agent'
import { Header } from './components/Header'
import { Palette } from './components/Palette'
import { Canvas } from './components/Canvas'
import { SavedAgents } from './components/SavedAgents'
import { Banners } from './components/Banners'
import { addUnique, makeAgentId, parseSavedAgents } from './utils/agent'

const STORAGE_KEY = 'savedAgents'

function AgentBuilderApp() {
  const [data, setData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dragOverZone, setDragOverZone] = useState<DropZoneType | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const [draft, setDraft] = useState<AgentDraft>({
    name: '',
    profileId: '',
    skillIds: [],
    layerIds: [],
    provider: '',
  })

  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>(() =>
    parseSavedAgents(localStorage.getItem(STORAGE_KEY)),
  )
  const [sessionTime, setSessionTime] = useState(0)

  const fetchConfig = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/data.json', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const jsonData: AgentData = await response.json()
      setData(jsonData)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load configuration data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchConfig()
  }, [fetchConfig])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAgents))
  }, [savedAgents])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSessionTime((prev) => prev + 1)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!notice) return

    const timeout = window.setTimeout(() => {
      setNotice(null)
    }, 2500)

    return () => window.clearTimeout(timeout)
  }, [notice])

  const profileById = useMemo(
    () => new Map(data?.agentProfiles.map((profile) => [profile.id, profile])),
    [data],
  )

  const skillById = useMemo(() => new Map(data?.skills.map((skill) => [skill.id, skill])), [data])
  const layerById = useMemo(() => new Map(data?.layers.map((layer) => [layer.id, layer])), [data])

  const selectedProfile = draft.profileId ? profileById.get(draft.profileId) : null
  const selectedSkills = useMemo(
    () => draft.skillIds.map((id) => skillById.get(id)).filter((skill): skill is Skill => Boolean(skill)),
    [draft.skillIds, skillById],
  )
  const selectedLayers = useMemo(
    () => draft.layerIds.map((id) => layerById.get(id)).filter((layer): layer is Layer => Boolean(layer)),
    [draft.layerIds, layerById],
  )

  const setDraftName = useCallback((name: string) => {
    setDraft((prev) => ({ ...prev, name }))
  }, [])

  const setDropZone = useCallback((zone: DropZoneType | null) => {
    setDragOverZone(zone)
  }, [])

  const onDragStart = useCallback((payload: DragPayload, event: React.DragEvent<HTMLElement>) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/json', JSON.stringify(payload))
  }, [])

  const onDropZone = useCallback((zone: DropZoneType, event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    setDragOverZone(null)

    const dataTransferPayload = event.dataTransfer.getData('application/json')
    if (!dataTransferPayload) return

    try {
      const payload = JSON.parse(dataTransferPayload) as DragPayload

      setDraft((prev) => {
        if (zone === 'trash') {
          if (payload.type === 'selected-skill') {
            return { ...prev, skillIds: prev.skillIds.filter((id) => id !== payload.id) }
          }

          if (payload.type === 'selected-layer') {
            return { ...prev, layerIds: prev.layerIds.filter((id) => id !== payload.id) }
          }

          return prev
        }

        if (zone === 'profile' && payload.type === 'profile') {
          return { ...prev, profileId: payload.id }
        }

        if (zone === 'provider' && payload.type === 'provider') {
          return { ...prev, provider: payload.id }
        }

        if (zone === 'skill' && payload.type === 'skill') {
          return { ...prev, skillIds: addUnique(prev.skillIds, payload.id) }
        }

        if (zone === 'layer' && payload.type === 'layer') {
          return { ...prev, layerIds: addUnique(prev.layerIds, payload.id) }
        }

        return prev
      })
    } catch {
      // Ignore malformed drag payloads.
    }
  }, [])

  const saveAgent = useCallback(() => {
    if (!draft.name.trim()) {
      setNotice('Please enter a name before saving.')
      return
    }

    if (!draft.profileId) {
      setNotice('Pick a profile to save this agent.')
      return
    }

    const newAgent: SavedAgent = {
      id: makeAgentId(),
      name: draft.name.trim(),
      profileId: draft.profileId,
      skillIds: draft.skillIds,
      layerIds: draft.layerIds,
      provider: draft.provider,
    }

    setSavedAgents((prev) => [newAgent, ...prev])
    setNotice(`Saved "${newAgent.name}" successfully.`)
    setDraft((prev) => ({ ...prev, name: '' }))
  }, [draft])

  const loadSavedAgent = useCallback((agent: SavedAgent) => {
    setDraft({
      name: agent.name,
      profileId: agent.profileId,
      skillIds: agent.skillIds,
      layerIds: agent.layerIds,
      provider: agent.provider,
    })
    setNotice(`Loaded "${agent.name}" into the builder.`)
  }, [])

  const deleteSavedAgent = useCallback((agentId: string) => {
    setSavedAgents((prev) => prev.filter((agent) => agent.id !== agentId))
  }, [])

  const clearSavedAgents = useCallback(() => {
    setSavedAgents([])
    setNotice('Cleared all saved agents.')
  }, [])

  const removeSkill = useCallback((skillId: string) => {
    setDraft((prev) => ({ ...prev, skillIds: prev.skillIds.filter((id) => id !== skillId) }))
  }, [])

  const removeLayer = useCallback((layerId: string) => {
    setDraft((prev) => ({ ...prev, layerIds: prev.layerIds.filter((id) => id !== layerId) }))
  }, [])

  return (
    <div className="app-shell">
      <Header loading={loading} sessionTime={sessionTime} onReload={() => void fetchConfig()} />

      <Banners error={error} notice={notice} />

      <main className="layout-grid">
        <Palette
          data={data}
          loading={loading}
          onDragStart={onDragStart}
          onProfileClick={(id) => setDraft((prev) => ({ ...prev, profileId: id }))}
          onSkillClick={(id) =>
            setDraft((prev) => ({
              ...prev,
              skillIds: addUnique(prev.skillIds, id),
            }))
          }
          onLayerClick={(id) =>
            setDraft((prev) => ({
              ...prev,
              layerIds: addUnique(prev.layerIds, id),
            }))
          }
          onProviderClick={(provider) => setDraft((prev) => ({ ...prev, provider }))}
          selectedProfileId={draft.profileId}
          selectedSkillIds={draft.skillIds}
          selectedLayerIds={draft.layerIds}
          selectedProvider={draft.provider}
        />

        <Canvas
          selectedProfile={selectedProfile ?? null}
          selectedSkills={selectedSkills}
          selectedLayers={selectedLayers}
          selectedProvider={draft.provider}
          agentName={draft.name}
          dragOverZone={dragOverZone}
          onDragOver={setDropZone}
          onDragLeave={() => setDropZone(null)}
          onDrop={onDropZone}
          onDragStart={onDragStart}
          onNameChange={setDraftName}
          onSaveAgent={saveAgent}
          onRemoveSkill={removeSkill}
          onRemoveLayer={removeLayer}
        />
      </main>

      <SavedAgents
        savedAgents={savedAgents}
        profileById={profileById}
        onLoadAgent={loadSavedAgent}
        onDeleteAgent={deleteSavedAgent}
        onClearAll={clearSavedAgents}
      />
    </div>
  )
}

export default AgentBuilderApp
