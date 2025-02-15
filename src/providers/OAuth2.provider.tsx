import React, { useEffect } from 'react'
import { AuthTypeEnum } from '@regolithco/common'
import { GoogleAuthProvider } from './GoogleAuth.provider'
import { DiscordAuthProvider } from './DiscordAuth.provider'
import useLocalStorage from '../hooks/useLocalStorage'
import { DEFAULT_INNER_LOGIN_CONTEXT, InnerLoginContextObj, LoginContext } from '../context/auth.context'
import { wipeAuthStorage } from '../lib/utils'
import log from 'loglevel'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const [authTypeLS, setAuthTypeLS] = useLocalStorage<AuthTypeEnum | null>('ROCP_AuthType', null)
  const [postLoginRedirect, setPostLoginRedirect] = useLocalStorage<string | null>('ROCP_PostLoginRedirect', null)
  const [innerState, setInnerState] = React.useState<InnerLoginContextObj>(DEFAULT_INNER_LOGIN_CONTEXT)

  useEffect(() => {
    if (postLoginRedirect && innerState.isAuthenticated && !innerState.loading) {
      navigate(postLoginRedirect)
      setPostLoginRedirect(null)
    }
  }, [postLoginRedirect, setPostLoginRedirect])

  return (
    <LoginContext.Provider
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
        closePopup: () => setPopupOpen(false),
        setPopupOpen: (redirectUrl?: string) => {
          log.debug(`Setting popup open with redirect: ${redirectUrl}`)
          if (redirectUrl) setPostLoginRedirect(redirectUrl)
          else setPostLoginRedirect(null)
          setPopupOpen(true)
        },

        // These get populated from within the LoginProvider
        ...innerState,
        authLogOut: () => {
          innerState.authLogOut?.()
          setInnerState(DEFAULT_INNER_LOGIN_CONTEXT)
          setAuthTypeLS(null)
          wipeAuthStorage()
        },
      }}
    >
      {authTypeLS === AuthTypeEnum.Discord ? <DiscordAuthProvider setInnerState={setInnerState} /> : null}
      {authTypeLS === AuthTypeEnum.Google ? <GoogleAuthProvider setInnerState={setInnerState} /> : null}
      {children}
    </LoginContext.Provider>
  )
}
