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
  PendingUser,
  MiningLoadout,
  ScoutingFind,
  ScoutingFindTypeEnum,
  session2Json,
  SessionStateEnum,
  SessionUser,
  UserProfile,
  UserSuggest,
  WorkOrder,
  WorkOrderDefaults,
} from '@regolithco/common'
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
import { DialogContentText, Typography } from '@mui/material'
import { CollaborateModal } from '../../modals/CollaborateModal'
import { ConfirmModal } from '../../modals/ConfirmModal'
import { DownloadModal } from '../../modals/DownloadModal'
import { downloadFile } from '../../../lib/utils'
import { newEmptyScoutingFind, newWorkOrderMaker } from '../../../lib/newObjectFactories'
import { ActivePopupMe } from '../../modals/ActiveUserPopup/ActivePopupMe'
import { ActivePopupUser } from '../../modals/ActiveUserPopup/ActivePopupUser'
import { PendingUserPopup } from '../../modals/ActiveUserPopup/PendingUserPopup'
import { AddPendingUsersModal } from '../../modals/AddPendingUsersModal'
import { DisbandModal } from '../../modals/DisbandCrew'
import { ShareModal } from '../../modals/ShareModal'
import config from '../../../config'
import { SessionNotFound } from './SessionNotFound'

export const SessionPageContainer: React.FC = () => {
  const { sessionId, orderId: modalOrderId, tab, scoutingFindId: modalScoutingFindId } = useParams()
  const navigate = useNavigate()
  const userQry = useUserProfile()

  // For temporary objects before we commit them to the DB
  const [newWorkOrder, setNewWorkOrder] = React.useState<WorkOrder | null>(null)
  const [newScoutingFind, setNewScoutingFind] = React.useState<ScoutingFind | null>(null)
  const [activeModal, setActiveModal] = React.useState<DialogEnum | null>(null)
  const [activeLoadout, setActiveLoadout] = React.useState<MiningLoadout | null>(null)
  const [activeUserModalId, setActiveUserModalId] = React.useState<string | null>(null)
  const [pendingUserModalScName, setPendingUserModalScName] = React.useState<string | null>(null)

  const [shareWorkOrderId, setShareWorkOrderId] = React.useState<string | null>(null)
  const [shareScoutingFindId, setShareScoutingFindId] = React.useState<string | null>(null)

  const sessionQueries = useSessions(sessionId as string)
  const modalWorkOrderQry = useWorkOrders(sessionId as string, modalOrderId as string)
  const modalScoutingFindQry = useScoutingFind(
    sessionId as string,
    modalScoutingFindId as string,
    sessionQueries.sessionUser
  )
  const session = sessionQueries.session
  const myUserProfile = userQry.userProfile as UserProfile
  const mySessionUser = sessionQueries.sessionUser as SessionUser
  const isActive = session?.state === SessionStateEnum.Active
  const amISessionOwner = session?.ownerId === myUserProfile.userId
  const shareUrl: string | null = session?.joinId ? `${config.shareUrl}?joinId=${session?.joinId}` : null

  const returnToSession = () => navigate(makeSessionUrls({ sessionId, tab }))
  const openWorkOrderModal = (orderId: string) => navigate(makeSessionUrls({ sessionId, orderId, tab }))
  const openScoutingModal = (scoutingFindId: string) => navigate(makeSessionUrls({ sessionId, scoutingFindId, tab }))

  const sessionUserModalSessionUser: SessionUser | undefined = session?.activeMembers?.items?.find(
    ({ owner }) => owner?.userId === activeUserModalId
  )

  const sessionUserModalPendingUser: PendingUser | undefined = session?.mentionedUsers?.find(
    ({ scName }) => scName === pendingUserModalScName
  )

  const { crewHierarchy, singleActives, captains, singleInnactives } = React.useMemo(() => {
    const crewHierarchy = crewHierarchyCalc(
      (session?.activeMembers?.items as SessionUser[]) || [],
      session?.mentionedUsers || []
    )

    const { captains, singleActives } = (session?.activeMembers?.items || []).reduce(
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
    const singleInnactives: PendingUser[] = (session?.mentionedUsers || []).filter(
      ({ captainId }) => !captainId || !crewHierarchy[captainId]
    )
    return { crewHierarchy, singleActives, captains, singleInnactives }
  }, [session?.activeMembers?.items, session?.mentionedUsers])

  const userSuggest: UserSuggest = React.useMemo(
    () => createUserSuggest(session, myUserProfile, mySessionUser, crewHierarchy),
    [session, myUserProfile, mySessionUser, crewHierarchy]
  )

  const openActiveUserModal = (userId: string | null) => {
    setPendingUserModalScName(null)
    setActiveUserModalId(userId)
    setActiveModal(DialogEnum.USER_STATUS)
  }
  const openPendingUserModal = (scName: string | null) => {
    setActiveUserModalId(null)
    setPendingUserModalScName(scName)
    setActiveModal(DialogEnum.USER_STATUS)
  }
  const openLoadoutModal = (loadout: MiningLoadout | null) => {
    setActiveLoadout(loadout)
    setActiveModal(DialogEnum.LOADOUT_MODAL)
  }

  const createNewWorkOrder = (activity: ActivityEnum) => {
    if (!session) return
    setNewWorkOrder(newWorkOrderMaker(session, myUserProfile, activity, crewHierarchy))
    setActiveModal(DialogEnum.ADD_WORKORDER)
  }

  const createNewScoutingFind = (scoutingType: ScoutingFindTypeEnum) => {
    if (!session) return
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

  const updateModalWorkOrder = async (workOrder: WorkOrder) => {
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
    return modalWorkOrderQry.updateWorkOrder(workOrder)
  }

  // make a map of useIds to their scouting find attendance
  const scoutingAttendanceMap = React.useMemo(() => {
    const map = new Map<string, ScoutingFind>()
    session?.scouting?.items?.forEach((scoutingFind) => {
      // This will get overwritten if there are duplicates but that's ok
      scoutingFind.attendance?.forEach((attendance) => {
        map.set(attendance.owner?.userId as string, scoutingFind)
      })
    })
    return map
  }, [session?.scouting?.items])

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

  // NO HOOKS BELOW HERE PLEASE
  if (sessionQueries.loading && !sessionQueries.session) return <PageLoader title="loading session..." loading />

  if (sessionQueries.sessionError || !sessionQueries.session) {
    return <SessionNotFound action={() => navigate('/sessions')} />
  }

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
          userSuggest,

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
          updateMySessionUser: sessionQueries.updateMySessionUser,
          updateSessionUserCaptain: sessionQueries.updateSessionUserCaptain,
          updatePendingUserCaptain: sessionQueries.updatePendingUserCaptain,

          openActiveUserModal,
          openPendingUserModal,
          openLoadoutModal,
          openScoutingModal,
          openWorkOrderModal,
          // CrewShares
          markCrewSharePaid: sessionQueries.markCrewSharePaid,
          // Work orders
          activeTab: tab as SessionTabs,
          setActiveTab,
          failWorkOrder: modalWorkOrderQry.failWorkOrder,
          createWorkOrder,
          updateModalWorkOrder,
          updateAnyWorkOrder: modalWorkOrderQry.updateAnyWorkOrder,
          deleteWorkOrder: modalWorkOrderQry.deleteWorkOrder,
          deleteAnyWorkOrder: modalWorkOrderQry.deleteAnyWorkOrder,
          setWorkOrderShareId: (shareId) => {
            setShareWorkOrderId(shareId)
            setActiveModal(DialogEnum.SHARE_SESSION)
          },
          createScoutingFind: sessionQueries.createScoutingFind,
          // Scouting finds
          updateScoutingFind: modalScoutingFindQry.updateScoutingFind,
          deleteScoutingFind: modalScoutingFindQry.deleteScoutingFind,
          joinScoutingFind: modalScoutingFindQry.joinScoutingFind,
          setScoutingFindShareId: (shareId) => {
            setShareScoutingFindId(shareId)
            setActiveModal(DialogEnum.SHARE_SESSION)
          },
          leaveScoutingFind: modalScoutingFindQry.leaveScoutingFind,
          verifiedMentionedUsers: {},
        }}
      >
        <SessionPage />

        {/* Workorder Modal: EDITING */}
        {modalWorkOrder && (
          <ThemeProvider theme={workOrderStateThemes[modalWorkOrder.state]}>
            <WorkOrderContext.Provider
              value={{
                onUpdate: (newOrder) => {
                  setActiveModal(null)
                  updateModalWorkOrder(newOrder)
                },
                markCrewSharePaid: sessionQueries.markCrewSharePaid,
                workOrder: modalWorkOrder as WorkOrder,
                templateJob: session?.sessionSettings?.workOrderDefaults as WorkOrderDefaults,
                userSuggest,
                isMine: modalWorkOrder.ownerId === myUserProfile?.userId,
                allowPay:
                  amISessionOwner ||
                  modalWorkOrder.ownerId === myUserProfile?.userId ||
                  (Boolean(modalWorkOrder.sellerscName) && modalWorkOrder.sellerscName === myUserProfile?.scName),
                deleteWorkOrder: () => modalWorkOrderQry.deleteWorkOrder(),
                failWorkOrder: modalWorkOrderQry.failWorkOrder,
                isSessionActive: isActive,
                allowEdit:
                  myUserProfile?.userId === modalWorkOrder?.ownerId ||
                  amISessionOwner ||
                  modalWorkOrder.sellerscName === myUserProfile?.scName,
              }}
            >
              <WorkOrderModal
                open={Boolean(modalWorkOrder)}
                setWorkOrderShareId={(shareId) => {
                  setShareWorkOrderId(shareId)
                  setActiveModal(DialogEnum.SHARE_SESSION)
                }}
                onClose={() => {
                  setActiveModal(null)
                  returnToSession()
                }}
              />
            </WorkOrderContext.Provider>
          </ThemeProvider>
        )}

        {/* Workorder Modal: NEW */}
        {isActive && newWorkOrder && (
          // NEW WORK ORDER
          <WorkOrderContext.Provider
            value={{
              onUpdate: (newOrder) => {
                setActiveModal(null)
                createWorkOrder(newOrder)
                setNewWorkOrder(null)
              },
              isMine: true,
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

        {/* LOADOUT Modal */}
        {activeLoadout && (
          <LoadoutCalc
            isModal
            readonly
            onClose={() => setActiveModal(null)}
            open={activeModal === DialogEnum.LOADOUT_MODAL}
            miningLoadout={activeLoadout}
          />
        )}

        {/* ScoutingFind Modal: NEW */}
        {isActive && newScoutingFind && (
          <ScoutingFindContext.Provider
            value={{
              meUser: mySessionUser,
              allowEdit: isActive,
              allowDelete: true,
              scoutingFind: newScoutingFind as ScoutingFind,
              isNew: true,
              onChange: (newScouting) => {
                setActiveModal(null)
                sessionQueries.createScoutingFind(newScouting)
                setNewScoutingFind(null)
              },
            }}
          >
            <ScoutingFindModal
              open={activeModal === DialogEnum.ADD_SCOUTING}
              onClose={() => {
                setActiveModal(null)
              }}
            />
          </ScoutingFindContext.Provider>
        )}

        {/* ScoutingFind Modal: EDITING */}
        {modalScoutingFind && (
          <ScoutingFindContext.Provider
            value={{
              meUser: mySessionUser,
              allowEdit: true, // anyone in the sessionc an edit this
              allowDelete: amISessionOwner || modalScoutingFind.ownerId === myUserProfile?.userId,
              scoutingFind: modalScoutingFind,
              joinScoutingFind: modalScoutingFindQry.joinScoutingFind,
              leaveScoutingFind: modalScoutingFindQry.leaveScoutingFind,
              onDelete: () => {
                modalScoutingFindQry.deleteScoutingFind(modalScoutingFind.scoutingFindId)
                setActiveModal(null)
              },
              onChange: (newScouting) => {
                modalScoutingFindQry.updateScoutingFind(newScouting)
                setNewScoutingFind(null)
              },
            }}
          >
            <ScoutingFindModal
              open={Boolean(modalScoutingFind)}
              onClose={() => returnToSession()}
              setShareScoutingFindId={(shareId) => {
                setShareScoutingFindId(shareId)
                setActiveModal(DialogEnum.SHARE_SESSION)
              }}
            />
          </ScoutingFindContext.Provider>
        )}

        {/* Delete Session Modal */}
        <DeleteModal
          title={'Permanently DELETE session?'}
          confirmBtnText={'Yes, Delete Session!'}
          cancelBtnText="No, keep session"
          message={
            <DialogContentText id="alert-dialog-description">
              Deleting a session will remove it permanently. Work orders and crew shares will be irrecoverably lost.
              THIS IS A PERMANENT ACTION. Are you sure you want to delete this session?
            </DialogContentText>
          }
          open={activeModal === DialogEnum.DELETE_SESSION}
          onClose={() => setActiveModal(null)}
          onConfirm={() => {
            sessionQueries.deleteSession()
            setActiveModal(null)
          }}
        />

        {/* End Session Modal */}
        <DeleteModal
          title={'Permanently end this session?'}
          confirmBtnText={'YES! End my session!'}
          cancelBtnText="Cancel"
          message={
            <DialogContentText id="alert-dialog-description" component={'div'}>
              <Typography paragraph>
                Closing a session will lock it permanently. Crew shares can still be marked paid but new jobs or
                scouting finds CANNOT be added and no new users can join.
              </Typography>
              <Typography paragraph>
                <strong>THIS IS A PERMANENT ACTION</strong>. Are you sure you want to close this session?
              </Typography>
            </DialogContentText>
          }
          open={activeModal === DialogEnum.CLOSE_SESSION}
          onClose={() => setActiveModal(null)}
          onConfirm={() => {
            sessionQueries.closeSession()
            setActiveModal(null)
          }}
        />

        {/* Collaborate Session Modal */}
        <CollaborateModal
          open={Boolean(shareUrl && activeModal === DialogEnum.COLLABORATE)}
          warn={!session?.sessionSettings.specifyUsers}
          url={shareUrl as string}
          onClose={() => setActiveModal(null)}
        />

        {/* Share Session Modal */}
        {activeModal === DialogEnum.SHARE_SESSION && (
          <ShareModal
            open
            initScoutingFindId={shareScoutingFindId}
            initWorkOrderId={shareWorkOrderId}
            onClose={() => {
              setShareWorkOrderId(null)
              setShareScoutingFindId(null)
              setActiveModal(null)
            }}
          />
        )}

        {/* Leave Session Modal */}
        <ConfirmModal
          title="Leave the session?"
          message="Are you sure you want to leave this session? You will not be able to find it again unless you still have the URL."
          onClose={() => setActiveModal(null)}
          open={activeModal === DialogEnum.LEAVE_SESSION}
          onConfirm={sessionQueries.leaveSession}
          cancelBtnText="Cancel"
          confirmBtnText="Yes, Leave"
        />

        {/* Download Data Modal */}
        <DownloadModal
          open={activeModal === DialogEnum.DOWNLOAD_SESSION}
          onClose={() => setActiveModal(null)}
          title="Download Session"
          // description="Download the session data as a CSV or JSON file."
          description="Download the session data as a JSON file."
          // downloadCSV={() => {
          //   if (!session) return
          //   const csvObj = session2csv(session)
          //   downloadFile(csvObj, createSafeFileName(session.name || 'Session', session.sessionId) + '.csv', 'text/csv')
          // }}
          downloadJSON={() => {
            if (!session) return
            const jsonObj = JSON.stringify(session2Json(session), null, 2)
            downloadFile(
              jsonObj,
              createSafeFileName(session.name || 'Session', session.sessionId) + '.json',
              'application/json'
            )
          }}
        />

        <AddPendingUsersModal open={activeModal === DialogEnum.ADD_FRIEND} onClose={() => setActiveModal(null)} />
        <DisbandModal open={activeModal === DialogEnum.DISBAND_CREW} onClose={() => setActiveModal(null)} />

        {/* Active User Popup Modal: ME */}
        {sessionUserModalSessionUser && sessionUserModalSessionUser.ownerId === mySessionUser.ownerId && (
          <ActivePopupMe open={activeModal === DialogEnum.USER_STATUS} onClose={() => setActiveModal(null)} />
        )}

        {/* Active User Popup Modal: Active User */}
        {sessionUserModalSessionUser && mySessionUser.owner?.userId !== sessionUserModalSessionUser.ownerId && (
          <ActivePopupUser
            open={activeModal === DialogEnum.USER_STATUS}
            onClose={() => setActiveModal(null)}
            sessionUser={sessionUserModalSessionUser}
          />
        )}

        {/* Pending User Popup Modal */}
        {sessionUserModalPendingUser && (
          <PendingUserPopup
            open={activeModal === DialogEnum.USER_STATUS}
            onClose={() => setActiveModal(null)}
            pendingUser={sessionUserModalPendingUser}
          />
        )}
      </SessionContext.Provider>
    </>
  )
}
