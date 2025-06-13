import React from 'react'
import { useRouteError } from 'react-router-dom'
import log from 'loglevel'
import { Typography, Container, Button, Divider, Box, Stack } from '@mui/material'
import { PageWrapper } from './components/PageWrapper'
import { AppWrapperContainer } from './components/AppWrapper'
import { DiscordIcon } from './icons'
import { BugReport, Replay } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { wipeLocalLookups } from './lib/utils'
import { TopBar } from './components/TopBar'
import { useBrowserTitle } from './hooks/useBrowserTitle'
// import { feedbackIntegration } from '@sentry/react'

// const basename = import.meta.env.MODE === 'development' ? '/regolithco' : '/'

export function ErrorPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error: any = useRouteError()
  log.error(error)

  return <GenericErrorPage error={error as Error} errorInfo={error?.info as React.ErrorInfo} />
}

export interface GenericErrorProps {
  error: Error
  errorInfo: React.ErrorInfo
}

export const GenericErrorPage: React.FC<GenericErrorProps> = ({ error, errorInfo }) => {
  const { enqueueSnackbar } = useSnackbar()
  useBrowserTitle('Error - Regolith')
  const handleReload = () => {
    wipeLocalLookups()
    window.location.reload()
  }

  return (
    <>
      <TopBar />
      <AppWrapperContainer>
        <PageWrapper title="ERROR: Something went wrong" maxWidth="lg">
          <Container>
            <Typography variant="overline">Regolith Error</Typography>
            <Typography component="p" gutterBottom>
              Try reloading the page. It may fix the issue. If this error persists, please consider copying the error
              and pasting it in our `report-bugs` channel on Discord.
            </Typography>
            <Stack
              direction="row"
              justifyContent={'space-between'}
              spacing={2}
              sx={{
                width: '100%',
                my: 4,
              }}
            >
              <Button startIcon={<Replay />} color="info" variant="contained" size="large" onClick={handleReload}>
                Try Reloading
              </Button>
              {/* <Button
                startIcon={<BugReport />}
                variant="contained"
                color="error"
                fullWidth
                sx={{ fontSize: '1rem', p: 2, maxWidth: 200 }}
                onClick={async () => {
                  const feedback = feedbackIntegration({
                    colorScheme: 'dark',
                    showEmail: false,
                    isNameRequired: true,
                    isEmailRequired: false,
                    nameLabel: 'RSI Username',
                    namePlaceholder: 'miner-joe',
                    enableScreenshot: false,
                    messagePlaceholder:
                      "What's the bug? What did you do to cause it? What did you expect? What happened instead?",
                    // messagePlaceholder
                    // Disable the injection of the default widget
                    autoInject: false,
                  })
                  const form = await feedback.createForm()
                  form.appendToDom()
                  form.open()
                }}
              >
                Report Bug
              </Button> */}
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
            <Typography component="p" gutterBottom fontStyle={'italic'}>
              <strong>NOTE:</strong> We get detailed reports of all crashes including this one so you don't NEED to
              report this bug unless you feel there's something special about it.
            </Typography>
            <Divider sx={{ my: 5 }} />
            <Typography variant="h4" color="error">
              Error Message:
            </Typography>
            <Typography variant="overline" sx={{ mt: 5 }}>
              Error Details (Click to copy)
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
    </>
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
      return <GenericErrorPage error={this.state.error as Error} errorInfo={this.state.errorInfo as React.ErrorInfo} />
    }

    return this.props.children
  }
}
