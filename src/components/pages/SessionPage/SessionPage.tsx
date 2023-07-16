import * as React from 'react'

import {
  Session,
  SessionStateEnum,
  UserProfile,
  WorkOrderDefaults,
  VerifiedUserLookup,
  SessionUser,
  UserSuggest,
  WorkOrder,
  SessionInput,
  DestructuredSettings,
  createUserSuggest,
  ScoutingFind,
  session2Json,
  createSafeFileName,
  session2csv,
  CrewShare,
} from '@regolithco/common'
import {
  Box,
  Button,
  DialogContentText,
  Drawer,
  Stack,
  Tab,
  Tabs,
  Theme,
  ThemeProvider,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { SxProps } from '@mui/system'
import { ArrowBack, Dashboard, Group, Logout, Settings, Summarize, TableView, TravelExplore } from '@mui/icons-material'
import { WorkOrderModal } from '../../modals/WorkOrderModal'
import { ShareModal } from '../../modals/ShareModal'
import { SessionHeader } from './SessionHeader'
import { ScoutingFindModal } from '../../modals/ScoutingFindModal'
import { ConfirmModal } from '../../modals/ConfirmModal'
import { DownloadModal } from '../../modals/DownloadModal'
import { fontFamilies, workOrderStateThemes } from '../../../theme'
import { DialogEnum, SessionTabs } from './SessionPage.container'
import { TabDashboard } from './TabDashboard'
import { TabWorkOrders } from './TabWorkOrders'
import { TabScouting } from './TabScouting'
import { SessionSettingsTab } from './TabSettings'
import { DeleteModal } from '../../modals/DeleteModal'
import { TabUsers } from './TabUsers'
import { TabSummary } from './TabSummary'
import { downloadFile } from '../../../lib/utils'

export interface SessionPageProps {
  session: Session
  userProfile: UserProfile
  sessionUser: SessionUser
  // For the two modals that take us deeper
  orderId?: string
  scoutingFindId?: string
  loading: boolean
  mutating: boolean
  // The
  verifiedMentionedUsers: VerifiedUserLookup
  addFriend: (username: string) => void
  navigate: (path: string) => void
  // Tab navigation
  activeTab: SessionTabs
  setActiveTab: (tab: SessionTabs) => void
  // Session
  onCloseSession: () => void
  addSessionMentions: (scNames: string[]) => void
  removeSessionMentions: (scNames: string[]) => void
  removeSessionCrew: (scName: string) => void
  onUpdateSession: (session: SessionInput, settings: DestructuredSettings) => void
  resetDefaultSystemSettings: () => void
  resetDefaultUserSettings: () => void
  leaveSession: () => void
  deleteSession: () => void
  // CrewShares
  markCrewSharePaid: (crewShare: CrewShare, isPaid: boolean) => void
  // Work orders
  createWorkOrder: (workOrder: WorkOrder) => void
  openWorkOrderModal: (workOrderId?: string) => void
  deleteWorkOrder: (workOrderId: string) => void
  updateWorkOrder: (newWorkOrder: WorkOrder, setFail?: boolean) => void
  failWorkOrder: (reason?: string) => void
  // scouting
  createScoutingFind: (scoutingFind: ScoutingFind) => void
  openScoutingModal: (scoutinfFindId?: string) => void
  updateScoutingFind: (scoutingFind: ScoutingFind) => void
  deleteScoutingFind: (scoutingFindId: string) => void
  joinScoutingFind: (findId: string, enRoute: boolean) => void
  leaveScoutingFind: (findId: string) => void
}

const stylesThunk = (theme: Theme, isActive: boolean): Record<string, SxProps<Theme>> => ({
  container: {
    [theme.breakpoints.up('md')]: {
      height: '100%',
      overflow: 'hidden',
      p: 2,
    },
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

export const SessionPage: React.FC<SessionPageProps> = ({
  session,
  userProfile,
  sessionUser,
  orderId,
  navigate,
  loading,
  mutating,
  activeTab,
  setActiveTab,
  scoutingFindId,
  leaveSession,
  addFriend,
  updateWorkOrder,
  onUpdateSession,
  markCrewSharePaid,
  removeSessionMentions,
  addSessionMentions,
  removeSessionCrew,
  verifiedMentionedUsers,
  resetDefaultSystemSettings,
  resetDefaultUserSettings,
  createWorkOrder,
  createScoutingFind,
  openWorkOrderModal,
  updateScoutingFind,
  openScoutingModal,
  joinScoutingFind,
  failWorkOrder,
  deleteScoutingFind,
  leaveScoutingFind,
  deleteWorkOrder,
  onCloseSession,
  deleteSession,
}) => {
  const theme = useTheme()
  const mediumUp = useMediaQuery(theme.breakpoints.up('md'))
  const isActive = session.state === SessionStateEnum.Active
  const styles = stylesThunk(theme, isActive)
  // Only one major modal at a time please.
  const [activeModal, setActiveModal] = React.useState<DialogEnum | null>(null)

  // For temporary objects before we commit them to the DB
  const [newWorkOrder, setNewWorkOrder] = React.useState<WorkOrder>()
  const [newScoutingFind, setNewScoutingFind] = React.useState<ScoutingFind>()

  const isSessionOwner = session.ownerId === userProfile.userId
  const activeWorkOrder =
    session.workOrders?.items?.find(({ orderId: existingOrderId }) => existingOrderId === orderId) || undefined
  const activeScoutingFind =
    session.scouting?.items?.find(
      ({ scoutingFindId: existingScoutingFindId }) => existingScoutingFindId === scoutingFindId
    ) || undefined
  // Some contextual subtitle stuff

  const shareUrl = `${window.location.origin}${process.env.PUBLIC_URL}/session/${session.sessionId}`

  const userSuggest: UserSuggest = React.useMemo(
    () => createUserSuggest(session.activeMembers?.items || [], session.mentionedUsers, userProfile.friends),
    [session, userProfile]
  )

  // USER Tab is not allowed on desktop
  React.useEffect(() => {
    if (mediumUp && activeTab === SessionTabs.USERS) {
      setActiveTab(SessionTabs.DASHBOARD)
    }
  }, [mediumUp, activeTab, setActiveTab])

  return (
    <Box sx={{ display: 'flex', height: '100%', backdropFilter: 'blur(7px)', backgroundColor: '#0e0c1b77' }}>
      {/* NAV Drawer   */}
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
          variant="permanent"
          anchor="left"
        >
          {/* <Toolbar /> */}
          <TabUsers
            session={session}
            userProfile={userProfile}
            sessionUser={sessionUser}
            navigate={navigate}
            addFriend={addFriend}
            addSessionMentions={addSessionMentions}
            removeSessionMentions={removeSessionMentions}
            verifiedMentionedUsers={verifiedMentionedUsers}
            setActiveModal={setActiveModal}
          />
          <Stack direction="row" spacing={2} sx={{ p: 2 }}>
            <Tooltip title="Back to sessions">
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/session')}
                color="secondary"
                variant="text"
                fullWidth
              >
                Back to sessions
              </Button>
            </Tooltip>
            {!isSessionOwner && (
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
      <Box
        sx={{
          overflow: 'hidden',
          mx: mediumUp ? 3 : 0,
          display: 'flex',
          flex: '1 1',
          maxWidth: 1100,
          flexDirection: 'column',
          height: '100%',
          // border: '1px solid yellow',
        }}
      >
        <SessionHeader userProfile={userProfile} setActiveModal={setActiveModal} session={session} />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {mediumUp && (
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => {
                setActiveTab(newValue)
              }}
              sx={styles.sessionTabs}
              aria-label="basic tabs example"
            >
              <Tab label="Dashboard" value={SessionTabs.DASHBOARD} />
              <Tab label="Work Orders" value={SessionTabs.WORK_ORDERS} />
              <Tab label="Scouting" value={SessionTabs.SCOUTING} />
              <Tab label="Summary" value={SessionTabs.SUMMARY} />
              {isSessionOwner && <Tab label="Settings" value={SessionTabs.SETTINGS} />}
            </Tabs>
          )}
        </Box>
        <Box
          sx={{
            flex: '1 1',
            overflow: 'auto',
          }}
        >
          {activeTab === SessionTabs.USERS && (
            <TabUsers
              session={session}
              userProfile={userProfile}
              sessionUser={sessionUser}
              navigate={navigate}
              addFriend={addFriend}
              addSessionMentions={addSessionMentions}
              removeSessionMentions={removeSessionMentions}
              verifiedMentionedUsers={verifiedMentionedUsers}
              setActiveModal={setActiveModal}
            />
          )}
          {activeTab === SessionTabs.DASHBOARD && (
            <TabDashboard
              session={session}
              userProfile={userProfile}
              sessionUser={sessionUser}
              openScoutingModal={openScoutingModal}
              openWorkOrderModal={openWorkOrderModal}
              setActiveModal={setActiveModal}
              setNewWorkOrder={setNewWorkOrder}
              setNewScoutingFind={setNewScoutingFind}
            />
          )}
          {activeTab === SessionTabs.WORK_ORDERS && (
            <TabWorkOrders
              session={session}
              userProfile={userProfile}
              openWorkOrderModal={openWorkOrderModal}
              setActiveModal={setActiveModal}
              setNewWorkOrder={setNewWorkOrder}
            />
          )}
          {activeTab === SessionTabs.SCOUTING && (
            <TabScouting
              session={session}
              sessionUser={sessionUser}
              openScoutingModal={openScoutingModal}
              setActiveModal={setActiveModal}
              setNewScoutingFind={setNewScoutingFind}
            />
          )}
          {activeTab === SessionTabs.SUMMARY && (
            <TabSummary
              session={session}
              sessionUser={sessionUser}
              mutating={mutating}
              setActiveModal={setActiveModal}
              markCrewSharePaid={markCrewSharePaid}
              openWorkOrderModal={openWorkOrderModal}
            />
          )}
          {activeTab === SessionTabs.SETTINGS && (
            <SessionSettingsTab
              session={session}
              userSuggest={userSuggest}
              scroll
              resetDefaultSystemSettings={resetDefaultSystemSettings}
              resetDefaultUserSettings={resetDefaultUserSettings}
              setActiveModal={setActiveModal}
              onChangeSession={(newSession, newSettings) => {
                setActiveModal(null)
                onUpdateSession(newSession, newSettings)
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
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '& .MuiTab-root': {
                color: theme.palette.primary.contrastText,
              },
              '& .Mui-selected': {
                backgroundColor: theme.palette.secondary.main,
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
            <Tab label="Orders" value={SessionTabs.WORK_ORDERS} icon={<TableView />} />
            <Tab label="Scout" value={SessionTabs.SCOUTING} icon={<TravelExplore />} />
            <Tab label="Summary" value={SessionTabs.SUMMARY} icon={<Summarize />} />
            {isSessionOwner && <Tab label="Settings" value={SessionTabs.SETTINGS} icon={<Settings />} />}
          </Tabs>
        )}
      </Box>

      {/* The modals start here ====================== */}

      <ShareModal
        open={activeModal === DialogEnum.SHARE_SESSION}
        warn={!session.sessionSettings.specifyUsers}
        url={shareUrl}
        onClose={() => setActiveModal(null)}
      />

      {/* This is the ADD workordermodal */}
      {isActive && newWorkOrder && (
        // NEW WORK ORDER
        <WorkOrderModal
          open={activeModal === DialogEnum.ADD_WORKORDER}
          onClose={() => setActiveModal(null)}
          onUpdate={(newOrder) => {
            setActiveModal(null)
            createWorkOrder(newOrder)
            setNewWorkOrder(undefined)
          }}
          allowEdit={isActive}
          allowPay={true}
          isSessionActive={isActive}
          forceTemplate
          userSuggest={userSuggest}
          isNew={true}
          markCrewSharePaid={markCrewSharePaid}
          templateJob={session.sessionSettings?.workOrderDefaults as WorkOrderDefaults}
          workOrder={newWorkOrder as WorkOrder}
        />
      )}

      {/* This is the EDIT Workorder modal */}
      {activeWorkOrder && (
        <ThemeProvider theme={workOrderStateThemes[activeWorkOrder.state]}>
          <WorkOrderModal
            onUpdate={(newOrder) => {
              setActiveModal(null)
              updateWorkOrder(newOrder)
            }}
            markCrewSharePaid={markCrewSharePaid}
            workOrder={activeWorkOrder as WorkOrder}
            templateJob={session.sessionSettings?.workOrderDefaults as WorkOrderDefaults}
            userSuggest={userSuggest}
            allowPay={isSessionOwner || activeWorkOrder.ownerId === userProfile?.userId}
            deleteWorkOrder={() => deleteWorkOrder(activeWorkOrder.orderId)}
            open={Boolean(activeWorkOrder)}
            failWorkOrder={failWorkOrder}
            isSessionActive={isActive}
            onClose={() => {
              setActiveModal(null)
              openWorkOrderModal && openWorkOrderModal()
            }}
            allowEdit={
              userProfile?.userId === activeWorkOrder?.ownerId ||
              isSessionOwner ||
              activeWorkOrder.sellerscName === userProfile?.scName
            }
          />
        </ThemeProvider>
      )}

      {isActive && newScoutingFind && (
        <ScoutingFindModal
          meUser={sessionUser}
          allowEdit={isActive}
          allowWork={isActive}
          open={activeModal === DialogEnum.ADD_SCOUTING}
          scoutingFind={newScoutingFind as ScoutingFind}
          isNew={true}
          onClose={() => setActiveModal(null)}
          onChange={(newScouting) => {
            setActiveModal(null)
            createScoutingFind(newScouting)
            setNewScoutingFind(undefined)
          }}
        />
      )}

      {leaveSession && (
        <ConfirmModal
          title="Leave the session?"
          message="Are you sure you want to leave this session? You will not be able to find it again unless you still have the URL."
          onClose={() => setActiveModal(null)}
          open={activeModal === DialogEnum.LEAVE_SESSION}
          onConfirm={leaveSession}
          cancelBtnText="Cancel"
          confirmBtnText="Yes, Leave"
        />
      )}
      <DownloadModal
        open={activeModal === DialogEnum.DOWNLOAD_SESSION}
        onClose={() => setActiveModal(null)}
        title="Download Session"
        description="Download the session data as a CSV or JSON file."
        downloadCSV={() => {
          const csvObj = session2csv(session)
          downloadFile(csvObj, createSafeFileName(session.name || 'Session', session.sessionId) + '.csv', 'text/csv')
        }}
        downloadJSON={() => {
          const jsonObj = JSON.stringify(session2Json(session), null, 2)
          downloadFile(
            jsonObj,
            createSafeFileName(session.name || 'Session', session.sessionId) + '.json',
            'application/json'
          )
        }}
      />

      {activeScoutingFind && (
        <ScoutingFindModal
          meUser={sessionUser}
          allowEdit={
            isSessionOwner ||
            activeScoutingFind.ownerId === userProfile?.userId ||
            activeScoutingFind.attendanceIds.includes(userProfile?.userId as string)
          }
          allowWork={
            isSessionOwner ||
            activeScoutingFind.ownerId === userProfile?.userId ||
            activeScoutingFind.attendanceIds.includes(userProfile?.userId as string)
          }
          open={Boolean(activeScoutingFind)}
          scoutingFind={activeScoutingFind}
          joinScoutingFind={joinScoutingFind}
          leaveScoutingFind={leaveScoutingFind}
          onClose={() => {
            setActiveModal(null)
            openScoutingModal && openScoutingModal()
          }}
          onDelete={() => {
            setActiveModal(null)
            deleteScoutingFind(activeScoutingFind.scoutingFindId)
          }}
          onChange={(newScouting) => {
            updateScoutingFind(newScouting)
            setNewScoutingFind(undefined)
          }}
        />
      )}

      <DeleteModal
        title={'Permanently DELETE session?'}
        confirmBtnText={'Yes, Delete Session!'}
        cancelBtnText="No, keep session"
        message={
          <DialogContentText id="alert-dialog-description">
            Deleting a session will remove it permanently. Work orders and crew shares will be irrecoverably lots. THIS
            IS A PERMANENT ACTION. Are you sure you want to delete this session?
          </DialogContentText>
        }
        open={activeModal === DialogEnum.DELETE_SESSION}
        onClose={() => {
          setActiveModal(null)
        }}
        onConfirm={() => {
          setActiveModal(null)
          deleteSession && deleteSession()
        }}
      />

      <DeleteModal
        title={'Permanently end this session?'}
        confirmBtnText={'Yes, End Session!'}
        cancelBtnText="No, keep session"
        message={
          <DialogContentText id="alert-dialog-description">
            Closing a session will lock it permanently. Crew shares can still be marked paid but no new jobs or scouting
            finds can be added and no new users can join. THIS IS A PERMANENT ACTION. Are you sure you want to close
            this session?
          </DialogContentText>
        }
        open={activeModal === DialogEnum.CLOSE_SESSION}
        onClose={() => {
          setActiveModal(null)
        }}
        onConfirm={() => {
          setActiveModal(null)
          onCloseSession && onCloseSession()
        }}
      />
    </Box>
  )
}
