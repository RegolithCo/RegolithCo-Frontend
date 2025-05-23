import React, { useContext, useEffect, useRef } from 'react'
import { AppWrapperContainer } from './components/AppWrapper'
import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { HomePageContainer } from './components/pages/HomePage.container'
import { AboutPageContainer } from './components/pages/AboutPage'
import { ProfilePageContainer } from './components/pages/ProfilePage/ProfilePage.container'
import { SessionPageContainer } from './components/pages/SessionPage/SessionPage.container'
import { InitializeUserContainer } from './components/modals/InitializeUser/InitializeUser.container'
import { DataTablesPageContainer } from './components/pages/DataTablesPage'
import { AuthGate } from './components/pages/AuthGate'
import { DashboardContainer, SessionDashTabsEnum } from './components/pages/Dashboard/Dashboard.container'
import { WorkOrderCalcPageContainer } from './components/pages/WorkOrderCalcPage'
import { ClusterCalcPage } from './components/pages/ClusterCalcPage'
import { StagingWarning } from './components/modals/StagingWarning'
import { LoadoutPageContainer } from './components/pages/LoadoutPage.container'
import { MarketPriceCalcPage } from './components/pages/MarketPriceCalcPage'
import { SessionJoinContainer } from './components/pages/SessionJoin.container'
import { ProfileTabsEnum } from './components/pages/ProfilePage'
import { ErrorPage } from './Error'
import { SurveyCorpsHomeContainer } from './components/pages/SurveyCorps'
import { AppContext } from './context/app.context'
import { LoginContext, UserProfileContext } from './context/auth.context'
import { TopBar } from './components/TopBar'
import { enqueueSnackbar } from 'notistack'
import { Box } from '@mui/material'

export const App: React.FC = () => {
  const { isAuthenticated } = useContext(LoginContext)
  const { isInitialized, error: userError, loading: userLoading } = React.useContext(UserProfileContext)
  const { maintenanceMode } = React.useContext(AppContext)
  const needIntervention = !userLoading && !userError && isAuthenticated && !isInitialized
  const isAutheticated = useRef(false)

  useEffect(() => {
    if (isAuthenticated !== isAutheticated.current) {
      if (isAuthenticated) enqueueSnackbar('Welcome back!', { variant: 'success' })
      else enqueueSnackbar('Logging out', { variant: 'info' })
      isAutheticated.current = isAuthenticated
    }
  }, [isAuthenticated])

  if (needIntervention)
    return (
      <>
        <TopBar />
        <AppWrapperContainer>
          <Routes>
            <Route
              path="/verify"
              element={
                <AuthGate allowNoInit>
                  <InitializeUserContainer />
                </AuthGate>
              }
              errorElement={<ErrorPage />}
            />
            <Route path="*" element={<Navigate to="/verify  " replace />} />
          </Routes>
        </AppWrapperContainer>
      </>
    )

  return (
    <>
      <TopBar />
      <StagingWarning />
      <AppWrapperContainer>
        <Routes>
          <Route path="/" element={<HomePageContainer />} errorElement={<ErrorPage />} />

          {/* about uses urls for tabs */}
          {!maintenanceMode && (
            <>
              <Route path="/about/" element={<Navigate to="/about/general" replace />} />
              <Route path="/about/:tab" element={<AboutPageContainer />} errorElement={<ErrorPage />} />

              <Route path="/terms" element={<AboutPageContainer />} errorElement={<ErrorPage />} />
              <Route path="/privacy" element={<AboutPageContainer />} errorElement={<ErrorPage />} />

              <Route path="/cluster" element={<ClusterCalcPage />} errorElement={<ErrorPage />} />
              <Route path="/market-price" element={<MarketPriceCalcPage />} errorElement={<ErrorPage />} />
              <Route
                path="/verify"
                element={
                  <AuthGate allowNoInit>
                    <InitializeUserContainer />
                  </AuthGate>
                }
                errorElement={<ErrorPage />}
              />
              {/* Standalone calc */}
              <Route path="/workorder" element={<WorkOrderCalcPageContainer />} errorElement={<ErrorPage />} />
              {/* Tables uses urls for tabs */}
              <Route path="/survey" element={<Navigate to="/survey/ores" replace />} />
              <Route path="/survey/:tab" element={<SurveyCorpsHomeContainer />} />
              <Route path="/survey/:tab/:subtab" element={<SurveyCorpsHomeContainer />} />

              <Route path="/tables/" element={<Navigate to="/tables/ore" replace />} />
              <Route path="/tables/:tab" element={<DataTablesPageContainer />} errorElement={<ErrorPage />} />

              <Route path="/loadouts/" element={<Navigate to="/loadouts/calculator" replace />} />
              <Route path="/loadouts/:tab" element={<LoadoutPageContainer />} errorElement={<ErrorPage />} />
              <Route
                path="/loadouts/:tab/:activeLoadout"
                element={<LoadoutPageContainer />}
                errorElement={<ErrorPage />}
              />

              {/**
               * This is the authentication section. Everything below here needs the AuthGate
               */}

              {/* User's profile page */}
              <Route
                path={`/${ProfileTabsEnum.PROFILE}`}
                element={
                  <AuthGate>
                    <ProfilePageContainer />
                  </AuthGate>
                }
                errorElement={<ErrorPage />}
              />
              <Route
                path={`/${ProfileTabsEnum.SURVEY}`}
                element={
                  <AuthGate>
                    <ProfilePageContainer />
                  </AuthGate>
                }
                errorElement={<ErrorPage />}
              />
              <Route
                path={`/${ProfileTabsEnum.FRIENDS}`}
                element={
                  <AuthGate>
                    <ProfilePageContainer />
                  </AuthGate>
                }
                errorElement={<ErrorPage />}
              />
              <Route
                path={`/${ProfileTabsEnum.SESSION_DEFAULTS}`}
                element={
                  <AuthGate>
                    <ProfilePageContainer />
                  </AuthGate>
                }
                errorElement={<ErrorPage />}
              />
              <Route
                path={`/${ProfileTabsEnum.API}`}
                element={
                  <AuthGate>
                    <ProfilePageContainer />
                  </AuthGate>
                }
                errorElement={<ErrorPage />}
              />
              {/* Session page has 3 ways into it*/}
              <Route
                path="/session"
                element={
                  <AuthGate>
                    <RedirectToDashboardTab />
                  </AuthGate>
                }
                errorElement={<ErrorPage />}
              />
              <Route
                path="/dashboard"
                element={
                  <AuthGate>
                    <RedirectToDashboardTab />
                  </AuthGate>
                }
                errorElement={<ErrorPage />}
              />
              <Route
                path="/dashboard/:tab/:preset?"
                element={
                  <AuthGate>
                    <DashboardContainer />
                  </AuthGate>
                }
                errorElement={<ErrorPage />}
              />
              <Route
                path="/session/:sessionId"
                element={
                  <AuthGate>
                    <RedirectToSessionTab />
                  </AuthGate>
                }
              />
              <Route
                path="/join/:joinId"
                element={
                  <AuthGate>
                    <SessionJoinContainer />
                  </AuthGate>
                }
              />
              <Route
                path="/session/:sessionId/:tab"
                element={
                  <AuthGate>
                    <SessionPageContainer />
                  </AuthGate>
                }
                errorElement={<ErrorPage />}
              />
              <Route
                path="/session/:sessionId/:tab/w/:orderId"
                element={
                  <AuthGate>
                    <SessionPageContainer />
                  </AuthGate>
                }
                errorElement={<ErrorPage />}
              />
              <Route
                path="/session/:sessionId/:tab/s/:scoutingFindId"
                element={
                  <AuthGate>
                    <SessionPageContainer />
                  </AuthGate>
                }
                errorElement={<ErrorPage />}
              />
            </>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Box style={{ flex: '1 1' }} />
      </AppWrapperContainer>
    </>
  )
}

export default App

const RedirectToSessionTab: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  return <Navigate to={`/session/${sessionId}/dash`} replace />
}

const RedirectToDashboardTab: React.FC = () => {
  return <Navigate to={`/dashboard/${SessionDashTabsEnum.sessions}`} replace />
}
