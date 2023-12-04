import * as React from 'react'
import { useTheme, Typography, Paper, Toolbar } from '@mui/material'
import { defaultSessionName, getTimezoneStr, Session, SessionBreakdown, sessionReduce } from '@regolithco/common'
import dayjs from 'dayjs'

import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Stack, SxProps, Theme } from '@mui/system'
import { RockIcon } from '../../icons'
import { fontFamilies } from '../../theme'
import { TabSummaryStats } from '../pages/SessionPage/TabSummaryStats'
import { OwingList } from '../pages/SessionPage/TabSummary'
import { WorkOrderTable } from '../pages/SessionPage/WorkOrderTable'
import { AppContext } from '../../context/app.context'

export type SessionShareSettings = {
  hideNames?: boolean
  hideAvatars?: boolean
}

export interface SessionShareProps {
  session: Session
  settings?: SessionShareSettings
}

const sessionShareStyleThunk = (theme: Theme): Record<string, SxProps<Theme>> => ({
  container: {
    [theme.breakpoints.up('md')]: {
      flex: '1 1',
    },
  },
  sectionTitle: {
    m: 2,
    color: theme.palette.secondary.light,
    fontSize: '1.2rem',
    lineHeight: 2,
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
  },
  cardCss: {
    border: `1px solid #444444`,
    [theme.breakpoints.up('md')]: {
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 600,
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
      border: `None`,
    },
  },
  gridCss: {
    [theme.breakpoints.up('md')]: {
      height: '100%',
    },
  },
})

export const SessionShare: React.FC<SessionShareProps> = ({ session, settings }) => {
  const theme = useTheme()
  const styles = sessionShareStyleThunk(theme)
  const { getSafeName } = React.useContext(AppContext)
  const sessionSummary: SessionBreakdown = React.useMemo(
    () => sessionReduce(session?.workOrders?.items || []),
    [session]
  )

  return (
    <Paper elevation={11} sx={{ p: 2 }}>
      <Toolbar
        sx={{
          borderRadius: 2,
          mb: 2,
          flex: '0 0',
          fontFamily: fontFamilies.robotoMono,
          bgcolor: theme.palette.secondary.light,
          color: theme.palette.secondary.contrastText,
          // mb: 2,
        }}
      >
        <RockIcon color="inherit" fontSize="large" sx={styles.icon} />
        <Stack>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              fontWeight: 700,
              py: 0,
              pl: 5,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {session.name || defaultSessionName()}
          </Typography>
          <Typography component="div" sx={{ py: 0, pl: 5, fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}>
            Created By: {getSafeName(session.owner?.scName)}
          </Typography>
        </Stack>
        <Stack>
          <Typography
            component="div"
            variant="caption"
            sx={{ py: 0, pl: 5, fontFamily: fontFamilies.robotoMono, fontWeight: 'bold' }}
          >
            {dayjs(session.createdAt).format('MMM D YYYY, h:mm a')} ({getTimezoneStr()})
          </Typography>
        </Stack>
      </Toolbar>
      <TabSummaryStats session={session} isShare />
      <Typography sx={styles.sectionTitle}>Work Orders:</Typography>
      {(session.workOrders?.items || []).length > 0 ? (
        <WorkOrderTable workOrders={session.workOrders?.items || []} isShare />
      ) : (
        <Typography sx={{ m: 2, textAlign: 'center' }} color="text.secondary" variant="overline" component="div">
          No Work Orders (yet)
        </Typography>
      )}
      <Typography sx={styles.sectionTitle}>Payment Summary:</Typography>
      {Object.keys(sessionSummary.owed).length > 0 || Object.keys(sessionSummary.paid).length > 0 ? (
        <OwingList session={session} sessionSummary={sessionSummary} isShare />
      ) : (
        <Typography sx={{ m: 2, textAlign: 'center' }} color="text.secondary" variant="overline" component="div">
          No profits to share (yet)
        </Typography>
      )}
    </Paper>
  )
}
