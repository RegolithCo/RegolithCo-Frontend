import React, { useContext, useEffect } from 'react'
import { UserStateEnum } from '@regolithco/common'
import { useGetUserProfileQuery } from '../schema'
import { usePageVisibility } from '../hooks/usePageVisibility'
import { LoginContext, UserProfileContext } from '../context/auth.context'
import * as Sentry from '@sentry/react'
import config from '../config'

/**
 * Finallly, the third component in the stack goes and gets the user profile (if there is one)
 * @param param0
 * @returns
 */
export const UserProfileProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, loading: loginLoading } = useContext(LoginContext)
  const isPageVisible = usePageVisibility()

  const userProfileQry = useGetUserProfileQuery({
    skip: !isAuthenticated || loginLoading,
  })

  useEffect(() => {
    if (config.stage !== 'production') return
    Sentry.setTag('Authenticated', isAuthenticated)
    if (isAuthenticated && userProfileQry.data?.profile) {
      Sentry.setUser({
        id: userProfileQry.data?.profile?.userId,
        username: userProfileQry.data?.profile?.scName,
      })
    } else {
      Sentry.setUser({
        username: 'Anonymous',
      })
    }
  }, [isAuthenticated, userProfileQry.data])

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

  return (
    <UserProfileContext.Provider
      value={{
        error: userProfileQry.error,
        isVerified: Boolean(
          userProfileQry.data?.profile?.userId && userProfileQry.data?.profile?.state === UserStateEnum.Verified
        ),
        isInitialized: Boolean(userProfileQry.data?.profile),
        myProfile: userProfileQry.data?.profile || null,
        loading:
          loginLoading || userProfileQry.loading || (isAuthenticated && !userProfileQry.data && !userProfileQry.error),
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}
