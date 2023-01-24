import * as React from 'react'
import { InitializeUser } from './InitializeUser'
import { useNavigate } from 'react-router-dom'
import { useUserProfile } from '../../../hooks/useUserProfile'
import { useLogin } from '../../../hooks/useOAuth2'

export interface InitializeUserContainerProps {
  origPath?: string
}

export const InitializeUserContainer: React.FC<InitializeUserContainerProps> = () => {
  const userCtx = useLogin()
  const navigate = useNavigate()

  const userQueries = useUserProfile()

  const backToPage = () => {
    navigate('/')
  }

  return (
    <InitializeUser
      verifyOnly={userCtx.isAuthenticated && userCtx.isInitialized && !userCtx.isVerified}
      verifyError={userQueries.verifyError ? 'Account verification failed' : undefined}
      userProfile={userQueries.userProfile}
      fns={{
        backToPage,
        requestVerify: userQueries.requestVerify,
        initializeUser: userQueries.initializeUser,
        verifyUser: userQueries.verifyUser,
        deleteUser: userQueries.deleteProfile,
      }}
      loading={userQueries.loading || userQueries.mutating}
      login={userCtx}
    />
  )
}
