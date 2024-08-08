import { useState } from 'react'
import { DataStore, Lookups } from '@regolithco/common'
import lookupMocks from '../mock/lookupMocks.json'

class StorybookDataStore implements DataStore {
  public loading = false
  public error = null
  public ready = false

  getLookup<K extends keyof Lookups>(key: K): Lookups[K] {
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
      case 'tradeportLookups':
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
