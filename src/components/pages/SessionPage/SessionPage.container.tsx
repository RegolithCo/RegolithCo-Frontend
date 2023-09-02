import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SessionPage } from './SessionPage'
import { PageLoader } from '../PageLoader'
import { useSessions } from '../../../hooks/useSessions'
import {
  ActivityEnum,
  createSafeFileName,
  createUserSuggest,
  crewHierarchyCalc,
  CrewShareInput,
  InnactiveUser,
  MiningLoadout,
  ScoutingFind,
  ScoutingFindTypeEnum,
  Session,
  session2csv,
  session2Json,
  SessionStateEnum,
  SessionUser,
  UserProfile,
  UserSuggest,
  WorkOrder,
  WorkOrderDefaults,
} from '@regolithco/common'
import { SessionJoinContainer } from '../SessionJoin.container'
import { useUserProfile } from '../../../hooks/useUserProfile'
import { makeSessionUrls } from '../../../lib/routingUrls'
import { useWorkOrders } from '../../../hooks/useWorkOrder'
import { useScoutingFind } from '../../../hooks/useScouting'
import { DialogEnum, SessionContext, SessionTabs } from '../../../context/session.context'
import { ScoutingFindContext } from '../../../context/scoutingFind.context'
import { ScoutingFindModal } from '../../modals/ScoutingFindModal'
import { ThemeProvider } from '@mui/system'
import { WorkOrderContext } from '../../../context/workOrder.context'
import { LoadoutCalc } from '../../calculators/LoadoutCalc/LoadoutCalc'
import { WorkOrderModal } from '../../modals/WorkOrderModal'
import { workOrderStateThemes } from '../../../theme'
import { DeleteModal } from '../../modals/DeleteModal'
import { DialogContentText } from '@mui/material'
import { ShareModal } from '../../modals/ShareModal'
import { ConfirmModal } from '../../modals/ConfirmModal'
import { DownloadModal } from '../../modals/DownloadModal'
import { downloadFile } from '../../../lib/utils'
import { newEmptyScoutingFind, newWorkOrderMaker } from '../../../lib/newObjectFactories'
import { ActivePopupMe } from '../../modals/ActiveUserPopup/ActivePopupMe'
import { ActivePopupUser } from '../../modals/ActiveUserPopup/ActivePopupUser'

export const SessionPageContainer2: React.FC = () => {
  const { sessionId, orderId: modalOrderId, tab, scoutingFindId: modalScoutingFindId } = useParams()
  const navigate = useNavigate()
  const userQry = useUserProfile()

  // For temporary objects before we commit them to the DB
  const [newWorkOrder, setNewWorkOrder] = React.useState<WorkOrder | null>(null)
  const [newScoutingFind, setNewScoutingFind] = React.useState<ScoutingFind | null>(null)
  const [activeModal, setActiveModal] = React.useState<DialogEnum | null>(null)
  const [activeLoadout, setActiveLoadout] = React.useState<MiningLoadout | null>(null)
  const [activeUserModalId, setActiveUserModalId] = React.useState<string | null>(null)
  const [innactiveUserModalScName, setInnactiveUserModalScName] = React.useState<string | null>(null)

  const sessionQueries = useSessions(sessionId as string)
  const workOrderQry = useWorkOrders(sessionId as string, modalOrderId as string)
  const scoutingFindQry = useScoutingFind(
    sessionId as string,
    modalScoutingFindId as string,
    sessionQueries.sessionUser
  )
  const session = sessionQueries.session as Session
  const myUserProfile = userQry.userProfile as UserProfile
  const mySessionUser = sessionQueries.sessionUser as SessionUser
  const isActive = session.state === SessionStateEnum.Active
  const amISessionOwner = session.ownerId === myUserProfile.userId
  const shareUrl = `${window.location.origin}${process.env.PUBLIC_URL}/session/${session.sessionId}`

  const returnToSession = () => navigate(makeSessionUrls({ tab }))
  const openWorkOrderModal = (orderId: string) => navigate(makeSessionUrls({ sessionId, orderId, tab }))
  const openScoutingModal = (scoutingFindId: string) => navigate(makeSessionUrls({ sessionId, scoutingFindId, tab }))

  // Only one major modal at a time please.

  const activeUserModelSessionUser: SessionUser | undefined = session.activeMembers?.items?.find(
    ({ owner }) => owner?.userId === activeUserModalId
  )

  const innactiveUserModelSessionUser: InnactiveUser | undefined = session.mentionedUsers?.find(
    ({ scName }) => scName === innactiveUserModalScName
  )

  const userSuggest: UserSuggest = React.useMemo(
    () => createUserSuggest(session.activeMembers?.items || [], session.mentionedUsers, myUserProfile.friends),
    [session, myUserProfile]
  )

  const { crewHierarchy, singleActives, captains, singleInnactives } = React.useMemo(() => {
    const crewHierarchy = crewHierarchyCalc(session.activeMembers?.items as SessionUser[], session.mentionedUsers || [])
    console.log(crewHierarchy, JSON.stringify(crewHierarchy))
    const { captains, singleActives } = (session.activeMembers?.items || []).reduce(
      (acc, su) => {
        const suUserId = su.owner?.userId as string
        const crew = crewHierarchy[suUserId as string]
        // If I'm not a captain or I don't have a captain, I'm a single active
        if (!su.captainId && !crew) {
          acc.singleActives.push(su)
          return acc
        }
        if (crew) acc.captains.push(su)
        return acc
      },
      { singleActives: [], captains: [] } as { singleActives: SessionUser[]; captains: SessionUser[] }
    )
    const singleInnactives: InnactiveUser[] = (session.mentionedUsers || []).filter(
      ({ captainId }) => !captainId || !crewHierarchy[captainId]
    )
    return { crewHierarchy, singleActives, captains, singleInnactives }
  }, [session.activeMembers?.items, session.mentionedUsers])

  const openActiveUserModal = (userId: string | null) => {
    setActiveUserModalId(userId)
    setActiveModal(DialogEnum.USER_STATUS)
  }
  const openInnactiveUserModal = (scName: string | null) => {
    setInnactiveUserModalScName(scName)
    setActiveModal(DialogEnum.USER_STATUS)
  }
  const openLoadoutModal = (loadout: MiningLoadout | null) => {
    setActiveLoadout(loadout)
    setActiveModal(DialogEnum.LOADOUT_MODAL)
  }

  const createNewWorkOrder = (activity: ActivityEnum) => {
    setNewWorkOrder(newWorkOrderMaker(session, myUserProfile, activity))
    setActiveModal(DialogEnum.ADD_WORKORDER)
  }

  const createNewScoutingFind = (scoutingType: ScoutingFindTypeEnum) => {
    setNewScoutingFind(newEmptyScoutingFind(session, mySessionUser, scoutingType))
    setActiveModal(DialogEnum.ADD_SCOUTING)
  }

  const setActiveTab = (tab: SessionTabs) => navigate(makeSessionUrls({ sessionId, tab }))

  const createWorkOrder = async (workOrder: WorkOrder) => {
    const newShares: CrewShareInput[] = (workOrder.crewShares || []).map(
      ({ scName, share, shareType, state, note }) => ({
        scName,
        share,
        shareType,
        state: Boolean(state),
        note,
      })
    )
    await createNewMentionedUsers(newShares)
    return sessionQueries.createWorkOrder(workOrder)
  }

  const updateWorkOrder = async (workOrder: WorkOrder) => {
    const newShares: CrewShareInput[] = (workOrder.crewShares || []).map(
      ({ scName, share, shareType, state, note }) => ({
        scName,
        share,
        shareType,
        state: Boolean(state),
        note,
      })
    )
    await createNewMentionedUsers(newShares)
    return workOrderQry.updateWorkOrder(workOrder)
  }

  // make a map of useIds to their scouting find attendance
  const scoutingAttendanceMap = React.useMemo(() => {
    const map = new Map<string, ScoutingFind>()
    session.scouting?.items?.forEach((scoutingFind) => {
      // This will get overwritten if there are duplicates but that's ok
      scoutingFind.attendance?.forEach((attendance) => {
        map.set(attendance.owner?.userId as string, scoutingFind)
      })
    })
    return map
  }, [session.scouting?.items])

  // TODO: Need to fold this into the API call I think OR let session users add referenced users
  const createNewMentionedUsers = async (newShares: CrewShareInput[]): Promise<void> => {
    if (newShares && newShares.length > 0) {
      const shareNames = newShares.map((s) => s.scName)
      const activeNames = (sessionQueries.session?.activeMembers?.items || []).map(({ owner }) => owner?.scName)
      const addToMentioned = shareNames.filter(
        (s) => !sessionQueries.session?.mentionedUsers?.find((u) => u.scName === s) && !activeNames.includes(s)
      )
      if (addToMentioned.length > 0) await sessionQueries.addSessionMentions(addToMentioned)
    }
  }

  if (sessionQueries.loading && !sessionQueries.session && !sessionQueries.sessionStub)
    return <PageLoader title="loading session..." loading />

  const modalWorkOrder: WorkOrder | undefined = React.useMemo(() => {
    return (
      (sessionQueries.session &&
        modalOrderId &&
        sessionQueries.session.workOrders?.items?.find(
          ({ orderId: existingOrderId }) => existingOrderId === modalOrderId
        )) ||
      undefined
    )
  }, [sessionQueries.session, modalOrderId])
  const modalScoutingFind: ScoutingFind | undefined = React.useMemo(() => {
    return (
      (sessionQueries.session &&
        modalScoutingFindId &&
        sessionQueries.session.scouting?.items?.find(
          ({ scoutingFindId: existingScoutingFindId }) => existingScoutingFindId === modalScoutingFindId
        )) ||
      undefined
    )
  }, [sessionQueries.session, modalScoutingFindId])

  if (sessionQueries.sessionStub || sessionQueries.sessionError)
    return (
      <SessionJoinContainer
        session={sessionQueries.sessionStub}
        sessionError={sessionQueries.sessionError}
        userProfile={userQry.userProfile as UserProfile}
        joinSession={sessionQueries.joinSession}
        loading={sessionQueries.loading || sessionQueries.mutating}
      />
    )
  return (
    <>
      <SessionContext.Provider
        value={{
          session,
          navigate: navigate,
          loading: sessionQueries.loading,
          mutating: sessionQueries.mutating,
          // User
          myUserProfile,
          // A bit redundant but we need it
          mySessionUser,
          addFriend: userQry.addFriend,
          removeFriend: userQry.removeFriend,

          crewHierarchy,
          singleActives,
          captains,
          singleInnactives,
          scoutingAttendanceMap,

          createNewWorkOrder,
          createNewScoutingFind,
          // Session stuff
          onCloseSession: sessionQueries.closeSession,
          onUpdateSession: sessionQueries.onUpdateSession,
          resetDefaultSystemSettings: sessionQueries.resetDefaultSystemSettings,
          resetDefaultUserSettings: sessionQueries.resetDefaultUserSettings,
          addSessionMentions: sessionQueries.addSessionMentions,
          removeSessionMentions: sessionQueries.removeSessionMentions,
          removeSessionCrew: sessionQueries.removeSessionCrew,
          leaveSession: sessionQueries.leaveSession,
          deleteSession: sessionQueries.deleteSession,
          // Session User Stuff
          setActiveModal,
          updateSessionUser: sessionQueries.updateSessionUser,
          openActiveUserModal,
          openInnactiveUserModal,
          openLoadoutModal,
          openScoutingModal,
          openWorkOrderModal,
          // CrewShares
          markCrewSharePaid: sessionQueries.markCrewSharePaid,
          // Work orders
          activeTab: tab as SessionTabs,
          setActiveTab,
          failWorkOrder: workOrderQry.failWorkOrder,
          createWorkOrder,
          updateWorkOrder,
          deleteWorkOrder: workOrderQry.deleteWorkOrder,
          createScoutingFind: sessionQueries.createScoutingFind,
          // Scouting finds
          updateScoutingFind: scoutingFindQry.updateScoutingFind,
          deleteScoutingFind: scoutingFindQry.deleteScoutingFind,
          joinScoutingFind: scoutingFindQry.joinScoutingFind,
          leaveScoutingFind: scoutingFindQry.leaveScoutingFind,
          verifiedMentionedUsers: {},
        }}
      >
        <SessionPage />
      </SessionContext.Provider>
      {/* This is the EDIT Workorder modal */}
      {modalWorkOrder && (
        <ThemeProvider theme={workOrderStateThemes[modalWorkOrder.state]}>
          <WorkOrderContext.Provider
            value={{
              onUpdate: (newOrder) => {
                setActiveModal(null)
                updateWorkOrder(newOrder)
              },
              markCrewSharePaid: sessionQueries.markCrewSharePaid,
              workOrder: modalWorkOrder as WorkOrder,
              templateJob: session.sessionSettings?.workOrderDefaults as WorkOrderDefaults,
              userSuggest,
              allowPay: amISessionOwner || modalWorkOrder.ownerId === myUserProfile?.userId,
              deleteWorkOrder: () => workOrderQry.deleteWorkOrder(),
              failWorkOrder: workOrderQry.failWorkOrder,
              isSessionActive: isActive,
              allowEdit:
                myUserProfile?.userId === modalWorkOrder?.ownerId ||
                amISessionOwner ||
                modalWorkOrder.sellerscName === myUserProfile?.scName,
            }}
          >
            <WorkOrderModal
              open={Boolean(modalWorkOrder)}
              onClose={() => {
                setActiveModal(null)
                returnToSession()
              }}
            />
          </WorkOrderContext.Provider>
        </ThemeProvider>
      )}

      {/* This is the ADD workordermodal */}
      {isActive && newWorkOrder && (
        // NEW WORK ORDER
        <WorkOrderContext.Provider
          value={{
            onUpdate: (newOrder) => {
              setActiveModal(null)
              createWorkOrder(newOrder)
              setNewWorkOrder(null)
            },
            allowEdit: isActive,
            allowPay: true,
            isSessionActive: isActive,
            forceTemplate: true,
            userSuggest: userSuggest,
            isNew: true,
            markCrewSharePaid: sessionQueries.markCrewSharePaid,
            templateJob: session.sessionSettings?.workOrderDefaults as WorkOrderDefaults,
            workOrder: newWorkOrder as WorkOrder,
          }}
        >
          <WorkOrderModal open={activeModal === DialogEnum.ADD_WORKORDER} onClose={() => setActiveModal(null)} />
        </WorkOrderContext.Provider>
      )}
      {activeUserModelSessionUser && activeUserModelSessionUser.loadout && (
        <LoadoutCalc
          isModal
          readonly
          onClose={() => setActiveModal(null)}
          open={activeModal === DialogEnum.LOADOUT_MODAL}
          miningLoadout={activeUserModelSessionUser.loadout}
        />
      )}

      {isActive && newScoutingFind && (
        <ScoutingFindContext.Provider
          value={{
            meUser: mySessionUser,
            allowEdit: isActive,
            allowWork: isActive,
            scoutingFind: newScoutingFind as ScoutingFind,
            isNew: true,
            onChange: (newScouting) => {
              setActiveModal(null)
              sessionQueries.createScoutingFind(newScouting)
              setNewScoutingFind(null)
            },
          }}
        >
          <ScoutingFindModal open={activeModal === DialogEnum.ADD_SCOUTING} onClose={() => setActiveModal(null)} />
        </ScoutingFindContext.Provider>
      )}
      {modalScoutingFind && (
        <ScoutingFindContext.Provider
          value={{
            meUser: mySessionUser,
            allowEdit:
              amISessionOwner ||
              modalScoutingFind.ownerId === myUserProfile?.userId ||
              modalScoutingFind.attendanceIds.includes(myUserProfile?.userId as string),
            allowWork:
              amISessionOwner ||
              modalScoutingFind.ownerId === myUserProfile?.userId ||
              modalScoutingFind.attendanceIds.includes(myUserProfile?.userId as string),
            scoutingFind: modalScoutingFind,
            joinScoutingFind: scoutingFindQry.joinScoutingFind,
            leaveScoutingFind: scoutingFindQry.leaveScoutingFind,
            onDelete: () => setActiveModal(null),
            onChange: (newScouting) => {
              scoutingFindQry.updateScoutingFind(newScouting)
              setNewScoutingFind(null)
            },
          }}
        >
          <ScoutingFindModal open={Boolean(modalScoutingFind)} onClose={() => returnToSession()} />
        </ScoutingFindContext.Provider>
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
        onClose={() => setActiveModal(null)}
        onConfirm={() => setActiveModal(null)}
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
        onClose={() => setActiveModal(null)}
        onConfirm={() => setActiveModal(null)}
      />
      <ShareModal
        open={activeModal === DialogEnum.SHARE_SESSION}
        warn={!session.sessionSettings.specifyUsers}
        url={shareUrl}
        onClose={() => setActiveModal(null)}
      />

      <ConfirmModal
        title="Leave the session?"
        message="Are you sure you want to leave this session? You will not be able to find it again unless you still have the URL."
        onClose={() => setActiveModal(null)}
        open={activeModal === DialogEnum.LEAVE_SESSION}
        onConfirm={sessionQueries.leaveSession}
        cancelBtnText="Cancel"
        confirmBtnText="Yes, Leave"
      />

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

      {/* The popup is different if the user is you */}
      {activeUserModelSessionUser && mySessionUser.owner?.userId === activeUserModelSessionUser.ownerId && (
        <ActivePopupMe open={activeModal === DialogEnum.USER_STATUS} onClose={() => setActiveModal(null)} />
      )}
      {activeUserModelSessionUser && mySessionUser.owner?.userId !== activeUserModelSessionUser.ownerId && (
        <ActivePopupUser
          open={activeModal === DialogEnum.USER_STATUS}
          onClose={() => setActiveModal(null)}
          sessionUser={activeUserModelSessionUser}
        />
      )}
    </>
  )
}
