import * as React from 'react'

import { UserProfile, Session, SessionStateEnum } from '@regolithco/common'
import { Alert, AlertTitle, Box, Button, FormControlLabel, Paper, Switch, Typography, useTheme } from '@mui/material'
import { SessionList } from '../fields/SessionList'
import { AddCircle } from '@mui/icons-material'
import { Container, Stack } from '@mui/system'
import { PageLoader } from './PageLoader'
import { fontFamilies } from '../../theme'

export interface SessionChooserPageProps {
  userProfile: UserProfile
  mySessions: Session[]
  joinedSessions: Session[]
  loading?: boolean
  navigate?: (path: string) => void
  onCreateNewSession?: () => void
}

export const SessionChooserPage: React.FC<SessionChooserPageProps> = ({
  userProfile,
  mySessions,
  joinedSessions,
  loading,
  navigate,
  onCreateNewSession,
}) => {
  const theme = useTheme()
  const [activeOnly, setActiveOnly] = React.useState(false)

  // Make our buckets: bucket 1: [year-month] bucket 2: day
  const allSessionsSorted: Session[] = React.useMemo(() => {
    const allSessions = [...mySessions, ...joinedSessions].filter((s) =>
      activeOnly ? s.state !== SessionStateEnum.Closed : true
    )
    allSessions.sort((a, b) => b.createdAt - a.createdAt)
    return allSessions
  }, [mySessions, joinedSessions, activeOnly])

  const styles = {
    container: {
      py: {
        md: 3,
        lg: 4,
      },
      px: {
        md: 2,
        lg: 4,
      },
      my: {
        md: 4,
      },
      border: {
        // md: '1px solid #444444',
      },
      backgroundColor: '#000000cc',
    },
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={4} sx={styles.container}>
        <Stack
          spacing={2}
          sx={{ my: 2, borderBottom: `2px solid ${theme.palette.secondary.dark}` }}
          direction={{ xs: 'column', sm: 'row' }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              color: 'secondary.dark',
              fontFamily: fontFamilies.robotoMono,
              fontWeight: 'bold',
            }}
          >
            My Sessions
          </Typography>
          <div style={{ flex: 1 }} />
          <FormControlLabel
            control={<Switch checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} />}
            label="Only active"
            labelPlacement="start"
          />
        </Stack>

        <Stack spacing={2} sx={{ my: 2 }} direction={{ xs: 'column', sm: 'row' }}>
          <Box>
            {onCreateNewSession && (
              <Button
                startIcon={<AddCircle />}
                size="large"
                variant="contained"
                sx={{ margin: '0 auto' }}
                onClick={onCreateNewSession}
              >
                Create a new Session
              </Button>
            )}
          </Box>
          <div style={{ flex: 1 }} />
          <Alert elevation={6} variant="outlined" severity="info" sx={{ my: 2, flex: '1 1 50%' }}>
            <AlertTitle>Sessions close automatically</AlertTitle>
            <Typography>
              Sessions end after 12 hours of inactivity. Ended sessions cannot be re-opened, however you can still mark
              shares as paid.{' '}
            </Typography>
          </Alert>
        </Stack>

        <SessionList
          sessions={allSessionsSorted}
          loading={loading}
          activeOnly={activeOnly}
          onClickSession={(sessionId) => navigate?.(`/session/${sessionId}`)}
        />
      </Paper>
      <PageLoader title="Loading..." loading={loading} small />
      {/* <PageLoader title="Loading session data" loading small /> */}
    </Container>
  )
}
