import { AuthTypeEnum, UserProfile } from '@regolithco/common'
import React, { useContext } from 'react'
import { AuthContext, AuthProvider, TAuthConfig, TRefreshTokenExpiredEvent, IAuthContext } from 'react-oauth2-code-pkce'
import useLocalStorage from './useLocalStorage'
import log from 'loglevel'
const redirectUrl = new URL(process.env.PUBLIC_URL, window.location.origin).toString()

const discordConfig: TAuthConfig = {
  clientId: '1067082442877440050',
  authorizationEndpoint: 'https://discord.com/oauth2/authorize',
  tokenEndpoint: 'https://discord.com/api/oauth2/token',
  redirectUri: redirectUrl,
  autoLogin: false,
  decodeToken: false,
  scope: 'identify',
  onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) =>
    window.confirm('Session expired. Refresh page to continue using the site?') && event.login(),
}

const googleConfig: TAuthConfig = {
  clientId: '413063286287-5d17pgr02vra5go3n82jvs11rckd56vl.apps.googleusercontent.com',
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  redirectUri: redirectUrl,
  autoLogin: false,
  scope: 'openid',
  onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) =>
    window.confirm('Session expired. Refresh page to continue using the site?') && event.login(),
}

type UseOAuth2Return = IAuthContext & {
  authType: AuthTypeEnum
  setAuthType: (authType: AuthTypeEnum) => void
}

/**
 * This is a hook we use inside useLogin() to get the OAuth2 context
 * @returns
 */
export const useOAuth2 = (): UseOAuth2Return => {
  const { authType, setAuthType } = useContext(LoginContextWrapper)
  const { tokenData, token, login, logOut, idToken, error, loginInProgress, idTokenData }: IAuthContext =
    useContext(AuthContext)

  return {
    tokenData,
    token,
    error,
    idToken,
    authType,
    setAuthType,
    login,
    logOut,
    loginInProgress,
    idTokenData,
  }
}

type LoginSwitcherObj = {
  authType: AuthTypeEnum
  setAuthType: (authType: AuthTypeEnum) => void
}

const LoginContextWrapper = React.createContext<LoginSwitcherObj>({
  authType: AuthTypeEnum.DISCORD,
  setAuthType: () => {
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
  const [authTypeLS, setAuthTypeLS] = useLocalStorage<AuthTypeEnum>('ROCP_AuthType', AuthTypeEnum.DISCORD)
  const [authType, _setAuthType] = React.useState<AuthTypeEnum>(authTypeLS)
  const [postLoginRedirect, setPostLoginRedirect] = useLocalStorage<string | null>('ROCP_PostLoginRedirect', null)

  const setAuthType = (newAuthType: AuthTypeEnum) => {
    setAuthTypeLS(newAuthType)
    _setAuthType(newAuthType)
  }

  let authConfig: TAuthConfig = discordConfig
  if (authType === AuthTypeEnum.GOOGLE) authConfig = googleConfig

  const newAuth: TAuthConfig = {
    ...authConfig,
    postLogin: () => {
      if (postLoginRedirect) {
        const newUrl = new URL(process.env.PUBLIC_URL + postLoginRedirect, window.location.origin)
        setPostLoginRedirect(null)
        window.location.href = newUrl.toString()
      }
    },
  }

  return (
    <LoginContextWrapper.Provider value={{ authType, setAuthType }}>
      <AuthProvider authConfig={newAuth}>{children}</AuthProvider>
    </LoginContextWrapper.Provider>
  )
}

const DEFAULT_LOGIN_CONTEXT: LoginContextObj = {
  isAuthenticated: false,
  isInitialized: false,
  isVerified: false,
  APIWorking: true,
  popup: null,
  openPopup: () => {
    console.log('NOT SET UP FOR POPUP')
  },
  login: (authType: AuthTypeEnum) => {
    console.log('NOT SET UP FOR LOGIN', authType)
  },
  logOut: () => {
    console.log('NOT SET UP FOR LOGOUT')
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
  login: (authType: AuthTypeEnum) => void
  logOut: () => void
  userProfile?: UserProfile
}
