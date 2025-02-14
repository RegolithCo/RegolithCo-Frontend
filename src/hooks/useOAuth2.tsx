import { AuthTypeEnum, UserProfile } from '@regolithco/common'
import React, { useContext, useState } from 'react'
import { AuthContext, AuthProvider, TAuthConfig, TRefreshTokenExpiredEvent, IAuthContext } from 'react-oauth2-code-pkce'
import useLocalStorage from './useLocalStorage'
import { useGoogleLogin, GoogleOAuthProvider, googleLogout } from '@react-oauth/google'
import log from 'loglevel'
import config from '../config'
import axios from 'axios'
import dayjs from 'dayjs'
import { enqueueSnackbar } from 'notistack'

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

const discordConfig: TAuthConfig = {
  clientId: config.discordClientId,
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

const getExpiryTs = (expiresIn: number, shortenMin: number): number =>
  // Set the expiry time to the current time plus the expiry time minus the shorten time
  Date.now() + expiresIn * 1000 - shortenMin * 60 * 1000

/**
 * This is a hook we use inside useLogin() to get the OAuth2 context
 * @returns
 */
export const useOAuth2 = (): UseOAuth2Return => {
  const { authType, setAuthType, googleToken, setGoogleToken, refreshPopupOpen, setRefreshPopupOpen } =
    useContext(LoginContextWrapper)
  const { tokenData, token, logIn, logOut, idToken, error, loginInProgress, idTokenData }: IAuthContext =
    useContext(AuthContext)

  const googleLogin = React.useCallback(
    useGoogleLogin({
      flow: 'auth-code',
      onSuccess: async (tokenResponse) => {
        try {
          // Step 2: Send auth code to regolith backend for token exchange
          // Note that it sues the same endpoint as the refresh token below
          await axios
            .post(config.googleAuth, {
              authCode: tokenResponse.code,
            })
            .then((res) => {
              const expiryTs = Date.now() + res.data.expires_in * 1000
              // if the expiry is in the past then we have a problem
              if (expiryTs < Date.now()) {
                enqueueSnackbar('Error logging in with Google. Please try again.', { variant: 'error' })
                log.error('Token expired before it was even set')
                setGoogleToken(null)
                logOut()
              } else {
                setGoogleToken({
                  accessToken: res.data.access_token as string,
                  refreshToken: res.data.refresh_token as string,
                  expiryTs: getExpiryTs(res.data.expires_in, 5),
                })
                enqueueSnackbar('Successfully logged in with Google', { variant: 'success' })
              }
            })
        } catch (error) {
          enqueueSnackbar('Error logging in with Google. Please try again.', { variant: 'error' })
          log.error('Error exchanging code for token:', error)
          logOut()
        }
      },
      onError: (error) => log.error('Google Login Failed:', error),
    }),
    [googleToken, setGoogleToken]
  )

  // Step 3: Refresh token before access token expires
  React.useEffect(() => {
    if (!googleToken || !googleToken.refreshToken) return
    const refreshAccessToken = async () => {
      log.debug('Refreshing Google token', googleToken)
      await axios
        .post(config.googleAuth, { refreshToken: googleToken.refreshToken })
        .then((res) => {
          log.debug(`Refreshed Google token at ${dayjs().format('YYYY-MM-DD HH:mm:ss')} for ${googleToken}`, res.data)
          if (!res.data.access_token) {
            enqueueSnackbar('Error refreshing token. Please log in again.', { variant: 'error' })
            throw new Error('No access token in response')
          }
          setGoogleToken({
            accessToken: res.data.access_token,
            refreshToken: res.data.refresh_token,
            expiryTs: getExpiryTs(res.data.expires_in, 5),
          })
        })
        .catch((error) => {
          enqueueSnackbar('Error refreshing token. Please log in again.', { variant: 'error' })
          log.error('Error refreshing token:', error.response?.data || error.message)
          logOut()
        })
    }

    // Refresh token 5 minutes before it's set to expire
    const intervalValue = googleToken.expiryTs - Date.now() - 5 * 60 * 1000 // Set a timer for 5 minutes before expiry

    if (googleToken.expiryTs < Date.now()) {
      // If the token is already expired, refresh it immediately
      refreshAccessToken()
    } else {
      const intervalObj = setInterval(refreshAccessToken, intervalValue)
      return () => clearInterval(intervalObj)
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
    setGoogleToken(null)
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
    token: authType === AuthTypeEnum.Google ? (googleToken?.accessToken as string) : token,
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

type GoogleTokenObject = { accessToken: string; refreshToken: string; expiryTs: number }

type LoginSwitcherObj = {
  authType: AuthTypeEnum
  setAuthType: (authType: AuthTypeEnum) => void
  googleToken: GoogleTokenObject | null
  setGoogleToken: (obj: GoogleTokenObject | null) => void
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
  googleToken: null,
  setGoogleToken: (obj: GoogleTokenObject | null) => {
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
  const [googleToken, _setGoogleToken] = useLocalStorage<GoogleTokenObject | null>('ROCP_GooToken', null)

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
        setGoogleToken: (obj: GoogleTokenObject | null) => {
          _setGoogleToken(obj)
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
