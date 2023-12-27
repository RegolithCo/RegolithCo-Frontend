import React, { useEffect } from 'react'
import { DataStore, Lookups } from '@regolithco/common'
import * as NodeCache from 'node-cache'
import { useGetPublicLookupsLazyQuery } from '../schema'

// One hour cache
const LONG_CACHE = new NodeCache.default({ stdTTL: 60 * 60, checkperiod: 100 })

// Implement the interface for the client-side data store
// This is the same interface as the server-side data store
// But we get the values from the public API instead of directly
class ClientDataStore implements DataStore {
  public loading = false

  async getLookup<K extends keyof Lookups>(key: K): Promise<Lookups[K]> {
    const cached = LONG_CACHE.get(key)
    if (cached) return cached as Lookups[K]

    // Use the Apollo Client hook to fetch data
    const [getPublicLookups, { data }] = useGetPublicLookupsLazyQuery()

    useEffect(() => {
      getPublicLookups()
    }, [key])

    if (data) {
      LONG_CACHE.set(key, data)
      switch (key) {
        case 'densitiesLookups':
          return data.lookups?.CIG?.densitiesLookups as Lookups[K]
        case 'methodsBonusLookup':
          return data.lookups?.CIG?.methodsBonusLookup as Lookups[K]
        case 'refineryBonusLookup':
          return data.lookups?.CIG?.refineryBonusLookup as Lookups[K]
        case 'oreProcessingLookup':
          return data.lookups?.CIG?.oreProcessingLookup as Lookups[K]
        // UEX Endpoints
        case 'planetLookups':
          return data.lookups?.UEX?.bodies as Lookups[K]
        case 'priceStatsLookups':
          return data.lookups?.UEX?.maxPrices as Lookups[K]
        case 'shipLookups':
          return data.lookups?.UEX?.ships as Lookups[K]
        case 'tradeportsLookups':
          return data.lookups?.UEX?.tradeports as Lookups[K]
        // Loadout Endpount
        case 'loadout':
          return data.lookups?.Loadout as Lookups[K]
        default:
          throw new Error('Lookup not found')
      }
    }
    throw new Error('Lookup not found')
  }
}

/**
 * When we just need the store we can use this hook
 * @returns
 */
export const useLookups = (): DataStore => {
  const [store, _setStore] = React.useState<DataStore>(new ClientDataStore())
  return store
}

/**
 * When we have more complex needs we can use this hook
 * @param asyncFunction
 * @param args
 * @returns
 */
export const useAsyncLookupData = <T>(
  asyncFunction: (ds: DataStore, ...innerArgs: any[]) => Promise<T>,
  args?: any[]
): T | null => {
  const [store] = React.useState<DataStore>(new ClientDataStore())
  const [result, setResult] = React.useState<T | null>(null)

  useEffect(() => {
    asyncFunction(store, ...(args || []))
      .then((result) => setResult(result))
      .catch((err) => console.error(err))
  }, [...(args || [])])

  return result
}
