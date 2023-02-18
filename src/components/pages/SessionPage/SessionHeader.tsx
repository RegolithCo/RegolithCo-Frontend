import * as React from 'react'

import {
  Session,
  SessionSettings,
  UserProfile,
  getLocationName,
  getPlanetName,
  defaultSessionName,
  getActivityName,
} from '@regolithco/common'
import { Box, IconButton, Theme, Tooltip, Typography, useTheme } from '@mui/material'
import { SxProps } from '@mui/system'
import dayjs from 'dayjs'
import { fontFamilies } from '../../../theme'
import { CloudDownload, Share } from '@mui/icons-material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { DialogEnum } from './SessionPage.container'
import { SessionState } from '../../SessionState'

export interface SesionHeaderProps {
  session: Session
  userProfile: UserProfile
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
  container: {
    background: '#121115aa',
    p: 1,
    '*': {
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
  },
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

export const SessionHeader: React.FC<SesionHeaderProps> = ({ session, userProfile, setActiveModal }) => {
  const theme = useTheme()
  const styles = stylesThunk(theme)
  const subtitleArr = sessionSubtitleArr(session)

  // Some convenience variables so we don't have to keep checking for null
  const isSessionOwner = session.ownerId === userProfile.userId

  return (
    <Box sx={styles.container}>
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
                mb: { xs: 0, md: 2 },
                textShadow: '1px 1px 4px #000',
                fontSize: {
                  xs: '1rem',
                  md: session.name && session.name.length > 100 ? '1rem' : '1.4rem',
                },
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
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    color: theme.palette.grey[500],
                    fontFamily: fontFamilies.robotoMono,
                    fontWeight: 'bold',
                    fontSize: {
                      xs: '0.65rem',
                      md: '0.8rem',
                    },
                  }}
                >
                  {subtitleArr.join(' // ')}
                </Typography>
              )}
              {session.note && session.note.trim().length && (
                <Typography
                  component="div"
                  sx={{
                    fontSize: {
                      xs: '0.6rem',
                      md: '0.8rem',
                    },
                  }}
                  gutterBottom
                >
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
              <SessionState sessionState={session.state} size="large" />
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
              Started: <strong>{dayjs(session.createdAt).format('MMM D YYYY, h:mm a')}</strong>
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
    </Box>
  )
}
