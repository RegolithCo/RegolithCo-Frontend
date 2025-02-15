import React, { useEffect } from 'react'
import { useGoogleLogin, GoogleOAuthProvider, googleLogout } from '@react-oauth/google'
import log from 'loglevel'
import axios from 'axios'
import dayjs from 'dayjs'
import { enqueueSnackbar } from 'notistack'
import useLocalStorage from '../hooks/useLocalStorage'
import { wipeAuthStorage } from '../lib/utils'
import config from '../config'
import { InnerLoginContextObj } from '../context/auth.context'
import { getRedirectUrl } from './OAuth2.provider'
import { useLocation } from 'react-router-dom'

const getExpiryTs = (expiresIn: number, shortenMin: number): number =>
  // Set the expiry time to the current time plus the expiry time minus the shorten time
  Date.now() + expiresIn * 1000 - shortenMin * 60 * 1000

type GoogleTokenObject = { accessToken: string; refreshToken: string; expiryTs: number }

export const GoogleAuthInner: React.FC<
  React.PropsWithChildren & { isLoaded: boolean; setInnerState: (obj: InnerLoginContextObj) => void }
> = ({ isLoaded, setInnerState }) => {
  const [googleAuth, setGoogleAuth] = useLocalStorage<GoogleTokenObject | null>('ROCP_GooToken', null)
  const location = useLocation()
  const redirectUri = getRedirectUrl()

  const fullLogout = () => {
    log.debug('GoogleAuth::Full Logout')
    setGoogleAuth(null)
    googleLogout()
    wipeAuthStorage()
  }

  const onSuccess = React.useCallback(
    (code: string) => {
      log.debug('GoogleAuth::Token Response good code')
      setInnerState({
        isAuthenticated: true,
        loading: true,
        token: code,
        authLogIn: googleLogin,
        authLogOut: googleLogout,
      })
      try {
        // Step 2: Send auth code to regolith backend for token exchange
        // Note that it sues the same endpoint as the refresh token below
        return axios
          .post(config.googleAuth, {
            authCode: code,
            redirectUri,
          })
          .then((res) => {
            const expiryTs = Date.now() + res.data.expires_in * 1000
            // if the expiry is in the past then we have a problem
            if (expiryTs < Date.now()) {
              enqueueSnackbar('GoogleAuth::Error logging in with Google. Please try again.', { variant: 'error' })
              log.error('GoogleAuth::Token expired before it was even set')
              fullLogout()
            } else {
              log.debug(`GoogleAuth::Token Response good. Expiry in ${dayjs(expiryTs).fromNow()}`)
              handleChange({
                accessToken: res.data.access_token as string,
                refreshToken: res.data.refresh_token as string,
                expiryTs: getExpiryTs(res.data.expires_in, 5),
              })
            }
          })
      } catch (error) {
        enqueueSnackbar('GoogleAuth::Error logging in with Google. Please try again.', { variant: 'error' })
        log.error('GoogleAuth::Error exchanging Google code for token:', error)
        fullLogout()
      }
    },
    [setGoogleAuth, setInnerState]
  )

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: redirectUri,
    onNonOAuthError: (error) => {
      log.error('Google Login Failed:', error)
      fullLogout()
    },
    onError: (error) => log.error('Google Login Failed:', error),
  })

  const handleChange = React.useCallback(
    (obj: GoogleTokenObject) => {
      setGoogleAuth(obj)
      setInnerState({
        isAuthenticated: Boolean(obj.accessToken && obj.expiryTs > Date.now()),
        loading: false,
        token: obj.accessToken,
        authLogIn: googleLogin,
        authLogOut: googleLogout,
      })
    },
    [setGoogleAuth, setInnerState, googleLogin]
  )

  const triggerGoogleLogin = React.useCallback(() => {
    if (googleLogin && isLoaded) googleLogin()
  }, [googleLogin, isLoaded])

  // This is the effect for the initial login
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const authCode = urlParams.get('code')

    if (googleAuth && googleAuth.accessToken && googleAuth.expiryTs > Date.now()) {
      log.debug(`GoogleAuth::Using existing valid token which expires in ${dayjs(googleAuth.expiryTs).fromNow()}`)
      // We only update the inner state because the outer state is fine
      setInnerState({
        isAuthenticated: true,
        loading: false,
        token: googleAuth.accessToken,
        authLogIn: googleLogin,
        authLogOut: googleLogout,
      })
    } else if (authCode) {
      onSuccess(authCode)
      // Remove all the query params from the URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } else {
      triggerGoogleLogin()
    }
  }, [googleAuth, googleLogin, triggerGoogleLogin, location.search, setInnerState])

  // This is the effect for refreshing the token
  useEffect(() => {
    if (!googleAuth || !googleAuth.refreshToken) return
    const refreshAccessToken = async () => {
      setInnerState({
        isAuthenticated: true,
        loading: true,
        token: googleAuth.accessToken,
        authLogIn: googleLogin,
        authLogOut: googleLogout,
      })
      log.debug('Refreshing Google token')
      await axios
        .post(config.googleAuth, { refreshToken: googleAuth.refreshToken })
        .then((res) => {
          log.debug(`Refreshed Google token at ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)
          if (!res.data.access_token) {
            enqueueSnackbar('Error refreshing token. Please log in again.', { variant: 'error' })
            fullLogout()
            throw new Error('No access token in response')
          }
          handleChange({
            accessToken: res.data.access_token as string,
            refreshToken: googleAuth.refreshToken,
            expiryTs: getExpiryTs(res.data.expires_in, 5),
          })
        })
        .catch((error) => {
          enqueueSnackbar('Error refreshing token. Please log in again.', { variant: 'error' })
          log.error('Error refreshing token:', error.response?.data || error.message)
          fullLogout()
        })
    }

    // Refresh token 5 minutes before it's set to expire
    const intervalValue = googleAuth.expiryTs - Date.now() - 5 * 60 * 1000 // Set a timer for 5 minutes before expiry
    // const intervalValue = 5 * 1000

    if (googleAuth.expiryTs < Date.now()) {
      // If the token is already expired, refresh it immediately
      refreshAccessToken()
    } else {
      const intervalObj = setInterval(refreshAccessToken, intervalValue)
      return () => clearInterval(intervalObj)
    }
  }, [googleAuth])

  return null
}

/**
 * This is a top-level component that wraps EVERYTHING and delivers context to be able to
 * swap Authentications at will
 * @param param0
 * @returns
 */
export const GoogleAuthProvider: React.FC<{ setInnerState: (obj: InnerLoginContextObj) => void }> = ({
  setInnerState,
}) => {
  // Instead of state the authType is stored in local storage next to the other pkce keys.
  // This should persist the key with the other choices
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)

  return (
    <GoogleOAuthProvider
      clientId={config.googleClientId}
      onScriptLoadError={() => log.error('GoogleAuth::Script Load Error')}
      onScriptLoadSuccess={() => {
        log.debug('GoogleAuth::Script Loaded')
        setIsLoaded(true)
      }}
    >
      <GoogleAuthInner isLoaded={isLoaded} setInnerState={setInnerState} />
    </GoogleOAuthProvider>
  )
}
