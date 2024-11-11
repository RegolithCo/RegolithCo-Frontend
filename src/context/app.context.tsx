import { obfuscateUserId, UserProfile } from '@regolithco/common'
import React, { createContext, PropsWithChildren } from 'react'
import log from 'loglevel'
import { useLogin } from '../hooks/useOAuth2'
import { useGetUserProfileQuery } from '../schema'

export interface AppContextType {
  hideNames: boolean
  setHideNames: (hideNames: boolean) => void
  getSafeName: (scName?: string) => string
  myUserProfile?: UserProfile
}

const notAvailable =
  (name: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any) => {
    log.error(`${name} not available in app context`, args)
  }

export const appContextDefault: AppContextType = {
  hideNames: false,
  setHideNames: notAvailable('setHideNames'),
  getSafeName: (scName?: string) => scName || 'UNNAMEDUSER',
}

export const AppContext = createContext<AppContextType>(appContextDefault)

export const AppContextWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [hideNames, setHideNames] = React.useState(false)
  const ctx = useLogin()
  const userProfileQry = useGetUserProfileQuery({
    // returnPartialData: true,
  })

  const myUserProfile = userProfileQry.data?.profile as UserProfile

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
        myUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
