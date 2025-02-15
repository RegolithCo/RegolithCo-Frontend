import { Typography } from '@mui/material'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { LoginButton } from '../LoginButton'
import { PageWrapper } from '../PageWrapper'
import { MaintenancePage } from './MaintenancePage'
import { PageLoader } from './PageLoader.stories'
import { ServiceDownPage } from './ServiceDownPage'
import { AppContext } from '../../context/app.context'
import { LoginContext, UserProfileContext } from '../../context/auth.context'

export interface AuthGateProps {
  children: React.ReactNode
  allowNoInit?: boolean
  fallback?: React.ReactNode
}

export const AuthGate: React.FC<AuthGateProps> = ({ allowNoInit, children, fallback }) => {
  const { maintenanceMode, APIWorking } = React.useContext(AppContext)
  const { isAuthenticated, loading: loginLoading } = React.useContext(LoginContext)
  const { isInitialized, loading: profileLoading } = React.useContext(UserProfileContext)

  // Detect if localStorage has a redirect_url set and then redirect to it
  const redirect_url = localStorage.getItem('redirect_url')
  const loading = loginLoading || profileLoading

  if (!APIWorking) {
    if (maintenanceMode) return <MaintenancePage msg={maintenanceMode} />
    // Store the current URL so we can redirect back after the site comes back online
    // Only set this if there is not already a redirect_url set
    if (!redirect_url) localStorage.setItem('redirect_url', window.location.href)
    return <ServiceDownPage />
  }
  // If the use is not authenticated AND we are not loading, show an error and the login button
  if (!isAuthenticated && !loading) {
    if (fallback) return fallback as React.ReactElement
    return (
      <PageWrapper title="Please login">
        <Typography paragraph>The URL you are trying to reach requires that you authenticate</Typography>
        <LoginButton />
      </PageWrapper>
    )
  }
  // If this is a loading state, show a loading screen
  if (loading) {
    return (
      <PageWrapper title="Logging in...">
        <PageLoader loading title="Loading..." subtitle="Finding your credentials" />
      </PageWrapper>
    )
  }

  if (redirect_url) {
    localStorage.removeItem('redirect_url')
    return <Navigate to={redirect_url} />
  }

  if (!isInitialized && !allowNoInit) {
    return <Navigate to="/verify" />
  }

  return children as React.ReactElement
}
