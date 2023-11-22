import * as React from 'react'

import { defaultSessionName, getActivityName, SessionShare } from '@regolithco/common'
import { PageWrapper } from '../PageWrapper'
import { Alert, AlertTitle, Box, Button, Paper, Typography } from '@mui/material'
import { SessionJoinError } from './SessionJoin.container'
import dayjs from 'dayjs'
import { fontFamilies } from '../../theme'
import { ArrowBack } from '@mui/icons-material'

export interface SessionJoinProps {
  sessionShare?: SessionShare
  loading: boolean
  joinSession: () => void
  navigate: (path: string) => void
  joinErrors: SessionJoinError[]
}

export const SessionJoin: React.FC<SessionJoinProps> = ({
  sessionShare,
  loading,
  joinSession,
  navigate,
  joinErrors,
}) => {
  const subtitleArr = []
  if (sessionShare?.activity) subtitleArr.push(getActivityName(sessionShare?.activity))

  return (
    <PageWrapper title="Session Join" loading={loading} maxWidth="md">
      <Typography variant="body1" component="div" paragraph>
        This is a session that you have been invited to join.
      </Typography>
      <Paper elevation={5} sx={{ p: 3, border: '1px solid white', borderRadius: 3 }}>
        <Typography variant="h4" component="h1">
          {sessionShare?.name || defaultSessionName()}
        </Typography>
        {sessionShare && (
          <Typography sx={{ fontFamily: 'inherit' }} component="div" gutterBottom>
            <strong>Started:</strong> {dayjs(sessionShare.createdAt).format('ddd, MMM D YYYY, h:mm a')}
          </Typography>
        )}
        {sessionShare && sessionShare.finishedAt && (
          <Typography sx={{ fontFamily: 'inherit' }} component="div" gutterBottom>
            <strong>Ended:</strong> {dayjs(sessionShare.finishedAt).format('ddd, MMM D YYYY, h:mm a')}
          </Typography>
        )}
        {sessionShare && sessionShare.note && (
          <Typography sx={{ fontFamily: 'inherit' }} component="div" gutterBottom>
            <strong>Note:</strong> {sessionShare.note}
          </Typography>
        )}
        <Box style={{ flex: '1 1' }}>
          {subtitleArr.length > 0 && (
            <Typography variant="h6" component="div">
              {subtitleArr.join(' - ')}
            </Typography>
          )}
          {sessionShare && sessionShare.note && sessionShare.note.trim().length && (
            <Typography component="div" sx={{ mb: 2 }} gutterBottom>
              {sessionShare.note}
            </Typography>
          )}
        </Box>
        {joinErrors.includes(SessionJoinError.NotOnList) && (
          <Alert severity="error" sx={{ my: 2 }}>
            <AlertTitle>This session is by invite only and you are not on the list</AlertTitle>
            <Typography paragraph>
              If you are in contact with the session owner ask them to add you to the Inactive user list.
            </Typography>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => {
                navigate('/session')
              }}
              sx={{ ml: 2 }}
              variant="contained"
            >
              Back to Sessions
            </Button>
          </Alert>
        )}
        {joinErrors.includes(SessionJoinError.UnverifiedNotAllowd) && (
          <Alert severity="error" sx={{ my: 2 }}>
            <AlertTitle>Only verified users are allowed to join this session</AlertTitle>
            <Typography paragraph>The user has requested that only verified users join this session</Typography>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => {
                navigate('/session')
              }}
              sx={{ ml: 2 }}
              variant="contained"
            >
              Back to Sessions
            </Button>
          </Alert>
        )}
        {joinErrors.includes(SessionJoinError.Closed) && (
          <Alert severity="error" sx={{ my: 2 }}>
            <AlertTitle>Session Closed</AlertTitle>
            <Typography paragraph>
              This session has been closed either deliberately or due to inactivity and is no longer accepting new
              users.
            </Typography>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => {
                navigate('/session')
              }}
              sx={{ ml: 2 }}
              variant="contained"
            >
              Back to Sessions
            </Button>
          </Alert>
        )}
      </Paper>

      {joinErrors.length === 0 && (
        <Box
          sx={{
            width: '100%',
            textAlign: 'center',
            p: 6,
          }}
        >
          <Button
            onClick={joinSession}
            size="large"
            color="secondary"
            sx={{
              fontFamily: fontFamilies.robotoMono,
              fontSize: '2.5rem',
            }}
            variant="contained"
          >
            Join this session
          </Button>
        </Box>
      )}
    </PageWrapper>
  )
}
