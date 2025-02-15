import React, { useContext } from 'react'
import { AuthProvider, AuthContext, TAuthConfig, TRefreshTokenExpiredEvent, IAuthContext } from 'react-oauth2-code-pkce'
import { getRedirectUrl } from './OAuth2.provider'
import { wipeAuthStorage } from '../lib/utils'
import config from '../config'
import { LoginContext, LoginContextWrapper } from '../context/auth.context'

const getDiscordConfig = (): TAuthConfig => ({
  clientId: config.discordClientId,
  authorizationEndpoint: 'https://discord.com/oauth2/authorize',
  tokenEndpoint: 'https://discord.com/api/oauth2/token',
  redirectUri: getRedirectUrl(),
  autoLogin: true,
  decodeToken: false,
  scope: 'identify guilds',
})

/**
 *
 * @param param0
 * @returns
 */
export const DiscordAuthInner: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { setAuthType } = useContext(LoginContextWrapper)
  const { token, logIn, logOut, loginInProgress }: IAuthContext = useContext(AuthContext)

  return (
    <LoginContext.Provider
      value={{
        isAuthenticated: !!token,
        loading: loginInProgress,
        token: token,
        authLogIn: logIn,
        authLogOut: () => {
          logOut()
          setAuthType(null)
          wipeAuthStorage()
        },
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}

/**
 * This is a top-level component that wraps EVERYTHING and delivers context to be able to
 * swap Authentications at will
 * @param param0
 * @returns
 */
export const DiscordAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const discordAuth: TAuthConfig = {
    ...getDiscordConfig(),
    onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => {},
  }

  return (
    <AuthProvider authConfig={discordAuth}>
      <DiscordAuthInner>{children}</DiscordAuthInner>
    </AuthProvider>
  )
}
