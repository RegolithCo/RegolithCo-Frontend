import * as React from 'react'

import { defaultSessionName, getLocationName, getPlanetName, Session } from '@orgminer/common'
import { PageWrapper } from '../PageWrapper'
import { Alert, AlertTitle, Box, Button, Paper, Typography } from '@mui/material'
import { SessionJoinError } from './SessionJoin.container'
import dayjs from 'dayjs'
import { fontFamilies } from '../../theme'

export interface SessionJoinProps {
  session: Session
  loading: boolean
  joinSession: () => void
  joinErrors: SessionJoinError[]
}

export const SessionJoin: React.FC<SessionJoinProps> = ({ session, loading, joinSession, joinErrors }) => {
  const settings = session.sessionSettings || {}
  const subtitleArr = []
  if (settings.activity) subtitleArr.push(settings.activity)
  if (settings.gravityWell) subtitleArr.push(getPlanetName(settings.gravityWell))
  if (settings.location) subtitleArr.push(getLocationName(settings.location))

  return (
    <PageWrapper title="Session Join" loading={loading} maxWidth="md">
      <Typography variant="body1" component="div" paragraph>
        This is a session that you have been invited to join.
      </Typography>
      <Paper elevation={5} sx={{ p: 3, border: '1px solid white', borderRadius: 3 }}>
        <Typography variant="h4" component="h1">
          {session.name || defaultSessionName()}
        </Typography>
        <Typography sx={{ fontFamily: 'inherit' }} component="div" gutterBottom>
          <strong>Started:</strong> {dayjs(session.createdAt).format('ddd, MMM D YYYY, h:mm a')}
        </Typography>
        {session.finishedAt && (
          <Typography sx={{ fontFamily: 'inherit' }} component="div" gutterBottom>
            <strong>Ended:</strong> {dayjs(session.finishedAt).format('ddd, MMM D YYYY, h:mm a')}
          </Typography>
        )}
        {session.note && (
          <Typography sx={{ fontFamily: 'inherit' }} component="div" gutterBottom>
            <strong>Note:</strong> {session.note}
          </Typography>
        )}
        <div style={{ flex: '1 1' }}>
          {subtitleArr.length > 0 && (
            <Typography variant="h6" component="div">
              {subtitleArr.join(' - ')}
            </Typography>
          )}
          {session.note && session.note.trim().length && (
            <Typography component="div" sx={{ mb: 2 }} gutterBottom>
              {session.note}
            </Typography>
          )}
        </div>
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
      {joinErrors.includes(SessionJoinError.NotOnList) && (
        <Alert severity="error">
          <AlertTitle>This session is by invite only and you are not on the list</AlertTitle>
          If you are in contact with the session owner ask them to add you to the Innactive user list.
        </Alert>
      )}
      {joinErrors.includes(SessionJoinError.UnverifiedNotAllowd) && (
        <Alert severity="error">
          <AlertTitle>Only verified users are allowed to join this session</AlertTitle>
          The user has requested that only verified users join this session
        </Alert>
      )}
      {joinErrors.includes(SessionJoinError.Closed) && (
        <Alert severity="error">
          <AlertTitle>Session Closed</AlertTitle>
          This session has been closed either deliberately or due to innactivity and is no longer accepting new users.
        </Alert>
      )}
    </PageWrapper>
  )
}
