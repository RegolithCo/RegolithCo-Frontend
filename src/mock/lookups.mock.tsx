import React from 'react'
import { LookupsContext } from '../context/lookupsContext'
import { mockDataStore } from '../hooks/useLookupStorybook'

export const LookupsContextMock: React.FC<React.PropsWithChildren> = ({ children }) => {
  const contextValue = mockDataStore
  console.log('MARZIPAN', mockDataStore)

  return <LookupsContext.Provider value={contextValue}>{children}</LookupsContext.Provider>
}
