import React, { useContext } from 'react'
import { AuthProvider, AuthContext, TAuthConfig, TRefreshTokenExpiredEvent, IAuthContext } from 'react-oauth2-code-pkce'
import log from 'loglevel'
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
  decodeToken: true,
  scope: 'identify guilds',
})

/**
 *
 * @param param0
 * @returns
 */
export const DiscordAuthInner: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { setAuthType } = useContext(LoginContextWrapper)
  const { tokenData, token, logIn, logOut, idToken, error, loginInProgress, idTokenData }: IAuthContext =
    useContext(AuthContext)

  log.info('MARZIPAN', {
    tokenData,
    token,
    logIn,
    logOut,
    idToken,
    error,
    loginInProgress,
    idTokenData,
  })

  return (
    <LoginContext.Provider
      value={{
        isAuthenticated: !!token,
        loading: loginInProgress,
        token: token,
        logIn,
        logOut: () => {
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
    autoLogin: false,
    onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => {},
  }

  return <AuthProvider authConfig={discordAuth}>{children}</AuthProvider>
}
