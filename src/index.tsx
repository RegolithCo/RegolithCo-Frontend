import React from 'react'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'
import reportWebVitals from './reportWebVitals'
import log from 'loglevel'
import App from './App'
import { SnackbarProvider } from 'notistack'
// import LogRocket from 'logrocket'
import { ErrorBoundary } from './Error'
import { BrowserRouter as Router } from 'react-router-dom'
import { LookupsContextWrapper } from './context/lookupsContext'
import config, { getVersions } from './config'
import { ScreenshareProvider } from './context/screenshare.context'
import { APIProvider } from './providers/API.provider'
import { OAuth2Provider } from './providers/OAuth2.provider'
import { UserProfileProvider } from './providers/UserProfile.provider'
import { LoginChoiceContainer } from './components/modals/LoginChoice'
import * as Sentry from '@sentry/react'

if (config.stage !== 'production') {
  // Logrocket only runs when not in production since we only get the free plan
  log.enableAll()
  log.debug('Logging is set to enable all')
  // LogRocket.init('xiwxu9/regolith')
  log.debug(`Logging is set to all for stage ${config.stage}`)
} else {
  log.setLevel('info')
  log.info(`Logging is set to info for stage ${config.stage}`)
}
const versions = getVersions()
Sentry.init({
  dsn: 'https://9f240841555f7364d65fb26d7c64b210@o4508823981391872.ingest.us.sentry.io/4508824003936256',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
      mask: ['.sentry-mask'],
    }),
  ],
  // Tracing
  environment: config.stage,
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    'localhost',
    'http://127.0.0.1:7009/api',
    'https://api.regolith.rocks/staging',
    'https://api.regolith.rocks',
  ],
  release: `regolith@${versions.appVersion}`,
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={theme}>
        <SnackbarProvider autoHideDuration={1300} maxSnack={4}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline enableColorScheme />
          <ErrorBoundary>
            <OAuth2Provider>
              <APIProvider>
                <UserProfileProvider>
                  <ScreenshareProvider>
                    <LookupsContextWrapper>
                      <LoginChoiceContainer />
                      <App />
                    </LookupsContextWrapper>
                  </ScreenshareProvider>
                </UserProfileProvider>
              </APIProvider>
            </OAuth2Provider>
          </ErrorBoundary>
        </SnackbarProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
