import * as React from 'react'

import { defaultSessionName, DiscordGuild, getActivityName, SessionShare } from '@regolithco/common'
import { PageWrapper } from '../PageWrapper'
import { Alert, AlertTitle, Avatar, Box, Button, Paper, Typography, useTheme } from '@mui/material'
import { SessionJoinError } from './SessionJoin.container'
import dayjs from 'dayjs'
import { fontFamilies } from '../../theme'
import { ArrowBack, Diversity3 } from '@mui/icons-material'
import { Stack } from '@mui/system'
import { GetUserProfileQuery } from '../../schema'

export interface SessionJoinProps {
  sessionShare?: SessionShare
  loading: boolean
  profile: GetUserProfileQuery['profile']
  showGuilds: boolean
  joinSession: () => void
  navigate: (path: string) => void
  joinErrors: SessionJoinError[]
}

const DiscordGuildDisplay: React.FC<{ guild: DiscordGuild }> = ({ guild }) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        borderRadius: 10,
        background: theme.palette.background.default,
        border: `5px solid ${theme.palette.primary.main}`,
        px: 4,
        py: 2,
        m: 2,
      }}
    >
      <Stack direction="column" alignItems="center" spacing={1}>
        <Typography variant="caption" color="text.secondary" sx={{ marginRight: 1 }}>
          You must be a member of
        </Typography>
        <Box display="flex" alignItems="center">
          <Avatar src={guild?.iconUrl || undefined} sx={{ width: 24, height: 24, marginRight: 1 }}>
            <Diversity3 color="primary" />
          </Avatar>
          {guild?.name}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ marginRight: 1 }}>
          And have permission to join a voice channel
        </Typography>
      </Stack>
    </Box>
  )
}

export const SessionJoin: React.FC<SessionJoinProps> = ({
  sessionShare,
  loading,
  joinSession,
  navigate,
  joinErrors,
}) => {
  const subtitleArr: string[] = []
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
          </Alert>
        )}
        {joinErrors.includes(SessionJoinError.NeedDiscord) && (
          <Alert severity="error" sx={{ my: 2 }}>
            <AlertTitle>Discord Server Membership Required</AlertTitle>
            <Typography paragraph>
              This session requires you to be logged into Regolith using Discord authentication.
            </Typography>
            {sessionShare?.lockToDiscordGuild && <DiscordGuildDisplay guild={sessionShare?.lockToDiscordGuild} />}
            {/* {showGuilds && (
              // <DiscordGuildList />
            )} */}
          </Alert>
        )}
        {joinErrors.includes(SessionJoinError.NotInDiscordServer) && (
          <Alert severity="error" sx={{ my: 2 }}>
            <AlertTitle>Not in Discord Server</AlertTitle>
            <Typography paragraph>
              This session requires you to be a member of a specific Discord server to join.
            </Typography>
            {sessionShare?.lockToDiscordGuild && <DiscordGuildDisplay guild={sessionShare?.lockToDiscordGuild} />}
          </Alert>
        )}
        {joinErrors.includes(SessionJoinError.NotPermittedInDiscordServer) && (
          <Alert severity="error" sx={{ my: 2 }}>
            <AlertTitle>Not Permitted in Discord Server</AlertTitle>
            <Typography paragraph>
              You are a member of the required Discord server but do not have permission to join a voice channel.
            </Typography>
            {sessionShare?.lockToDiscordGuild && <DiscordGuildDisplay guild={sessionShare?.lockToDiscordGuild} />}
          </Alert>
        )}

        {joinErrors.includes(SessionJoinError.UnverifiedNotAllowd) && (
          <Alert severity="error" sx={{ my: 2 }}>
            <AlertTitle>Only verified users are allowed to join this session</AlertTitle>
            <Typography paragraph>The user has requested that only verified users join this session</Typography>
          </Alert>
        )}
        {joinErrors.includes(SessionJoinError.Closed) && (
          <Alert severity="error" sx={{ my: 2 }}>
            <AlertTitle>Session Closed</AlertTitle>
            <Typography paragraph>
              This session has been closed either deliberately or due to inactivity and is no longer accepting new
              users.
            </Typography>
          </Alert>
        )}
        {joinErrors.length > 0 && (
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
