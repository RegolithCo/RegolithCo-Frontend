import React from 'react'
import { DataStore, Lookups } from '@regolithco/common'
import * as NodeCache from 'node-cache'

// One hour cache
const LONG_CACHE = new NodeCache.default({ stdTTL: 60 * 60, checkperiod: 100 })

// Implement the interface for the client-side data store
// This is the same interface as the server-side data store
// But we get the values from the public API instead of directly
class ClientDataStore implements DataStore {
  async getLookup<K extends keyof Lookups>(key: K): Promise<Lookups[K]> {
    const cached = LONG_CACHE.get(key)
    if (cached) return cached as Lookups[K]
    const response = await fetch(`/api/lookup/${key}`)
    const data = await response.json()
    return data as Lookups[K]
  }
}

export const useDataStore = () => {
  const [store, setStore] = React.useState<DataStore>(new ClientDataStore())
  return store
}
