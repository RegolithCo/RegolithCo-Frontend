import * as React from 'react'

import {
  Session,
  SessionSettings,
  UserProfile,
  getLocationName,
  getPlanetName,
  defaultSessionName,
  SessionStateEnum,
  getActivityName,
} from '@regolithco/common'
import { Box, IconButton, Theme, Tooltip, Typography, useTheme } from '@mui/material'
import { SxProps } from '@mui/system'
import dayjs from 'dayjs'
import { fontFamilies } from '../../../theme'
import { CloudDownload, Logout, Settings, Share } from '@mui/icons-material'
import { DialogEnum } from './SessionPage'
import Grid from '@mui/material/Unstable_Grid2/Grid2'

export interface SesionHeaderProps {
  session: Session
  userProfile: UserProfile
  leaveSession: () => void
  setActiveModal: (modal: DialogEnum) => void
}

export const sessionSubtitleArr = (session: Session): string[] => {
  const subtitleArr = []
  const sessionSettings: Partial<SessionSettings> = session.sessionSettings || {}
  // Some contextual subtitle stuff
  if (sessionSettings.activity) subtitleArr.push(getActivityName(sessionSettings.activity))
  if (sessionSettings.gravityWell) subtitleArr.push(getPlanetName(sessionSettings.gravityWell))
  if (sessionSettings.location) subtitleArr.push(getLocationName(sessionSettings.location))
  return subtitleArr
}

const stylesThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  gridContainer: {
    [theme.breakpoints.up('md')]: {},
    // border: '1px solid red',
  },
  gridInside: {
    [theme.breakpoints.up('md')]: {},
    // border: '1px solid blue',
  },
  gridInsideTitle: {
    [theme.breakpoints.up('md')]: {},
    // border: '1px solid green',
  },
  gridInsideDates: {
    textAlign: 'right',
    [theme.breakpoints.up('md')]: {},
    // border: '1px solid green',
    '& *': {
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
    '& strong': {
      color: theme.palette.primary.main,
    },
  },
  sessionContext: {
    '& *': {
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
  },
})

export const SessionHeader: React.FC<SesionHeaderProps> = ({ session, userProfile, leaveSession, setActiveModal }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const subtitleArr = sessionSubtitleArr(session)

  // Some convenience variables so we don't have to keep checking for null
  const isSessionOwner = session.ownerId === userProfile.userId

  return (
    <Grid container sx={styles.gridContainer} spacing={1} padding={1}>
      {/* Title Header Box */}
      <Grid xs={12} container sx={styles.gridInside}>
        <Grid xs={12} sm={12} md={8} sx={styles.gridInsideTitle}>
          {/* Title and button */}
          {/* <Typography variant="h4" component="h1" gutterBottom sx={{ flex: '1 1', mb: 2, fontSize: '2rem' }}> */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              flex: '1 1',
              mb: 2,
              textShadow: '1px 1px 4px #000',
              fontSize: session.name && session.name.length > 100 ? '1.5rem' : '2rem',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {session.name && session.name.trim().length ? session.name : defaultSessionName()}
          </Typography>
          {/* Context, note and ores header box */}
          <Box>
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
          </Box>
        </Grid>
        {/* Start and end date box */}
        <Grid xs={12} sm={12} md={4} sx={styles.gridInsideDates}>
          <Box sx={{ display: 'flex' }}>
            {/* SHARE BUTTON */}
            <div style={{ flex: '1 1' }} />
            <Typography
              sx={{
                fontWeight: 'bold',
                lineHeight: 1.5,
                my: 1,
                px: 2,
                borderRadius: 3,
                border: `2px solid ${
                  session.state === SessionStateEnum.Active ? theme.palette.success.main : theme.palette.error.main
                }`,
                textShadow: '1px 1px 4px #000',
                color:
                  session.state === SessionStateEnum.Active ? theme.palette.success.main : theme.palette.error.main,
                textTransform: 'uppercase',
                fontSize: '1.5rem',
              }}
            >
              {session.state === SessionStateEnum.Active ? 'Active' : 'Ended'}
            </Typography>
            {isSessionOwner && (
              <Tooltip title="Session Settings">
                <IconButton onClick={() => setActiveModal(DialogEnum.SESSION_PREFERENCES)} size="large">
                  <Settings />
                </IconButton>
              </Tooltip>
            )}
            {!isSessionOwner && (
              <Tooltip title="Leave Session">
                <IconButton onClick={() => setActiveModal(DialogEnum.LEAVE_SESSION)} color="error">
                  <Logout />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Download Session">
              <IconButton onClick={() => setActiveModal(DialogEnum.DOWNLOAD_SESSION)}>
                <CloudDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share session">
              <IconButton onClick={() => setActiveModal(DialogEnum.SHARE_SESSION)} color="secondary">
                <Share />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography
            sx={{ fontFamily: 'inherit', m: 0, p: 0, lineHeight: 1.2 }}
            component="div"
            gutterBottom
            variant="overline"
          >
            Started: <strong>{dayjs(session.createdAt).format('ddd, MMM D YYYY, h:mm a')}</strong>
          </Typography>
          {session.finishedAt && (
            <Typography
              sx={{ fontFamily: 'inherit', m: 0, p: 0, lineHeight: 1.2 }}
              component="div"
              gutterBottom
              variant="caption"
            >
              Ended: <strong>{dayjs(session.finishedAt).format('ddd, MMM D YYYY, h:mm a')}</strong>
            </Typography>
          )}
          <Typography
            sx={{ fontFamily: 'inherit', m: 0, p: 0, lineHeight: 1.2 }}
            component="div"
            gutterBottom
            variant="caption"
          >
            Unverified users can join: <strong>{session.sessionSettings.allowUnverifiedUsers ? 'Yes' : 'No'}</strong>
          </Typography>
          <Typography
            sx={{ fontFamily: 'inherit', m: 0, p: 0, lineHeight: 1.2 }}
            component="div"
            gutterBottom
            variant="caption"
          >
            Users must be mentioned to join: <strong>{session.sessionSettings.specifyUsers ? 'Yes' : 'No'}</strong>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
