import React from 'react'
import { AppWrapperContainer } from './components/AppWrapper'
import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { HomePageContainer } from './components/pages/HomePage.container'
import { AboutPageContainer } from './components/pages/AboutPage'
import { ProfilePageContainer } from './components/pages/ProfilePage.container'
import { TopBarContainer } from './components/TopBar.container'
import { SessionPageContainer } from './components/pages/SessionPage/SessionPage.container'
import { InitializeUserContainer } from './components/modals/InitializeUser/InitializeUser.container'
import { DataTablesPageContainer } from './components/pages/DataTablesPage'
import { AuthGate } from './components/pages/AuthGate'
import { SessionChooserPageContainer } from './components/pages/SessionChooserPage.container'
import { WorkOrderCalcPageContainer } from './components/pages/WorkOrderCalcPage'
import { ClusterCalcPage } from './components/pages/ClusterCalcPage'
import { useLogin } from './hooks/useOAuth2'
import { StagingWarning } from './components/modals/StagingWarning'
import { LoadoutPageContainer } from './components/pages/LoadoutPage.container'
import { MarketPriceCalcPage } from './components/pages/MarketPriceCalcPage'
import { SessionJoinContainer } from './components/pages/SessionJoin.container'
import { ProfileTabsEnum } from './components/pages/ProfilePage'
import { ErrorPage } from './Error'

const STAGE = document.querySelector<HTMLMetaElement>('meta[name=stage]')?.content
const IS_STAGING = !STAGE || STAGE === 'dev' || STAGE === 'staging'

export const App: React.FC = () => {
  const { isAuthenticated, isInitialized, loading, error } = useLogin()
  const [stagingWarningOpen, setStagingWarningOpen] = React.useState<boolean>(IS_STAGING)
  const needIntervention = !loading && !error && isAuthenticated && !isInitialized

  if (needIntervention)
    return (
      <Router basename={process.env.PUBLIC_URL}>
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
              errorElement={<ErrorPage />}
            />
            <Route path="*" element={<Navigate to="/verify  " replace />} />
          </Routes>
        </AppWrapperContainer>
      </Router>
    )

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <TopBarContainer />
      <StagingWarning
        open={stagingWarningOpen}
        onClose={() => {
          setStagingWarningOpen(false)
        }}
      />
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
              errorElement={<ErrorPage />}
            />
          )}
          <Route path="/" element={<HomePageContainer />} errorElement={<ErrorPage />} />

          {/* about uses urls for tabs */}
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
          <Route path="/tables/" element={<Navigate to="/tables/ore" replace />} />
          <Route path="/tables/:tab" element={<DataTablesPageContainer />} errorElement={<ErrorPage />} />

          <Route path="/loadouts/" element={<Navigate to="/loadouts/calculator" replace />} />
          <Route path="/loadouts/:tab" element={<LoadoutPageContainer />} errorElement={<ErrorPage />} />
          <Route path="/loadouts/:tab/:activeLoadout" element={<LoadoutPageContainer />} errorElement={<ErrorPage />} />

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
                <SessionChooserPageContainer />
              </AuthGate>
            }
            errorElement={<ErrorPage />}
          />
          <Route path="/session/:sessionId" element={<RedirectToTab />} />
          <Route path="/join/:joinId" element={<SessionJoinContainer />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <div style={{ flex: '1 1' }} />
      </AppWrapperContainer>
    </Router>
  )
}

export default App

const RedirectToTab: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  return <Navigate to={`/session/${sessionId}/dash`} replace />
}
