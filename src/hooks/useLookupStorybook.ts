import React, { useEffect, useState } from 'react'
import { DataStore, Lookups } from '@regolithco/common'
import lookupMocks from '../mock/lookupMocks.json'

class StorybookDataStore implements DataStore {
  public loading = false
  async getLookup<K extends keyof Lookups>(key: K): Promise<Lookups[K]> {
    switch (key) {
      case 'densitiesLookups':
        return lookupMocks.data.lookups.CIG.densitiesLookups as Lookups[K]
      case 'methodsBonusLookup':
        return lookupMocks.data.lookups.CIG.methodsBonusLookup as Lookups[K]
      case 'refineryBonusLookup':
        return lookupMocks.data.lookups.CIG.refineryBonusLookup as Lookups[K]
      case 'oreProcessingLookup':
        return lookupMocks.data.lookups.CIG.oreProcessingLookup as Lookups[K]
      case 'planetLookups':
        return lookupMocks.data.lookups.UEX.bodies as unknown as Lookups[K]
      case 'priceStatsLookups':
        return lookupMocks.data.lookups.UEX.maxPrices as Lookups[K]
      case 'shipLookups':
        return lookupMocks.data.lookups.UEX.ships as Lookups[K]
      case 'tradeportsLookups':
        return lookupMocks.data.lookups.UEX.tradeports as Lookups[K]
      case 'loadout':
        return lookupMocks.data.lookups.Loadout as Lookups[K]
      default:
        throw new Error('Lookup not found')
    }
  }
}

export const useStorybookLookups = (): DataStore => {
  const [dataStore] = useState(new StorybookDataStore())
  return dataStore
}

/**
 * When we have more complex needs we can use this hook
 * @param asyncFunction
 * @param args
 * @returns
 */
export const useStorybookAsyncLookupData = <T>(
  asyncFunction: (ds: DataStore, ...innerArgs: any[]) => Promise<T>,
  args?: any[]
): T | null => {
  const [store] = React.useState<DataStore>(new StorybookDataStore())
  const [result, setResult] = React.useState<T | null>(null)

  useEffect(() => {
    asyncFunction(store, ...(args || []))
      .then((result) => setResult(result))
      .catch((err) => console.error(err))
  }, [...(args || [])])

  return result
}
