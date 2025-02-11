import React, { useEffect, useState } from 'react'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import log from 'loglevel'
import { UserProfile, UserStateEnum } from '@regolithco/common'
import { useGetUserProfileQuery } from '../schema'
import { LoginChoice } from '../components/modals/LoginChoice'
import { LoginRefresh } from '../components/modals/LoginRefresh'
import { LoginContext, useOAuth2 } from '../hooks/useOAuth2'
import { usePageVisibility } from '../hooks/usePageVisibility'
import useLocalStorage from '../hooks/useLocalStorage'

interface UserProfileProviderProps {
  children: React.ReactNode
  apolloClient: ApolloClient<NormalizedCacheObject>
  APIWorking?: boolean
  maintenanceMode?: string
}
/**
 * Finallly, the third component in the stack goes and gets the user profile (if there is one)
 * @param param0
 * @returns
 */
export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({
  children,
  apolloClient,
  APIWorking,
  maintenanceMode,
}) => {
  const { logOut, logIn, token, loginInProgress, authType, setAuthType, refreshPopupOpen, setRefreshPopupOpen } =
    useOAuth2()
  const [openPopup, setOpenPopup] = useState(false)
  const isPageVisible = usePageVisibility()

  const [postLoginRedirect, setPostLoginRedirect] = useLocalStorage<string | null>('ROCP_PostLoginRedirect', null)
  const isAuthenticated = Boolean(token && token.length > 0)
  const userProfileQry = useGetUserProfileQuery({
    skip: !isAuthenticated,
  })

  // If the profile fails to fetch then try again in 5 seconds
  React.useEffect(() => {
    if (!isPageVisible || userProfileQry.loading || userProfileQry.data?.profile || !userProfileQry.error) {
      userProfileQry.stopPolling()
    }
    if (!userProfileQry.data?.profile && userProfileQry.error) {
      userProfileQry.startPolling(5000)
    }
    // Also stop polling when this component is unmounted
    return () => {
      userProfileQry.stopPolling()
    }
  }, [userProfileQry.data, userProfileQry.loading, userProfileQry.error])

  useEffect(() => {
    if (postLoginRedirect && isAuthenticated && Boolean(userProfileQry.data?.profile)) {
      const newUrl = new URL(postLoginRedirect, window.location.origin)
      setPostLoginRedirect(null)
      window.location.href = newUrl.toString()
    }
  }, [postLoginRedirect, setPostLoginRedirect, userProfileQry])
  useEffect(() => {
    if (!token || (token.length === 0 && apolloClient)) {
      // log.debug('User is not authenticated, clearing cache')
      // Save the data you want to keep. This will save us having to redownload lookup data for unauthenticated users
      // const dataToKeep = apolloClient.readQuery({ query: GetPublicLookupsDocument })
      // // Clear the cache
      // apolloClient.clearStore()
      // // Write the data you want to keep back to the cache
      // if (dataToKeep) {
      //   apolloClient.writeQuery({ query: GetPublicLookupsDocument, data: dataToKeep })
      // }
    }
  }, [token, apolloClient])

  return (
    <LoginContext.Provider
      value={{
        isAuthenticated,
        APIWorking,
        error: userProfileQry.error,
        maintenanceMode,
        isInitialized: Boolean(userProfileQry.data?.profile),
        isVerified: Boolean(
          userProfileQry.data?.profile?.userId && userProfileQry.data?.profile?.state === UserStateEnum.Verified
        ),
        userProfile: userProfileQry.data?.profile as UserProfile,
        logIn,
        refreshPopupOpen,
        logOut: () => {
          logOut()
          log.debug('Signed out')
          apolloClient.resetStore()
        },
        openPopup: (newLoginRedirect?: string) => {
          // Set up a redirect for later look in <TopbarContainer /> for the code that actions this
          // When the user returns
          // I want the path relative to the base url using window.location.pathname
          const relpath = window.location.pathname
          setPostLoginRedirect(newLoginRedirect || relpath)

          setOpenPopup(true)
        },
        refreshPopup: (
          <LoginRefresh
            open={refreshPopupOpen}
            onClose={() => setRefreshPopupOpen(false)}
            login={logIn}
            logOut={logOut}
            authType={authType}
          />
        ),
        setRefreshPopupOpen: (isOpen: boolean) => setRefreshPopupOpen(isOpen),
        popup: (
          <LoginChoice
            open={openPopup}
            authType={authType}
            setAuthType={setAuthType}
            login={logIn}
            onClose={() => setOpenPopup(false)}
          />
        ),
        loading: loginInProgress || userProfileQry.loading,
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}
