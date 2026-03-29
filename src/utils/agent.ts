import type { SavedAgent } from '../types/agent'

const STORAGE_KEY = 'savedAgents'

export const makeAgentId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const parseSavedAgents = (rawValue: string | null): SavedAgent[] => {
  if (!rawValue) return []

  try {
    const parsed = JSON.parse(rawValue)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map((item): SavedAgent | null => {
        if (!item || typeof item !== 'object') return null

        const name = typeof item.name === 'string' ? item.name : ''
        const profileId = typeof item.profileId === 'string' ? item.profileId : ''
        const provider = typeof item.provider === 'string' ? item.provider : ''
        const skillIds = Array.isArray(item.skillIds)
          ? item.skillIds.filter((id: unknown): id is string => typeof id === 'string')
          : []
        const layerIds = Array.isArray(item.layerIds)
          ? item.layerIds.filter((id: unknown): id is string => typeof id === 'string')
          : []

        if (!name) return null

        return {
          id: typeof item.id === 'string' && item.id.length > 0 ? item.id : makeAgentId(),
          name,
          profileId,
          provider,
          skillIds,
          layerIds,
        }
      })
      .filter((agent): agent is SavedAgent => Boolean(agent))
  } catch {
    return []
  }
}

export const addUnique = (items: string[], value: string) =>
  items.includes(value) ? items : [...items, value]

export const getStorageKey = () => STORAGE_KEY
