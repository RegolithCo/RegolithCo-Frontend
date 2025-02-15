import React from 'react'
import { useRouteError } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import log from 'loglevel'
import { Typography, Container, Button, Divider } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { PageWrapper } from './components/PageWrapper'
import { AppWrapperContainer } from './components/AppWrapper'
import { DiscordIcon } from './icons'
import { Replay } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { wipeLocalLookups } from './lib/utils'
import { TopBar } from './components/TopBar'

// const basename = import.meta.env.MODE === 'development' ? '/regolithco' : '/'

export function ErrorPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error: any = useRouteError()
  log.error(error)

  return <GenericError error={error as Error} errorInfo={error?.info as React.ErrorInfo} />
}

export interface GenericErrorProps {
  error: Error
  errorInfo: React.ErrorInfo
}

export const GenericError: React.FC<GenericErrorProps> = ({ error, errorInfo }) => {
  const { enqueueSnackbar } = useSnackbar()

  const handleReload = () => {
    wipeLocalLookups()
    window.location.reload()
  }

  return (
    <Router>
      <TopBar />
      <AppWrapperContainer>
        <PageWrapper title="ERROR: Something went wrong" maxWidth="lg">
          <Container>
            <Typography variant="overline">Regolith Error</Typography>
            <Typography paragraph>
              Try reloading the page. It may fix the issue. If this error persists, please consider copying the error
              and pasting it in our `report-bugs` channel on Discord.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button startIcon={<Replay />} color="info" variant="contained" size="large" onClick={handleReload}>
                Try Reloading
              </Button>
              <Button
                startIcon={<DiscordIcon />}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontSize: '1rem', p: 2, maxWidth: 200 }}
                href="https://discord.gg/6TKSYHNJha"
                target="_blank"
              >
                Discord Server
              </Button>
            </Stack>
            <Divider sx={{ my: 5 }} />
            <Typography variant="overline" sx={{ mt: 5 }}>
              Error Details (Click to copy)
            </Typography>
            <Typography paragraph>
              If you are reporting this error, please include the details below. This will help us debug the issue.
            </Typography>
            <Box
              onClick={() => {
                const text = error?.toString() + '\n' + errorInfo?.componentStack
                navigator.clipboard.writeText(text)
                // Now notify
                enqueueSnackbar('Copied to clipboard', { variant: 'info' })
              }}
              sx={{
                border: '1px solid red',
                borderRadius: '5px',
                padding: '1rem',
                overflow: 'hidden',
                backgroundColor: '#2e0000',
                margin: '1rem 0',
              }}
            >
              <pre>{error?.toString()}</pre>
              <pre>{errorInfo?.componentStack}</pre>
            </Box>
          </Container>
        </PageWrapper>
      </AppWrapperContainer>
    </Router>
  )
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children?: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: undefined }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <GenericError error={this.state.error as Error} errorInfo={this.state.errorInfo as React.ErrorInfo} />
    }

    return this.props.children
  }
}
