import * as React from 'react'

import { SessionStateEnum } from '@regolithco/common'
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  styled,
  Tab,
  Tabs,
  Theme,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { SxProps } from '@mui/system'
import {
  AdminPanelSettings,
  ArrowBack,
  Dashboard,
  Diversity3,
  Group,
  KeyboardDoubleArrowLeft,
  Logout,
  Settings,
  Summarize,
} from '@mui/icons-material'
import { SessionHeader } from './SessionHeader'
import { fontFamilies } from '../../../theme'
import { TabDashboard } from './TabDashboard'
import { SessionSettingsTab } from './TabSettings'
import { TabUsers } from './TabUsers'
import { TabSummary } from './TabSummary'
import { DialogEnum, SessionContext, SessionTabs } from '../../../context/session.context'
import { grey } from '@mui/material/colors'
import { RolesTab } from './TabRoles'

export interface SessionPageProps {
  noProps?: string
}

const stylesThunk = (theme: Theme, isActive: boolean): Record<string, SxProps<Theme>> => ({
  container: {
    display: 'flex',
    height: '100%',
    backdropFilter: 'blur(7px)',
    backgroundColor: '#0e0c1b77',
  },
  sessionTabs: {
    background: '#121115aa',
  },
  drawerAccordionSummary: {
    // borderBottom: '1px solid',
    fontFamily: fontFamilies.robotoMono,
    fontWeight: 'bold',
  },
})

const DRAWER_WIDTH = 300

const Main = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
  mediumUp?: boolean
}>(({ theme, open, mediumUp }) => ({
  flexGrow: 1,
  position: 'relative',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${DRAWER_WIDTH}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  '&>.MuiBox-root': {
    maxWidth: 1200,
  },
  overflow: 'hidden',
  mx: mediumUp ? 3 : 0,
  display: 'flex',
  flex: '1 1',
  flexDirection: 'column',
  height: '100%',
  padding: mediumUp ? theme.spacing(3) : 0,
  paddingTop: theme.spacing(3),
  // paddingBottom: {
  //   xs: 0,
  //   sm: 0,
  //   md: 2, // Leave a little space for the copyright marker
  // },
}))

export const SessionPage: React.FC<SessionPageProps> = () => {
  const {
    navigate,
    activeTab,
    userTabExpanded,
    setUserTabExpanded,
    setActiveTab,
    setActiveModal,
    onUpdateSession,
    onReOpenSession,
    session,
    isSessionAdmin,
    resetDefaultSystemSettings,
    resetDefaultUserSettings,
    userSuggest,
  } = React.useContext(SessionContext)
  const theme = useTheme()
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))
  const isActive = session?.state === SessionStateEnum.Active
  const styles = stylesThunk(theme, isActive)

  // USER Tab is not allowed on desktop
  React.useEffect(() => {
    if (mediumUp && activeTab === SessionTabs.USERS) {
      setActiveTab(SessionTabs.DASHBOARD)
    }
  }, [mediumUp, activeTab, setActiveTab])

  return (
    <Box sx={styles.container}>
      {mediumUp && (
        <Drawer
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              background: '#12121255',
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
          open={userTabExpanded}
          variant="persistent"
          anchor="left"
        >
          {/* <Toolbar /> */}
          <TabUsers />
          <Stack direction="row" spacing={2} sx={{ p: 2 }}>
            <Tooltip title="Back to sessions">
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/session')}
                color={'secondary'}
                variant="text"
                fullWidth
              >
                Back to sessions
              </Button>
            </Tooltip>
            {!isSessionAdmin && (
              <Tooltip title="Leave Session">
                <Button
                  startIcon={<Logout />}
                  onClick={() => setActiveModal(DialogEnum.LEAVE_SESSION)}
                  color="error"
                  variant="outlined"
                  fullWidth
                >
                  Leave Session
                </Button>
              </Tooltip>
            )}
          </Stack>
        </Drawer>
      )}
      {/* This is the main content */}
      <Main id="main" open={!mediumUp || userTabExpanded} mediumUp={mediumUp}>
        {/* NAV Drawer   */}
        {mediumUp && (
          <Tooltip title={userTabExpanded ? 'Collapse User Tab' : 'Expand User Tab'}>
            <IconButton
              color="default"
              sx={{
                opacity: 0.5,
                // backgroundColor: theme.palette.secondary.dark,
                height: theme.spacing(4),
                width: theme.spacing(8),
                border: '1px solid',
                borderRadius: 0,
                // borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                position: 'absolute',
                left: 0,
                // I want the left to transition and animate smoothly
                transition: theme.transitions.create('left', {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                top: 0,
                zIndex: 1000,
              }}
              onClick={() => {
                setUserTabExpanded(!userTabExpanded)
                // Trigger a window reserize event to force the map to resize
                setTimeout(() => window.dispatchEvent(new Event('resize')), 300)
              }}
            >
              <Diversity3 />
              <KeyboardDoubleArrowLeft
                sx={{
                  // color: theme.palette.primary.contrastText,
                  // rotate 180 degrees if expanded
                  transform: !userTabExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </IconButton>
          </Tooltip>
        )}
        <SessionHeader />
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          {mediumUp && (
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => {
                setActiveTab(newValue)
              }}
              sx={styles.sessionTabs}
              aria-label="basic tabs example"
            >
              <Tab label="Activity" icon={<Dashboard />} value={SessionTabs.DASHBOARD} iconPosition="start" />
              <Tab label="Roles" icon={<AdminPanelSettings />} value={SessionTabs.ROLES} iconPosition="start" />
              {/* <Tab label="Work Orders" value={SessionTabs.WORK_ORDERS} /> */}
              {/* <Tab label="Scouting" value={SessionTabs.SCOUTING} /> */}
              <Tab label="Summary" icon={<Summarize />} value={SessionTabs.SUMMARY} iconPosition="start" />
              {isSessionAdmin && (
                <Tab icon={<Settings />} label="Settings" value={SessionTabs.SETTINGS} iconPosition="start" />
              )}
            </Tabs>
          )}
        </Box>
        <Box
          sx={{
            flex: '1 1',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {activeTab === SessionTabs.USERS && <TabUsers />}
          {activeTab === SessionTabs.DASHBOARD && <TabDashboard />}
          {activeTab === SessionTabs.ROLES && <RolesTab />}
          {activeTab === SessionTabs.SUMMARY && <TabSummary />}
          {activeTab === SessionTabs.SETTINGS && (
            <SessionSettingsTab
              session={session}
              userSuggest={userSuggest}
              scroll
              resetDefaultSystemSettings={resetDefaultSystemSettings}
              resetDefaultUserSettings={resetDefaultUserSettings}
              endSession={() => setActiveModal(DialogEnum.CLOSE_SESSION)}
              reOpenSession={() => onReOpenSession()}
              deleteSession={() => setActiveModal(DialogEnum.DELETE_SESSION)}
              setActiveModal={setActiveModal}
              onChangeSession={(newSession, newSettings) => {
                onUpdateSession(newSession, newSettings)
                setActiveModal(null)
              }}
            />
          )}
        </Box>
        {/* Mobile-only menu */}
        {!mediumUp && (
          <Tabs
            variant="scrollable"
            sx={{
              borderTop: '2px solid',
              backgroundColor: isActive ? theme.palette.primary.main : grey[500],
              color: theme.palette.primary.contrastText,
              '& .MuiTab-root': {
                color: theme.palette.primary.contrastText,
              },
              '& .Mui-selected': {
                backgroundColor: isActive ? theme.palette.secondary.main : grey[200],
                // color: theme.palette.primary.light,
                // textShadow: '0 0 2px #FFF',
              },
            }}
            allowScrollButtonsMobile
            value={activeTab}
            onChange={(_, newValue) => {
              setActiveTab(newValue)
            }}
            aria-label="basic tabs example"
          >
            <Tab label="Users" value={SessionTabs.USERS} icon={<Group />} />
            <Tab label="Dash" value={SessionTabs.DASHBOARD} icon={<Dashboard />} />
            <Tab label="Roles" value={SessionTabs.ROLES} icon={<AdminPanelSettings />} />
            {/* <Tab label="Orders" value={SessionTabs.WORK_ORDERS} icon={<TableView />} />
            <Tab label="Scout" value={SessionTabs.SCOUTING} icon={<TravelExplore />} /> */}
            <Tab label="Summary" value={SessionTabs.SUMMARY} icon={<Summarize />} />
            {isSessionAdmin && <Tab label="Settings" value={SessionTabs.SETTINGS} icon={<Settings />} />}
          </Tabs>
        )}
      </Main>
    </Box>
  )
}
