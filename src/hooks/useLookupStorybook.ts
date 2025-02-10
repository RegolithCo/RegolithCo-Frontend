import { DataStore, Lookups } from '@regolithco/common'
import lookupMocks from '../mock/lookupMocks.json'

const LOOKUP_MAP: Record<string, unknown> = {
  densitiesLookups: lookupMocks.data.lookups.CIG.densitiesLookups as Lookups['densitiesLookups'],
  methodsBonusLookup: lookupMocks.data.lookups.CIG.methodsBonusLookup as Lookups['methodsBonusLookup'],
  refineryBonusLookup: lookupMocks.data.lookups.CIG.refineryBonusLookup as Lookups['refineryBonusLookup'],
  oreProcessingLookup: lookupMocks.data.lookups.CIG.oreProcessingLookup as Lookups['oreProcessingLookup'],
  gravityWellLookups: lookupMocks.data.lookups.UEX.bodies as Lookups['gravityWellLookups'],
  priceStatsLookups: lookupMocks.data.lookups.UEX.maxPrices as Lookups['priceStatsLookups'],
  shipLookups: lookupMocks.data.lookups.UEX.ships as Lookups['shipLookups'],
  tradeportLookups: lookupMocks.data.lookups.UEX.tradeports as Lookups['tradeportLookups'],
  loadout: lookupMocks.data.lookups.loadout as unknown as Lookups['loadout'],
}

class StorybookDataStore implements DataStore {
  public loading = false
  public error = null
  public ready = true
  public isLocal = false
  public localPath = undefined

  getLookup<K extends keyof Lookups>(key: K): Lookups[K] {
    const lookup = LOOKUP_MAP[key]
    if (lookup) {
      return lookup as Lookups[K]
    } else {
      throw new Error(`Lookup not found for key: ${key}`)
    }
  }
}

export const mockDataStore = new StorybookDataStore()

export const useStorybookLookups = (): DataStore => {
  return mockDataStore
}
