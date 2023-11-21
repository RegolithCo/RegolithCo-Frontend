import { obfuscateUserId } from '@regolithco/common'
import React, { createContext, PropsWithChildren } from 'react'

export interface AppContextType {
  hideNames: boolean
  setHideNames: (hideNames: boolean) => void
  getSafeName: (scName?: string) => string
}

const notAvailable =
  (name: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any) => {
    console.log(`${name} not available in app context`, args)
  }

export const appContextDefault: AppContextType = {
  hideNames: false,
  setHideNames: notAvailable('setHideNames'),
  getSafeName: (scName?: string) => scName || 'UNNAMEDUSER',
}

export const AppContext = createContext<AppContextType>(appContextDefault)

export const AppContextWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [hideNames, setHideNames] = React.useState(false)

  const getSafeName = React.useCallback(
    (scName?: string) => {
      const finalName = scName || 'UNNAMEDUSER'
      return hideNames ? obfuscateUserId(finalName) : finalName
    },
    [hideNames]
  )

  return (
    <AppContext.Provider
      value={{
        hideNames,
        setHideNames,
        getSafeName,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
