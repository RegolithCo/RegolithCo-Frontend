import React, { PropsWithChildren, useEffect } from 'react'
import { DataStore, GetPublicLookupsQuery, Lookups } from '@regolithco/common'
import { createContext } from 'react'
import { useGetPublicLookupsQuery } from '../schema'
import { PageLoader } from '../components/pages/PageLoader'

const normalizePath = (path: string) => (path.endsWith('/') ? path.slice(0, -1) : path)

// Implement the interface for the client-side data store
// This is the same interface as the server-side data store
// But we get the values from the public API instead of directly
export class ClientDataStore implements DataStore {
  public loading = false
  public ready = false
  public error: string | null = null
  public isLocal = false
  public localPath?: string | undefined
  private lookups: GetPublicLookupsQuery['lookups'] | undefined

  getLookup<K extends keyof Lookups>(key: K): Lookups[K] {
    return this.keyFinder(key) as Lookups[K]
  }
  setLoading = (loading: boolean) => {
    this.loading = loading
  }
  setError = (error: string) => {
    this.error = error
  }
  setReady = (ready: boolean) => {
    this.ready = ready
  }

  setData = (lookups: GetPublicLookupsQuery['lookups']) => {
    this.lookups = lookups
    this.setLoading(false)
    if (lookups) this.setReady(true)
  }

  keyFinder = <K extends keyof Lookups>(key: K): Lookups[K] | null => {
    let retVal: Lookups[K] | null = null
    if (this.lookups) {
      switch (key) {
        case 'densitiesLookups':
          retVal = this.lookups?.CIG?.densitiesLookups as Lookups[K]
          break
        case 'methodsBonusLookup':
          retVal = this.lookups?.CIG?.methodsBonusLookup as Lookups[K]
          break
        case 'refineryBonusLookup':
          retVal = this.lookups?.CIG?.refineryBonusLookup as Lookups[K]
          break
        case 'oreProcessingLookup':
          retVal = this.lookups?.CIG?.oreProcessingLookup as Lookups[K]
          break
        // UEX Endpoints
        case 'planetLookups':
          retVal = this.lookups?.UEX?.bodies as Lookups[K]
          break
        case 'priceStatsLookups':
          retVal = this.lookups?.UEX?.maxPrices as Lookups[K]
          break
        case 'shipLookups':
          retVal = this.lookups?.UEX?.ships as Lookups[K]
          break
        case 'tradeportLookups':
          retVal = this.lookups?.UEX?.tradeports as Lookups[K]
          break
        // Loadout Endpount
        case 'loadout':
          retVal = this.lookups?.Loadout as Lookups[K]
          break
        default:
          throw new Error('Lookup not found')
      }
    }
    return retVal
  }
}

export const lookupsDefault: DataStore = new ClientDataStore()

export const LookupsContext = createContext<DataStore>(lookupsDefault)

export const LookupsContextWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { data, loading } = useGetPublicLookupsQuery({
    fetchPolicy: 'cache-first',
    // Refetch every hour
    pollInterval: 3600 * 1000,
  })
  const [dataStore, setDataStore] = React.useState<ClientDataStore>(new ClientDataStore())

  const noLoadingPaths = ['/']
  const prefix = import.meta.env.BASE_URL || ''

  const currentPath = normalizePath(window.location.pathname)
  const isNoLoadingPath = noLoadingPaths.some((path) => normalizePath(`${prefix}${path}`) === currentPath)

  useEffect(() => {
    if (data && data.lookups) dataStore.setData(data.lookups)
  }, [data])

  useEffect(() => dataStore.setLoading(loading), [loading])

  useEffect(() => {
    if (data && data.lookups) {
      const newDataStore = new ClientDataStore()
      newDataStore.setData(data.lookups)
      setDataStore(newDataStore)
    }
  }, [data])

  return (
    <LookupsContext.Provider value={dataStore}>
      {children}
      {loading && !isNoLoadingPath && <PageLoader loading={loading} title="Loading Lookups" />}
    </LookupsContext.Provider>
  )
}
