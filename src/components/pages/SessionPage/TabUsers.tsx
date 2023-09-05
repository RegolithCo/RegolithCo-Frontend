import * as React from 'react'
import { PendingUser, SessionStateEnum, SessionUser } from '@regolithco/common'
import { Box, IconButton, Stack, SxProps, Theme, Toolbar, Tooltip, Typography, useTheme } from '@mui/material'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { ExpandMore, GroupAdd, HelpOutline } from '@mui/icons-material'
import { fontFamilies } from '../../../theme'
import { CrewUserList } from '../../fields/SessionUserList/CrewUserList'
import { SessionUserList } from '../../fields/SessionUserList/SessionUserList'
import { SessionContext } from '../../../context/session.context'
import { SessionUserContextMenu } from '../../fields/SessionUserList/SessionUserContextMenu'

export interface TabUsersProps {
  propa?: string
}

const stylesThunk = (theme: Theme, isActive: boolean): Record<string, SxProps<Theme>> => ({
  container: {
    [theme.breakpoints.up('md')]: {
      height: '100%',
      overflow: 'hidden',
      p: 2,
    },
  },
  gridContainer: {},
  gridColumn: {},
  drawerAccordionSummaryCrews: {
    '& .MuiTypography-root': {
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.dark,
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.secondary.contrastText,
    },
  },
  drawerAccordionSummaryActive: {
    '& .MuiTypography-root': {
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.secondary.contrastText,
    },
  },
  drawerAccordionSummarySecondary: {
    '& .MuiTypography-root': {
      fontFamily: fontFamilies.robotoMono,
      fontWeight: 'bold',
    },
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.light,
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.secondary.contrastText,
    },
  },
  drawerAccordionDetails: {
    p: 0,
    pb: 2,
  },
  paper: {},
})

export const TabUsers: React.FC<TabUsersProps> = () => {
  const theme = useTheme()
  const { session, captains, singleActives } = React.useContext(SessionContext)
  const isSessionActive = session?.state === SessionStateEnum.Active
  const styles = stylesThunk(theme, isSessionActive)

  const [userContexMenu, setUserContextMenu] = React.useState<{
    el: HTMLElement
    sessionUser?: SessionUser
    pendingUser?: PendingUser
  } | null>(null)

  return (
    <Box sx={{ flex: '1 1', overflowX: 'hidden', overflowY: 'auto' }}>
      <Toolbar
        disableGutters
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.secondary.contrastText,
          '&.MuiToolbar-root': {
            minHeight: 50,
            pl: 1,
            pr: 1,
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
          <Typography
            sx={{
              fontSize: `1rem`,
              textTransform: 'uppercase',
              fontFamily: fontFamilies.robotoMono,
              fontWeight: 'bold',
            }}
          >
            Session Members ({(session?.activeMembers?.items?.length || 0) + (session?.mentionedUsers || []).length})
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Add a pending user to this session" placement="right" arrow>
            <IconButton color="inherit" size="small">
              <GroupAdd />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
      {captains.length > 0 && (
        <Accordion defaultExpanded={true} disableGutters>
          <AccordionSummary expandIcon={<ExpandMore />} sx={styles.drawerAccordionSummaryCrews}>
            <Typography>Crews ({captains.length})</Typography>
          </AccordionSummary>
          <AccordionDetails sx={styles.drawerAccordionDetails}>
            <CrewUserList
              openContextMenu={(el: HTMLElement, su?: SessionUser, iu?: PendingUser) =>
                setUserContextMenu({ el, sessionUser: su, pendingUser: iu })
              }
            />
          </AccordionDetails>
        </Accordion>
      )}
      {captains.length > 0 && (
        <Accordion defaultExpanded={true} disableGutters>
          <AccordionSummary expandIcon={<ExpandMore />} sx={styles.drawerAccordionSummaryActive}>
            <Typography>Solo Players ({singleActives.length})</Typography>
          </AccordionSummary>
          <AccordionDetails sx={styles.drawerAccordionDetails}>
            <SessionUserList
              openContextMenu={(el: HTMLElement, su?: SessionUser, iu?: PendingUser) =>
                setUserContextMenu({ el, sessionUser: su, pendingUser: iu })
              }
            />
          </AccordionDetails>
        </Accordion>
      )}

      {captains.length === 0 && (
        <SessionUserList
          openContextMenu={(el: HTMLElement, su?: SessionUser, iu?: PendingUser) =>
            setUserContextMenu({ el, sessionUser: su, pendingUser: iu })
          }
        />
      )}

      {!!userContexMenu && (
        <SessionUserContextMenu
          open
          anchorEl={userContexMenu?.el}
          onClose={() => setUserContextMenu(null)}
          sessionUser={userContexMenu?.sessionUser}
          pendingUser={userContexMenu?.pendingUser}
        />
      )}
    </Box>
  )
}
