import { AuthTypeEnum, UserProfile } from '@regolithco/common'
import React, { useContext, useState } from 'react'
import { AuthContext, AuthProvider, TAuthConfig, TRefreshTokenExpiredEvent, IAuthContext } from 'react-oauth2-code-pkce'
import useLocalStorage from './useLocalStorage'
import { useGoogleLogin, GoogleOAuthProvider, googleLogout } from '@react-oauth/google'
import log from 'loglevel'

let redirectUri: string = ''
switch (import.meta.env.MODE) {
  case 'development':
    redirectUri = new URL('', 'http://localhost:3000').toString()
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
log.debug('REDIRECT URL', redirectUri)

const discordConfig: TAuthConfig = {
  clientId: '1067082442877440050',
  authorizationEndpoint: 'https://discord.com/oauth2/authorize',
  tokenEndpoint: 'https://discord.com/api/oauth2/token',
  redirectUri,
  autoLogin: false,
  decodeToken: false,
  scope: 'identify guilds',
}

type UseOAuth2Return = IAuthContext & {
  authType: AuthTypeEnum
  setAuthType: (authType: AuthTypeEnum) => void
  refreshPopupOpen: boolean
  setRefreshPopupOpen: (open: boolean) => void
}

/**
 * This is a hook we use inside useLogin() to get the OAuth2 context
 * @returns
 */
export const useOAuth2 = (): UseOAuth2Return => {
  const { authType, setAuthType, googleToken, setGoogleToken, refreshPopupOpen, setRefreshPopupOpen } =
    useContext(LoginContextWrapper)
  const { tokenData, token, logIn, logOut, idToken, error, loginInProgress, idTokenData }: IAuthContext =
    useContext(AuthContext)
  const googleTimerRef = React.useRef<NodeJS.Timeout>()

  const googleLogin = React.useCallback(
    useGoogleLogin({
      onSuccess: (tokenResponse) => {
        if (tokenResponse.access_token) {
          if (refreshPopupOpen) setRefreshPopupOpen(false) // just in case
          setGoogleToken(tokenResponse.access_token, tokenResponse.expires_in)
        }
      },
    }),
    [googleToken, setGoogleToken]
  )

  React.useEffect(() => {
    if (googleTimerRef.current) clearTimeout(googleTimerRef.current)
    if (googleToken[1] && googleToken[1] > Date.now()) {
      googleTimerRef.current = setTimeout(() => {
        googleLogout()
        setGoogleToken()
        setRefreshPopupOpen(true)
      }, googleToken[1] - Date.now())
    }
  }, [googleToken])

  const fancyLogin = async () => {
    if (authType === AuthTypeEnum.Discord) {
      googleLogout()
      logIn()
    } else if (authType === AuthTypeEnum.Google) {
      logOut()
      googleLogin()
    }
  }
  // Just do both.
  const fancyLogout = async () => {
    setGoogleToken()
    googleLogout()
    logOut()
    // Clear the localcache
    localStorage.removeItem('myGuilds')
    localStorage.removeItem('myGuildsTime')
    localStorage.removeItem('redirect_url')
    log.debug('LOGGED OUT')
  }

  return {
    logIn: fancyLogin,
    login: () => {
      throw new Error('DEPPRECATED LOGIN')
    },
    tokenData,
    token: authType === AuthTypeEnum.Google ? googleToken[0] : token,
    error,
    idToken,
    authType,
    setRefreshPopupOpen,
    refreshPopupOpen,
    setAuthType,
    logOut: fancyLogout,
    loginInProgress,
    idTokenData,
  }
}

type LoginSwitcherObj = {
  authType: AuthTypeEnum
  setAuthType: (authType: AuthTypeEnum) => void
  googleToken: [token: string, expiry: number | null]
  setGoogleToken: (token?: string, expiry?: number) => void
  refreshPopupOpen: boolean
  setRefreshPopupOpen: (open: boolean) => void
}

export const LoginContextWrapper = React.createContext<LoginSwitcherObj>({
  authType: AuthTypeEnum.Discord,
  refreshPopupOpen: false,
  setRefreshPopupOpen: (open: boolean) => {
    //
  },
  setAuthType: () => {
    //
  },
  googleToken: ['', null],
  setGoogleToken: (token?: string, expiry?: number) => {
    //
  },
})

/**
 * This is a top-level component that wraps EVERYTHING and delivers context to be able to
 * swap Authentications at will
 * @param param0
 * @returns
 */
export const MyAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Instead of state the authType is stored in local storage next to the other pkce keys.
  // This should persist the key with the other choices
  const [authTypeLS, setAuthTypeLS] = useLocalStorage<AuthTypeEnum>('ROCP_AuthType', AuthTypeEnum.Discord)
  const [authType, _setAuthType] = React.useState<AuthTypeEnum>(authTypeLS)
  const [refreshPopupOpen, setRefreshPopupOpen] = useState(false)
  const [googleToken, _setGoogleToken] = useLocalStorage<[string, number | null]>('ROCP_GooToken', ['', null])

  const setAuthType = (newAuthType: AuthTypeEnum) => {
    setAuthTypeLS(newAuthType)
    _setAuthType(newAuthType)
  }

  const discordAuth: TAuthConfig = {
    ...discordConfig,
    autoLogin: false,
    onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => {
      // window.confirm('Session expired. Refresh page to continue using the site?') && event.login(),
      setRefreshPopupOpen(true)
    },
  }

  return (
    <LoginContextWrapper.Provider
      value={{
        authType,
        setAuthType,
        googleToken,
        refreshPopupOpen,
        setRefreshPopupOpen,
        setGoogleToken: (newToken?: string, expiry?: number) => {
          const expires = expiry ? Date.now() + expiry * 1000 : null
          _setGoogleToken([newToken || '', expires])
        },
      }}
    >
      <GoogleOAuthProvider clientId="413063286287-oto0h8addk8jic8h6ontaf2f8l9r23h0.apps.googleusercontent.com">
        <AuthProvider authConfig={discordAuth}>{children}</AuthProvider>
      </GoogleOAuthProvider>
    </LoginContextWrapper.Provider>
  )
}

const DEFAULT_LOGIN_CONTEXT: LoginContextObj = {
  isAuthenticated: false,
  isInitialized: false,
  isVerified: false,
  APIWorking: true,
  popup: null,
  refreshPopupOpen: false,
  refreshPopup: null,
  setRefreshPopupOpen: () => {
    log.warn('NOT SET UP FOR POPUP')
  },
  openPopup: () => {
    log.warn('NOT SET UP FOR POPUP')
  },
  logIn: (authType: AuthTypeEnum) => {
    log.warn('NOT SET UP FOR LOGIN', authType)
  },
  logOut: () => {
    log.warn('NOT SET UP FOR LOGOUT')
  },
  loading: false,
}

export const LoginContext = React.createContext<LoginContextObj>(DEFAULT_LOGIN_CONTEXT)

/**
 * This is just a context fetcher shim
 * @returns
 */
export function useLogin(): LoginContextObj {
  const context = useContext<LoginContextObj>(LoginContext)
  if (typeof context === 'undefined') {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}

export interface LoginContextObj {
  isAuthenticated: boolean
  isInitialized: boolean
  APIWorking?: boolean
  maintenanceMode?: string
  isVerified: boolean
  loading: boolean
  error?: Error
  popup: React.ReactNode
  openPopup: (newLoginRedirect?: string) => void
  refreshPopupOpen: boolean
  refreshPopup: React.ReactNode
  setRefreshPopupOpen: (isOpen: boolean) => void
  logIn: (authType: AuthTypeEnum) => void
  logOut: () => void
  userProfile?: UserProfile
}
