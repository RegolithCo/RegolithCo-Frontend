import React from 'react'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'
import reportWebVitals from './reportWebVitals'
import log from 'loglevel'
import { APIProvider } from './hooks/useLogin'
import App from './App'
import { SnackbarProvider } from 'notistack'
import { MyAuthProvider } from './hooks/useOAuth2'
import LogRocket from 'logrocket'
import { AppContextWrapper } from './context/app.context'
import { ErrorBoundary } from './Error'
import { LookupsContextWrapper } from './context/lookupsContext'
import config from './config'

if (config.stage !== 'production') {
  // Logrocket only runs when not in production since we only get the free plan
  log.enableAll()
  log.debug('Logging is set to enable all')
  LogRocket.init('xiwxu9/regolith')
  log.debug(`Logging is set to all for stage ${config.stage}`)
} else {
  log.setLevel('info')
  log.info(`Logging is set to info for stage ${config.stage}`)
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider autoHideDuration={1300} maxSnack={4}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline enableColorScheme />
        <ErrorBoundary>
          <MyAuthProvider>
            <APIProvider>
              <AppContextWrapper>
                <LookupsContextWrapper>
                  <App />
                </LookupsContextWrapper>
              </AppContextWrapper>
            </APIProvider>
          </MyAuthProvider>
        </ErrorBoundary>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
