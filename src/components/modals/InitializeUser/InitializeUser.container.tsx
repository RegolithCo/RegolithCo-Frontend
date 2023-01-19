import * as React from 'react'
import { useLogin } from '../../../hooks/useLogin'
import { InitializeUser } from './InitializeUser'
import { useNavigate } from 'react-router-dom'
import { useUserProfile } from '../../../hooks/useUserProfile'

export interface InitializeUserContainerProps {
  origPath?: string
}

export const InitializeUserContainer: React.FC<InitializeUserContainerProps> = () => {
  const login = useLogin()
  const navigate = useNavigate()

  const userQueries = useUserProfile()

  const backToPage = () => {
    navigate('/')
  }

  return (
    <InitializeUser
      verifyOnly={login.isAuthenticated && login.isInitialized && !login.isVerified}
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
      login={login}
    />
  )
}
