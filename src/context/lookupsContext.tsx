import React, { PropsWithChildren } from 'react'
import { GetPublicLookupsQuery } from '@regolithco/common'
import { createContext } from 'react'
import { useGetPublicLookupsQuery } from '../schema'
import { PageLoader } from '../components/pages/PageLoader'

const normalizePath = (path: string) => (path.endsWith('/') ? path.slice(0, -1) : path)

export interface LookupsContext {
  lookups?: GetPublicLookupsQuery['lookups']
  loading: boolean
}

export const lookupsDefault: LookupsContext = {
  lookups: undefined,
  loading: false,
}

export const LookupsContext = createContext<LookupsContext>(lookupsDefault)

export const LookupsContextWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { data, loading } = useGetPublicLookupsQuery()

  const noLoadingPaths = ['/']
  const prefix = process.env.PUBLIC_URL || ''

  const currentPath = normalizePath(window.location.pathname)
  const isNoLoadingPath = noLoadingPaths.some((path) => normalizePath(`${prefix}${path}`) === currentPath)

  return (
    <LookupsContext.Provider
      value={{
        lookups: data?.lookups,
        loading,
      }}
    >
      {children}
      {loading && !isNoLoadingPath && <PageLoader loading={loading} title="Loading Lookups" />}
    </LookupsContext.Provider>
  )
}
