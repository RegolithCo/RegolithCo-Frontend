import React, { useContext } from 'react'
import { useGoogleLogin, GoogleOAuthProvider, googleLogout } from '@react-oauth/google'
import log from 'loglevel'
import axios from 'axios'
import dayjs from 'dayjs'
import { enqueueSnackbar } from 'notistack'
import useLocalStorage from '../hooks/useLocalStorage'
import { wipeAuthStorage } from '../lib/utils'
import config from '../config'
import { LoginContext, LoginContextWrapper } from '../context/auth.context'

const getExpiryTs = (expiresIn: number, shortenMin: number): number =>
  // Set the expiry time to the current time plus the expiry time minus the shorten time
  Date.now() + expiresIn * 1000 - shortenMin * 60 * 1000

type GoogleTokenObject = { accessToken: string; refreshToken: string; expiryTs: number }

export const GoogleAuthInner: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { setAuthType } = useContext(LoginContextWrapper)
  const [googleAuth, setGoogleAuth] = useLocalStorage<GoogleTokenObject | null>('ROCP_GooToken', null)

  const fullLogout = () => {
    googleLogout()
    setGoogleAuth(null)
    setAuthType(null)
    wipeAuthStorage()
  }

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onNonOAuthError: (error) => log.error('Google Login Failed:', error),
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
              fullLogout()
            } else {
              setGoogleAuth({
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
        fullLogout()
      }
    },
    onError: (error) => log.error('Google Login Failed:', error),
  })

  React.useEffect(() => {
    if (!googleAuth || !googleAuth.refreshToken) return
    const refreshAccessToken = async () => {
      log.debug('Refreshing Google token', googleAuth)
      await axios
        .post(config.googleAuth, { refreshToken: googleAuth.refreshToken })
        .then((res) => {
          log.debug(
            `Refreshed Google token at ${dayjs().format('YYYY-MM-DD HH:mm:ss')} for ${googleAuth}`,
            JSON.stringify(res.data)
          )
          if (!res.data.access_token) {
            enqueueSnackbar('Error refreshing token. Please log in again.', { variant: 'error' })
            throw new Error('No access token in response')
          }
          setGoogleAuth({
            accessToken: res.data.access_token,
            refreshToken: res.data.refresh_token,
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

    if (googleAuth.expiryTs < Date.now()) {
      // If the token is already expired, refresh it immediately
      refreshAccessToken()
    } else {
      const intervalObj = setInterval(refreshAccessToken, intervalValue)
      return () => clearInterval(intervalObj)
    }
  }, [googleAuth])

  return (
    <LoginContext.Provider
      value={{
        isAuthenticated: Boolean(googleAuth?.accessToken),
        loading: false,
        token: googleAuth?.accessToken || null,
        logIn: googleLogin,
        logOut: () => {
          googleLogout()
          setGoogleAuth(null)
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
export const GoogleAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Instead of state the authType is stored in local storage next to the other pkce keys.
  // This should persist the key with the other choices

  return <GoogleOAuthProvider clientId={config.googleClientId}>{children}</GoogleOAuthProvider>
}
