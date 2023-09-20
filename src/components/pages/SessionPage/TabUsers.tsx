import * as React from 'react'
import { PendingUser, SessionStateEnum, SessionUser } from '@regolithco/common'
import {
  alpha,
  Box,
  Button,
  IconButton,
  Stack,
  SxProps,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
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
            pl: 2,
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
            {(session?.activeMembers?.items?.length || 0) + (session?.mentionedUsers || []).length} Session Members
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {/* <CircleNumber
            number={(session?.activeMembers?.items?.length || 0) + (session?.mentionedUsers || []).length}
            color={theme.palette.primary.main}
            tooltip="Total Session Members"
          /> */}
          <Tooltip title="Add a pending user to this session" placement="right" arrow>
            <Button
              size="small"
              variant="outlined"
              endIcon={<GroupAdd />}
              color="inherit"
              sx={{
                background: theme.palette.secondary.main,
              }}
            >
              Add
            </Button>
          </Tooltip>
        </Stack>
      </Toolbar>
      {captains.length > 0 && (
        <Accordion defaultExpanded={true} disableGutters>
          <AccordionSummary expandIcon={<ExpandMore />} sx={styles.drawerAccordionSummaryCrews}>
            <Typography>{captains.length} Crews</Typography>
            <Box sx={{ flexGrow: 1 }} />
            {/* <CircleNumber
              number={captains.length}
              color={theme.palette.secondary.dark}
              tooltip="Total crews in this session"
            /> */}
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
            <Typography>{singleActives.length} Solo Players</Typography>
            <Box sx={{ flexGrow: 1 }} />
            {/* <CircleNumber
              number={singleActives.length}
              color={theme.palette.secondary.dark}
              tooltip="Total solor players in this session"
            /> */}
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

const CircleNumber: React.FC<{ number: number; color?: string; tooltip?: string }> = ({ number, color, tooltip }) => {
  const theme = useTheme()
  const colorFg = color || theme.palette.primary.main
  const contrastColor = alpha(theme.palette.getContrastText(color || theme.palette.primary.main), 0.5)
  return (
    <Tooltip title={tooltip || ''} arrow>
      <Box
        sx={{
          width: 30,
          height: 30,
          p: 0.2,
          borderRadius: '50%',
          border: `2px solid ${contrastColor}`,
          fontWeight: 'bold',
          fontFamily: fontFamilies.robotoMono,
          backgroundColor: colorFg,
          color: contrastColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
        }}
      >
        {number}
      </Box>
    </Tooltip>
  )
}
