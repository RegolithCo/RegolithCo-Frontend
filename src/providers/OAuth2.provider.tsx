import { AuthTypeEnum } from '@regolithco/common'
import React, { useEffect } from 'react'
import log from 'loglevel'
import { GoogleAuthProvider } from './GoogleAuth.provider'
import { DiscordAuthProvider } from './DiscordAuth.provider'
import useLocalStorage from '../hooks/useLocalStorage'
import { DEFAULT_LOGIN_CONTEXT, LoginContext, LoginContextWrapper } from '../context/auth.context'
import { wipeAuthStorage } from '../lib/utils'
import { LoginChoice } from '../components/modals/LoginChoice'

export const getRedirectUrl = () => {
  let redirectUri: string = ''
  switch (import.meta.env.MODE) {
    case 'development':
      redirectUri = new URL('', `${window.location.protocol}//localhost:3000`).toString()
      break
    case 'production':
      redirectUri = new URL('', 'https://regolith.rocks/').toString()
      break
    case 'staging':
      redirectUri = new URL('', 'https://staging.regolith.rocks/').toString()
      break
    default:
      throw new Error('Unknown mode')
  }
  log.debug(`REDIRECT URL: ${redirectUri} for mode ${import.meta.env.MODE}`)

  return redirectUri
}

/**
 * This is a top-level component that wraps EVERYTHING and delivers context to be able to
 * swap Authentications at will
 * @param param0
 * @returns
 */
export const OAuth2Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Instead of state the authType is stored in local storage next to the other pkce keys.
  // This should persist the key with the other choices
  const [popupOpen, setPopupOpen] = React.useState<boolean>(false)
  const [authTypeLS, setAuthTypeLS] = useLocalStorage<AuthTypeEnum | null>('ROCP_AuthType', null)
  const [postLoginRedirect, setPostLoginRedirect] = useLocalStorage<string | null>('ROCP_PostLoginRedirect', null)

  const LoginProvider: React.FC<React.PropsWithChildren> = React.useMemo(() => {
    if (authTypeLS === AuthTypeEnum.Discord) {
      return () => <GoogleAuthProvider>{children}</GoogleAuthProvider>
    } else if (authTypeLS === AuthTypeEnum.Google) {
      return () => <DiscordAuthProvider>{children}</DiscordAuthProvider>
    } else {
      return () => {
        return <LoginContext.Provider value={DEFAULT_LOGIN_CONTEXT}>{children}</LoginContext.Provider>
      }
    }
  }, [authTypeLS])

  return (
    <LoginContextWrapper.Provider
      value={{
        authType: authTypeLS,
        setAuthType: (authType: AuthTypeEnum | null) => {
          setAuthTypeLS(authType)
          if (!authType) {
            wipeAuthStorage()
          }
        },
        popupOpen,
        postLoginRedirect,
        setPopupOpen: (redirectUrl?: string) => {
          if (redirectUrl) setPostLoginRedirect(redirectUrl)
          else setPostLoginRedirect(null)
          setPopupOpen(true)
        },
      }}
    >
      {popupOpen && (
        <LoginChoice open onClose={() => setPopupOpen(false)} authType={authTypeLS} setAuthType={setAuthTypeLS} />
      )}
      <LoginProvider>{children}</LoginProvider>
    </LoginContextWrapper.Provider>
  )
}
