import React, { useContext, useEffect } from 'react'
import { AuthProvider, AuthContext, TAuthConfig, TRefreshTokenExpiredEvent, IAuthContext } from 'react-oauth2-code-pkce'
import { getRedirectUrl } from './OAuth2.provider'
import config from '../config'
import { InnerLoginContextObj } from '../context/auth.context'
import * as Sentry from '@sentry/react'

export class DiscordAuthError extends Error {
  constructor(public details: Record<string, unknown>) {
    super('Discord Authentication Error')
    this.name = `DiscordAuthError`
    Object.setPrototypeOf(this, DiscordAuthError.prototype)
  }
}

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
export const DiscordAuthInner: React.FC<{ setInnerState: (obj: InnerLoginContextObj) => void }> = ({
  setInnerState,
}) => {
  const { token, logIn, logOut, loginInProgress, error }: IAuthContext = useContext(AuthContext)

  useEffect(() => {
    if (config.stage !== 'production') return
    if (error) {
      Sentry.captureException(
        new DiscordAuthError({
          error,
        }),
        {
          extra: { error },
        }
      )
      console.error('DiscordAuthInner::Error', error)
    }
  }, [error])

  useEffect(() => {
    const newState = {
      isAuthenticated: Boolean(token),
      loading: loginInProgress,
      token: token,
      authLogIn: logIn,
      authLogOut: logOut,
    }
    // Compare newState with outerCtx and only call setInnerState if they don't match
    setInnerState(newState)
  }, [token, logIn, logOut, loginInProgress])

  return null
}

/**
 * This is a top-level component that wraps EVERYTHING and delivers context to be able to
 * swap Authentications at will
 * @param param0
 * @returns
 */
export const DiscordAuthProvider: React.FC<{ setInnerState: (obj: InnerLoginContextObj) => void }> = ({
  setInnerState,
}) => {
  const discordConfig = React.useMemo(() => getDiscordConfig(), [])
  const discordAuth: TAuthConfig = {
    ...discordConfig,
    onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => {},
  }

  return (
    <AuthProvider authConfig={discordAuth}>
      <DiscordAuthInner setInnerState={setInnerState} />
    </AuthProvider>
  )
}
