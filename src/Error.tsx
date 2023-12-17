import React from 'react'
import { useRouteError } from 'react-router-dom'
import log from 'loglevel'
import { Typography, Container, Button } from '@mui/material'
import { ThemeProvider } from '@mui/system'
import { theme } from './theme'

export function ErrorPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error: any = useRouteError()
  log.error(error)

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  )
}

interface ErrorBoundaryState {
  hasError: boolean
}

interface ErrorBoundaryProps {
  children?: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ThemeProvider theme={theme}>
          <Container>
            <Typography variant="overline">Regolith Error</Typography>
            <Typography variant="h1">Something went wrong.</Typography>
            <Typography paragraph>Try reloading the page. It may fix the issue.</Typography>
            <Button variant="contained" size="large" onClick={this.handleReload}>
              Reload
            </Button>
          </Container>
        </ThemeProvider>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
