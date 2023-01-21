import * as React from 'react'

import { UserProfile, Session } from '@regolithco/common'
import { PageWrapper } from '../PageWrapper'
import { Alert, AlertTitle, Box, Button, FormControlLabel, Switch, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { SessionList } from '../fields/SessionList'
import { AddCircle } from '@mui/icons-material'

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
  const [activeOnly, setActiveOnly] = React.useState(true)

  const friends: string[] = [...userProfile.friends] || []
  // Alphabetically sort friends
  friends.sort((a, b) => {
    return a.localeCompare(b)
  })

  return (
    <PageWrapper title="Choose or Create a Session" loading={loading} maxWidth="md">
      <Alert elevation={6} variant="outlined" severity="warning" sx={{ my: 2 }}>
        <AlertTitle>Sessions close automatically</AlertTitle>
        <Typography>
          Sessions close after 8 hours of inactivity. Closed sessions can be visited but cannot be re-opened.{' '}
        </Typography>
      </Alert>
      <Box sx={{ p: 3 }}>
        {onCreateNewSession && (
          <Button
            startIcon={<AddCircle />}
            size="large"
            variant="contained"
            sx={{ margin: '0 auto' }}
            onClick={onCreateNewSession}
            disabled={loading}
          >
            Create a new Session
          </Button>
        )}
      </Box>

      <FormControlLabel
        control={<Switch checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} />}
        label="Only show active sessions"
      />
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}>
          <SessionList
            title="My sessions"
            activeOnly={activeOnly}
            userProfile={userProfile}
            sessions={mySessions}
            loading={loading}
            pageSize={5}
            onClickSession={(sessionId) => navigate?.(`/session/${sessionId}`)}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          {joinedSessions.length > 0 && (
            <SessionList
              title="Joined Sessions"
              activeOnly={activeOnly}
              userProfile={userProfile}
              sessions={joinedSessions}
              loading={loading}
              pageSize={5}
              onClickSession={(sessionId) => navigate?.(`/session/${sessionId}`)}
            />
          )}
        </Grid>
      </Grid>
    </PageWrapper>
  )
}
