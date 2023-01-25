import React from 'react'
import { AppWrapperContainer } from './components/AppWrapper'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { HomePageContainer } from './components/pages/HomePage'
import Error from './Error'
import { FAQPage } from './components/pages/FAQPage'
import { AboutPage } from './components/pages/AboutPage'
import { ProfilePageContainer } from './components/pages/ProfilePage.container'
import { TopBarContainer } from './components/TopBar.container'
import { SessionPageContainer } from './components/pages/SessionPage/SessionPage.container'
import { InitializeUserContainer } from './components/modals/InitializeUser/InitializeUser.container'
import { DataTablesPageContainer } from './components/pages/DataTablesPage'
import { AuthGate } from './components/pages/AuthGate'
import { SessionChooserPageContainer } from './components/pages/SessionChooserPage.container'
import { WorkOrderCalcPageContainer } from './components/pages/WorkOrderCalcPage'
import { Box } from '@mui/material'
import { ClusterCalcPage } from './components/pages/ClusterCalcPage'
import { useLogin } from './hooks/useOAuth2'

export const App: React.FC = () => {
  const { isAuthenticated, isInitialized, loading } = useLogin()
  const needIntervention = !loading && isAuthenticated && !isInitialized

  if (needIntervention)
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <TopBarContainer />
          <AppWrapperContainer>
            <Routes>
              <Route
                path="/verify"
                element={
                  <AuthGate allowNoInit>
                    <InitializeUserContainer />
                  </AuthGate>
                }
                errorElement={<Error />}
              />
              <Route path="*" element={<Navigate to="/verify  " replace />} />
            </Routes>
          </AppWrapperContainer>
        </Box>
      </Router>
    )

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TopBarContainer />
        <AppWrapperContainer>
          <Routes>
            {needIntervention && (
              <Route
                path="*"
                element={
                  <AuthGate allowNoInit>
                    <InitializeUserContainer />
                  </AuthGate>
                }
                errorElement={<Error />}
              />
            )}
            <Route path="/" element={<HomePageContainer />} errorElement={<Error />} />
            <Route path="/faq" element={<FAQPage />} errorElement={<Error />} />
            <Route path="/about" element={<AboutPage />} errorElement={<Error />} />
            <Route path="/terms" element={<AboutPage />} errorElement={<Error />} />
            <Route path="/privacy" element={<AboutPage />} errorElement={<Error />} />
            <Route path="/cluster" element={<ClusterCalcPage />} errorElement={<Error />} />
            {/* Standalone calc */}
            <Route path="/workorder" element={<WorkOrderCalcPageContainer />} errorElement={<Error />} />
            {/* Tables uses urls for tabs */}
            <Route path="/tables/" element={<Navigate to="/tables/ore" replace />} />
            <Route path="/tables/:tab" element={<DataTablesPageContainer />} errorElement={<Error />} />

            {/**
             * This is the authentication section. Everything below here needs the AuthGate
             */}

            {/* User's profile page */}
            <Route
              path="/profile"
              element={
                <AuthGate>
                  <ProfilePageContainer />
                </AuthGate>
              }
              errorElement={<Error />}
            />
            {/* Session page has 3 ways into it*/}
            <Route
              path="/session"
              element={
                <AuthGate>
                  <SessionChooserPageContainer />
                </AuthGate>
              }
              errorElement={<Error />}
            />
            <Route
              path="/session/:sessionId"
              element={
                <AuthGate>
                  <SessionPageContainer />
                </AuthGate>
              }
              errorElement={<Error />}
            />
            <Route
              path="/session/:sessionId/w/:orderId"
              element={
                <AuthGate>
                  <SessionPageContainer />
                </AuthGate>
              }
              errorElement={<Error />}
            />
            <Route
              path="/session/:sessionId/s/:scoutingFindId"
              element={
                <AuthGate>
                  <SessionPageContainer />
                </AuthGate>
              }
              errorElement={<Error />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <div style={{ flex: '1 1' }} />
        </AppWrapperContainer>
      </Box>
    </Router>
  )
}

export default App
