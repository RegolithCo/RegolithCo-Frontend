import { Typography } from '@mui/material'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useLogin } from '../../hooks/useLogin'
import { LoginButton } from '../LoginButton'
import { PageWrapper } from '../PageWrapper'
import { MaintenancePage } from './MaintenancePage'
import { PageLoader } from './PageLoader.stories'
import { ServiceDownPage } from './ServiceDownPage'

export interface AuthGateProps {
  children: React.ReactNode
  allowNoInit?: boolean
  fallback?: React.ReactNode
}

export const AuthGate: React.FC<AuthGateProps> = ({ allowNoInit, children, fallback }) => {
  const { isAuthenticated, loading, isInitialized, APIWorking, maintenanceMode } = useLogin()
  if (!APIWorking) {
    if (maintenanceMode) return <MaintenancePage msg={maintenanceMode} />
    return <ServiceDownPage />
  } else if (!isAuthenticated && !loading) {
    if (fallback) return fallback as React.ReactElement
    return (
      <PageWrapper title="Please login">
        <Typography paragraph>The URL you are trying to reach requires that you authenticate</Typography>
        <LoginButton />
      </PageWrapper>
    )
  } else if (loading) {
    return (
      <PageWrapper title="Logging in...">
        <PageLoader loading title="Loading..." subtitle="Finding your credentials" />
      </PageWrapper>
    )
  } else if (!isInitialized && !allowNoInit) {
    return <Navigate to="/verify" />
  }

  return children as React.ReactElement
}
