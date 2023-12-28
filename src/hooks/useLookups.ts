import React, { useCallback, useEffect } from 'react'
import { DataStore, Lookups } from '@regolithco/common'
import { useGetPublicLookupsQuery } from '../schema'
import log from 'loglevel'

// Implement the interface for the client-side data store
// This is the same interface as the server-side data store
// But we get the values from the public API instead of directly
class ClientDataStore implements DataStore {
  public loading = false
  private fetcher: <K extends keyof Lookups>(key: K) => Lookups[keyof Lookups] | null

  // Need a constructor that takes a callback to fetch the data
  constructor(fetcher: <K extends keyof Lookups>(key: K) => Lookups[keyof Lookups] | null) {
    this.fetcher = fetcher
  }

  async getLookup<K extends keyof Lookups>(key: K): Promise<Lookups[K]> {
    let result: Lookups[K] | null = null

    while (result === null) {
      result = this.fetcher(key) as Lookups[K]
      if (result === null) {
        // Wait for 100ms before checking again
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    return result
  }
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
  // Use the Apollo Client hook to fetch data
  const { data } = useGetPublicLookupsQuery()

  const keyFinder = useCallback(
    <K extends keyof Lookups>(key: K): Lookups[K] | null => {
      let retVal: Lookups[K] | null = null
      if (data) {
        switch (key) {
          case 'densitiesLookups':
            retVal = data.lookups?.CIG?.densitiesLookups as Lookups[K]
            break
          case 'methodsBonusLookup':
            retVal = data.lookups?.CIG?.methodsBonusLookup as Lookups[K]
            break
          case 'refineryBonusLookup':
            retVal = data.lookups?.CIG?.refineryBonusLookup as Lookups[K]
            break
          case 'oreProcessingLookup':
            retVal = data.lookups?.CIG?.oreProcessingLookup as Lookups[K]
            break
          // UEX Endpoints
          case 'planetLookups':
            retVal = data.lookups?.UEX?.bodies as Lookups[K]
            break
          case 'priceStatsLookups':
            retVal = data.lookups?.UEX?.maxPrices as Lookups[K]
            break
          case 'shipLookups':
            retVal = data.lookups?.UEX?.ships as Lookups[K]
            break
          case 'tradeportLookups':
            retVal = data.lookups?.UEX?.tradeports as Lookups[K]
            break
          // Loadout Endpount
          case 'loadout':
            retVal = data.lookups?.Loadout as Lookups[K]
            break
          default:
            throw new Error('Lookup not found')
        }
      }
      return retVal
    },
    [data]
  )
  const store = React.useMemo(() => new ClientDataStore(keyFinder), [keyFinder])
  const [result, setResult] = React.useState<T | null>(null)

  useEffect(() => {
    // log.debug('useAsyncLookupData data change', [data, ...(args || [])])
    asyncFunction(store, ...(args || []))
      .then((result) => setResult(result))
      .catch((err) => console.error(err))
  }, [store, ...(args || [])])

  const memoizedResult = React.useMemo(() => {
    log.debug('useAsyncLookupData memoized result')
    return result
  }, [result])

  return memoizedResult
}
